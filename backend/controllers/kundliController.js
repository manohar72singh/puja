import sweph from 'sweph';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

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
  Sun: SE.SE_SUN, Moon: SE.SE_MOON, Mars: SE.SE_MARS,
  Mercury: SE.SE_MERCURY, Jupiter: SE.SE_JUPITER,
  Venus: SE.SE_VENUS, Saturn: SE.SE_SATURN, Rahu: SE.SE_TRUE_NODE,
};

function normalizeDeg(d) { return ((d % 360) + 360) % 360; }

function getStrength(name, rashi) {
  if (EXALTATION[name]  === rashi) return 'EXALTED';
  if (DEBILITATION[name] === rashi) return 'DEBILITATED';
  if (OWN_SIGN[name]?.includes(rashi)) return 'OWN_SIGN';
  return 'NEUTRAL';
}

function angDiff(lon1, lon2) {
  const d = Math.abs(lon1 - lon2) % 360;
  return d > 180 ? 360 - d : d;
}

function extractLonSpeed(r) {
  if (!r) return null;
  if (r.data && Array.isArray(r.data) && typeof r.data[0] === 'number')
    return { longitude: r.data[0], speed: r.data[3] ?? 0 };
  if (typeof r.longitude === 'number')
    return { longitude: r.longitude, speed: r.longitudeSpeed ?? r.speedInLongitude ?? 0 };
  if (typeof r[0] === 'number')
    return { longitude: r[0], speed: r[3] ?? 0 };
  if (r.error) console.warn(`  sweph error: ${r.error}`);
  return null;
}

function getJulianDay(dateStr, timeStr, tzOffset) {
  const [yr, mo, dy] = dateStr.split('-').map(Number);
  const [hr, mn]     = timeStr.split(':').map(Number);
  const utcHr        = (hr + mn / 60) - tzOffset;
  return sweph.julday(yr, mo, dy, utcHr, SE.SE_GREG_CAL);
}

function getAyanamsa(jd) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);
  const attempts = [
    () => { const r = sweph.get_ayanamsa_ex_ut(jd, SE.SEFLG_MOSEPH); return typeof r?.data === 'number' ? r.data : null; },
    () => { const r = sweph.get_ayanamsa_ex_ut(jd, 0);               return typeof r?.data === 'number' ? r.data : null; },
    () => { const r = sweph.get_ayanamsa_ut(jd); return typeof r === 'number' ? r : null; },
    () => { const r = sweph.get_ayanamsa(jd);    return typeof r === 'number' ? r : null; },
  ];
  for (const fn of attempts) {
    try {
      const val = fn();
      if (val !== null && val > 20 && val < 30) return val;
    } catch(_) {}
  }
  const T = (jd - 2451545.0) / 36525.0;
  return 23.85 + 0.01360 * T + 0.000236 * T * T;
}

function vsop87Fallback(jd, ayanamsa) {
  const T  = (jd - 2451545.0) / 36525.0;
  const Ms = ((357.52911 + 35999.05029*T) % 360) * Math.PI/180;
  const Mm = ((134.96298 + 477198.86763*T) % 360) * Math.PI/180;
  const trop = {
    Sun:280.46646+36000.76983*T+1.9146*Math.sin(Ms),
    Moon:218.31650+481267.88130*T+6.2886*Math.sin(Mm),
    Mars:355.43300+19140.29930*T, Mercury:252.25100+149472.67500*T,
    Jupiter:34.35100+3034.90500*T, Venus:181.97900+58517.81600*T,
    Saturn:50.07700+1222.11400*T, Rahu:125.04452-1934.13626*T,
  };
  const out = {};
  for (const [n, v] of Object.entries(trop)) {
    const lon = normalizeDeg(v - ayanamsa);
    const rIdx = Math.floor(lon / 30);
    const rashi = RASHIS[rIdx];
    out[n] = { longitude:+lon.toFixed(4), degree:+(lon%30).toFixed(2), rashi, lord:RASHI_LORDS[rashi], house:rIdx+1, strength:getStrength(n,rashi), retrograde:false, source:'fallback' };
  }
  const kLon = normalizeDeg(out.Rahu.longitude + 180);
  const kIdx = Math.floor(kLon / 30);
  const kRash = RASHIS[kIdx];
  out.Ketu = { longitude:+kLon.toFixed(4), degree:+(kLon%30).toFixed(2), rashi:kRash, lord:RASHI_LORDS[kRash], house:kIdx+1, strength:getStrength('Ketu',kRash), retrograde:false, source:'fallback' };
  return out;
}

