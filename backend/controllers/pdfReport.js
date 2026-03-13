/**
 * pdfReport.js  — ES Module (import/export)
 * Backend: Node.js + Puppeteer
 *
 * INSTALL:  npm install puppeteer
 *
 * USAGE in Express:
 *   import { generatePDF } from './pdfReport.js';
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

// ── Planet / Remedy data ─────────────────────────────────────
const REMEDIES = {
  1:{planet:'Sun (Surya)',     symbol:'☉', day:'Sunday',    colors:'Red, Orange, Gold',         gem:'Ruby / Garnet',              mantra:'Om Hraam Hreem Hraum Sah Suryaya Namah',   trait:'Leadership & Authority'},
  2:{planet:'Moon (Chandra)',  symbol:'☽', day:'Monday',    colors:'White, Silver, Pearl',      gem:'Pearl / Moonstone',          mantra:'Om Shraam Shreem Shraum Sah Chandraya Namah', trait:'Intuition & Sensitivity'},
  3:{planet:'Jupiter (Guru)',  symbol:'♃', day:'Thursday',  colors:'Yellow, Gold',              gem:'Yellow Sapphire / Topaz',    mantra:'Om Graam Greem Graum Sah Gurave Namah',   trait:'Wisdom & Expansion'},
  4:{planet:'Rahu / Uranus',   symbol:'☊', day:'Saturday',  colors:'Blue, Grey, Electric Blue', gem:'Hessonite (Gomed)',          mantra:'Om Raam Reem Raum Sah Rahave Namah',       trait:'Innovation & Change'},
  5:{planet:'Mercury (Budha)', symbol:'☿', day:'Wednesday', colors:'Green, Emerald',            gem:'Emerald / Green Tourmaline', mantra:'Om Braam Breem Braum Sah Budhaya Namah',   trait:'Communication & Intellect'},
  6:{planet:'Venus (Shukra)',  symbol:'♀', day:'Friday',    colors:'Pink, White, Light Blue',   gem:'Diamond / White Sapphire',   mantra:'Om Draam Dreem Draum Sah Shukraya Namah',  trait:'Love & Harmony'},
  7:{planet:'Ketu / Neptune',  symbol:'☋', day:'Monday',    colors:'Purple, Violet, Grey',      gem:"Cat's Eye (Lehsunia)",       mantra:'Om Straam Streem Straum Sah Ketave Namah', trait:'Spirituality & Mysticism'},
  8:{planet:'Saturn (Shani)',  symbol:'♄', day:'Saturday',  colors:'Black, Dark Blue, Indigo',  gem:'Blue Sapphire / Amethyst',   mantra:'Om Praam Preem Praum Sah Shanishcharaya Namah', trait:'Discipline & Karma'},
  9:{planet:'Mars (Mangal)',   symbol:'♂', day:'Tuesday',   colors:'Red, Scarlet, Coral',       gem:'Red Coral / Carnelian',      mantra:'Om Kraam Kreem Kraum Sah Bhaumaya Namah',  trait:'Courage & Energy'},
};

// Number meanings for deeper insight
const NUMBER_MEANINGS = {
  1:'The Leader — Independent, driven, a pioneer who carves their own path.',
  2:'The Diplomat — Cooperative, sensitive, a natural peacemaker and partner.',
  3:'The Creator — Expressive, joyful, gifted with communication and creativity.',
  4:'The Builder — Practical, disciplined, a foundation of stability and hard work.',
  5:'The Explorer — Freedom-loving, adaptable, magnetic and full of adventure.',
  6:'The Nurturer — Caring, responsible, drawn to family, beauty, and harmony.',
  7:'The Seeker — Introspective, analytical, a spiritual and intellectual investigator.',
  8:'The Achiever — Ambitious, powerful, destined for material and worldly success.',
  9:'The Humanitarian — Compassionate, wise, here to uplift and inspire others.',
  11:'Master Number 11 — The Intuitive Visionary. Rare spiritual insight and heightened sensitivity.',
  22:'Master Number 22 — The Master Builder. Power to turn the grandest dreams into reality.',
  33:'Master Number 33 — The Master Teacher. A beacon of healing, compassion, and truth.',
};

// ── Utility ──────────────────────────────────────────────────
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const gradeColor = g => ({
  'A+':'#059669', A:'#16a34a', 'B+':'#d97706', B:'#ea580c', C:'#dc2626'
}[g] ?? '#d97706');

const gradeLabel = g => ({
  'A+':'Exceptional — Elite Vibration',
  A:  'Excellent — Very Strong Alignment',
  'B+':'Good — Above Average Harmony',
  B:  'Average — Moderate Alignment',
  C:  'Weak — Correction Strongly Advised',
}[g] ?? 'Under Analysis');

const strengthColor = s => ({
  VeryStrong:'#059669', Master:'#7c3aed', Strong:'#1d4ed8',
  Moderate:'#d97706',   Weak:'#dc2626'
}[s] ?? '#d97706');

const today = new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'});
const reportId = `NC-${Date.now().toString(36).toUpperCase().slice(-8)}`;

// ── Letter boxes ─────────────────────────────────────────────
function letterBoxes(name, map, accent, bg) {
  return [...name.toUpperCase()].map(ch => {
    if (ch === ' ') return `<span style="display:inline-block;width:10px"></span>`;
    const val = map[ch];
    return `
      <span style="display:inline-flex;flex-direction:column;align-items:center;
        background:${bg};border:1.5px solid ${accent}33;border-radius:8px;
        padding:5px 7px;margin:2px;min-width:28px;box-shadow:0 1px 3px rgba(0,0,0,.05)">
        <b style="font-size:13px;color:${accent};font-family:'Playfair Display',Georgia,serif">${ch}</b>
        <span style="font-size:9px;color:${accent}99;margin-top:2px;font-weight:700">${val ?? '–'}</span>
      </span>`;
  }).join('');
}

// ── Compat bar ────────────────────────────────────────────────
function compatBar(label, value, showMeter = true) {
  const pct = Math.min(100, Math.max(0, value || 0));
  const color = pct >= 80 ? '#16a34a' : pct >= 65 ? '#d97706' : '#dc2626';
  const bgColor = pct >= 80 ? '#dcfce7' : pct >= 65 ? '#fef3c7' : '#fee2e2';
  const verdict = pct >= 80 ? 'Excellent' : pct >= 65 ? 'Good' : pct >= 50 ? 'Average' : 'Weak';
  return `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:11px;color:#374151;font-weight:500">${esc(label)}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:9px;background:${bgColor};color:${color};border-radius:99px;
            padding:2px 8px;font-weight:700">${verdict}</span>
          <b style="font-size:13px;color:${color}">${pct}%</b>
        </div>
      </div>
      ${showMeter ? `
      <div style="background:#f3f4f6;border-radius:99px;height:8px;overflow:hidden;position:relative">
        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,${color}cc,${color});
          border-radius:99px;position:relative">
        </div>
      </div>` : ''}
    </div>`;
}

// ── Section heading ───────────────────────────────────────────
function sectionHeading(icon, title, subtitle, accentColor = '#d97706') {
  return `
    <div style="margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:3px">
        <div style="width:28px;height:28px;border-radius:8px;background:${accentColor}18;
          display:flex;align-items:center;justify-content:center;font-size:14px">${icon}</div>
        <div class="serif" style="font-size:18px;font-weight:700;color:#111827">${esc(title)}</div>
      </div>
      <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;
        font-weight:600;padding-left:38px">${esc(subtitle)}</div>
    </div>`;
}

// ── Page chrome ───────────────────────────────────────────────
const pageHeader = (section, page, name) => `
  <div style="display:flex;justify-content:space-between;align-items:center;
    border-bottom:2px solid #f3f4f6;padding-bottom:10px;margin-bottom:22px">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:3px;height:14px;background:linear-gradient(180deg,#d97706,#b45309);border-radius:2px"></div>
      <span style="font-size:9px;font-weight:800;color:#374151;letter-spacing:2px;text-transform:uppercase">${esc(section)}</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:9px;color:#d1d5db">${esc(name)}</span>
      <span style="font-size:8px;background:#f3f4f6;color:#9ca3af;border-radius:4px;padding:2px 7px;font-weight:600">Page ${page}/6</span>
    </div>
  </div>`;

const pageFooter = (page, reportId) => `
  <div style="margin-top:auto;padding-top:14px;border-top:1px solid #f3f4f6;
    display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:8px;color:#d1d5db">Numerology Name Correction · Premium Report</span>
    <span style="font-size:8px;color:#e5e7eb;font-family:monospace">${reportId}</span>
    <span style="font-size:8px;color:#d1d5db">Page ${page} of 6</span>
  </div>`;

// ── Insight card ─────────────────────────────────────────────
function insightCard(icon, label, text, gradient, borderColor, labelColor) {
  if (!text) return '';
  return `
    <div style="background:${gradient};border:1.5px solid ${borderColor};border-radius:12px;
      padding:16px 18px;margin-bottom:14px;page-break-inside:avoid">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="font-size:12px">${icon}</span>
        <span style="font-size:9px;font-weight:800;text-transform:uppercase;
          letter-spacing:1.5px;color:${labelColor}">${esc(label)}</span>
      </div>
      <div style="font-size:12px;color:#374151;line-height:1.8">${esc(text)}</div>
    </div>`;
}

// ── Suggestion cards ──────────────────────────────────────────
function suggestionCards(suggestions) {
  if (!suggestions?.length) {
    return `
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;
        border-radius:16px;padding:32px;text-align:center">
        <div style="font-size:36px;margin-bottom:12px">✅</div>
        <p style="font-size:16px;font-weight:800;color:#15803d;margin:0 0 6px;
          font-family:'Playfair Display',Georgia,serif">Your Name is Already Optimal!</p>
        <p style="font-size:12px;color:#166534;margin:0;line-height:1.7">
          No corrections needed. Your name carries perfectly aligned vibrations with your date of birth.
          Focus on maximizing the positive energy already present.</p>
      </div>`;
  }

  return suggestions.slice(0, 5).map((s, idx) => {
    const sg = s.compatScore >= 85 ? 'A+' : s.compatScore >= 75 ? 'A' : s.compatScore >= 65 ? 'B+' : 'B';
    const gc = gradeColor(sg);
    const pow = s.isPowerful;
    const rank = ['🥇','🥈','🥉','4️⃣','5️⃣'][idx] || `${idx+1}.`;
    return `
      <div style="border:${pow ? '2px solid #d97706' : '1.5px solid #e5e7eb'};
        border-radius:14px;background:${pow ? 'linear-gradient(135deg,#fffbeb,#fef9ef)' : '#fff'};
        padding:18px 20px;margin-bottom:14px;page-break-inside:avoid;
        box-shadow:${pow ? '0 4px 16px rgba(217,119,6,.12)' : '0 1px 4px rgba(0,0,0,.04)'}">

        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">${rank}</span>
            <div>
              ${pow ? `<div style="font-size:8px;background:#fef3c7;color:#92400e;
                border:1px solid #fcd34d;border-radius:99px;padding:2px 8px;
                font-weight:700;display:inline-block;margin-bottom:4px">⭐ MOST POWERFUL VIBRATION</div>` : ''}
              <div class="serif" style="font-size:22px;font-weight:800;color:#111827;line-height:1">
                ${esc(s.name)}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;font-weight:800;color:#fff;background:${gc};
              border-radius:8px;padding:4px 12px;margin-bottom:4px;display:inline-block">${sg}</div>
            <div style="font-size:10px;color:${gc};font-weight:700">${s.compatScore ?? 0}% Match</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
          ${[
            ['Chaldean',    `${s.chaldean?.compound ?? '–'} → ${s.chaldean?.root ?? '–'}`, s.chaldean?.meaning, '#b45309','#fffbeb','#fde68a'],
            ['Pythagorean', `${s.pythagorean?.compound ?? '–'} → ${s.pythagorean?.root ?? '–'}`, s.pythagorean?.meaning, '#1d4ed8','#eff6ff','#bfdbfe'],
            ['DOB Match',   `${s.dobCompat ?? 75}%`, s.dobCompat >= 80 ? 'Excellent' : s.dobCompat >= 65 ? 'Good' : 'Fair',
              s.dobCompat >= 80 ? '#16a34a' : s.dobCompat >= 65 ? '#d97706' : '#dc2626', '#f9fafb','#f3f4f6'],
            ['Life Path',   `${s.lpCompat ?? 75}%`, s.lpCompat >= 80 ? 'Excellent' : s.lpCompat >= 65 ? 'Good' : 'Fair',
              s.lpCompat >= 80 ? '#16a34a' : s.lpCompat >= 65 ? '#d97706' : '#dc2626', '#f9fafb','#f3f4f6'],
          ].map(([lbl,val,hint,col,bg,border]) => `
            <div style="background:${bg};border:1.5px solid ${border};border-radius:8px;
              padding:8px;text-align:center">
              <div style="font-size:7px;color:#9ca3af;font-weight:700;text-transform:uppercase;
                margin-bottom:3px;letter-spacing:.5px">${lbl}</div>
              <div style="font-size:13px;font-weight:800;color:${col};line-height:1.1">${esc(val)}</div>
              ${hint ? `<div style="font-size:8px;color:#9ca3af;margin-top:2px">
                ${esc(String(hint).slice(0,24))}${String(hint).length > 24 ? '…' : ''}</div>` : ''}
            </div>`).join('')}
        </div>

        ${s.whyGood ? `
        <div style="background:#f0f9ff;border-left:3px solid #0ea5e9;border-radius:0 8px 8px 0;
          padding:10px 13px;margin-bottom:8px">
          <div style="font-size:8px;font-weight:700;color:#0369a1;text-transform:uppercase;
            letter-spacing:1px;margin-bottom:3px">💡 Why This Works</div>
          <div style="font-size:11px;color:#0c4a6e;line-height:1.65">${esc(s.whyGood)}</div>
        </div>` : ''}

        ${s.expectedBenefits ? `
        <div style="background:#f0fdf4;border-left:3px solid #16a34a;border-radius:0 8px 8px 0;
          padding:10px 13px">
          <div style="font-size:8px;font-weight:700;color:#15803d;text-transform:uppercase;
            letter-spacing:1px;margin-bottom:3px">✨ Expected Benefits</div>
          <div style="font-size:11px;color:#14532d;line-height:1.65">${esc(s.expectedBenefits)}</div>
        </div>` : ''}
      </div>`;
  }).join('');
}

// ── Vibration meter (visual gauge) ────────────────────────────
function vibrationMeter(value, label, color) {
  const pct = Math.min(100, Math.max(0, value));
  const angle = -135 + (pct / 100) * 270;
  return `
    <div style="text-align:center;padding:10px">
      <div style="position:relative;width:80px;height:50px;margin:0 auto 8px;overflow:hidden">
        <div style="width:80px;height:80px;border-radius:50%;border:6px solid #f3f4f6;
          border-top-color:${color};border-right-color:${color};
          transform:rotate(${angle}deg);box-sizing:border-box"></div>
      </div>
      <div style="font-size:18px;font-weight:800;color:${color}">${pct}%</div>
      <div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">${esc(label)}</div>
    </div>`;
}

// ── HTML builder ─────────────────────────────────────────────
function buildHTML(data) {
  const {
    name               = 'Unknown',
    dob                = {},
    chaldean           = {},
    pythagorean        = {},
    compat             = {},
    assessment         = {},
    ai                 = {},
    suggestions        = [],
    isPowerfulChaldean    = false,
    isPowerfulPythagorean = false,
  } = data;

  const grade   = assessment.grade || 'B';
  const gc      = gradeColor(grade);
  const gl      = gradeLabel(grade);
  const overall = compat.overall || 0;
  const oc      = overall >= 80 ? '#16a34a' : overall >= 65 ? '#d97706' : '#dc2626';
  const ocBg    = overall >= 80 ? '#dcfce7' : overall >= 65 ? '#fef3c7' : '#fee2e2';
  const chalSC  = strengthColor(chaldean.strength);
  const pythSC  = strengthColor(pythagorean.strength);
  const remNum  = parseInt(chaldean.root) || 5;
  const remedy  = REMEDIES[remNum] || REMEDIES[5];

  const chalMeaning  = NUMBER_MEANINGS[parseInt(chaldean.root)]  || '';
  const pythMeaning  = NUMBER_MEANINGS[parseInt(pythagorean.root)] || '';
  const lpMeaning    = NUMBER_MEANINGS[parseInt(dob.lifePath)]   || '';

  // Score circle HTML
  const scoreCircle = (score, label, color) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:52px;height:52px;border-radius:50%;
        background:conic-gradient(${color} ${score * 3.6}deg, #f3f4f6 0deg);
        display:flex;align-items:center;justify-content:center;position:relative">
        <div style="width:38px;height:38px;border-radius:50%;background:#fff;
          display:flex;align-items:center;justify-content:center">
          <span style="font-size:11px;font-weight:800;color:${color}">${score}%</span>
        </div>
      </div>
      <span style="font-size:8px;color:#9ca3af;text-align:center;max-width:60px;line-height:1.3">${esc(label)}</span>
    </div>`;

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'DM Sans','Segoe UI',sans-serif;background:#fff;color:#1f2937;font-size:12px;line-height:1.5;}
  .page{width:210mm;min-height:297mm;padding:28px 36px 24px;display:flex;flex-direction:column;}
  .cover{padding:0;background:linear-gradient(150deg,#0c0a1a 0%,#1a1033 40%,#0f0c20 70%,#1a1430 100%);display:flex;flex-direction:column;position:relative;overflow:hidden;}
  .serif{font-family:'Playfair Display',Georgia,serif;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>

<!-- ══════════════════ PAGE 1: LUXURY COVER ══════════════════ -->
<div class="page cover">

  <!-- Decorative circles -->
  <div style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(217,119,6,.18) 0%,transparent 70%);pointer-events:none"></div>
  <div style="position:absolute;bottom:-60px;left:-60px;width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 70%);pointer-events:none"></div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    width:500px;height:500px;border-radius:50%;
    background:radial-gradient(circle,rgba(255,255,255,.02) 0%,transparent 60%);pointer-events:none"></div>

  <!-- Gold top bar -->
  <div style="height:4px;background:linear-gradient(90deg,transparent,#d97706,#fbbf24,#d97706,transparent);
    position:relative;z-index:5"></div>

  <div style="position:relative;z-index:4;flex:1;display:flex;flex-direction:column;padding:36px 44px 0;">

    <!-- Brand header -->
    <div style="display:flex;justify-content:space-between;align-items:center;
      padding-bottom:18px;margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,.08)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:18px">🔢</span>
        <div>
          <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.8);letter-spacing:3px;
            text-transform:uppercase">Numerology Name Correction</div>
          <div style="font-size:8px;color:rgba(255,255,255,.3);letter-spacing:2px;margin-top:1px">
            PREMIUM ANALYSIS REPORT</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:8px;color:rgba(255,255,255,.25);letter-spacing:1px">REPORT ID</div>
        <div style="font-size:9px;color:rgba(255,255,255,.4);font-family:monospace;font-weight:600">
          ${reportId}</div>
      </div>
    </div>

    <!-- Hero section -->
    <div style="margin-bottom:36px">
      <div style="font-size:9px;color:#fbbf24;letter-spacing:5px;text-transform:uppercase;
        font-weight:700;margin-bottom:14px">✦ &nbsp; Your Personal &nbsp; ✦</div>
      <div class="serif" style="font-size:62px;font-weight:900;color:#fff;line-height:.95;
        margin-bottom:10px;text-shadow:0 4px 30px rgba(0,0,0,.4)">
        Name<br/><span style="background:linear-gradient(135deg,#fbbf24,#f59e0b,#d97706);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text">Vibration</span><br/>
        <span style="font-size:36px;font-weight:400;font-style:italic;
          color:rgba(255,255,255,.4)">Report</span>
      </div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:16px">
        <div style="height:1px;flex:1;background:linear-gradient(90deg,rgba(217,119,6,.6),transparent)"></div>
        <span style="font-size:9px;color:rgba(255,255,255,.25);letter-spacing:3px;text-transform:uppercase">
          Chaldean · Pythagorean · AI Analysis</span>
        <div style="height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(217,119,6,.6))"></div>
      </div>
    </div>

    <!-- Name card -->
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
      border-radius:18px;padding:24px 28px;margin-bottom:16px;
      backdrop-filter:blur(10px);position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;
        background:linear-gradient(90deg,transparent,${gc},transparent)"></div>
      <div style="font-size:8px;color:rgba(255,255,255,.3);text-transform:uppercase;
        letter-spacing:3px;margin-bottom:10px">✦ Prepared For</div>
      <div class="serif" style="font-size:36px;font-weight:700;color:#fff;
        margin-bottom:18px;text-shadow:0 2px 12px rgba(0,0,0,.3)">${esc(name)}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
        ${[
          ['Date of Birth', dob.raw || 'N/A'],
          ['Birth Number',  dob.birthNumber ?? '—'],
          ['Life Path',     dob.lifePath ?? '—'],
          ['Report Date',   today],
        ].map(([l,v]) => `
          <div>
            <div style="font-size:7px;color:rgba(255,255,255,.25);text-transform:uppercase;
              letter-spacing:2px;margin-bottom:4px">${l}</div>
            <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,.85)">${esc(String(v))}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Grade + Overall row -->
    <div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;
      align-items:center;margin-bottom:18px">
      <!-- Grade badge -->
      <div style="width:68px;height:68px;border-radius:16px;
        background:linear-gradient(135deg,${gc},${gc}cc);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        box-shadow:0 8px 24px ${gc}44;flex-shrink:0">
        <div class="serif" style="font-size:30px;font-weight:900;color:#fff;line-height:1">${esc(grade)}</div>
        <div style="font-size:7px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1px">Grade</div>
      </div>
      <!-- Middle info -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
        border-radius:12px;padding:14px 18px">
        <div class="serif" style="font-size:15px;font-weight:700;color:#fff;margin-bottom:2px">
          ${esc(gl)}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.35)">
          Chaldean ${chaldean.root ?? '–'} · Pythagorean ${pythagorean.root ?? '–'} · Life Path ${dob.lifePath ?? '–'}</div>
      </div>
      <!-- Score ring -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
        border-radius:12px;padding:14px 20px;text-align:center;flex-shrink:0">
        <div class="serif" style="font-size:28px;font-weight:900;color:${oc};line-height:1">
          ${overall}%</div>
        <div style="font-size:8px;color:rgba(255,255,255,.3);text-transform:uppercase;
          letter-spacing:1px;margin-top:2px">Overall Match</div>
      </div>
    </div>

    <!-- Status badges -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px">
      ${isPowerfulChaldean ? `
        <span style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);
          border-radius:99px;padding:5px 13px;font-size:9px;color:#fbbf24;font-weight:700">
          ⭐ Powerful Chaldean Number</span>` : ''}
      ${isPowerfulPythagorean ? `
        <span style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);
          border-radius:99px;padding:5px 13px;font-size:9px;color:#fbbf24;font-weight:700">
          ⭐ Powerful Pythagorean Number</span>` : ''}
      <span style="background:rgba(${ai.correctionNeeded ? '239,68,68' : '34,197,94'},.1);
        border:1px solid rgba(${ai.correctionNeeded ? '239,68,68' : '34,197,94'},.3);
        border-radius:99px;padding:5px 13px;font-size:9px;
        color:${ai.correctionNeeded ? '#f87171' : '#4ade80'};font-weight:700">
        ${ai.correctionNeeded ? '⚠️ Correction Recommended' : '✅ Name Well Aligned'}</span>
      <span style="background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.3);
        border-radius:99px;padding:5px 13px;font-size:9px;color:#a78bfa;font-weight:700">
        🤖 AI-Powered Analysis</span>
    </div>

    <!-- Contents list -->
    <div style="margin-top:auto;padding-top:16px;
      border-top:1px solid rgba(255,255,255,.06)">
      <div style="font-size:7px;color:rgba(255,255,255,.18);letter-spacing:4px;
        text-transform:uppercase;margin-bottom:12px">What's Inside This Report</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
        ${[
          ['01','Chaldean System Analysis'],
          ['02','Pythagorean System Analysis'],
          ['03','DOB Compatibility & Scores'],
          ['04','AI Personality Profile'],
          ['05','Challenges, Remedies & Career'],
          ['06','Name Suggestions & Final Advice'],
        ].map(([n,t]) => `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 8px;
            border-radius:6px;background:rgba(255,255,255,.02)">
            <span style="font-size:8px;font-weight:800;color:#d97706;min-width:18px;
              font-family:monospace">${n}</span>
            <span style="font-size:10px;color:rgba(255,255,255,.32)">${t}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Gold bottom bar + footer -->
  <div style="position:relative;z-index:4">
    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
      margin:0 44px"></div>
    <div style="display:flex;justify-content:space-between;padding:12px 44px">
      <span style="font-size:8px;color:rgba(255,255,255,.2)">NUMEROLOGY NAME CORRECTION · PREMIUM REPORT</span>
      <span style="font-size:8px;color:rgba(255,255,255,.2)">${today} · Page 1 of 6</span>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,transparent,#d97706,#fbbf24,#d97706,transparent)"></div>
  </div>
</div>


<!-- ══════════════════ PAGE 2: NUMEROLOGY ANALYSIS ═══════════ -->
<div class="page">
  ${pageHeader('Numerology Analysis', 2, name)}

  ${sectionHeading('🔮','Chaldean Numerology','01 — Ancient Babylonian System · Most Accurate for Destiny','#b45309')}

  <div style="background:linear-gradient(135deg,#fffbeb,#fef9ef,#fffdf5);
    border:1.5px solid #fde68a;border-radius:16px;padding:20px 24px;margin-bottom:20px;
    box-shadow:0 4px 16px rgba(217,119,6,.08)">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:20px">
        <div>
          <div style="font-size:8px;color:#92400e;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;margin-bottom:3px">Compound</div>
          <div class="serif" style="font-size:56px;font-weight:900;line-height:1;
            color:${chalSC};text-shadow:0 2px 8px ${chalSC}33">${esc(String(chaldean.compound ?? '–'))}</div>
        </div>
        <div style="font-size:26px;color:#d1d5db;margin-top:8px">→</div>
        <div>
          <div style="font-size:8px;color:#92400e;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;margin-bottom:3px">Root Number</div>
          <div class="serif" style="font-size:56px;font-weight:900;line-height:1;color:#374151">
            ${esc(String(chaldean.root ?? '–'))}</div>
        </div>
        <div style="margin-left:8px;max-width:160px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
            color:${chalSC};margin-bottom:4px">${esc(chaldean.category ?? '')}</div>
          <div class="serif" style="font-size:13px;font-style:italic;color:#374151;line-height:1.5">
            "${esc(chaldean.meaning ?? '')}"</div>
        </div>
      </div>
      <div style="text-align:right">
        <span style="font-size:9px;font-weight:700;padding:5px 13px;border-radius:99px;
          background:${chalSC};color:#fff;text-transform:uppercase;letter-spacing:1px;
          display:inline-block;margin-bottom:6px">${esc(chaldean.strength ?? '')}</span>
        ${isPowerfulChaldean ? `<div style="font-size:8px;color:#d97706;font-weight:700">
          ⭐ Powerful Number</div>` : ''}
      </div>
    </div>

    ${chalMeaning ? `
    <div style="background:#fff8ed;border-left:3px solid #d97706;border-radius:0 8px 8px 0;
      padding:10px 13px;margin-bottom:14px">
      <div style="font-size:8px;font-weight:700;color:#b45309;text-transform:uppercase;
        letter-spacing:1px;margin-bottom:3px">📖 Number ${chaldean.root} Meaning</div>
      <div style="font-size:11px;color:#78350f;line-height:1.65;font-style:italic">${esc(chalMeaning)}</div>
    </div>` : ''}

    <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
      color:#9ca3af;margin-bottom:8px">Letter Vibration Map (Chaldean)</div>
    <div style="display:flex;flex-wrap:wrap;gap:2px;background:#fff;
      border-radius:10px;padding:10px;border:1px solid #fde68a">
      ${letterBoxes(name, CHALDEAN_MAP, '#b45309','#fffbeb')}
    </div>
  </div>

  <div style="width:100%;height:1.5px;background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6);
    margin:4px 0 20px"></div>

  ${sectionHeading('📐','Pythagorean Numerology','02 — Greek Mathematical System · Best for Personality & Expression','#1d4ed8')}

  <div style="background:linear-gradient(135deg,#eff6ff,#eef2ff,#f5f7ff);
    border:1.5px solid #bfdbfe;border-radius:16px;padding:20px 24px;
    box-shadow:0 4px 16px rgba(59,130,246,.06)">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:20px">
        <div>
          <div style="font-size:8px;color:#1e3a8a;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;margin-bottom:3px">Compound</div>
          <div class="serif" style="font-size:56px;font-weight:900;line-height:1;
            color:${pythSC};text-shadow:0 2px 8px ${pythSC}33">${esc(String(pythagorean.compound ?? '–'))}</div>
        </div>
        <div style="font-size:26px;color:#d1d5db;margin-top:8px">→</div>
        <div>
          <div style="font-size:8px;color:#1e3a8a;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;margin-bottom:3px">Root Number</div>
          <div class="serif" style="font-size:56px;font-weight:900;line-height:1;color:#374151">
            ${esc(String(pythagorean.root ?? '–'))}</div>
        </div>
        <div style="margin-left:8px;max-width:160px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
            color:${pythSC};margin-bottom:4px">${esc(pythagorean.category ?? '')}</div>
          <div class="serif" style="font-size:13px;font-style:italic;color:#374151;line-height:1.5">
            "${esc(pythagorean.meaning ?? '')}"</div>
        </div>
      </div>
      <div style="text-align:right">
        <span style="font-size:9px;font-weight:700;padding:5px 13px;border-radius:99px;
          background:${pythSC};color:#fff;text-transform:uppercase;letter-spacing:1px;
          display:inline-block">${esc(pythagorean.strength ?? '')}</span>
      </div>
    </div>

    ${pythMeaning ? `
    <div style="background:#eef2ff;border-left:3px solid #3b82f6;border-radius:0 8px 8px 0;
      padding:10px 13px;margin-bottom:14px">
      <div style="font-size:8px;font-weight:700;color:#1d4ed8;text-transform:uppercase;
        letter-spacing:1px;margin-bottom:3px">📖 Number ${pythagorean.root} Meaning</div>
      <div style="font-size:11px;color:#1e3a8a;line-height:1.65;font-style:italic">${esc(pythMeaning)}</div>
    </div>` : ''}

    <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
      color:#9ca3af;margin-bottom:8px">Letter Vibration Map (Pythagorean)</div>
    <div style="display:flex;flex-wrap:wrap;gap:2px;background:#fff;
      border-radius:10px;padding:10px;border:1px solid #bfdbfe">
      ${letterBoxes(name, PYTH_MAP, '#1d4ed8','#eff6ff')}
    </div>
  </div>

  ${pageFooter(2, reportId)}
</div>


<!-- ══════════════ PAGE 3: COMPATIBILITY & PERSONALITY ═══════ -->
<div class="page">
  ${pageHeader('Compatibility & Personality', 3, name)}

  ${sectionHeading('🔢','DOB & Compatibility Analysis','03 — Birth Vibration vs Name Vibration Harmony','#7c3aed')}

  <!-- 4 stat cards -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
    ${[
      ['Birth Number',   dob.birthNumber,   '#d97706', `Day of Birth`, '#fffbeb','#fde68a'],
      ['Life Path',      dob.lifePath,      '#7c3aed', lpMeaning.split('—')[0] || '', '#f5f3ff','#e9d5ff'],
      ['Overall Match',  `${overall}%`,     oc,        assessment.label || '', ocBg, oc+'44'],
      ['Report Grade',   grade,             gc,        gl.split('—')[0], '#f9fafb','#e5e7eb'],
    ].map(([l,v,c,h,bg,border]) => `
      <div style="background:${bg};border:2px solid ${border};border-radius:14px;
        padding:16px 12px;text-align:center;position:relative;overflow:hidden">
        <div style="font-size:8px;color:#9ca3af;font-weight:700;text-transform:uppercase;
          letter-spacing:1px;margin-bottom:6px">${l}</div>
        <div class="serif" style="font-size:30px;font-weight:900;color:${c};line-height:1">
          ${esc(String(v ?? ''))}</div>
        <div style="font-size:8px;color:#d1d5db;margin-top:6px;line-height:1.3">
          ${esc(String(h).slice(0,30))}</div>
      </div>`).join('')}
  </div>

  ${lpMeaning ? `
  <div style="background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1.5px solid #d8b4fe;
    border-radius:12px;padding:14px 18px;margin-bottom:16px">
    <div style="font-size:8px;font-weight:700;color:#7c3aed;text-transform:uppercase;
      letter-spacing:1.5px;margin-bottom:6px">✨ Life Path ${dob.lifePath} — Your Soul's Journey</div>
    <div style="font-size:12px;color:#4c1d95;line-height:1.7;font-style:italic">
      ${esc(lpMeaning)}</div>
  </div>` : ''}

  <!-- Compat bars -->
  <div style="background:#f9fafb;border:1.5px solid #f3f4f6;border-radius:14px;
    padding:18px 20px;margin-bottom:16px">
    <div style="font-size:9px;font-weight:800;color:#374151;text-transform:uppercase;
      letter-spacing:2px;margin-bottom:14px">📊 Compatibility Breakdown</div>
    ${compatBar(`Chaldean Root (${chaldean.root}) × Birth No. (${dob.birthNumber})`,     compat.chaldeanVsBirth    || 0)}
    ${compatBar(`Chaldean Root (${chaldean.root}) × Life Path (${dob.lifePath})`,        compat.chaldeanVsLifePath || 0)}
    ${compatBar(`Pythagorean Root (${pythagorean.root}) × Birth No. (${dob.birthNumber})`, compat.pythagoreanVsBirth || 0)}
    ${compatBar(`Pythagorean Root (${pythagorean.root}) × Life Path (${dob.lifePath})`,    compat.pythagoreanVsLP   || 0)}
    <div style="background:${ocBg};border:1.5px solid ${oc}44;border-radius:10px;
      padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:12px">
      <div>
        <div style="font-size:11px;font-weight:700;color:#374151">Final Compatibility Score</div>
        <div style="font-size:9px;color:#6b7280;margin-top:2px">${esc(assessment.label || '')}</div>
      </div>
      <div class="serif" style="font-size:32px;font-weight:900;color:${oc}">${overall}%</div>
    </div>
  </div>

  ${ai.correctionReason ? `
  <div style="background:${ai.correctionNeeded ? '#fef2f2' : '#f0fdf4'};
    border:1.5px solid ${ai.correctionNeeded ? '#fca5a5' : '#86efac'};
    border-radius:12px;padding:14px 18px;display:flex;gap:13px;align-items:flex-start">
    <div style="font-size:22px;flex-shrink:0">${ai.correctionNeeded ? '⚠️' : '✅'}</div>
    <div>
      <div style="font-size:11px;font-weight:800;margin-bottom:5px;
        color:${ai.correctionNeeded ? '#dc2626' : '#16a34a'}">
        ${ai.correctionNeeded ? 'Name Correction Strongly Recommended' : 'Your Name is Well Aligned'}</div>
      <div style="font-size:11px;color:#374151;line-height:1.7">${esc(ai.correctionReason ?? '')}</div>
    </div>
  </div>` : ''}

  <div style="width:100%;height:1.5px;background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6);
    margin:18px 0"></div>

  ${sectionHeading('🧠','AI Personality Profile','04 — Deep Psychological & Numerological Insight','#0ea5e9')}

  ${insightCard('🧠','Personality Insight',      ai.personalityInsight,   'linear-gradient(135deg,#fffbeb,#fef9ef)','#fde68a','#92400e')}
  ${insightCard('🔍','Current Name Analysis',    ai.currentNameAnalysis,  'linear-gradient(135deg,#f0f9ff,#e0f2fe)','#bae6fd','#0369a1')}

  ${pageFooter(3, reportId)}
</div>


<!-- ══════════════ PAGE 4: CHALLENGES, REMEDIES, CAREER ══════ -->
<div class="page">
  ${pageHeader('Challenges, Remedies & Career', 4, name)}

  ${sectionHeading('⚡','Key Life Challenges','05 — Obstacles Written in Your Name Vibration','#dc2626')}

  ${insightCard('⚡','Challenges Indicated by Your Name', ai.challenges, 'linear-gradient(135deg,#fff7f0,#fef3ee)','#fed7aa','#c2410c')}

  <!-- Planetary remedy card -->
  <div style="background:linear-gradient(135deg,#fefce8,#fef9c3,#fefde8);
    border:2px solid #fde68a;border-radius:16px;padding:20px 22px;margin-bottom:18px;
    box-shadow:0 4px 20px rgba(234,179,8,.1)">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:10px;
          background:linear-gradient(135deg,#fbbf24,#d97706);
          display:flex;align-items:center;justify-content:center;
          font-size:18px">${remedy.symbol}</div>
        <div>
          <div style="font-size:11px;font-weight:800;color:#92400e">Ruling Planet & Remedies</div>
          <div style="font-size:9px;color:#b45309">Based on Chaldean Root Number ${esc(String(chaldean.root ?? ''))}</div>
        </div>
      </div>
      <div style="background:#fff;border:1.5px solid #fde68a;border-radius:8px;
        padding:6px 14px;font-size:12px;font-weight:700;color:#92400e">
        ${esc(remedy.planet)}</div>
    </div>

    <div style="background:rgba(255,255,255,.5);border-radius:10px;overflow:hidden;
      border:1px solid rgba(0,0,0,.05)">
      ${[
        ['🌟','Ruling Trait',  remedy.trait,   '#92400e'],
        ['📅','Best Day',      remedy.day,     '#374151'],
        ['🎨','Power Colors',  remedy.colors,  '#374151'],
        ['💎','Gemstone',      remedy.gem,     '#374151'],
        ['🕉️','Daily Mantra',  remedy.mantra,  '#7c3aed'],
      ].map(([icon,l,v,c],i,arr) => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;
          ${i < arr.length-1 ? 'border-bottom:1px solid rgba(0,0,0,.05)' : ''}
          background:${i%2 ? 'rgba(255,255,255,.3)' : 'transparent'}">
          <span style="font-size:14px;width:20px;flex-shrink:0">${icon}</span>
          <div style="width:110px;font-size:8px;font-weight:700;text-transform:uppercase;
            letter-spacing:.5px;color:#9ca3af;flex-shrink:0">${l}</div>
          <div style="font-size:12px;font-weight:600;color:${c};
            ${l==='Daily Mantra' ? 'font-style:italic;letter-spacing:.3px' : ''}">${esc(v)}</div>
        </div>`).join('')}
    </div>
  </div>

  <div style="width:100%;height:1.5px;background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6);
    margin:4px 0 18px"></div>

  ${sectionHeading('💼','Career & Lucky Details','06 — Auspicious Paths Aligned with Your Vibration','#16a34a')}

  ${ai.careerAreas?.length ? `
  <div style="margin-bottom:16px">
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
      color:#374151;margin-bottom:10px">💼 Best Career Areas for You</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px">
      ${ai.careerAreas.map(c => `
        <span style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);
          border:1.5px solid #bbf7d0;color:#166534;border-radius:99px;
          padding:6px 16px;font-size:11px;font-weight:700">✓ ${esc(c)}</span>`).join('')}
    </div>
  </div>` : ''}

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${ai.luckyNumbers?.length ? `
    <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;padding:14px 16px">
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
        color:#92400e;margin-bottom:10px">🍀 Lucky Numbers</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${ai.luckyNumbers.map(n => `
          <div style="width:38px;height:38px;border-radius:50%;
            background:linear-gradient(135deg,#fbbf24,#f59e0b);
            border:2px solid #d97706;display:flex;align-items:center;justify-content:center;
            font-size:14px;font-weight:900;color:#fff;
            box-shadow:0 2px 8px rgba(217,119,6,.3)">${esc(String(n))}</div>`).join('')}
      </div>
    </div>` : ''}

    ${(ai.luckyColors?.length || ai.luckyDays?.length) ? `
    <div style="background:#f5f3ff;border:1.5px solid #e9d5ff;border-radius:12px;padding:14px 16px">
      ${ai.luckyColors?.length ? `
      <div style="margin-bottom:12px">
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
          color:#7c3aed;margin-bottom:8px">🎨 Lucky Colors</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${ai.luckyColors.map(c => `
            <span style="background:#fff;border:1.5px solid #ddd6fe;color:#6d28d9;
              border-radius:99px;padding:3px 11px;font-size:10px;font-weight:600">${esc(c)}</span>`).join('')}
        </div>
      </div>` : ''}
      ${ai.luckyDays?.length ? `
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;
          color:#1d4ed8;margin-bottom:8px">📅 Lucky Days</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${ai.luckyDays.map(d => `
            <span style="background:#eff6ff;border:1.5px solid #bfdbfe;color:#1e40af;
              border-radius:99px;padding:3px 11px;font-size:10px;font-weight:600">${esc(d)}</span>`).join('')}
        </div>
      </div>` : ''}
    </div>` : ''}
  </div>

  ${pageFooter(4, reportId)}
</div>


<!-- ══════════════════ PAGE 5: NAME SUGGESTIONS ══════════════ -->
<div class="page">
  ${pageHeader('Name Correction Suggestions', 5, name)}

  ${sectionHeading('✍️','AI-Recommended Name Spellings','07 — Ranked by Numerological Compatibility Score','#d97706')}

  <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1.5px solid #fde68a;
    border-radius:12px;padding:12px 16px;margin-bottom:16px;
    display:flex;align-items:center;gap:12px">
    <span style="font-size:18px">💡</span>
    <div style="font-size:11px;color:#78350f;line-height:1.6">
      These spellings are <b>specifically calculated</b> for <b>${esc(name)}</b>'s date of birth and life path.
      Each suggestion has been scored across Chaldean, Pythagorean, DOB match, and Life Path compatibility.
      The ⭐ MOST POWERFUL option is your top recommended spelling.
    </div>
  </div>

  ${suggestionCards(suggestions)}

  ${pageFooter(5, reportId)}
</div>


<!-- ══════════════════ PAGE 6: FINAL ADVICE & SUMMARY ════════ -->
<div class="page">
  ${pageHeader('Final Advice & Summary', 6, name)}

  ${sectionHeading('🎯','Numerologist\'s Final Advice','08 — Personalised Guidance for Your Journey','#7c3aed')}

  ${ai.generalAdvice ? `
  <div style="position:relative;margin-bottom:20px">
    <div style="position:absolute;top:-8px;left:16px;font-size:48px;color:#e9d5ff;
      font-family:'Playfair Display',serif;line-height:1;z-index:0">"</div>
    <div style="background:linear-gradient(135deg,#faf5ff,#f3e8ff);
      border:2px solid #d8b4fe;border-radius:16px;padding:22px 24px 18px;
      position:relative;z-index:1;
      box-shadow:0 8px 24px rgba(124,58,237,.08)">
      <div class="serif" style="font-size:13px;font-style:italic;color:#4c1d95;
        line-height:1.85;margin-bottom:14px">${esc(ai.generalAdvice)}</div>
      <div style="display:flex;align-items:center;gap:8px;
        border-top:1px solid #e9d5ff;padding-top:12px">
        <div style="width:24px;height:24px;border-radius:50%;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          display:flex;align-items:center;justify-content:center;font-size:11px">🔢</div>
        <div style="font-size:9px;color:#7c3aed;font-weight:700">
          Personalized for ${esc(name)} · Generated ${today}</div>
      </div>
    </div>
    <div style="position:absolute;bottom:-8px;right:16px;font-size:48px;color:#e9d5ff;
      font-family:'Playfair Display',serif;line-height:1;transform:rotate(180deg);z-index:0">"</div>
  </div>` : ''}

  <div style="width:100%;height:1.5px;background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6);
    margin:4px 0 18px"></div>

  <div class="serif" style="font-size:17px;font-weight:700;color:#111827;margin-bottom:14px">
    📋 Complete Summary Table</div>

  <div style="border:1.5px solid #f3f4f6;border-radius:14px;overflow:hidden;margin-bottom:16px;
    box-shadow:0 2px 8px rgba(0,0,0,.04)">
    ${[
      ['Full Name',           name,                                                        '#111827'],
      ['Date of Birth',       dob.raw || '',                                               '#374151'],
      ['Birth Number',        dob.birthNumber ?? '',                                       '#d97706'],
      ['Life Path Number',    `${dob.lifePath ?? ''}  ${lpMeaning ? '— '+lpMeaning.split('—')[0] : ''}`, '#7c3aed'],
      ['Chaldean Numbers',    `${chaldean.compound ?? '–'} → ${chaldean.root ?? '–'}  (${chaldean.strength ?? ''})`, chalSC],
      ['Pythagorean Numbers', `${pythagorean.compound ?? '–'} → ${pythagorean.root ?? '–'}  (${pythagorean.strength ?? ''})`, pythSC],
      ['Compatibility Score', `${overall}%  —  ${assessment.label || ''}`,                oc],
      ['Report Grade',        `${grade}  —  ${gl}`,                                       gc],
      ['Correction Needed',   ai.correctionNeeded ? '⚠️ Yes — Please use suggested spellings' : '✅ No — Name is already optimal', ai.correctionNeeded ? '#dc2626' : '#16a34a'],
      ['Best Career Areas',   (ai.careerAreas || []).join(', '),                           '#374151'],
      ['Lucky Numbers',       (ai.luckyNumbers || []).join(', '),                          '#d97706'],
      ['Lucky Colors',        (ai.luckyColors  || []).join(', '),                          '#374151'],
      ['Lucky Days',          (ai.luckyDays    || []).join(', '),                          '#374151'],
      ['Ruling Planet',       remedy.planet,                                               '#92400e'],
      ['Gemstone',            remedy.gem,                                                  '#6d28d9'],
      ['Mantra',              remedy.mantra,                                               '#7c3aed'],
      ['Report Generated',    today,                                                       '#6b7280'],
      ['Report ID',           reportId,                                                    '#9ca3af'],
    ].map(([l,v],i) => `
      <div style="display:flex;align-items:center;gap:0;
        background:${i%2===0 ? '#f9fafb' : '#fff'};
        border-bottom:1px solid #f3f4f6">
        <div style="width:4px;align-self:stretch;background:${i%2===0 ? '#f3f4f6' : '#fff'}"></div>
        <div style="width:160px;padding:8px 12px;font-size:8.5px;font-weight:700;
          text-transform:uppercase;letter-spacing:.5px;color:#9ca3af;flex-shrink:0;
          border-right:1px solid #f3f4f6">${l}</div>
        <div style="padding:8px 14px;font-size:11.5px;font-weight:600;color:#111827;
          flex:1;line-height:1.4">${esc(String(v ?? ''))}</div>
      </div>`).join('')}
  </div>

  <!-- Disclaimer -->
  <div style="background:#f9fafb;border-radius:10px;padding:12px 16px;
    border:1px solid #f3f4f6;margin-top:auto">
    <div style="font-size:7.5px;color:#9ca3af;line-height:1.8;text-align:justify">
      <b style="color:#d1d5db">DISCLAIMER:</b> This report applies traditional Chaldean and Pythagorean 
      numerology systems with AI-assisted pattern analysis. It is intended for personal guidance, 
      self-reflection, and spiritual insight only. Results are based on established numerological traditions 
      and do not constitute professional advice. For significant life decisions, consult a qualified 
      numerologist or relevant professional. Numerology Name Correction · Premium Report · ${today}
    </div>
  </div>

  ${pageFooter(6, reportId)}
</div>

</body></html>`;
}

// ── Generate PDF ─────────────────────────────────────────────
export async function generatePDF(resultData) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox',
           '--disable-dev-shm-usage','--disable-gpu'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildHTML(resultData), {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(r => setTimeout(r, 1000)); // wait for font render
    return await page.pdf({
      format:          'A4',
      printBackground: true,
      margin:          { top:'0', right:'0', bottom:'0', left:'0' },
    });
  } finally {
    await browser.close();
  }
}