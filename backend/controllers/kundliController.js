import sweph from 'sweph';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Ephe Path Setup ───────────────────────────────────────────
let ephePath = path.resolve(__dirname, '../ephe').replace(/\\/g, '/');
if (!ephePath.endsWith('/')) ephePath += '/';

console.log('--- 🪐 Swiss Ephemeris Initialization ---');
if (fs.existsSync(ephePath)) {
  console.log(`✅ Folder found at: ${ephePath}`);
  const files = fs.readdirSync(ephePath).filter(f => f.endsWith('.se1'));
  console.log(files.length > 0
    ? `📂 Swiss Data Files: ${files.length} .se1 files found`
    : `⚠️  Folder exists but NO .se1 files found!`
  );
} else {
  console.error(`❌ Ephe folder NOT FOUND at: ${ephePath}`);
}

sweph.set_ephe_path(ephePath);
const SE = sweph.constants;

// ── Constants ─────────────────────────────────────────────────
export const RASHIS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

const RASHI_LORDS = {
  Aries:'Mars', Taurus:'Venus', Gemini:'Mercury', Cancer:'Moon',
  Leo:'Sun', Virgo:'Mercury', Libra:'Venus', Scorpio:'Mars',
  Sagittarius:'Jupiter', Capricorn:'Saturn', Aquarius:'Saturn', Pisces:'Jupiter'
};

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

const NAKSHATRA_LORDS = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'
];

const DASHA_YEARS = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7,
  Rahu:18, Jupiter:16, Saturn:19, Mercury:17
};

const EXALTATION = {
  Sun:'Aries', Moon:'Taurus', Mars:'Capricorn', Mercury:'Virgo',
  Jupiter:'Cancer', Venus:'Pisces', Saturn:'Libra',
  Rahu:'Gemini', Ketu:'Sagittarius'
};

const DEBILITATION = {
  Sun:'Libra', Moon:'Scorpio', Mars:'Cancer', Mercury:'Pisces',
  Jupiter:'Capricorn', Venus:'Virgo', Saturn:'Aries',
  Rahu:'Sagittarius', Ketu:'Gemini'
};

const OWN_SIGN = {
  Sun:['Leo'], Moon:['Cancer'], Mars:['Aries','Scorpio'],
  Mercury:['Gemini','Virgo'], Jupiter:['Sagittarius','Pisces'],
  Venus:['Taurus','Libra'], Saturn:['Capricorn','Aquarius']
};

const SE_IDS = {
  Sun:     SE.SE_SUN,
  Moon:    SE.SE_MOON,
  Mars:    SE.SE_MARS,
  Mercury: SE.SE_MERCURY,
  Jupiter: SE.SE_JUPITER,
  Venus:   SE.SE_VENUS,
  Saturn:  SE.SE_SATURN,
  Rahu:    SE.SE_TRUE_NODE,
};

// ── Helpers ───────────────────────────────────────────────────
function normalizeDeg(d) { return ((d % 360) + 360) % 360; }

function getStrength(name, rashi) {
  if (EXALTATION[name]  === rashi)        return 'EXALTED';
  if (DEBILITATION[name] === rashi)       return 'DEBILITATED';
  if (OWN_SIGN[name]?.includes(rashi))    return 'OWN_SIGN';
  return 'NEUTRAL';
}

// ── CONFIRMED sweph format (from debug output) ────────────────
// calc_ut       → { flag, error, data: [lon, lat, dist, speed, ...] }
// ayanamsa_ex_ut→ { flag, error, data: <number> }
// ayanamsa_ut   → <number>
// houses_ex     → { flag, data: <object> }  ← data keys logged below

function extractLonSpeed(r) {
  if (!r) return null;
  // ✅ CONFIRMED format
  if (r.data && Array.isArray(r.data) && typeof r.data[0] === 'number') {
    return { longitude: r.data[0], speed: r.data[3] ?? 0 };
  }
  // Fallbacks
  if (typeof r.longitude === 'number') {
    return { longitude: r.longitude, speed: r.longitudeSpeed ?? r.speedInLongitude ?? 0 };
  }
  if (typeof r[0] === 'number') {
    return { longitude: r[0], speed: r[3] ?? 0 };
  }
  if (r.error) console.warn(`  sweph error: ${r.error}`);
  return null;
}

