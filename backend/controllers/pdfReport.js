/**
 * pdfReport.js  — ES Module (import/export)
 * Backend: Node.js + Puppeteer
 *
 * INSTALL:
 *   npm install puppeteer
 *
 * USAGE in your Express route file:
 *   import { generatePDF } from './pdfReport.js';
 *
 *   app.post('/name/pdf-report', async (req, res) => {
 *     try {
 *       const pdf      = await generatePDF(req.body);
 *       const safeName = (req.body.name || 'Report').replace(/\s+/g, '_');
 *       res.set({
 *         'Content-Type':        'application/pdf',
 *         'Content-Disposition': `attachment; filename="${safeName}_Numerology_Report.pdf"`,
 *         'Content-Length':      pdf.length,
 *       });
 *       res.send(pdf);
 *     } catch (err) {
 *       console.error('PDF error:', err);
 *       res.status(500).json({ error: 'PDF generation failed' });
 *     }
 *   });
 *
 * NOTE: Make sure your package.json has:
 *   "type": "module"
 * OR rename this file to pdfReport.mjs
 */

import puppeteer from 'puppeteer';

// ── Letter value maps ────────────────────────────────────────
const CHALDEAN_MAP = {
  A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8,
};
const PYTH_MAP = {
  A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,
  E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9,
};

const REMEDIES = {
  1: { planet:'Sun (Surya)',      day:'Sunday',    colors:'Red, Orange, Gold',         gem:'Ruby / Garnet',              mantra:'Om Hraam Hreem Hraum Sah Suryaya Namah' },
  2: { planet:'Moon (Chandra)',   day:'Monday',    colors:'White, Silver, Pearl',      gem:'Pearl / Moonstone',          mantra:'Om Shraam Shreem Shraum Sah Chandraya Namah' },
  3: { planet:'Jupiter (Guru)',   day:'Thursday',  colors:'Yellow, Gold',              gem:'Yellow Sapphire / Topaz',    mantra:'Om Graam Greem Graum Sah Gurave Namah' },
  4: { planet:'Rahu / Uranus',    day:'Saturday',  colors:'Blue, Grey, Electric Blue', gem:'Hessonite (Gomed)',          mantra:'Om Raam Reem Raum Sah Rahave Namah' },
  5: { planet:'Mercury (Budha)',  day:'Wednesday', colors:'Green, Emerald',            gem:'Emerald / Green Tourmaline', mantra:'Om Braam Breem Braum Sah Budhaya Namah' },
  6: { planet:'Venus (Shukra)',   day:'Friday',    colors:'Pink, White, Light Blue',   gem:'Diamond / White Sapphire',   mantra:'Om Draam Dreem Draum Sah Shukraya Namah' },
  7: { planet:'Ketu / Neptune',   day:'Monday',    colors:'Purple, Violet, Grey',      gem:"Cat's Eye (Lehsunia)",       mantra:'Om Straam Streem Straum Sah Ketave Namah' },
  8: { planet:'Saturn (Shani)',   day:'Saturday',  colors:'Black, Dark Blue, Indigo',  gem:'Blue Sapphire / Amethyst',   mantra:'Om Praam Preem Praum Sah Shanishcharaya Namah' },
  9: { planet:'Mars (Mangal)',    day:'Tuesday',   colors:'Red, Scarlet, Coral',       gem:'Red Coral / Carnelian',      mantra:'Om Kraam Kreem Kraum Sah Bhaumaya Namah' },
};

// ── Helpers ──────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const gradeColor = (g) =>
  ({ 'A+':'#059669', A:'#16a34a', 'B+':'#d97706', B:'#ea580c', C:'#dc2626' }[g] ?? '#d97706');

const strengthColor = (s) =>
  ({ VeryStrong:'#059669', Master:'#7c3aed', Strong:'#1d4ed8', Moderate:'#d97706', Weak:'#dc2626' }[s] ?? '#d97706');

