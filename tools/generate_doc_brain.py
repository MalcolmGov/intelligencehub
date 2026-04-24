#!/usr/bin/env python3
"""
Generate doc_brain.json from tools/extracted_docs.json using an LLM.

Purpose: regenerate the TL;DR + FAQ data when docs change.

Supports two providers:
  - Anthropic direct  (ANTHROPIC_API_KEY)
  - Azure AI Foundry  (AZURE_FOUNDRY_ENDPOINT + AZURE_FOUNDRY_KEY + AZURE_FOUNDRY_DEPLOYMENT)

Run:
  export ANTHROPIC_API_KEY=sk-...
  python3 tools/generate_doc_brain.py

Or for Foundry:
  export AZURE_FOUNDRY_ENDPOINT=https://<your-resource>.services.ai.azure.com
  export AZURE_FOUNDRY_KEY=<key>
  export AZURE_FOUNDRY_DEPLOYMENT=claude-sonnet-4-5
  python3 tools/generate_doc_brain.py

The script is idempotent and safe to re-run. Output: doc_brain.json at repo root.
Existing entries can be preserved by passing --incremental (only regenerates missing docs).
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IN_PATH = ROOT / "tools" / "extracted_docs.json"
OUT_PATH = ROOT / "doc_brain.json"

# Mapping from path prefix → (human title, category)
TITLE_MAP = {
    "docs/01_Strategy_and_Vision/SDLC_2.0_Strategy.docx": ("SDLC 2.0 Strategy — Embedding Claude across the Lifecycle", "Strategy & Vision"),
    "docs/01_Strategy_and_Vision/SDLC_2.0_Staff_One_Pager.docx": ("SDLC 2.0 Staff One-Pager", "Strategy & Vision"),
    "docs/01_Strategy_and_Vision/AI_and_Engineering_Strategy_on_a_Page.pdf": ("AI & Engineering Strategy on a Page (PDF)", "Strategy & Vision"),
    "docs/01_Strategy_and_Vision/90_Day_Plan.docx": ("90-Day Plan — Head of AI & Automation", "Strategy & Vision"),
    "docs/01_Strategy_and_Vision/Business_Case_and_Budget.docx": ("Business Case & Budget", "Strategy & Vision"),
    "docs/01_Strategy_and_Vision/Board_Scorecard_AI_and_Engineering.pptx": ("Board Scorecard — AI & Engineering", "Strategy & Vision"),
    "docs/02_Governance_and_Policy/AI_Governance_Framework.docx": ("AI Governance Framework", "Governance & Policy"),
    "docs/02_Governance_and_Policy/AI_Council_Charter_and_Decision_Log.docx": ("AI Council Charter & Decision Log", "Governance & Policy"),
    "docs/02_Governance_and_Policy/AI_Acceptable_Use_Policy.docx": ("AI Acceptable Use Policy", "Governance & Policy"),
    "docs/03_Operations_and_Controls/AI_Control_Register.docx": ("AI Control Register", "Operations & Controls"),
    "docs/03_Operations_and_Controls/AI_Monitoring_and_Incident_Playbook.docx": ("AI Monitoring & Incident Playbook", "Operations & Controls"),
    "docs/04_Templates_and_Forms/AI_Use_Case_Intake_and_Tier_Rubric.docx": ("Use-Case Intake Form + Tier Scoring Rubric", "Templates & Forms"),
    "docs/04_Templates_and_Forms/AI_Vendor_Third_Party_DDQ.docx": ("AI Vendor & Third-Party DDQ", "Templates & Forms"),
    "docs/04_Templates_and_Forms/Vendor_AI_SOW_Addendum_Template.docx": ("Vendor AI Tools SOW Addendum", "Templates & Forms"),
    "docs/05_Technical_and_Tooling/Sandbox_Reference_Architecture.docx": ("AI Sandbox Reference Architecture", "Technical & Tooling"),
    "docs/05_Technical_and_Tooling/GitHub_Copilot_Rollout_Plan.docx": ("GitHub Copilot Rollout Plan", "Technical & Tooling"),
    "docs/05_Technical_and_Tooling/Vendor_AI_Acceleration_Playbook.docx": ("Vendor AI Acceleration Playbook", "Technical & Tooling"),
    "docs/06_Memos_and_Asks/Foundry_Standing_Access_Memo.docx": ("Foundry Standing Access Memo", "Memos & Asks"),
    "docs/Test_Automation_Strategy.docx": ("Intelligent Test Automation Strategy", "Technical & Tooling"),
}


SYSTEM_PROMPT = """You generate TL;DRs and FAQs for internal strategy documents.
Your output will be read by staff instead of the full document, so quality matters.

Strict rules:
- TL;DR is 3 sentences, under 60 words, specific not generic. Lead with what the doc IS.
  End with the decision/commitment it enshrines. No marketing language.
- FAQs: 10-15 per doc (6-10 if the doc is under 500 words).
  Questions are what a staff member would actually type.
  Answers 2-4 sentences, grounded in the doc, quoting specific figures/thresholds/names.
  Every answer references a section name from the doc where possible.