// ── Julian Day ────────────────────────────────────────────────
function getJulianDay(dateStr, timeStr, tzOffset) {
  const [yr, mo, dy] = dateStr.split('-').map(Number);
  const [hr, mn]     = timeStr.split(':').map(Number);
  const utcHr        = (hr + mn / 60) - tzOffset;
  return sweph.julday(yr, mo, dy, utcHr, SE.SE_GREG_CAL);
}

// ── Lahiri Ayanamsa ───────────────────────────────────────────
function getAyanamsa(jd) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);

  const attempts = [
    // ✅ CONFIRMED: get_ayanamsa_ex_ut returns { flag, error, data: number }
    () => { const r = sweph.get_ayanamsa_ex_ut(jd, SE.SEFLG_MOSEPH); return typeof r?.data === 'number' ? r.data : null; },
    () => { const r = sweph.get_ayanamsa_ex_ut(jd, 0);               return typeof r?.data === 'number' ? r.data : null; },
    // ✅ CONFIRMED: get_ayanamsa_ut returns number directly
    () => { const r = sweph.get_ayanamsa_ut(jd); return typeof r === 'number' ? r : null; },
    () => { const r = sweph.get_ayanamsa(jd);    return typeof r === 'number' ? r : null; },
  ];

  for (const fn of attempts) {
    try {
      const val = fn();
      if (val !== null && val > 20 && val < 30) {
        console.log(`✅ Ayanamsa (SwissEph): ${val.toFixed(4)}°`);
        return val;
      }
    } catch(_) {}
  }

  // Math fallback
  const T   = (jd - 2451545.0) / 36525.0;
  const val = 23.85 + 0.01360 * T + 0.000236 * T * T;
  console.warn(`⚠️  Ayanamsa (math fallback): ${val.toFixed(4)}°`);
  return val;
}

// ── VSOP87 Math Fallback ──────────────────────────────────────
function vsop87Fallback(jd, ayanamsa) {
  const T  = (jd - 2451545.0) / 36525.0;
  const Ms = ((357.52911 + 35999.05029*T) % 360) * Math.PI/180;
  const Mm = ((134.96298 + 477198.86763*T) % 360) * Math.PI/180;
  const trop = {
    Sun     : 280.46646 + 36000.76983*T + 1.9146*Math.sin(Ms),
    Moon    : 218.31650 + 481267.88130*T + 6.2886*Math.sin(Mm),
    Mars    : 355.43300 + 19140.29930*T,
    Mercury : 252.25100 + 149472.67500*T,
    Jupiter : 34.35100  + 3034.90500*T,
    Venus   : 181.97900 + 58517.81600*T,
    Saturn  : 50.07700  + 1222.11400*T,
    Rahu    : 125.04452 - 1934.13626*T,
  };
  const out = {};
  for (const [n, v] of Object.entries(trop)) {
    const lon   = normalizeDeg(v - ayanamsa);
    const rIdx  = Math.floor(lon / 30);
    const rashi = RASHIS[rIdx];
    out[n] = {
      longitude: +lon.toFixed(4), degree: +(lon%30).toFixed(2),
      rashi, lord: RASHI_LORDS[rashi], house: rIdx+1,
      strength: getStrength(n, rashi), retrograde: false, source:'fallback'
    };
  }
  const kLon  = normalizeDeg(out.Rahu.longitude + 180);
  const kIdx  = Math.floor(kLon / 30);
  const kRash = RASHIS[kIdx];
  out.Ketu = {
    longitude: +kLon.toFixed(4), degree: +(kLon%30).toFixed(2),
    rashi: kRash, lord: RASHI_LORDS[kRash], house: kIdx+1,
    strength: getStrength('Ketu', kRash), retrograde: false, source:'fallback'
  };
  return out;
}

