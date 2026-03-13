import sweph from 'sweph';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

let ephePath = path.resolve(__dirname, '../ephe').replace(/\\/g, '/');
if (!ephePath.endsWith('/')) ephePath += '/';

if (fs.existsSync(ephePath)) {
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

const doshas=[];

const lon=n=>planets[n]?.longitude??0
const ri=n=>Math.floor(lon(n)/30)
const deg=n=>planets[n]?.degree??(lon(n)%30)
const arc=(a,b)=>{const d=Math.abs(lon(a)-lon(b))%360;return d>180?360-d:d}
const hf=(name,refIdx)=>((ri(name)-refIdx+12)%12)+1

const moonRashiIdx=ri('Moon')
const venusRashiIdx=ri('Venus')
const rahuRashiIdx=ri('Rahu')
const ketuRashiIdx=ri('Ketu')

const lagnaRashiIdx=lagnaIdx

// ------------------------------------------------
// 1 MANGAL DOSHA
// ------------------------------------------------

{
const MH=[1,2,4,7,8,12]

const fl=MH.includes(hf('Mars',lagnaRashiIdx))
const fm=MH.includes(hf('Mars',moonRashiIdx))
const fv=MH.includes(hf('Mars',venusRashiIdx))

const count=[fl,fm,fv].filter(Boolean).length

if(count>0){

const isFull=count===3

doshas.push({

name:'Mangal Dosha',

present:true,

type:isFull?'FULL':'PARTIAL',

severity:isFull?'HIGH':count===2?'MODERATE':'LOW',

trigger:`Mars from ${count}/3 references`

})

}

}

// ------------------------------------------------
// 2 PITRA DOSHA
// ------------------------------------------------

{
const sunRahu=arc('Sun','Rahu')<12
const sunKetu=arc('Sun','Ketu')<12

const rahu9=hf('Rahu',lagnaRashiIdx)===9
const ketu9=hf('Ketu',lagnaRashiIdx)===9

const isFull=sunRahu||sunKetu
const isPartial=!isFull&&(rahu9||ketu9)

if(isFull||isPartial){

doshas.push({

name:'Pitra Dosha',

present:true,

type:isFull?'FULL':'PARTIAL',

severity:isFull?'HIGH':'MODERATE',

trigger:isFull?'Sun with Rahu/Ketu':'Rahu or Ketu in 9th house'

})

}

}

// ------------------------------------------------
// 3 SHANI SADE SATI
// ------------------------------------------------

{
const satRi=ri('Saturn')
const moonRi=ri('Moon')

const peak=satRi===moonRi
const rising=satRi===(moonRi-1+12)%12
const setting=satRi===(moonRi+1)%12

if(peak||rising||setting){

const phase=peak?'Peak':rising?'Rising':'Setting'

doshas.push({

name:`Shani Sade Sati (${phase})`,

present:true,

type:peak?'FULL':'PARTIAL',

severity:peak?'HIGH':'MODERATE',

trigger:`Saturn relative to Moon sign`

})

}

}

// ------------------------------------------------
// 4 GURU CHANDAL YOGA
// ------------------------------------------------

{
const guruRahu=arc('Jupiter','Rahu')<8
const guruKetu=arc('Jupiter','Ketu')<8

if(guruRahu||guruKetu){

doshas.push({

name:'Guru Chandal Yoga',

present:true,

type:'FULL',

severity:'MODERATE',

trigger:'Jupiter conjunct Rahu/Ketu'

})

}

}

// ------------------------------------------------
// 5 SHAPIT YOGA
// ------------------------------------------------

{
const satRahu=arc('Saturn','Rahu')<8

if(satRahu){

doshas.push({

name:'Shapit Yoga',

present:true,

type:'FULL',

severity:'HIGH',

trigger:'Saturn conjunct Rahu'

})

}

}

// ------------------------------------------------
// 6 GRAHAN DOSHA
// ------------------------------------------------

{
const sunRahu=arc('Sun','Rahu')<8
const sunKetu=arc('Sun','Ketu')<8

if(sunRahu||sunKetu){

doshas.push({

name:'Surya Grahan Dosha',

present:true,

type:'FULL',

severity:'HIGH',

trigger:'Sun conjunct Rahu/Ketu'

})

}

const moonRahu=arc('Moon','Rahu')<8
const moonKetu=arc('Moon','Ketu')<8

if(moonRahu||moonKetu){

doshas.push({

name:'Chandra Grahan Dosha',

present:true,

type:'FULL',

severity:'HIGH',

trigger:'Moon conjunct Rahu/Ketu'

})

}

}

// ------------------------------------------------
// 7 VISH YOGA
// ------------------------------------------------

{
if(ri('Moon')===ri('Saturn')){

doshas.push({

name:'Vish Yoga',

present:true,

type:'FULL',

severity:'MODERATE',

trigger:'Moon with Saturn'

})

}

}

// ------------------------------------------------
// 8 ANGARAK YOGA
// ------------------------------------------------

{
if(arc('Mars','Rahu')<8){

doshas.push({

name:'Angarak Yoga',

present:true,

type:'FULL',

severity:'HIGH',

trigger:'Mars conjunct Rahu'

})

}

}

return doshas

}

export function debugSweph() {
  const jd = sweph.julday(2003, 11, 20, 7.5, SE.SE_GREG_CAL);
  sweph.set_sid_mode(SE.SE_SIDM_LAHIRI, 0, 0);
  try {
    const r = sweph.calc_ut(jd, SE.SE_SUN, SE.SEFLG_SPEED|SE.SEFLG_SIDEREAL|SE.SEFLG_MOSEPH);
  } catch(e) { console.error('calc_ut:', e.message); }
  try {
    const r = sweph.get_ayanamsa_ex_ut(jd, 0);
  } catch(e) { console.log('ayanamsa_ex_ut error:', e.message); }
  try {
    const h = sweph.houses_ex(jd, SE.SEFLG_SIDEREAL, 29.9, 78.0, 'W');
  } catch(e) { console.error('houses_ex:', e.message); }
}

export async function generateKundli(name, dateStr, timeStr, place, gender, tzOffset=5.5, lat=20.5937, lon=78.9629) {


  const jd       = getJulianDay(dateStr, timeStr, tzOffset);
  const ayanamsa = getAyanamsa(jd);

  let planets  = calcPlanets(jd, ayanamsa);
  const lagna  = calcLagna(jd, lat, lon, ayanamsa);

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