function calcPlanets(jd, ayanamsa) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);
  const BASE = SE.SEFLG_SPEED;
  const SIDEREAL = BASE | SE.SEFLG_SIDEREAL;
  const flagSets = [
    { flags: SIDEREAL | SE.SEFLG_SWIEPH, label:'swisseph', sidereal:true },
    { flags: SIDEREAL | SE.SEFLG_MOSEPH, label:'moshier',  sidereal:true },
    { flags: BASE | SE.SEFLG_SWIEPH,     label:'swisseph-t', sidereal:false },
    { flags: BASE | SE.SEFLG_MOSEPH,     label:'moshier-t',  sidereal:false },
  ];
  const planets = {};
  for (const [name, seId] of Object.entries(SE_IDS)) {
    let found = null;
    for (const { flags, label, sidereal } of flagSets) {
      try {
        const raw = sweph.calc_ut(jd, seId, flags);
        const ex  = extractLonSpeed(raw);
        if (ex && typeof ex.longitude === 'number') {
          const lon = sidereal ? normalizeDeg(ex.longitude) : normalizeDeg(ex.longitude - ayanamsa);
          found = { longitude: lon, speed: ex.speed, source: label };
          break;
        }
      } catch(e) { console.warn(`  ❌ ${name} [${label}]: ${e.message}`); }
    }
    if (!found) { console.warn(`⚠️  ${name}: ALL sweph failed`); continue; }
    const lon = found.longitude;
    const rIdx = Math.floor(lon / 30);
    const rashi = RASHIS[rIdx];
    planets[name] = {
      longitude:+lon.toFixed(4), degree:+(lon%30).toFixed(2),
      rashi, lord:RASHI_LORDS[rashi], house:rIdx+1,
      strength:getStrength(name,rashi), retrograde:found.speed<0, source:found.source
    };
  }
  if (planets.Rahu) {
    const kLon = normalizeDeg(planets.Rahu.longitude + 180);
    const kIdx = Math.floor(kLon / 30);
    const kRash = RASHIS[kIdx];
    planets.Ketu = { longitude:+kLon.toFixed(4), degree:+(kLon%30).toFixed(2), rashi:kRash, lord:RASHI_LORDS[kRash], house:kIdx+1, strength:getStrength('Ketu',kRash), retrograde:false, source:'calculated' };
  }
  const needed = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const missing = needed.filter(p => !planets[p]);
  if (missing.length > 0) {
    const fb = vsop87Fallback(jd, ayanamsa);
    missing.forEach(p => { planets[p] = fb[p]; });
  }
  return planets;
}

function calcLagna(jd, lat, lon, ayanamsa) {
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);
  function extractAsc(h, tropical) {
    if (!h) return null;
    let asc = null;
    if (Array.isArray(h.data?.points) && typeof h.data.points[0] === 'number') asc = h.data.points[0];
    else if (typeof h.ascendant === 'number') asc = h.ascendant;
    else if (typeof h.ascmc?.[0] === 'number') asc = h.ascmc[0];
    else if (Array.isArray(h.data) && typeof h.data[0] === 'number') asc = h.data[0];
    else if (h.data?.ascendant != null) asc = h.data.ascendant;
    else if (Array.isArray(h) && Array.isArray(h[1])) asc = h[1][0];
    else if (Array.isArray(h) && typeof h[0] === 'number') asc = h[0];
    if (asc === null || isNaN(asc)) return null;
    return tropical ? asc - ayanamsa : asc;
  }
  for (const sys of ['W','P','E']) {
    for (const { flag, tropical } of [{ flag:SE.SEFLG_SIDEREAL, tropical:false },{ flag:0, tropical:true }]) {
      try {
        const h = sweph.houses_ex(jd, flag, lat, lon, sys);
        const asc = extractAsc(h, tropical);
        if (asc !== null && !isNaN(asc) && asc > 0) return buildLagna(normalizeDeg(asc));
      } catch(_) {}
    }
  }
  const T = (jd - 2451545.0) / 36525.0;
  const gst = normalizeDeg(280.46061837 + 360.98564736629*(jd-2451545.0) + 0.000387933*T*T);
  const lst  = normalizeDeg(gst + lon);
  const eps  = (23.439291111 - 0.013004167*T) * Math.PI/180;
  const lRad = lst * Math.PI/180;
  const laRad= lat * Math.PI/180;
  const tanA = Math.cos(lRad)/(-Math.sin(lRad)*Math.cos(eps)+Math.tan(laRad)*Math.sin(eps));
  let asc2 = Math.atan(tanA) * 180/Math.PI;
  asc2 = Math.sin(lRad) > 0 ? asc2 + 180 : asc2 + 360;
  return buildLagna(normalizeDeg(asc2 - ayanamsa));
}

function buildLagna(lagnaLon) {
  const idx = Math.floor(lagnaLon / 30);
  return { lagnaRashi:RASHIS[idx], lagnaLord:RASHI_LORDS[RASHIS[idx]], lagnaLon:+lagnaLon.toFixed(2), lagnaRashiIdx:idx };
}

function assignHouses(planets, lagnaIdx) {
  const out = {};
  for (const [n, p] of Object.entries(planets)) {
    const absIdx = Math.floor(p.longitude / 30);
    out[n] = { ...p, house: ((absIdx - lagnaIdx + 12) % 12) + 1 };
  }
  return out;
}