// ── Planet Calculations ───────────────────────────────────────
function calcPlanets(jd, ayanamsa) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);

  const BASE     = SE.SEFLG_SPEED;
  const SIDEREAL = BASE | SE.SEFLG_SIDEREAL;

  const flagSets = [
    { flags: SIDEREAL | SE.SEFLG_SWIEPH,  label: 'swisseph',   sidereal: true  },
    { flags: SIDEREAL | SE.SEFLG_MOSEPH,  label: 'moshier',    sidereal: true  },
    { flags: BASE     | SE.SEFLG_SWIEPH,  label: 'swisseph-t', sidereal: false },
    { flags: BASE     | SE.SEFLG_MOSEPH,  label: 'moshier-t',  sidereal: false },
  ];

  const planets = {};

  for (const [name, seId] of Object.entries(SE_IDS)) {
    let found = null;

    for (const { flags, label, sidereal } of flagSets) {
      try {
        const raw = sweph.calc_ut(jd, seId, flags);
        const ex  = extractLonSpeed(raw);
        if (ex && typeof ex.longitude === 'number') {
          const lon = sidereal
            ? normalizeDeg(ex.longitude)
            : normalizeDeg(ex.longitude - ayanamsa);
          found = { longitude: lon, speed: ex.speed, source: label };
          break;
        }
      } catch(e) {
        console.warn(`  ❌ ${name} [${label}]: ${e.message}`);
      }
    }

    if (!found) {
      console.warn(`⚠️  ${name}: ALL sweph attempts failed — will use VSOP87`);
      continue;
    }

    const lon   = found.longitude;
    const rIdx  = Math.floor(lon / 30);
    const rashi = RASHIS[rIdx];

    planets[name] = {
      longitude : +lon.toFixed(4),
      degree    : +(lon % 30).toFixed(2),
      rashi,
      lord      : RASHI_LORDS[rashi],
      house     : rIdx + 1,
      strength  : getStrength(name, rashi),
      retrograde: found.speed < 0,
      source    : found.source,
    };
  }

  // Ketu = Rahu + 180°
  if (planets.Rahu) {
    const kLon  = normalizeDeg(planets.Rahu.longitude + 180);
    const kIdx  = Math.floor(kLon / 30);
    const kRash = RASHIS[kIdx];
    planets.Ketu = {
      longitude: +kLon.toFixed(4), degree: +(kLon%30).toFixed(2),
      rashi: kRash, lord: RASHI_LORDS[kRash], house: kIdx+1,
      strength: getStrength('Ketu', kRash), retrograde: false, source:'calculated'
    };
  }

  // Fill any missing via VSOP87
  const needed  = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const missing = needed.filter(p => !planets[p]);
  if (missing.length > 0) {
    console.warn(`⚠️  Filling via VSOP87: ${missing.join(', ')}`);
    const fb = vsop87Fallback(jd, ayanamsa);
    missing.forEach(p => { planets[p] = fb[p]; });
  }

  return planets;
}

