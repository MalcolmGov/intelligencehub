#!/usr/bin/env node
/**
 * Build the Spark Challenge Charter .docx from spark_charter.json.
 * Output: docs/02_Governance_and_Policy/Spark_Challenge_Charter.docx
 *
 * Run from repo root:  node tools/build_spark_charter_docx.js
 * (expects `docx` installed either locally or at /tmp/docx_build/node_modules)
 */
const fs = require('fs');
const path = require('path');

// Resolve `docx` from a few candidate locations
let docx;
const candidates = [
  require.resolve.paths('docx')[0],
  '/tmp/docx_build/node_modules',
  path.resolve(__dirname, '..', 'node_modules'),
];
for (const p of candidates) {
  try { docx = require(path.join(p, 'docx')); break; } catch (_) { /* try next */ }
}
if (!docx) {
  try { docx = require('docx'); } catch (e) {
    console.error('Could not load docx module. Install via `npm install docx` or run with NODE_PATH=/tmp/docx_build/node_modules');
    process.exit(1);
  }
}

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, PositionalTab, PositionalTabAlignment,
  PositionalTabRelativeTo, PositionalTabLeader,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak, PageNumber
} = docx;

const ROOT = path.resolve(__dirname, '..');
const charter = JSON.parse(fs.readFileSync(path.join(ROOT, 'spark_charter.json'), 'utf8'));
const OUT_PATH = path.join(ROOT, 'docs', '02_Governance_and_Policy', 'Spark_Challenge_Charter.docx');

const BRAND_BLUE = '2563EB';
const BRAND_YELLOW = 'EAB308';
const MUTED = '6B7280';
const TEXT = '111827';
const BORDER_LIGHT = 'E5E7EB';
const BG_SOFT = 'F9FAFB';
const BG_TERT = 'F3F4F6';

const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT };
const cellBorders = { top: border, bottom: border, left: border, right: border };

// ========== helpers ==========
function p(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text.map(r => typeof r === 'string' ? new TextRun(r) : new TextRun(r))
    : [new TextRun(text)];
  return new Paragraph({
    children: runs,
    spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: 300 },
    alignment: opts.align || AlignmentType.LEFT,
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })], // 11pt
    spacing: { before: opts.before ?? 0, after: opts.after ?? 160, line: 320 },
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, color: TEXT })],
    spacing: { before: 360, after: 180 },
  });
}
function h2(num, text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({ text: num + '. ', bold: true, size: 26, color: BRAND_BLUE }),
      new TextRun({ text, bold: true, size: 26, color: TEXT }),
    ],
    spacing: { before: 300, after: 140 },
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 22, color: TEXT })],
    spacing: { before: 200, after: 100 },
  });
}

function cell(children, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: Array.isArray(children) ? children : [children],
  });
}

function rubricTable(rubric) {
  const WIDTH = 9360; // US Letter content width at 1" margins
  const cols = [2600, 1200, 5560];
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell(new Paragraph({ children: [new TextRun({ text: 'Dimension', bold: true, size: 20, color: MUTED })] }), { width: cols[0], shade: BG_TERT }),
      cell(new Paragraph({ children: [new TextRun({ text: 'Weight',    bold: true, size: 20, color: MUTED })] }), { width: cols[1], shade: BG_TERT }),
      cell(new Paragraph({ children: [new TextRun({ text: 'What we score', bold: true, size: 20, color: MUTED })] }), { width: cols[2], shade: BG_TERT }),
    ],
  });
  const rows = rubric.map(r => new TableRow({
    children: [
      cell(new Paragraph({ children: [new TextRun({ text: r.dimension, bold: true, size: 22 })] }), { width: cols[0] }),
      cell(new Paragraph({ children: [new TextRun({ text: r.weight, size: 22, color: BRAND_BLUE, bold: true })] }), { width: cols[1] }),
      cell(new Paragraph({ children: [new TextRun({ text: r.description, size: 22 })] }), { width: cols[2] }),
    ],
  }));
  return new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    columnWidths: cols,
    rows: [header, ...rows],
  });
}

function stagesTable(stages) {
  const WIDTH = 9360;
  const cols = [700, 1800, 6860];
  const rows = stages.map((s, i) => new TableRow({
    children: [
      cell(new Paragraph({ children: [new TextRun({ text: String(i + 1), bold: true, size: 22, color: 'FFFFFF' })], alignment: AlignmentType.CENTER }), { width: cols[0], shade: BRAND_BLUE }),
      cell(new Paragraph({ children: [new TextRun({ text: s.name, bold: true, size: 22 })] }), { width: cols[1] }),
      cell(new Paragraph({ children: [new TextRun({ text: s.trigger, size: 22 })] }), { width: cols[2] }),
    ],
  }));
  return new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    columnWidths: cols,
    rows,
  });
}