function getDasha(moonLon) {
  const span = 360 / 27;
  const idx  = Math.floor(moonLon / span) % 27;
  const lord = NAKSHATRA_LORDS[idx];
  const yrs  = DASHA_YEARS[lord];
  const used = (moonLon % span / span) * yrs;
  return { nakshatra:NAKSHATRAS[idx], nakshatraLord:lord, mahadasha:{ planet:lord, yearsRemaining:+(yrs-used).toFixed(2) } };
}

// ══════════════════════════════════════════════════════════════
// DOSHA DETECTION — Full + Partial for every dosha
//
// FULL    = Primary condition met (same rashi / all planets inside arc)
// PARTIAL = Secondary condition (adjacent rashi / 5-6 planets inside)
// type field: 'FULL' | 'PARTIAL' | 'CANCELLED'
// ══════════════════════════════════════════════════════════════
function detectDoshas(planets, lagnaRashi, lagnaIdx) {
  const doshas = [];

  // Helpers — always longitude-based, never raw .house for Moon/Venus refs
  const lon = n => planets[n]?.longitude ?? 0;
  const ri  = n => Math.floor((planets[n]?.longitude ?? 0) / 30);  // 0-11
  const deg = n => planets[n]?.degree ?? ((planets[n]?.longitude ?? 0) % 30);
  const arc = (a, b) => { const d = Math.abs(lon(a)-lon(b))%360; return d>180?360-d:d; };
  const hf  = (name, refIdx) => ((ri(name) - refIdx + 12) % 12) + 1;
  const rashiGap = (riA, riB) => Math.min((riA-riB+12)%12, (riB-riA+12)%12);

  const lagnaRashiIdx = lagnaIdx;
  const moonRashiIdx  = ri('Moon');
  const venusRashiIdx = ri('Venus');
  const rahuRashiIdx  = ri('Rahu');
  const ketuRashiIdx  = ri('Ketu');
  const G7 = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];

  // ─────────────────────────────────────────────────────────
  // 1. MANGAL DOSHA
  // Full    = Mars in [1,2,4,7,8,12] from ALL 3 (Lagna+Moon+Venus)
  // Partial = Mars in [1,2,4,7,8,12] from 1 or 2 references
  // ─────────────────────────────────────────────────────────
  {
    const MH = [1,2,4,7,8,12];
    const fl = MH.includes(hf('Mars', lagnaRashiIdx));
    const fm = MH.includes(hf('Mars', moonRashiIdx));
    const fv = MH.includes(hf('Mars', venusRashiIdx));
    const count = [fl,fm,fv].filter(Boolean).length;

    if (count > 0) {
      const triggers = [];
      if (fl) triggers.push(`H${hf('Mars',lagnaRashiIdx)} from Lagna`);
      if (fm) triggers.push(`H${hf('Mars',moonRashiIdx)} from Moon`);
      if (fv) triggers.push(`H${hf('Mars',venusRashiIdx)} from Venus`);

      const cc = [];
      if (['Aries','Scorpio'].includes(planets.Mars?.rashi)) cc.push('Mars in own sign');
      if (planets.Mars?.rashi === 'Capricorn') cc.push('Mars exalted');
      if (['Aries','Scorpio'].includes(lagnaRashi)) cc.push(`Mars rules ${lagnaRashi} Lagna`);
      if (arc('Jupiter','Mars') < 8) cc.push('Jupiter conjunct Mars');

      const isFull = count === 3;
      doshas.push({
        name         : 'Mangal Dosha (Kuja Dosha)',
        present      : cc.length === 0,
        type         : cc.length > 0 ? 'CANCELLED' : isFull ? 'FULL' : 'PARTIAL',
        severity     : cc.length > 0 ? 'CANCELLED' : isFull ? 'HIGH' : count===2 ? 'MODERATE' : 'LOW',
        partialNote  : (!isFull && cc.length===0) ? `Partial — Mars manglik from ${count}/3 references only` : null,
        trigger      : `Mars in ${triggers.join(' | ')} — ${count}/3 references`,
        cancellations: cc,
        classicRef   : 'BPHS Ch.18 — Vivaha Adhyaya',
        impact       : cc.length>0 ? 'Cancelled'
          : isFull ? 'Strong — significant marital impact'
          : `Partial (${count}/3) — mild marital impact`,
        remedy: cc.length>0 ? ['No remedy needed'] : [
          'Mangal Puja every Tuesday',
          'Chant "Om Kram Kreem Kraum Sah Bhaumaya Namah" 108x daily',
          'Donate red lentils on Tuesday',
          ...(isFull ? ['Kumbh Vivah or Vishnu Vivah before marriage'] : []),
        ],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 2. KAAL SARP DOSHA
  // Full    = All 7 planets inside arc (count=7)
  // Partial = 5 or 6 planets inside arc
  // NOTE: Uses LONGITUDE (0-360), NOT degree(0-30) — critical fix
  // ─────────────────────────────────────────────────────────
  {
    const rahuLon = lon('Rahu');
    const ketuLon = lon('Ketu');
    const rahuDeg = deg('Rahu');
    const ketuDeg = deg('Ketu');

    const insideRK = name => {
      const pRi=ri(name), pDg=deg(name), pLon=lon(name);
      if (pRi===rahuRashiIdx) return pDg < rahuDeg;
      if (pRi===ketuRashiIdx) return pDg > ketuDeg;
      const arcLen=(ketuLon-rahuLon+360)%360, dist=(pLon-rahuLon+360)%360;
      return dist>0 && dist<arcLen;
    };
    const insideKR = name => {
      const pRi=ri(name), pDg=deg(name), pLon=lon(name);
      if (pRi===ketuRashiIdx) return pDg < ketuDeg;
      if (pRi===rahuRashiIdx) return pDg > rahuDeg;
      const arcLen=(rahuLon-ketuLon+360)%360, dist=(pLon-ketuLon+360)%360;
      return dist>0 && dist<arcLen;
    };

    const cRK = G7.filter(p=>insideRK(p)).length;
    const cKR = G7.filter(p=>insideKR(p)).length;
    const maxC = Math.max(cRK, cKR);
    const dir  = cRK>=cKR ? 'Rahu→Ketu' : 'Ketu→Rahu';
    const outside = G7.filter(p => cRK>=cKR ? !insideRK(p) : !insideKR(p));

    if (maxC >= 5) {
      const isFull = maxC === 7;
      const rahuH  = hf('Rahu', lagnaRashiIdx);
      const KSD_NAMES = {
        1:'Anant',2:'Kulik',3:'Vasuki',4:'Shankhpal',5:'Padma',6:'Mahapadma',
        7:'Takshak',8:'Karkotak',9:'Shankhchud',10:'Ghatak',11:'Vishdhar',12:'Sheshnag'
      };
      const cc = [];
      if ([1,4,5,7,9,10].includes(hf('Jupiter',lagnaRashiIdx))) cc.push('Jupiter in Kendra/Trikona');
      if (planets.Jupiter?.strength==='EXALTED') cc.push('Jupiter exalted');
      if ([3,6,11].includes(rahuH)) cc.push('Rahu in upachaya house');

      doshas.push({
        name         : `Kaal Sarp Dosha — ${KSD_NAMES[rahuH]||''} KSD`,
        present      : true,
        type         : isFull ? 'FULL' : 'PARTIAL',
        severity     : cc.length>0?'MODERATE': isFull?'HIGH': maxC===6?'MODERATE':'LOW',
        partialNote  : !isFull ? `Partial KSD — ${maxC}/7 planets inside ${dir} arc. Outside: ${outside.join(', ')}` : null,
        trigger      : isFull
          ? `All 7 planets in ${dir} arc | Rahu H${rahuH} (${planets.Rahu?.rashi})`
          : `${maxC}/7 planets in ${dir} arc | Outside: ${outside.join(', ')}`,
        cancellations: cc,
        classicRef   : 'Kaal Sarp Yoga — Traditional Jyotish',
        impact       : isFull
          ? 'Full KSD — strong karmic struggles, sudden reversals'
          : `Partial KSD (${maxC}/7) — periodic obstacles, moderate Rahu-Ketu influence`,
        remedy: [
          'Kaal Sarp Shanti Puja at Trimbakeshwar (Nashik)',
          'Mahamrityunjaya Mantra 108x daily',
          'Nag Panchami worship every year',
          ...(!isFull ? ['Rahu-Ketu Shanti Puja sufficient for partial KSD'] : []),
        ],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 3. PITRA DOSHA
  // Full    = Sun same rashi as Rahu/Ketu
  // Partial = Rahu/Ketu in 9th OR 9th lord with Rahu/Ketu
  // ─────────────────────────────────────────────────────────
  {
    const sunWithRahu = ri('Sun')===rahuRashiIdx;
    const sunWithKetu = ri('Sun')===ketuRashiIdx;
    const rahuIn9=hf('Rahu',lagnaRashiIdx)===9, ketuIn9=hf('Ketu',lagnaRashiIdx)===9;
    const sunIn9=hf('Sun',lagnaRashiIdx)===9, satIn9=hf('Saturn',lagnaRashiIdx)===9;
    const ninthRashi=RASHIS[(lagnaRashiIdx+8)%12], ninthLord=RASHI_LORDS[ninthRashi];
    const nlWithRahu=ri(ninthLord)===rahuRashiIdx, nlWithKetu=ri(ninthLord)===ketuRashiIdx;

    const isFull    = sunWithRahu || sunWithKetu;
    const isPartial = !isFull && (rahuIn9||ketuIn9||nlWithRahu||nlWithKetu||(sunIn9&&satIn9));

    if (isFull || isPartial) {
      const triggers=[];
      if (sunWithRahu) triggers.push(`Sun+Rahu same sign (${planets.Sun?.rashi})`);
      if (sunWithKetu) triggers.push(`Sun+Ketu same sign (${planets.Sun?.rashi})`);
      if (rahuIn9) triggers.push('Rahu in 9th house');
      if (ketuIn9) triggers.push('Ketu in 9th house');
      if (nlWithRahu) triggers.push(`9th lord ${ninthLord} with Rahu`);
      if (nlWithKetu) triggers.push(`9th lord ${ninthLord} with Ketu`);
      if (sunIn9&&satIn9) triggers.push('Sun+Saturn both in 9th');

      doshas.push({
        name         : 'Pitra Dosha',
        present      : true,
        type         : isFull ? 'FULL' : 'PARTIAL',
        severity     : isFull ? 'HIGH' : 'MODERATE',
        partialNote  : isPartial ? 'Partial — 9th house affliction only, no direct Sun-Rahu/Ketu conjunction' : null,
        trigger      : triggers.join(' | '),
        cancellations: planets.Sun?.strength==='EXALTED'?['Sun exalted — reduced']:[],
        classicRef   : 'Pitru Rina — Dharma Sindhu, Garuda Purana',
        impact       : isFull ? 'Strong ancestral karma — major obstacles' : 'Mild ancestral karma — periodic obstacles',
        remedy: [
          'Pind Daan at Gaya/Varanasi on Amavasya',
          'Tarpan (sesame+water) every Amavasya',
          'Feed crows every Saturday and Amavasya',
          'Shraddha rituals during Pitru Paksha annually',
        ],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 4. SHANI SADE SATI
  // Full    = Saturn in Moon's rashi (peak)
  // Partial = Saturn in 12th or 2nd from Moon (rising/setting)
  // ─────────────────────────────────────────────────────────
  {
    const satRi=ri('Saturn'), moonRi=ri('Moon');
    const peak=satRi===moonRi;
    const rising=satRi===(moonRi-1+12)%12;
    const setting=satRi===(moonRi+1)%12;

    if (peak||rising||setting) {
      const phase=peak?'2nd Phase — Peak':rising?'1st Phase — Rising':'3rd Phase — Setting';
      const cc=[];
      if (planets.Saturn?.strength==='EXALTED') cc.push('Saturn exalted — much reduced');
      if (planets.Saturn?.strength==='OWN_SIGN') cc.push('Saturn own sign — moderate only');

      doshas.push({
        name         : `Shani Sade Sati (${phase})`,
        present      : true,
        type         : peak ? 'FULL' : 'PARTIAL',
        severity     : peak?'HIGH':'MODERATE',
        partialNote  : !peak ? `Partial — ${phase}. Less intense than peak phase.` : null,
        trigger      : `Saturn in ${planets.Saturn?.rashi} — ${phase} from Moon in ${planets.Moon?.rashi}`,
        cancellations: cc,
        classicRef   : 'Shani Sade Sati — Brihat Samhita',
        impact       : peak ? 'Peak — maximum Saturn pressure on Moon sign'
          : `${phase} — Saturn approaching/leaving, moderate pressure`,
        remedy: [
          'Shani Puja every Saturday',
          'Til oil lamp at Peepal tree Saturday evening',
          'Donate black sesame + mustard oil on Saturday',
          'Chant "Om Sham Shanicharaya Namah" 108x daily',
        ],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 5. GURU CHANDAL YOGA
  // Full    = Jupiter same rashi as Rahu/Ketu
  // Partial = Jupiter in adjacent rashi to Rahu/Ketu
  // ─────────────────────────────────────────────────────────
  {
    const jupRi=ri('Jupiter');
    const exactRahu=jupRi===rahuRashiIdx, exactKetu=jupRi===ketuRashiIdx;
    const nearRahu=rashiGap(jupRi,rahuRashiIdx)===1;
    const nearKetu=rashiGap(jupRi,ketuRashiIdx)===1;
    const isFull=exactRahu||exactKetu;
    const isPartial=!isFull&&(nearRahu||nearKetu);

    if (isFull||isPartial) {
      const cc=[];
      if (planets.Jupiter?.strength==='EXALTED') cc.push('Jupiter exalted — greatly reduced');
      if (planets.Jupiter?.strength==='OWN_SIGN') cc.push('Jupiter own sign — partial cancellation');
      if ([1,4,5,7,9,10].includes(hf('Jupiter',lagnaRashiIdx))) cc.push('Jupiter in Kendra/Trikona');

      doshas.push({
        name         : 'Guru Chandal Yoga',
        present      : cc.length===0,
        type         : cc.length>0?'CANCELLED':isFull?'FULL':'PARTIAL',
        severity     : cc.length>0?'CANCELLED':isFull?'MODERATE':'LOW',
        partialNote  : (isPartial&&cc.length===0) ? `Partial — Jupiter in adjacent sign to ${nearRahu?'Rahu':'Ketu'}` : null,
        trigger      : isFull
          ? `Jupiter+${exactRahu?'Rahu':'Ketu'} same sign (${planets.Jupiter?.rashi})`
          : `Jupiter (${planets.Jupiter?.rashi}) adjacent to ${nearRahu?'Rahu ('+planets.Rahu?.rashi+')':'Ketu ('+planets.Ketu?.rashi+')'}`,
        cancellations: cc,
        classicRef   : 'Chandal Yoga — Phaladeepika Ch.6',
        impact       : isFull?'Ethical confusion, wrong guidance':'Mild — occasional confusion regarding teachers/guidance',
        remedy: cc.length>0?['Regular Jupiter worship sufficient']:[
          'Guru Puja every Thursday',
          'Chant "Om Graam Greem Graum Sah Gurave Namah" 108x',
          'Donate yellow items on Thursday',
        ],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 6. VISH YOGA
  // Full    = Moon same rashi as Saturn
  // Partial = Moon and Saturn in adjacent rashis
  // ─────────────────────────────────────────────────────────
  {
    const mRi=ri('Moon'), sRi=ri('Saturn');
    const isFull=mRi===sRi;
    const isPartial=!isFull&&rashiGap(mRi,sRi)===1;

    if (isFull||isPartial) {
      const d=arc('Moon','Saturn');
      const cc=[];
      if (planets.Moon?.strength==='EXALTED') cc.push('Moon exalted — reduced');
      if (ri('Jupiter')===mRi) cc.push('Jupiter with Moon — Gaja Kesari cancels');

      doshas.push({
        name         : 'Vish Yoga (Moon-Saturn)',
        present      : cc.length===0,
        type         : cc.length>0?'CANCELLED':isFull?'FULL':'PARTIAL',
        severity     : cc.length>0?'CANCELLED':isFull?(d<10?'HIGH':'MODERATE'):'LOW',
        partialNote  : (isPartial&&cc.length===0) ? `Partial — Moon (${planets.Moon?.rashi}) and Saturn (${planets.Saturn?.rashi}) in adjacent signs` : null,
        trigger      : isFull
          ? `Moon+Saturn same sign (${planets.Moon?.rashi}), ${d.toFixed(1)}° apart`
          : `Moon (${planets.Moon?.rashi}) and Saturn (${planets.Saturn?.rashi}) — adjacent signs`,
        cancellations: cc,
        classicRef   : 'Vish Yoga — Brihat Jataka, BPHS',
        impact       : isFull?'Emotional heaviness, depression':'Mild Saturn pressure on Moon — occasional pessimism',
        remedy: ['Mahamrityunjaya Mantra 108x daily','Offer raw milk to Shiva on Monday','Fast on Mondays'],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 7. ANGARAK YOGA
  // Full    = Mars same rashi as Rahu
  // Partial = Mars in adjacent rashi to Rahu
  // ─────────────────────────────────────────────────────────
  {
    const marsRi=ri('Mars');
    const isFull=marsRi===rahuRashiIdx;
    const isPartial=!isFull&&rashiGap(marsRi,rahuRashiIdx)===1;

    if (isFull||isPartial) {
      doshas.push({
        name         : 'Angarak Yoga (Mars-Rahu)',
        present      : true,
        type         : isFull?'FULL':'PARTIAL',
        severity     : isFull?'HIGH':'LOW',
        partialNote  : isPartial ? `Partial — Mars (${planets.Mars?.rashi}) adjacent to Rahu (${planets.Rahu?.rashi})` : null,
        trigger      : isFull
          ? `Mars+Rahu same sign (${planets.Mars?.rashi}), ${arc('Mars','Rahu').toFixed(1)}° apart`
          : `Mars (${planets.Mars?.rashi}) adjacent to Rahu (${planets.Rahu?.rashi})`,
        cancellations: planets.Mars?.strength==='EXALTED'?['Mars exalted — reduced']:[],
        classicRef   : 'Angarak Yoga — Lal Kitab',
        impact       : isFull?'Explosive anger, accidents, blood disorders':'Mild — impulsive tendencies, minor accidents',
        remedy: ['Hanuman Chalisa daily','Fast on Tuesdays','Chant "Om Kram Kreem Kraum Sah Bhaumaya Namah" 108x'],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 8. SHAPIT YOGA
  // Full    = Saturn same rashi as Rahu
  // Partial = Saturn in adjacent rashi to Rahu
  // ─────────────────────────────────────────────────────────
  {
    const satRi2=ri('Saturn');
    const isFull=satRi2===rahuRashiIdx;
    const isPartial=!isFull&&rashiGap(satRi2,rahuRashiIdx)===1;

    if (isFull||isPartial) {
      doshas.push({
        name         : 'Shapit Yoga (Saturn-Rahu)',
        present      : true,
        type         : isFull?'FULL':'PARTIAL',
        severity     : isFull?(arc('Saturn','Rahu')<10?'HIGH':'MODERATE'):'LOW',
        partialNote  : isPartial ? `Partial — Saturn (${planets.Saturn?.rashi}) adjacent to Rahu (${planets.Rahu?.rashi})` : null,
        trigger      : isFull
          ? `Saturn+Rahu same sign (${planets.Saturn?.rashi}), ${arc('Saturn','Rahu').toFixed(1)}° apart`
          : `Saturn (${planets.Saturn?.rashi}) adjacent to Rahu (${planets.Rahu?.rashi})`,
        cancellations: planets.Saturn?.strength==='EXALTED'?['Saturn exalted — reduced']:[],
        classicRef   : 'Shrapit Yoga — Lal Kitab',
        impact       : isFull?'Cursed karma, repeated failures':'Mild karmic pressure — occasional setbacks',
        remedy: ['Shani-Rahu Shanti Puja on Saturday','Donate black sesame + mustard oil Saturday','Feed crows and dogs Saturday'],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 9. GRAHAN DOSHA (Surya + Chandra)
  // Full    = Sun/Moon same rashi as Rahu/Ketu
  // Partial = Sun/Moon in adjacent rashi to Rahu/Ketu
  // ─────────────────────────────────────────────────────────
  {
    // Surya Grahan
    const sunRi2=ri('Sun');
    const sunFull=sunRi2===rahuRashiIdx||sunRi2===ketuRashiIdx;
    const sunPartial=!sunFull&&(rashiGap(sunRi2,rahuRashiIdx)===1||rashiGap(sunRi2,ketuRashiIdx)===1);

    if (sunFull||sunPartial) {
      const nearN=rashiGap(sunRi2,rahuRashiIdx)<=rashiGap(sunRi2,ketuRashiIdx)?'Rahu':'Ketu';
      const withW=sunRi2===rahuRashiIdx?'Rahu':sunRi2===ketuRashiIdx?'Ketu':nearN;
      const d=arc('Sun',withW);
      doshas.push({
        name         : 'Surya Grahan Dosha',
        present      : true,
        type         : sunFull?'FULL':'PARTIAL',
        severity     : sunFull?(d<10?'HIGH':'MODERATE'):'LOW',
        partialNote  : sunPartial?`Partial — Sun (${planets.Sun?.rashi}) adjacent to ${withW} (${planets[withW]?.rashi})`:null,
        trigger      : sunFull
          ? `Sun+${withW} same sign (${planets.Sun?.rashi}), ${d.toFixed(1)}° apart`
          : `Sun (${planets.Sun?.rashi}) adjacent to ${withW} (${planets[withW]?.rashi})`,
        cancellations: planets.Sun?.strength==='EXALTED'?['Sun exalted — reduced']:[],
        classicRef   : 'Surya Grahan Yoga — Jataka Parijata',
        impact       : sunFull?'Father conflicts, govt obstacles, ego issues':'Mild — occasional authority friction',
        remedy: ['Surya Arghya at sunrise daily','Aditya Hridayam on Sundays','Donate wheat+jaggery on Sunday'],
      });
    }

    // Chandra Grahan
    const moonRi3=ri('Moon');
    const moonFull=moonRi3===rahuRashiIdx||moonRi3===ketuRashiIdx;
    const moonPartial=!moonFull&&(rashiGap(moonRi3,rahuRashiIdx)===1||rashiGap(moonRi3,ketuRashiIdx)===1);

    if (moonFull||moonPartial) {
      const nearN=rashiGap(moonRi3,rahuRashiIdx)<=rashiGap(moonRi3,ketuRashiIdx)?'Rahu':'Ketu';
      const withW=moonRi3===rahuRashiIdx?'Rahu':moonRi3===ketuRashiIdx?'Ketu':nearN;
      const d=arc('Moon',withW);
      doshas.push({
        name         : 'Chandra Grahan Dosha',
        present      : true,
        type         : moonFull?'FULL':'PARTIAL',
        severity     : moonFull?(d<10?'HIGH':'MODERATE'):'LOW',
        partialNote  : moonPartial?`Partial — Moon (${planets.Moon?.rashi}) adjacent to ${withW} (${planets[withW]?.rashi})`:null,
        trigger      : moonFull
          ? `Moon+${withW} same sign (${planets.Moon?.rashi}), ${d.toFixed(1)}° apart`
          : `Moon (${planets.Moon?.rashi}) adjacent to ${withW} (${planets[withW]?.rashi})`,
        cancellations: planets.Moon?.strength==='EXALTED'?['Moon exalted — reduced']:[],
        classicRef   : 'Chandra Grahan Yoga — BPHS',
        impact       : moonFull?'Mental instability, anxiety, mother health':'Mild — occasional emotional disturbance',
        remedy: ['Chant "Om Som Somaya Namah" 108x on Monday','Fast on Mondays','Wear pearl in silver'],
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 10. KEMDRUM YOGA
  // Full    = Moon completely isolated (no adj, no conj, no kendra)
  // Partial = Moon has kendra support but no adjacent planets
  // ─────────────────────────────────────────────────────────
  {
    const mRi2=ri('Moon');
    const G6=['Sun','Mars','Mercury','Jupiter','Venus','Saturn'];
    const adjR=[(mRi2-1+12)%12,(mRi2+1)%12];
    const kenR=[mRi2,(mRi2+3)%12,(mRi2+6)%12,(mRi2+9)%12];

    const hasAdj  =G6.some(p=>adjR.includes(ri(p)));
    const hasConj =G6.some(p=>ri(p)===mRi2);
    const hasKend =G6.some(p=>kenR.includes(ri(p)));

    if (!hasAdj&&!hasConj&&!hasKend) {
      doshas.push({
        name:'Kemdrum Yoga', present:true, type:'FULL', severity:'MODERATE', partialNote:null,
        trigger:`Moon isolated in ${planets.Moon?.rashi} — no planets in adjacent or kendra rashis`,
        cancellations:[], classicRef:'Kemdrum Yoga — BPHS Ch.23, Phaladeepika',
        impact:'Emotional isolation, mental instability, lack of support',
        remedy:['Chandra Puja on Mondays','Wear pearl (moti) in silver on Monday','Spend time near water'],
      });
    } else if (!hasAdj&&!hasConj&&hasKend) {
      const kendraSupport=G6.filter(p=>kenR.includes(ri(p)));
      doshas.push({
        name:'Kemdrum Yoga', present:true, type:'PARTIAL', severity:'LOW',
        partialNote:`Partial — no adjacent planets, but ${kendraSupport.join('/')} in kendra gives partial support`,
        trigger:`Moon (${planets.Moon?.rashi}) — no adjacent planets, kendra support from ${kendraSupport.join('/')}`,
        cancellations:[`${kendraSupport.join('/')} in kendra — partial cancellation`],
        classicRef:'Kemdrum Yoga — BPHS Ch.23',
        impact:'Mild emotional instability — some lonely periods',
        remedy:['Chandra Puja on Mondays','Wear pearl in silver on Monday'],
      });
    }
  }

  return doshas;
}

export function debugSweph() {
  console.log('\n========== 🔍 SWEPH DEBUG ==========');
  const jd = sweph.julday(2003, 11, 20, 7.5, SE.SE_GREG_CAL);
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);
  try {
    const r = sweph.calc_ut(jd, SE.SE_SUN, SE.SEFLG_SPEED|SE.SEFLG_SIDEREAL|SE.SEFLG_MOSEPH);
    console.log('calc_ut keys:', Object.keys(r));
    console.log('calc_ut r.data:', r.data);
  } catch(e) { console.error('calc_ut:', e.message); }
  try {
    const r = sweph.get_ayanamsa_ex_ut(jd, 0);
    console.log('ayanamsa_ex_ut:', JSON.stringify(r));
  } catch(e) { console.log('ayanamsa_ex_ut error:', e.message); }
  try {
    const h = sweph.houses_ex(jd, SE.SEFLG_SIDEREAL, 29.9, 78.0, 'W');
    console.log('houses_ex keys:', Object.keys(h));
  } catch(e) { console.error('houses_ex:', e.message); }
  console.log('=====================================\n');
}

export async function generateKundli(name, dateStr, timeStr, place, gender, tzOffset=5.5, lat=20.5937, lon=78.9629) {
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
    console.log(`  ${n.padEnd(10)}: H${String(p.house).padEnd(2)} ${p.rashi.padEnd(13)} ${p.degree}° ${p.strength.padEnd(12)} [${p.source}]${p.retrograde?' ℞':''}`)
  );

  const { nakshatra, nakshatraLord, mahadasha } = getDasha(planets.Moon.longitude);
  const doshas         = detectDoshas(planets, lagna.lagnaRashi, lagna.lagnaRashiIdx);
  const fullDoshas     = doshas.filter(d=>d.present&&d.type==='FULL').length;
  const partialDoshas  = doshas.filter(d=>d.present&&d.type==='PARTIAL').length;
  const strongPlanets  = Object.entries(planets).filter(([,p])=>['EXALTED','OWN_SIGN'].includes(p.strength)).map(([n])=>n);
  const weakPlanets    = Object.entries(planets).filter(([,p])=>p.strength==='DEBILITATED').map(([n])=>n);
  const sources        = [...new Set(Object.values(planets).map(p=>p.source))];
  const dataSource     = sources.includes('swisseph')?'swisseph':sources.includes('moshier')?'moshier':'fallback';

  console.log(`✅ Done | src:${dataSource} | Full:${fullDoshas} | Partial:${partialDoshas}`);

  return {
    nativeInfo        : { name, dateOfBirth:dateStr, timeOfBirth:timeStr, placeOfBirth:place, gender, timezoneOffset:tzOffset },
    lagnaRashi        : lagna.lagnaRashi,
    lagnaLord         : lagna.lagnaLord,
    lagnaLon          : lagna.lagnaLon,
    lagnaRashiIdx     : lagna.lagnaRashiIdx,
    planets, nakshatra, nakshatraLord, mahadasha,
    doshas,
    doshaCount        : doshas.filter(d=>d.present).length,
    fullDoshaCount    : fullDoshas,
    partialDoshaCount : partialDoshas,
    strongPlanets, weakPlanets,
    ayanamsa          : +ayanamsa.toFixed(4),
    dataSource,
  };
}