// ── Lagna (Ascendant) ─────────────────────────────────────────
// houses_ex returns { flag, data: <object> }
// We need to inspect h.data keys — logged in debugSweph()
// Trying all known possible structures
function calcLagna(jd, lat, lon, ayanamsa) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);

  function extractAsc(h, tropical) {
    if (!h) return null;
    let asc = null;

    // ✅ CONFIRMED format: h.data.points[0] = ascendant (already sidereal when SEFLG_SIDEREAL used)
    // h.data.houses = [300,330,0,30,...] 12 cusps
    // h.data.points = [asc, mc, armc, vertex, eq_asc, co-asc1, co-asc2, polar_asc]
    if (Array.isArray(h.data?.points) && typeof h.data.points[0] === 'number') {
      asc = h.data.points[0];
    }
    // Fallbacks
    else if (typeof h.ascendant === 'number')       { asc = h.ascendant; }
    else if (typeof h.ascmc?.[0] === 'number')      { asc = h.ascmc[0]; }
    else if (Array.isArray(h.data) && typeof h.data[0] === 'number') { asc = h.data[0]; }
    else if (h.data?.ascendant != null)              { asc = h.data.ascendant; }
    else if (Array.isArray(h) && Array.isArray(h[1])) { asc = h[1][0]; }
    else if (Array.isArray(h) && typeof h[0] === 'number') { asc = h[0]; }

    if (asc === null || isNaN(asc)) return null;
    // Only subtract ayanamsa if tropical flag was used
    return tropical ? asc - ayanamsa : asc;
  }

  const houseSystems = ['W', 'P', 'E'];
  const modes = [
    { flag: SE.SEFLG_SIDEREAL, tropical: false, label: 'sidereal' },
    { flag: 0,                 tropical: true,  label: 'tropical' },
  ];

  for (const sys of houseSystems) {
    for (const { flag, tropical, label } of modes) {
      try {
        const h   = sweph.houses_ex(jd, flag, lat, lon, sys);
        const asc = extractAsc(h, tropical);
        if (asc !== null && !isNaN(asc) && asc > 0) {
          const lagnaLon = normalizeDeg(asc);
          console.log(`  ✅ Lagna (${sys}/${label}): ${lagnaLon.toFixed(4)}°`);
          return buildLagna(lagnaLon);
        }
        // Log data structure once to help debug
        if (sys === 'W' && !tropical) {
          console.warn(`  ⚠️  houses_ex data: ${JSON.stringify(h?.data)?.slice(0, 300)}`);
        }
      } catch(e) {
        if (sys === 'W') console.warn(`  ⚠️  houses_ex [${sys}/${label}]: ${e.message}`);
      }
    }
  }

  // LST-based math fallback
  console.warn('  ⚠️  All houses_ex failed — using math fallback');
  const T    = (jd - 2451545.0) / 36525.0;
  let gst    = 280.46061837 + 360.98564736629*(jd-2451545.0) + 0.000387933*T*T;
  gst        = normalizeDeg(gst);
  const lst  = normalizeDeg(gst + lon);
  const eps  = (23.439291111 - 0.013004167*T) * Math.PI/180;
  const lRad = lst * Math.PI/180;
  const laRad= lat * Math.PI/180;
  const tanA = Math.cos(lRad)/(-Math.sin(lRad)*Math.cos(eps)+Math.tan(laRad)*Math.sin(eps));
  let asc2   = Math.atan(tanA) * 180/Math.PI;
  asc2       = Math.sin(lRad) > 0 ? asc2 + 180 : asc2 + 360;
  const lagnaLon = normalizeDeg(asc2 - ayanamsa);
  console.warn(`  ⚠️  Lagna (math fallback): ${lagnaLon.toFixed(4)}°`);
  return buildLagna(lagnaLon);
}

function buildLagna(lagnaLon) {
  const idx = Math.floor(lagnaLon / 30);
  return {
    lagnaRashi   : RASHIS[idx],
    lagnaLord    : RASHI_LORDS[RASHIS[idx]],
    lagnaLon     : +lagnaLon.toFixed(2),
    lagnaRashiIdx: idx,
  };
}

// ── Houses from Lagna ─────────────────────────────────────────
function assignHouses(planets, lagnaIdx) {
  const out = {};
  for (const [n, p] of Object.entries(planets)) {
    const absIdx = Math.floor(p.longitude / 30);
    out[n] = { ...p, house: ((absIdx - lagnaIdx + 12) % 12) + 1 };
  }
  return out;
}

// ── Nakshatra + Mahadasha ─────────────────────────────────────
function getDasha(moonLon) {
  const span = 360 / 27;
  const idx  = Math.floor(moonLon / span) % 27;
  const lord = NAKSHATRA_LORDS[idx];
  const yrs  = DASHA_YEARS[lord];
  const used = (moonLon % span / span) * yrs;
  return {
    nakshatra    : NAKSHATRAS[idx],
    nakshatraLord: lord,
    mahadasha    : { planet: lord, yearsRemaining: +(yrs - used).toFixed(2) }
  };
}