- Voice: precise, operational, zero fluff. Financial services / enterprise register.

Return valid JSON only, matching this schema:
{
  "tl_dr": "...",
  "key_audiences": ["...", "..."],
  "faqs": [
    {"q": "...", "a": "...", "section": "..."}
  ]
}
"""


def flatten_content(content: dict) -> str:
    """Render the extracted content as plain text for the model."""
    out = []
    if "sections" in content:
        for sec in content["sections"]:
            if sec.get("heading"):
                out.append(f"\n## {sec['heading']}")
            for p in sec.get("paras", []):
                out.append(p)
        for i, tbl in enumerate(content.get("tables", [])):
            out.append(f"\n[Table {i+1}]")
            for row in tbl:
                out.append(" | ".join(row))
    elif "pages" in content:
        for pg in content["pages"]:
            out.append(pg.get("text", ""))
    elif "slides" in content:
        for s in content["slides"]:
            if s.get("title"):
                out.append(f"## {s['title']}")
            for b in s.get("body", []):
                out.append(b)
    return "\n".join(out).strip()


def call_anthropic(system: str, user: str, model: str = "claude-sonnet-4-5") -> str:
    import urllib.request
    key = os.environ["ANTHROPIC_API_KEY"]
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        method="POST",
        headers={
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        data=json.dumps({
            "model": model,
            "max_tokens": 4096,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        }).encode(),
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read())
    return body["content"][0]["text"]


def call_foundry(system: str, user: str) -> str:
    import urllib.request
    endpoint = os.environ["AZURE_FOUNDRY_ENDPOINT"].rstrip("/")
    key = os.environ["AZURE_FOUNDRY_KEY"]
    deployment = os.environ["AZURE_FOUNDRY_DEPLOYMENT"]
    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version=2024-10-21"
    req = urllib.request.Request(
        url,
        method="POST",
        headers={"api-key": key, "content-type": "application/json"},
        data=json.dumps({
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "max_tokens": 4096,
            "temperature": 0.2,
        }).encode(),
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read())
    return body["choices"][0]["message"]["content"]


def pick_caller():
    if os.environ.get("ANTHROPIC_API_KEY"):
        return lambda s, u: call_anthropic(s, u)
    if os.environ.get("AZURE_FOUNDRY_ENDPOINT") and os.environ.get("AZURE_FOUNDRY_KEY"):
        return call_foundry
    print("ERROR: set ANTHROPIC_API_KEY or AZURE_FOUNDRY_* env vars.", file=sys.stderr)
    sys.exit(2)


def extract_json(text: str) -> dict:
    # Handle models that wrap JSON in code fences
    t = text.strip()
    if t.startswith("```"):
        t = t.split("```", 2)[1]
        if t.lstrip().lower().startswith("json"):
            t = t.split("\n", 1)[1]
        t = t.rsplit("```", 1)[0]
    return json.loads(t.strip())


def build_entry(doc: dict, caller) -> dict:
    path = doc["path"]
    title, category = TITLE_MAP.get(path, (doc["filename"], doc.get("category", "General")))
    doc_id = Path(doc["filename"]).stem.replace(".", "_")
    body = flatten_content(doc.get("content", {}))
    if not body:
        return None
    user = (
        f"DOCUMENT TITLE: {title}\n"
        f"CATEGORY: {category}\n\n"
        f"--- DOCUMENT CONTENT ---\n{body[:25000]}\n--- END ---\n\n"
        f"Generate the TL;DR and FAQs as JSON per the schema."
    )
    raw = caller(SYSTEM_PROMPT, user)
    parsed = extract_json(raw)
    parsed["id"] = doc_id
    parsed["filename"] = doc["filename"]
    parsed["path"] = path
    parsed["title"] = title
    parsed["category"] = category
    return parsed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--incremental", action="store_true", help="Only regenerate docs missing from existing doc_brain.json")
    args = ap.parse_args()

    extracted = json.loads(IN_PATH.read_text())
    caller = pick_caller()

    existing_ids = set()
    results = []
    if args.incremental and OUT_PATH.exists():
        prev = json.loads(OUT_PATH.read_text())
        results = prev.get("docs", [])
        existing_ids = {d["id"] for d in results}

    for doc in extracted:
        doc_id = Path(doc["filename"]).stem.replace(".", "_")
        if doc_id in existing_ids:
            print(f"[skip] {doc_id} (already present)")
            continue
        print(f"[gen]  {doc_id}")
        try:
            entry = build_entry(doc, caller)
            if entry:
                results.append(entry)
            time.sleep(0.5)
        except Exception as e:
            print(f"[err]  {doc_id}: {e}", file=sys.stderr)

    output = {
        "generated_at": time.strftime("%Y-%m-%d"),
        "version": "1.0",
        "docs": results,
    }
    OUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"\nWrote {OUT_PATH} ({len(results)} docs)")


if __name__ == "__main__":
    main()