function prizesTable(prizes) {
  const WIDTH = 9360;
  const cols = [4200, 2000, 3160];
  const rows = prizes.map((pr, i) => {
    const shade = i === 0 ? 'FEF3C7' : i === 1 ? 'F3F4F6' : i === 2 ? 'FEF3C7' : 'FFFFFF';
    return new TableRow({
      children: [
        cell(new Paragraph({ children: [new TextRun({ text: pr.place, bold: true, size: 22 })] }), { width: cols[0], shade }),
        cell(new Paragraph({ children: [new TextRun({ text: pr.amount, bold: true, size: 24, color: TEXT })] }), { width: cols[1], shade }),
        cell(new Paragraph({ children: [new TextRun({ text: pr.note, size: 20, color: MUTED })] }), { width: cols[2], shade }),
      ],
    });
  });
  return new Table({
    width: { size: WIDTH, type: WidthType.DXA },
    columnWidths: cols,
    rows,
  });
}

// ========== Build the document body ==========
const body = [];

// Cover block
body.push(new Paragraph({
  children: [new TextRun({ text: 'AI & AUTOMATION DIVISION', bold: true, size: 18, color: BRAND_BLUE, characterSpacing: 40 })],
  spacing: { before: 0, after: 120 },
}));
body.push(new Paragraph({
  children: [new TextRun({ text: 'Spark — Continental Innovation Challenge', bold: true, size: 44, color: TEXT })],
  spacing: { before: 0, after: 80 },
}));
body.push(new Paragraph({
  children: [new TextRun({ text: 'Rules & Judging Charter', italic: true, size: 32, color: MUTED })],
  spacing: { before: 0, after: 360 },
}));

// Meta box
body.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [new TableRow({
    children: [
      cell([
        new Paragraph({ children: [new TextRun({ text: 'VERSION', bold: true, size: 16, color: MUTED })] }),
        new Paragraph({ children: [new TextRun({ text: charter.version, bold: true, size: 24, color: TEXT })] }),
      ], { width: 3120, shade: BG_SOFT }),
      cell([
        new Paragraph({ children: [new TextRun({ text: 'EFFECTIVE', bold: true, size: 16, color: MUTED })] }),
        new Paragraph({ children: [new TextRun({ text: charter.effective_date, bold: true, size: 24, color: TEXT })] }),
      ], { width: 3120, shade: BG_SOFT }),
      cell([
        new Paragraph({ children: [new TextRun({ text: 'OWNER', bold: true, size: 16, color: MUTED })] }),
        new Paragraph({ children: [new TextRun({ text: charter.owner, bold: true, size: 24, color: TEXT })] }),
      ], { width: 3120, shade: BG_SOFT }),
    ],
  })],
}));

body.push(new Paragraph({ children: [new TextRun(' ')], spacing: { before: 240, after: 240 } }));

// Sections
charter.sections.forEach(sec => {
  body.push(h2(sec.num, sec.heading));
  (sec.paras || []).forEach(t => body.push(bodyPara(t)));
  if (sec.rubric)  body.push(rubricTable(sec.rubric));
  if (sec.stages)  body.push(stagesTable(sec.stages));
  if (sec.prizes)  body.push(prizesTable(sec.prizes));
  (sec.paras_after || []).forEach(t => body.push(bodyPara(t, { before: 120 })));
});

// Signature block
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1('Ratification'));
body.push(bodyPara(`This charter is ratified by the AI Council and takes effect on ${charter.effective_date}.`));
body.push(bodyPara('Signed on behalf of the Council:'));
body.push(new Paragraph({ children: [new TextRun(' ')], spacing: { before: 400, after: 0 } }));
body.push(new Paragraph({
  children: [
    new TextRun({ text: 'Head of AI & Automation', bold: true, size: 22 }),
    new TextRun('\t'),
    new TextRun({ text: 'AI Council Chair', bold: true, size: 22 }),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
}));
body.push(new Paragraph({
  children: [
    new TextRun({ text: '____________________________', size: 22, color: MUTED }),
    new TextRun('\t'),
    new TextRun({ text: '____________________________', size: 22, color: MUTED }),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
  spacing: { before: 400, after: 80 },
}));

// ========== Document wrapper ==========
const doc = new Document({
  creator: 'AI Council',
  title: charter.title,
  description: 'Rules & Judging Charter for the Spark Continental Innovation Challenge',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } }, // 11pt
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: TEXT },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: TEXT },
        paragraph: { spacing: { before: 300, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial', color: TEXT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: 'SPARK · RULES & JUDGING CHARTER', size: 16, color: MUTED, characterSpacing: 40 }),
            new TextRun('\t'),
            new TextRun({ text: charter.version, size: 16, color: MUTED }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT, space: 4 } },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            new TextRun({ text: 'AI & Automation Division · Internal-Confidential', size: 16, color: MUTED }),
            new TextRun('\t'),
            new TextRun({ text: 'Page ', size: 16, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          alignment: AlignmentType.LEFT,
        })],
      }),
    },
    children: body,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, buffer);
  console.log('Wrote', OUT_PATH, '(' + buffer.length + ' bytes)');
});