// ── Dosha Detection ───────────────────────────────────────────
function detectDoshas(planets) {
  const H      = n => planets[n]?.house || 1;
  const doshas = [];

  // 1. MANGAL DOSHA
  const marsH = H('Mars');
  if ([1,2,4,7,8,12].includes(marsH)) {
    const cc = [];
    if (['Aries','Scorpio','Capricorn'].includes(planets.Mars.rashi))
      cc.push('Mars in own/exalted sign — reduced');
    if (H('Jupiter') === 1)
      cc.push('Jupiter in Lagna — protective');
    if (planets.Mars.rashi === planets.Jupiter.rashi)
      cc.push('Mars-Jupiter conjunction — reduced');
    if (H('Venus') === 2 && marsH === 2)
      cc.push('Venus in 2nd — nullified');
    const cancelled = cc.length > 0;
    doshas.push({
      name        : 'Mangal Dosha (Kuja Dosha)',
      present     : !cancelled,
      severity    : cancelled ? 'CANCELLED' : ([7,8,1].includes(marsH)?'HIGH':'MODERATE'),
      trigger     : `Mars in H${marsH} (${planets.Mars.rashi})`,
      cancellations: cc,
      classicRef  : 'BPHS Ch.18 v.6',
      impact      : cancelled ? 'Cancelled — minimal effect' : `Tension in marriage; H${marsH} affected`,
      remedy      : cancelled ? ['No remedy needed'] : [
        'Mangal Puja every Tuesday',
        'Chant Om Angarakaya Namaha 108x',
        'Donate red lentils on Tuesdays',
        'Red Coral after consultation',
      ],
    });
  }

  // 2. KAAL SARP DOSHA
  const rLon   = planets.Rahu.longitude;
  const kLon   = planets.Ketu.longitude;
  const hemmed = l => rLon < kLon ? (l>=rLon&&l<=kLon) : (l>=rLon||l<=kLon);
  const hc     = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']
                   .filter(p => hemmed(planets[p].longitude)).length;
  const ksNames = ['Anant','Kulika','Vasuki','Shankhapala','Padma','Mahapadma',
                   'Takshak','Karkotak','Shankhachur','Ghatak','Vishdhar','Sheshnag'];
  if (hc >= 5) {
    doshas.push({
      name        : hc===7 ? `Kaal Sarp Dosha — ${ksNames[(H('Rahu')-1)%12]} Type`
                           : `Partial Kaal Sarp (${hc}/7 planets)`,
      present     : true,
      severity    : hc===7 ? 'HIGH' : 'MODERATE',
      trigger     : `${hc}/7 planets between Rahu(${planets.Rahu.rashi}) & Ketu(${planets.Ketu.rashi})`,
      cancellations: [],
      classicRef  : 'Parashar Hora Shastra',
      impact      : 'Career obstacles, sudden reversals, spiritual lessons',
      remedy      : ['Kaal Sarp Puja at Trimbakeshwar','Rudrabhishek on Nag Panchami'],
    });
  }

  // 3. PITRA DOSHA
  const sH = H('Sun');
  if (sH===H('Rahu') || sH===H('Ketu') || planets.Sun.rashi===planets.Rahu.rashi) {
    doshas.push({
      name        : 'Pitra Dosha',
      present     : true,
      severity    : planets.Sun.rashi===planets.Rahu.rashi ? 'HIGH' : 'MODERATE',
      trigger     : `Sun(H${sH}) afflicted by Rahu/Ketu`,
      cancellations: [],
      classicRef  : 'BPHS — Pitru Rina Yoga',
      impact      : 'Ancestral karma, obstacles from father-side',
      remedy      : ['Pind Daan at Gaya/Prayagraj','Feed Brahmins on Amavasya'],
    });
  }

  // 4. SADE SATI / SHANI DOSHA
  const mIdx = Math.floor(planets.Moon.longitude/30);
  const sIdx = Math.floor(planets.Saturn.longitude/30);
  const diff = Math.abs(sIdx - mIdx);
  const sati = diff<=1 || diff===11;
  const satH = H('Saturn');
  const shCan= ['EXALTED','OWN_SIGN'].includes(planets.Saturn.strength);
  if (sati || [4,8,12].includes(satH)) {
    doshas.push({
      name        : sati ? 'Sade Sati' : 'Shani Dosha',
      present     : true,
      severity    : shCan ? 'LOW' : (sati ? 'HIGH' : 'MODERATE'),
      trigger     : sati
        ? `Saturn(${planets.Saturn.rashi}) near Moon(${planets.Moon.rashi})`
        : `Saturn in H${satH}`,
      cancellations: shCan ? [`Saturn ${planets.Saturn.strength} — severity reduced`] : [],
      classicRef  : 'BPHS Ch.45',
      impact      : 'Delays, discipline, career pressure',
      remedy      : ['Shani Puja every Saturday','Donate black sesame on Saturdays'],
    });
  }

  // 5. GRAHAN DOSHA
  const sRahu = planets.Sun.rashi  === planets.Rahu.rashi;
  const sKetu = planets.Sun.rashi  === planets.Ketu.rashi;
  const mRahu = planets.Moon.rashi === planets.Rahu.rashi;
  const mKetu = planets.Moon.rashi === planets.Ketu.rashi;
  if (sRahu||sKetu||mRahu||mKetu) {
    const lunar = mRahu||mKetu;
    doshas.push({
      name        : `Grahan Dosha (${lunar?'Lunar':'Solar'})`,
      present     : true,
      severity    : 'HIGH',
      trigger     : lunar
        ? `Moon+${mRahu?'Rahu':'Ketu'} in ${planets.Moon.rashi}`
        : `Sun+${sRahu?'Rahu':'Ketu'} in ${planets.Sun.rashi}`,
      cancellations: [],
      classicRef  : 'Graha Mala Yoga',
      impact      : lunar ? 'Mental restlessness, confusion' : 'Authority & father issues',
      remedy      : ['Surya/Chandra Grah Shanti Puja','Offer water to Sun daily'],
    });
  }

  // 6. GURU CHANDAL DOSHA
  if (planets.Jupiter.rashi===planets.Rahu.rashi || planets.Jupiter.rashi===planets.Ketu.rashi) {
    const can = planets.Jupiter.strength==='EXALTED';
    doshas.push({
      name        : 'Guru Chandal Dosha',
      present     : !can,
      severity    : can ? 'CANCELLED' : 'MODERATE',
      trigger     : `Jupiter+Rahu/Ketu in ${planets.Jupiter.rashi}`,
      cancellations: can ? ['Jupiter exalted — cancelled'] : [],
      classicRef  : 'Chandal Yoga — BPHS',
      impact      : can ? 'Cancelled' : 'Poor judgment, legal issues',
      remedy      : can ? ['No remedy needed'] : ['Guru Puja on Thursdays','Yellow items donation'],
    });
  }

  // 7. VISH YOGA
  if (planets.Moon.rashi===planets.Saturn.rashi) {
    const can = ['EXALTED','OWN_SIGN'].includes(planets.Saturn.strength) ||
                ['EXALTED','OWN_SIGN'].includes(planets.Moon.strength);
    doshas.push({
      name        : 'Vish Yoga',
      present     : !can,
      severity    : can ? 'CANCELLED' : 'MODERATE',
      trigger     : `Moon+Saturn in ${planets.Moon.rashi}`,
      cancellations: can ? ['Exalted planet — reduced'] : [],
      classicRef  : 'Moon-Saturn conjunction',
      impact      : 'Emotional heaviness, pessimism',
      remedy      : ['Maha Mrityunjaya Japa daily','White flowers to Shiva on Mondays'],
    });
  }

  // 8. KEMDRUM YOGA
  const moonH = H('Moon');
  const adj   = [((moonH-2+12)%12)+1, (moonH%12)+1];
  const allH  = Object.entries(planets)
    .filter(([n]) => n!=='Moon' && n!=='Rahu' && n!=='Ketu')
    .map(([,p]) => p.house);
  if (!allH.some(h => adj.includes(h))) {
    doshas.push({
      name        : 'Kemdrum Yoga',
      present     : true,
      severity    : 'MODERATE',
      trigger     : `Moon in H${moonH}, no planets in adjacent houses`,
      cancellations: [],
      classicRef  : 'BPHS',
      impact      : 'Emotional isolation, financial fluctuations',
      remedy      : ['Chandra mantra on Mondays','Donate milk and white rice'],
    });
  }

  return doshas;
}