function letterBoxes(name, map, accent) {
  return [...name.toUpperCase()]
    .map((ch) => {
      if (ch === ' ') return `<span style="display:inline-block;width:8px"></span>`;
      return `
        <span style="display:inline-flex;flex-direction:column;align-items:center;
          background:#f8f7f4;border:1.5px solid #e5e2dc;border-radius:6px;
          padding:4px 6px;margin:2px;min-width:24px">
          <b style="font-size:12px;color:${accent}">${ch}</b>
          <span style="font-size:9px;color:#9ca3af;margin-top:1px">${map[ch] ?? '–'}</span>
        </span>`;
    })
    .join('');
}

function compatBar(label, value) {
  const color = value >= 80 ? '#16a34a' : value >= 65 ? '#d97706' : '#dc2626';
  return `
    <div style="margin-bottom:11px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:4px">
        <span>${esc(label)}</span>
        <b style="color:${color}">${value}%</b>
      </div>
      <div style="background:#f3f4f6;border-radius:99px;height:7px;overflow:hidden">
        <div style="width:${value}%;height:100%;background:${color};border-radius:99px"></div>
      </div>
    </div>`;
}

function suggestionCards(suggestions) {
  if (!suggestions?.length) {
    return `
      <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;
        padding:24px;text-align:center">
        <div style="font-size:28px;margin-bottom:8px">✅</div>
        <p style="font-size:15px;font-weight:700;color:#15803d;margin:0 0 4px">
          Your Name is Already Optimal!</p>
        <p style="font-size:12px;color:#166534;margin:0">
          No corrections needed — your name is perfectly aligned.</p>
      </div>`;
  }

  return suggestions.map((s) => {
    const sg  = s.compatScore >= 85 ? 'A+' : s.compatScore >= 75 ? 'A' : s.compatScore >= 65 ? 'B+' : 'B';
    const gc  = gradeColor(sg);
    const pow = s.isPowerful;
    return `
      <div style="border:${pow ? '2px solid #d97706' : '1.5px solid #e5e7eb'};
        border-radius:12px;background:${pow ? '#fffbeb' : '#fff'};
        padding:18px;margin-bottom:14px;page-break-inside:avoid">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            ${pow ? `<span style="font-size:9px;background:#fef3c7;color:#92400e;
              border:1px solid #fcd34d;border-radius:99px;padding:2px 8px;
              font-weight:700;margin-right:6px">⭐ POWERFUL</span>` : ''}
            <span style="font-size:17px;font-weight:800;color:#111827;
              font-family:'Playfair Display',Georgia,serif">${esc(s.name)}</span>
          </div>
          <span style="font-size:12px;font-weight:800;color:#fff;
            background:${gc};border-radius:8px;padding:4px 10px">${sg}</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px">
          ${[
            ['Chaldean',    `${s.chaldean?.compound} → ${s.chaldean?.root}`, s.chaldean?.meaning,    '#b45309'],
            ['Pythagorean', `${s.pythagorean?.compound} → ${s.pythagorean?.root}`, s.pythagorean?.meaning, '#1d4ed8'],
            ['DOB Match',   `${s.dobCompat ?? 75}%`, '', s.dobCompat >= 80 ? '#16a34a' : s.dobCompat >= 65 ? '#d97706' : '#dc2626'],
            ['Life Path',   `${s.lpCompat ?? 75}%`,  '', s.lpCompat  >= 80 ? '#16a34a' : s.lpCompat  >= 65 ? '#d97706' : '#dc2626'],
          ].map(([lbl, val, hint, col]) => `
            <div style="background:#f9fafb;border-radius:8px;padding:8px;
              text-align:center;border:1px solid #f3f4f6">
              <div style="font-size:8px;color:#9ca3af;font-weight:700;
                text-transform:uppercase;margin-bottom:2px">${lbl}</div>
              <div style="font-size:14px;font-weight:800;color:${col}">${esc(val)}</div>
              ${hint ? `<div style="font-size:8px;color:#9ca3af;margin-top:2px">
                ${esc(String(hint).slice(0, 28))}…</div>` : ''}
            </div>`).join('')}
        </div>

        ${s.whyGood ? `
        <div style="background:#f8faff;border-left:3px solid #3b82f6;
          border-radius:0 8px 8px 0;padding:10px 12px;margin-bottom:8px">
          <div style="font-size:8px;font-weight:700;color:#3b82f6;
            text-transform:uppercase;margin-bottom:3px">Why This Works</div>
          <div style="font-size:11px;color:#374151;line-height:1.6">${esc(s.whyGood)}</div>
        </div>` : ''}

        ${s.expectedBenefits ? `
        <div style="background:#f0fdf4;border-left:3px solid #16a34a;
          border-radius:0 8px 8px 0;padding:10px 12px">
          <div style="font-size:8px;font-weight:700;color:#16a34a;
            text-transform:uppercase;margin-bottom:3px">✨ Expected Benefits</div>
          <div style="font-size:11px;color:#374151;line-height:1.6">${esc(s.expectedBenefits)}</div>
        </div>` : ''}
      </div>`;
  }).join('');
}

// ── HTML Builder ─────────────────────────────────────────────
function buildHTML(data) {
  const {
    name        = 'Unknown',
    dob         = {},
    chaldean    = {},
    pythagorean = {},
    compat      = {},
    assessment  = {},
    ai          = {},
    suggestions = [],
    isPowerfulChaldean    = false,
    isPowerfulPythagorean = false,
  } = data;

  const grade    = assessment.grade || 'B';
  const gc       = gradeColor(grade);
  const overall  = compat.overall || 0;
  const oc       = overall >= 80 ? '#16a34a' : overall >= 65 ? '#d97706' : '#dc2626';
  const ocBg     = overall >= 80 ? '#dcfce7' : overall >= 65 ? '#fef3c7' : '#fee2e2';
  const today    = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const chalSC   = strengthColor(chaldean.strength);
  const pythSC   = strengthColor(pythagorean.strength);
  const remNum   = parseInt(chaldean.root) || 5;
  const remedy   = REMEDIES[remNum] || REMEDIES[5];

  // shared page header snippet
  const pageHeader = (section, page) => `
    <div style="display:flex;justify-content:space-between;align-items:center;
      border-bottom:2px solid #f3f4f6;padding-bottom:10px;margin-bottom:22px">
      <span style="font-size:9px;font-weight:700;color:#9ca3af;
        letter-spacing:2px;text-transform:uppercase">${section}</span>
      <span style="font-size:9px;color:#d1d5db">${esc(name)} · Page ${page}</span>
    </div>`;

  const pageFooter = (page) => `
    <div style="margin-top:20px;padding-top:10px;border-top:1px solid #f3f4f6;
      display:flex;justify-content:space-between">
      <span style="font-size:8px;color:#d1d5db">
        Numerology Name Correction — Premium Report · ${esc(name)}</span>
      <span style="font-size:8px;color:#d1d5db">Page ${page}</span>
    </div>`;

  const insightBox = (label, text, bg, border, labelColor) =>
    text ? `
    <div style="background:${bg};border:1.5px solid ${border};border-radius:12px;
      padding:16px 18px;margin-bottom:14px;page-break-inside:avoid">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;
        letter-spacing:1.5px;color:${labelColor};margin-bottom:8px">${label}</div>
      <div style="font-size:12px;color:#374151;line-height:1.75">${esc(text)}</div>
    </div>` : '';

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans','Segoe UI',sans-serif; background:#fff; color:#1f2937; font-size:12px; line-height:1.5; }
  .page { width:210mm; padding:28px 36px 24px; }
  .cover { padding:0; background:linear-gradient(150deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%); min-height:297mm; display:flex; flex-direction:column; position:relative; overflow:hidden; }
  .cover::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse at 15% 15%, rgba(217,119,6,.15) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(99,102,241,.15) 0%, transparent 55%); }
  .cover-inner { position:relative; z-index:2; flex:1; display:flex; flex-direction:column; padding:44px 44px 0; }
  .cover-footer { position:relative; z-index:2; border-top:1px solid rgba(255,255,255,.08); padding:14px 44px; display:flex; justify-content:space-between; }
  .serif { font-family:'Playfair Display',Georgia,serif; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style>
</head>
<body>

<!-- ══════════════════════════════════════ COVER ══════════════ -->
<div class="page cover">
  <div class="cover-inner">

    <!-- Brand bar -->
    <div style="border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:14px;margin-bottom:36px">
      <span style="font-size:9px;color:rgba(255,255,255,.35);letter-spacing:3px;text-transform:uppercase">
        🔢 &nbsp; Numerology Name Correction &nbsp;·&nbsp; Premium Report
      </span>
    </div>

    <!-- Title -->
    <div style="font-size:10px;color:#fbbf24;letter-spacing:4px;text-transform:uppercase;
      font-weight:600;margin-bottom:14px">✦ &nbsp; Premium Analysis &nbsp; ✦</div>
    <div class="serif" style="font-size:56px;font-weight:900;color:#fff;line-height:1.05;margin-bottom:6px">
      Name<br/><span style="color:#fbbf24">Correction</span>
    </div>
    <div style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:44px;font-weight:300;letter-spacing:1px">
      Chaldean &nbsp;·&nbsp; Pythagorean &nbsp;·&nbsp; AI-Powered Analysis
    </div>
    <div style="width:56px;height:3px;background:linear-gradient(90deg,#fbbf24,#f59e0b);
      border-radius:2px;margin-bottom:40px"></div>

    <!-- Name block -->
    <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
      border-radius:16px;padding:26px 30px;margin-bottom:20px">
      <div style="font-size:9px;color:rgba(255,255,255,.35);text-transform:uppercase;
        letter-spacing:3px;margin-bottom:8px">Prepared For</div>
      <div class="serif" style="font-size:30px;font-weight:700;color:#fff;margin-bottom:14px">
        ${esc(name)}</div>
      <div style="display:flex;gap:28px;flex-wrap:wrap">
        ${[['Date of Birth', dob.raw || ''], ['Birth Number', dob.birthNumber], ['Life Path', dob.lifePath], ['Report Date', today]]
          .map(([l, v]) => `
          <div>
            <div style="font-size:8px;color:rgba(255,255,255,.3);text-transform:uppercase;
              letter-spacing:2px;margin-bottom:3px">${l}</div>
            <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,.8)">${esc(String(v ?? ''))}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Grade row -->
    <div style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px 20px;margin-bottom:20px">
      <div style="width:54px;height:54px;border-radius:50%;background:${gc};display:flex;
        align-items:center;justify-content:center;flex-shrink:0">
        <span class="serif" style="font-size:26px;font-weight:900;color:#fff">${esc(grade)}</span>
      </div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:2px">
          ${esc(assessment.label || '')}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.4)">Overall Assessment</div>
      </div>
      <div style="background:${oc};border-radius:99px;padding:6px 16px;
        font-size:13px;font-weight:700;color:#fff">${overall}% Match</div>
    </div>

    <!-- Badges -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:auto;padding-bottom:28px">
      ${isPowerfulChaldean    ? `<span style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:99px;padding:5px 12px;font-size:9px;color:rgba(255,255,255,.5);font-weight:600">⭐ Powerful Chaldean</span>` : ''}
      ${isPowerfulPythagorean ? `<span style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:99px;padding:5px 12px;font-size:9px;color:rgba(255,255,255,.5);font-weight:600">⭐ Powerful Pythagorean</span>` : ''}
      <span style="background:rgba(255,255,255,.08);border:1px solid rgba(${ai.correctionNeeded ? '220,38,38' : '22,163,74'},.4);border-radius:99px;padding:5px 12px;font-size:9px;color:rgba(255,255,255,.5);font-weight:600">
        ${ai.correctionNeeded ? '⚠️ Correction Recommended' : '✅ Name Analyzed'}</span>
      <span style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:99px;padding:5px 12px;font-size:9px;color:rgba(255,255,255,.5);font-weight:600">🤖 AI-Powered</span>
    </div>

    <!-- TOC -->
    <div style="margin-top:auto;padding-top:16px">
      <div style="font-size:8px;color:rgba(255,255,255,.2);letter-spacing:3px;
        text-transform:uppercase;margin-bottom:10px">Contents</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px">
        ${[['01','Chaldean Analysis'],['02','Pythagorean Analysis'],
           ['03','DOB & Compatibility'],['04','Personality Profile'],
           ['05','Challenges & Remedies'],['06','Career & Lucky Details'],
           ['07','Name Suggestions'],['08','Final Advice & Summary'],
        ].map(([n,t]) => `
          <div style="display:flex;align-items:center;gap:8px;padding:5px 0;
            border-bottom:1px solid rgba(255,255,255,.05)">
            <span style="font-size:9px;font-weight:800;color:#fbbf24;width:20px">${n}</span>
            <span style="font-size:10px;color:rgba(255,255,255,.38)">${t}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <span style="font-size:8px;color:rgba(255,255,255,.2)">NUMEROLOGY NAME CORRECTION · PREMIUM REPORT</span>
    <span style="font-size:8px;color:rgba(255,255,255,.2)">Page 1</span>
  </div>
</div>

<!-- ══════════════════════════════ PAGE 2: NUMEROLOGY ════════ -->
<div class="page">
  ${pageHeader('Numerology Analysis', 2)}

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">Chaldean Numerology</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:14px">01 — Ancient Babylonian System</div>

  <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1.5px solid #fde68a;
    border-radius:12px;padding:18px 22px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:9px;font-weight:700;text-transform:uppercase;
        letter-spacing:2px;color:#92400e">🔮 Chaldean System</span>
      <span style="font-size:9px;font-weight:700;padding:3px 10px;border-radius:99px;
        background:${chalSC};color:#fff;text-transform:uppercase;letter-spacing:1px">
        ${esc(chaldean.strength)}</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
      <div>
        <div style="font-size:9px;color:#92400e;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:2px">Compound</div>
        <div class="serif" style="font-size:52px;font-weight:900;line-height:1;color:${chalSC}">
          ${esc(chaldean.compound)}</div>
      </div>
      <div style="font-size:22px;color:#d1d5db">→</div>
      <div>
        <div style="font-size:9px;color:#92400e;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:2px">Root</div>
        <div class="serif" style="font-size:52px;font-weight:900;line-height:1;color:#374151">
          ${esc(chaldean.root)}</div>
      </div>
      <div style="margin-left:12px;flex:1">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
          color:${chalSC};margin-bottom:4px">${esc(chaldean.category)}</div>
        <div style="font-size:13px;font-weight:600;font-style:italic;color:#374151">
          "${esc(chaldean.meaning)}"</div>
      </div>
    </div>
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
      color:#9ca3af;margin-bottom:6px;padding-top:10px;border-top:1px solid rgba(0,0,0,.06)">
      Letter Values (Chaldean)</div>
    <div style="display:flex;flex-wrap:wrap;gap:2px">
      ${letterBoxes(name, CHALDEAN_MAP, '#b45309')}</div>
  </div>

  <hr style="border:none;border-top:1.5px solid #f3f4f6;margin:18px 0"/>

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">Pythagorean Numerology</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:14px">02 — Greek Mathematical System</div>

  <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #bfdbfe;
    border-radius:12px;padding:18px 22px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="font-size:9px;font-weight:700;text-transform:uppercase;
        letter-spacing:2px;color:#1e3a8a">📐 Pythagorean System</span>
      <span style="font-size:9px;font-weight:700;padding:3px 10px;border-radius:99px;
        background:${pythSC};color:#fff;text-transform:uppercase;letter-spacing:1px">
        ${esc(pythagorean.strength)}</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
      <div>
        <div style="font-size:9px;color:#1e3a8a;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:2px">Compound</div>
        <div class="serif" style="font-size:52px;font-weight:900;line-height:1;color:${pythSC}">
          ${esc(pythagorean.compound)}</div>
      </div>
      <div style="font-size:22px;color:#d1d5db">→</div>
      <div>
        <div style="font-size:9px;color:#1e3a8a;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:2px">Root</div>
        <div class="serif" style="font-size:52px;font-weight:900;line-height:1;color:#374151">
          ${esc(pythagorean.root)}</div>
      </div>
      <div style="margin-left:12px;flex:1">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
          color:${pythSC};margin-bottom:4px">${esc(pythagorean.category)}</div>
        <div style="font-size:13px;font-weight:600;font-style:italic;color:#374151">
          "${esc(pythagorean.meaning)}"</div>
      </div>
    </div>
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
      color:#9ca3af;margin-bottom:6px;padding-top:10px;border-top:1px solid rgba(0,0,0,.06)">
      Letter Values (Pythagorean)</div>
    <div style="display:flex;flex-wrap:wrap;gap:2px">
      ${letterBoxes(name, PYTH_MAP, '#1d4ed8')}</div>
  </div>

  ${pageFooter(2)}
</div>

<!-- ══════════════════════════ PAGE 3: COMPAT + PERSONALITY ══ -->
<div class="page">
  ${pageHeader('Compatibility & Personality', 3)}

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">DOB Numbers</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:14px">03 — Birth Vibration</div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:16px">
    ${[
      ['Birth Number', dob.birthNumber, '#d97706', `Day of Birth`],
      ['Life Path',    dob.lifePath,    '#7c3aed', `Total ${dob.lifePathTotal ?? ''}`],
      ['Overall Match',`${overall}%`,   oc,        assessment.label || ''],
      ['Grade',        grade,           gc,        assessment.label || ''],
    ].map(([l,v,c,h]) => `
      <div style="background:#f9fafb;border:1.5px solid #f3f4f6;border-radius:12px;
        padding:14px 10px;text-align:center">
        <div style="font-size:8px;color:#9ca3af;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:6px">${l}</div>
        <div class="serif" style="font-size:28px;font-weight:900;color:${c};line-height:1">
          ${esc(String(v ?? ''))}</div>
        <div style="font-size:9px;color:#d1d5db;margin-top:4px">${esc(String(h))}</div>
      </div>`).join('')}
  </div>

  <!-- Compat bars -->
  <div style="background:#f9fafb;border:1.5px solid #f3f4f6;border-radius:12px;
    padding:16px 18px;margin-bottom:14px">
    <div style="font-size:9px;font-weight:800;color:#374151;text-transform:uppercase;
      letter-spacing:2px;margin-bottom:12px">Compatibility Breakdown</div>
    ${compatBar(`Chaldean (${chaldean.root}) × Birth No. (${dob.birthNumber})`,   compat.chaldeanVsBirth    || 0)}
    ${compatBar(`Chaldean (${chaldean.root}) × Life Path (${dob.lifePath})`,      compat.chaldeanVsLifePath || 0)}
    ${compatBar(`Pythagorean (${pythagorean.root}) × Birth No. (${dob.birthNumber})`, compat.pythagoreanVsBirth || 0)}
    ${compatBar(`Pythagorean (${pythagorean.root}) × Life Path (${dob.lifePath})`,    compat.pythagoreanVsLP    || 0)}
    <div style="background:${ocBg};border-radius:8px;padding:10px 14px;
      display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <span style="font-size:11px;font-weight:700;color:#374151">Overall Score</span>
      <span style="font-size:18px;font-weight:900;color:${oc}">${overall}% — ${esc(assessment.label || '')}</span>
    </div>
  </div>

  <!-- Correction banner -->
  ${ai.correctionReason ? `
  <div style="background:${ai.correctionNeeded ? '#fef2f2' : '#f0fdf4'};
    border:1.5px solid ${ai.correctionNeeded ? '#fca5a5' : '#86efac'};
    border-radius:12px;padding:14px 18px;display:flex;gap:12px;margin-bottom:14px">
    <span style="font-size:20px">${ai.correctionNeeded ? '⚠️' : '✅'}</span>
    <div>
      <div style="font-size:11px;font-weight:800;margin-bottom:3px;
        color:${ai.correctionNeeded ? '#dc2626' : '#16a34a'}">
        ${ai.correctionNeeded ? 'Name Correction Recommended' : 'Name is Well Aligned'}</div>
      <div style="font-size:11px;color:#4b5563;line-height:1.6">${esc(ai.correctionReason)}</div>
    </div>
  </div>` : ''}

  <hr style="border:none;border-top:1.5px solid #f3f4f6;margin:16px 0"/>

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">AI Personality Profile</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:12px">04 — Psychological & Numerological Insight</div>

  ${insightBox('🧠 Personality Insight',    ai.personalityInsight,   '#fffbeb', '#fde68a', '#92400e')}
  ${insightBox('🔍 Current Name Analysis',  ai.currentNameAnalysis,  '#f8faff', '#bfdbfe', '#1e3a8a')}

  ${pageFooter(3)}
</div>

<!-- ════════════════════════ PAGE 4: CHALLENGES + CAREER ════ -->
<div class="page">
  ${pageHeader('Challenges, Remedies & Lucky Details', 4)}

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">Key Challenges</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:12px">05 — Life Obstacles & Remedies</div>

  ${insightBox('⚡ Key Life Challenges', ai.challenges, '#fff7f0', '#fed7aa', '#c2410c')}

  <!-- Remedy table -->
  <div style="background:#fefce8;border:1.5px solid #fde68a;border-radius:12px;
    padding:16px 18px;margin-bottom:16px">
    <div style="font-size:9px;font-weight:800;color:#92400e;text-transform:uppercase;
      letter-spacing:2px;margin-bottom:12px">🌟 Numerological Remedies — Ruling Number ${esc(String(chaldean.root))}</div>
    ${[
      ['Ruling Planet',  remedy.planet,  '#92400e'],
      ['Best Day',       remedy.day,     '#374151'],
      ['Power Colors',   remedy.colors,  '#374151'],
      ['Gemstone',       remedy.gem,     '#374151'],
      ['Daily Mantra',   remedy.mantra,  '#7c3aed'],
    ].map(([l,v,c],i) => `
      <div style="display:flex;gap:12px;padding:8px 0;
        ${i < 4 ? 'border-bottom:1px solid rgba(0,0,0,.06)' : ''}">
        <div style="width:110px;font-size:9px;font-weight:700;text-transform:uppercase;
          letter-spacing:.5px;color:#9ca3af;flex-shrink:0">${l}</div>
        <div style="font-size:12px;font-weight:600;color:${c};
          ${l==='Daily Mantra' ? 'font-style:italic' : ''}">${esc(v)}</div>
      </div>`).join('')}
  </div>

  <hr style="border:none;border-top:1.5px solid #f3f4f6;margin:14px 0"/>

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">Career & Lucky Details</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:12px">06 — Auspicious Numbers, Colors & Days</div>

  ${ai.careerAreas?.length ? `
  <div style="margin-bottom:14px">
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
      color:#374151;margin-bottom:8px">💼 Best Career Areas</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${ai.careerAreas.map(c => `
        <span style="background:#f0fdf4;border:1.5px solid #bbf7d0;color:#166534;
          border-radius:99px;padding:5px 14px;font-size:11px;font-weight:600">
          ${esc(c)}</span>`).join('')}
    </div>
  </div>` : ''}

  ${ai.luckyNumbers?.length ? `
  <div style="margin-bottom:14px">
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
      color:#374151;margin-bottom:8px">🍀 Lucky Numbers</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${ai.luckyNumbers.map(n => `
        <div style="width:36px;height:36px;border-radius:50%;
          background:linear-gradient(135deg,#fef3c7,#fde68a);
          border:2px solid #fbbf24;display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:800;color:#92400e">${esc(String(n))}</div>`).join('')}
    </div>
  </div>` : ''}

  <div style="background:#f9fafb;border:1.5px solid #f3f4f6;border-radius:12px;overflow:hidden">
    ${[
      ai.luckyColors?.length ? ['Lucky Colors', ai.luckyColors.map(c =>
        `<span style="display:inline-block;background:#fef3c7;border:1px solid #fde68a;
          border-radius:99px;padding:2px 10px;font-size:11px;color:#92400e;margin-right:4px">
          ${esc(c)}</span>`).join('')] : null,
      ai.luckyDays?.length ? ['Lucky Days', ai.luckyDays.map(d =>
        `<span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;
          border-radius:99px;padding:2px 10px;font-size:11px;color:#1e40af;margin-right:4px">
          ${esc(d)}</span>`).join('')] : null,
    ].filter(Boolean).map(([l, v], i, arr) => `
      <div style="display:flex;gap:12px;padding:10px 14px;align-items:center;
        ${i < arr.length - 1 ? 'border-bottom:1px solid #f3f4f6' : ''}">
        <div style="width:90px;font-size:9px;font-weight:700;text-transform:uppercase;
          letter-spacing:.5px;color:#9ca3af;flex-shrink:0">${l}</div>
        <div>${v}</div>
      </div>`).join('')}
  </div>

  ${pageFooter(4)}
</div>

<!-- ══════════════════════════════ PAGE 5: SUGGESTIONS ══════ -->
<div class="page">
  ${pageHeader('Name Correction Suggestions', 5)}

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">AI-Recommended Spellings</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:14px">07 — Ranked by Compatibility Score</div>

  ${suggestionCards(suggestions)}

  ${pageFooter(5)}
</div>

<!-- ═══════════════════════════ PAGE 6: ADVICE + SUMMARY ════ -->
<div class="page">
  ${pageHeader('Final Advice & Summary', 6)}

  <div class="serif" style="font-size:19px;font-weight:700;color:#111827;margin-bottom:2px">
    Numerologist's Final Advice</div>
  <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
    font-weight:600;margin-bottom:14px">08 — Personal Guidance</div>

  ${ai.generalAdvice ? `
  <div style="border-left:4px solid #7c3aed;background:#f5f3ff;border-radius:0 12px 12px 0;
    padding:18px 20px;font-family:'Playfair Display',Georgia,serif;font-size:13px;
    font-style:italic;color:#4c1d95;line-height:1.8;margin-bottom:18px">
    "${esc(ai.generalAdvice)}"
  </div>` : ''}

  <hr style="border:none;border-top:1.5px solid #f3f4f6;margin:16px 0"/>

  <div class="serif" style="font-size:17px;font-weight:700;color:#111827;margin-bottom:12px">
    Complete Summary</div>

  <div style="background:#f9fafb;border:1.5px solid #f3f4f6;border-radius:12px;
    overflow:hidden;margin-bottom:18px">
    ${[
      ['Full Name',          name],
      ['Date of Birth',      dob.raw || ''],
      ['Birth Number',       dob.birthNumber],
      ['Life Path Number',   dob.lifePath],
      ['Chaldean',           `${chaldean.compound} → ${chaldean.root}  (${chaldean.strength})`],
      ['Pythagorean',        `${pythagorean.compound} → ${pythagorean.root}  (${pythagorean.strength})`],
      ['Compatibility',      `${overall}%  —  ${assessment.label || ''}`],
      ['Report Grade',       grade],
      ['Correction Needed',  ai.correctionNeeded ? '⚠️ Yes — See Suggestions' : '✅ No'],
      ['Best Career Areas',  (ai.careerAreas || []).join(', ')],
      ['Lucky Numbers',      (ai.luckyNumbers || []).join(', ')],
      ['Lucky Colors',       (ai.luckyColors  || []).join(', ')],
      ['Lucky Days',         (ai.luckyDays    || []).join(', ')],
      ['Ruling Planet',      remedy.planet],
      ['Gemstone',           remedy.gem],
      ['Report Generated',   today],
    ].map(([l,v],i,arr) => `
      <div style="display:flex;gap:12px;padding:9px 14px;
        background:${i%2===1?'#fff':'#f9fafb'};
        ${i < arr.length-1 ? 'border-bottom:1px solid #f3f4f6' : ''}">
        <div style="width:150px;font-size:9px;font-weight:700;text-transform:uppercase;
          letter-spacing:.5px;color:#9ca3af;flex-shrink:0">${l}</div>
        <div style="font-size:12px;font-weight:600;color:#111827">${esc(String(v ?? ''))}</div>
      </div>`).join('')}
  </div>

  <!-- Disclaimer -->
  <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;border:1px solid #f3f4f6">
    <div style="font-size:8px;color:#9ca3af;line-height:1.7;text-align:justify">
      <b style="color:#d1d5db">DISCLAIMER:</b> This report uses traditional Chaldean and Pythagorean
      numerology principles with AI analysis. It is for personal guidance and self-reflection only.
      For major life decisions, please consult a qualified professional numerologist.
    </div>
  </div>

  ${pageFooter(6)}
</div>

</body></html>`;
}

// ── Export ───────────────────────────────────────────────────
export async function generatePDF(resultData) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildHTML(resultData), { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800)); // font render wait
    return await page.pdf({
      format:          'A4',
      printBackground: true,
      margin:          { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await browser.close();
  }
}