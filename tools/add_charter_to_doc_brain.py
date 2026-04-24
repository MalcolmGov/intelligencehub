#!/usr/bin/env python3
"""
Append the hand-authored Spark Challenge Charter entry to doc_brain.json.
Idempotent: if the entry already exists (by id), it's replaced.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRAIN = ROOT / "doc_brain.json"

CHARTER_ENTRY = {
    "id": "Spark_Challenge_Charter",
    "filename": "Spark_Challenge_Charter.docx",
    "path": "docs/02_Governance_and_Policy/Spark_Challenge_Charter.docx",
    "title": "Spark — Continental Innovation Challenge · Rules & Judging Charter",
    "category": "Governance & Policy",
    "tl_dr": (
        "Governing charter for the Spark Continental Innovation Challenge — the quarterly "
        "$100K competition where staff across all 13 Opcos submit ideas, vote, and see the "
        "top three funded as pilots. Defines eligibility, submission + voting rules, a "
        "weighted 60/40 panel-plus-community scoring model, and a tiered prize pool of "
        "$50K/$25K/$15K with a further $10K across honourable mentions. Ratified by the AI "
        "Council, v1.0, effective 24 April 2026."
    ),
    "key_audiences": [
        "All Opco staff (submitters, voters, commenters)",
        "AI Council members and judging panel",
        "Opco leadership (sponsors of winning ideas)",
        "Group Legal, Risk, and HR (for compliance, IP, conflicts)",
        "Finance and Group Tax (prize payout treatment)"
    ],
    "faqs": [
        {
            "q": "Who can submit ideas to Spark?",
            "a": "All permanent and fixed-term staff employed by a Group entity or a participating Opco are eligible. Contractors on engagements of three months or longer are eligible with their sponsoring manager's written consent. Judges, Council members during their term, interns under three months' tenure, and staff on active PIPs or disciplinary process are not eligible. Third parties (vendors, consultancies) cannot submit but can be cited in support.",
            "section": "2. Eligibility"
        },
        {
            "q": "How many ideas can I submit and can I co-author?",
            "a": "Each staff member may submit up to three ideas per quarterly round. Joint submissions of up to three co-authors are permitted — the lead author receives any prize allocation, with an obligation to share with co-authors per the team's own agreement.",
            "section": "3. Submission Rules"
        },
        {
            "q": "How does voting work and can I vote for my own idea?",
            "a": "Every eligible staff member gets a fixed pool of 20 votes per round, distributable across any number of ideas (up to 3 per single idea). Self-voting is prohibited — you cannot vote for your own ideas, your co-authored ideas, or ideas authored by your direct manager. Vote-campaigning is allowed at reasonable one-to-many scale but quid-pro-quo offers, coordinated bloc voting, or a manager directing their team's votes results in nullification and potential disqualification.",
            "section": "4. Voting Rules"
        },
        {
            "q": "How are winners actually chosen — is it just vote count?",
            "a": "No. Shortlist selection and pilot funding use a weighted scoring rubric applied by a judging panel chaired by the Head of AI & Automation. Five dimensions are scored 1–5: customer/business impact (30%), feasibility (20%), strategic alignment (20%), originality (15%), and risk & governance (15%). The weighted panel score is combined 60/40 with the community vote count (normalised 0–100) to produce the final pilot-funding score.",
            "section": "5. Judging Criteria & Scoring Rubric"
        },
        {
            "q": "What are the five pipeline stages an idea moves through?",
            "a": "Submitted (idea filed; passes automated AI review) → Voted (live for community voting, typically 3 weeks) → Shortlist (top 20 by combined score advance to clarification interviews) → Pilot (Council-approved funding, with named sponsor, lead, success criteria, and 90-day scope) → Scaled (pilot meets success criteria; promoted to Active Projects portfolio).",
            "section": "6. Pipeline Stages"
        },
        {
            "q": "What's the timeline — when are ideas due and when are winners announced?",
            "a": "Spark runs on a quarterly cadence with four rounds per year aligned to the Group financial calendar. Each round is thirteen weeks: weeks 1–3 open submissions, weeks 4–6 community voting, week 7 shortlist published, weeks 8–9 panel scoring and clarification interviews, week 10 winners announced, weeks 11–13 pilot kickoffs. One flagship round per year (typically Q3) runs an extended five-week voting window and carries an enhanced prize pool.",
            "section": "7. Timeline & Cadence"
        },
        {
            "q": "How is the $100,000 prize pool split?",
            "a": "Tiered by place: $50,000 to the 1st place winner, $25,000 to 2nd place, $15,000 to 3rd place, and a $10,000 pool split equally across 4th–10th place honourable mentions (approximately $1,430 each). Prizes are paid within 60 days of announcement through Opco payroll, subject to local tax withholding. Group Tax publishes a per-country note each round.",
            "section": "8. Prize Mechanics"
        },
        {
            "q": "Is prize money the same as pilot funding?",
            "a": "No — they are separate and independent allocations. Prize money goes to the lead author as a one-time bonus. Pilot funding is a separate allocation made by the AI Council to actually build the winning idea. Pilot funding may be clawed back if a pilot is cancelled for cause; prize money may not.",
            "section": "8. Prize Mechanics"
        },
        {
            "q": "Who owns the IP on a submitted idea?",
            "a": "All ideas submitted to Spark are the intellectual property of the Group. By submitting, staff grant the Group a perpetual, royalty-free, worldwide licence to implement, modify, and commercialise the idea — aligning with the standard employment contract of each participating entity. Submissions are internal-confidential through the Voted stage and internal-all-staff from Shortlist onward.",
            "section": "9. Intellectual Property, Confidentiality & Data"
        },
        {
            "q": "Can I include real customer data in an idea submission?",
            "a": "No. Submissions must not contain personally identifiable customer data (use synthetic or aggregated examples), third-party trade secrets, material non-public information about the Group or any Opco, or data subject to contractual confidentiality obligations. Ideas involving personal data processing must comply with the Group Data Protection Policy and cannot progress past Shortlist without a completed data protection pre-assessment.",
            "section": "9. Intellectual Property, Confidentiality & Data"
        },
        {
            "q": "What counts as a conflict of interest and how is it handled?",
            "a": "Judges, Council members, and managers involved in scoring must declare any actual, potential, or perceived conflict of interest before scoring begins — including close personal relationships with an author, prior commercial relationships with a named vendor, and any pre-existing financial interest in the idea's domain. Recusal is automatic where declared.",
            "section": "10. Conflicts of Interest & Code of Conduct"
        },
        {
            "q": "If I think the rules have been breached, how do I raise a dispute?",
            "a": "Raise a dispute within 72 hours of the event through the Spark section of the Hub or by email to spark-appeals@group. Disputes are triaged by the Head of AI & Automation and, if substantiated, heard by a three-person Council panel (excluding members with a conflict). The panel commits to a decision within ten working days. Remedies include vote nullification, disqualification, re-opening a stage, or no action.",
            "section": "11. Dispute Resolution"
        },
        {
            "q": "Who owns this charter and how can it be changed?",
            "a": "The charter is owned and ratified by the AI Council. It is reviewed annually and amendments may be issued between reviews where operational reality requires it. Material changes — to prize mechanics, judging weights, or eligibility — require a simple majority of the Council plus advance notice of at least one round. Current version is v1.0, effective 24 April 2026; change history is maintained in the Group document store and is visible to all staff.",
            "section": "12. Governance & Amendments"
        }
    ]
}


def main():
    data = json.loads(BRAIN.read_text())
    docs = data.get("docs", [])
    # Replace if exists
    docs = [d for d in docs if d.get("id") != CHARTER_ENTRY["id"]]
    docs.append(CHARTER_ENTRY)
    data["docs"] = docs
    BRAIN.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f"Wrote {BRAIN} ({len(docs)} docs total; charter indexed with {len(CHARTER_ENTRY['faqs'])} FAQs).")


if __name__ == "__main__":
    main()