// ── DEBUG HELPER ──────────────────────────────────────────────
export function debugSweph() {
  console.log('\n========== 🔍 SWEPH DEBUG ==========');
  const jd = sweph.julday(2003, 11, 20, 7.5, SE.SE_GREG_CAL);
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);

  try {
    const r = sweph.calc_ut(jd, SE.SE_SUN, SE.SEFLG_SPEED | SE.SEFLG_SIDEREAL | SE.SEFLG_MOSEPH);
    console.log('calc_ut keys:', Object.keys(r));
    console.log('calc_ut r.data:', r.data);
  } catch(e) { console.error('calc_ut:', e.message); }

  try {
    const r = sweph.get_ayanamsa_ex_ut(jd, 0);
    console.log('ayanamsa_ex_ut:', JSON.stringify(r));
  } catch(e) { console.log('ayanamsa_ex_ut error:', e.message); }

  // ★ MOST IMPORTANT: log full houses_ex data object
  try {
    const h = sweph.houses_ex(jd, SE.SEFLG_SIDEREAL, 29.9, 78.0, 'W');
    console.log('houses_ex keys:', Object.keys(h));
    console.log('houses_ex h.data type:', typeof h.data);
    console.log('houses_ex h.data FULL:', JSON.stringify(h.data, null, 2));
  } catch(e) { console.error('houses_ex:', e.message); }

  console.log('=====================================\n');
}

// ── Main Export ───────────────────────────────────────────────
export async function generateKundli(
  name, dateStr, timeStr, place, gender,
  tzOffset=5.5, lat=20.5937, lon=78.9629
) {
  console.log(`\n🔭 Kundli | ${name} | ${place}`);
  console.log(`📍 Lat:${lat} Lon:${lon} TZ:UTC+${tzOffset}`);

  const jd       = getJulianDay(dateStr, timeStr, tzOffset);
  const ayanamsa = getAyanamsa(jd);
  console.log(`📅 JD:${jd.toFixed(4)} | Ayanamsa:${ayanamsa.toFixed(4)}°`);

  let planets  = calcPlanets(jd, ayanamsa);
  const lagna  = calcLagna(jd, lat, lon, ayanamsa);
  console.log(`🏠 Lagna: ${lagna.lagnaRashi} (${lagna.lagnaLon}°)`);

  planets = assignHouses(planets, lagna.lagnaRashiIdx);

  Object.entries(planets).forEach(([n,p]) =>
    console.log(`  ${n.padEnd(10)}: H${String(p.house).padEnd(2)} ${p.rashi.padEnd(13)} ${p.strength.padEnd(12)} [${p.source}]${p.retrograde?' ℞':''}`)
  );

  const { nakshatra, nakshatraLord, mahadasha } = getDasha(planets.Moon.longitude);
  const doshas        = detectDoshas(planets);
  const strongPlanets = Object.entries(planets).filter(([,p])=>['EXALTED','OWN_SIGN'].includes(p.strength)).map(([n])=>n);
  const weakPlanets   = Object.entries(planets).filter(([,p])=>p.strength==='DEBILITATED').map(([n])=>n);
  const sources       = [...new Set(Object.values(planets).map(p=>p.source))];
  const dataSource    = sources.includes('swisseph')  ? 'swisseph'
                      : sources.includes('moshier')   ? 'moshier'
                      : sources.includes('moshier-t') ? 'moshier'
                      : 'fallback';

  console.log(`✅ Done | src:${dataSource} | Doshas:${doshas.filter(d=>d.present).length}`);

  return {
    nativeInfo   : { name, dateOfBirth:dateStr, timeOfBirth:timeStr, placeOfBirth:place, gender, timezoneOffset:tzOffset },
    lagnaRashi   : lagna.lagnaRashi,
    lagnaLord    : lagna.lagnaLord,
    lagnaLon     : lagna.lagnaLon,
    lagnaRashiIdx: lagna.lagnaRashiIdx,
    planets, nakshatra, nakshatraLord, mahadasha,
    doshas,
    doshaCount   : doshas.filter(d=>d.present).length,
    strongPlanets, weakPlanets,
    ayanamsa     : +ayanamsa.toFixed(4),
    dataSource,
  };
}