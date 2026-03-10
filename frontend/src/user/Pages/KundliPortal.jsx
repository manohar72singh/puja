import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${API_BASE_URL}/kundli/generate`;

const PLANET_SYMBOLS = {
  Sun:"☀️", Moon:"🌙", Mars:"♂️", Mercury:"☿",
  Jupiter:"♃", Venus:"♀", Saturn:"♄", Rahu:"☊", Ketu:"☋"
};
const SHORT = {
  Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me',
  Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke'
};
const PLANET_COLOR = {
  EXALTED:'#4ade80', OWN_SIGN:'#60a5fa', DEBILITATED:'#f87171', NEUTRAL:'#fcd34d'
};
const STRENGTH_CLS = {
  EXALTED:'text-green-400 font-bold', OWN_SIGN:'text-blue-400 font-semibold',
  DEBILITATED:'text-red-400 font-semibold', NEUTRAL:'text-amber-100/50'
};

// Severity border/bg colors
const SEVERITY_CLS = {
  HIGH     : 'bg-red-900/40 border-red-500 text-red-300',
  MODERATE : 'bg-amber-900/40 border-amber-500 text-amber-300',
  LOW      : 'bg-blue-900/40 border-blue-600/70 text-blue-300',
  CANCELLED: 'bg-gray-900/40 border-gray-600 text-gray-400',
};

// Full / Partial / Cancelled type badge
const TYPE_BADGE = {
  FULL     : { cls:'bg-red-800/70 text-red-200 border border-red-500/60',        icon:'🔴', label:'FULL'      },
  PARTIAL  : { cls:'bg-yellow-800/50 text-yellow-200 border border-yellow-500/60', icon:'🟡', label:'PARTIAL'  },
  CANCELLED: { cls:'bg-gray-800/60 text-gray-300 border border-gray-500/50',      icon:'✅', label:'CANCELLED' },
};

const RASHIS_LIST = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];
const HINDI_HOUSES = {
  1:'लग्न',2:'धन',3:'भाई',4:'सुख',5:'पुत्र',6:'रिपु',
  7:'जाया',8:'मृत्यु',9:'भाग्य',10:'कर्म',11:'लाभ',12:'व्यय'
};

// ── North Indian Kundli Chart ─────────────────────────────────
function KundliChart({ planets, lagnaRashi }) {
  const housePlanets = useMemo(() => {
    const m = {};
    for (let h = 1; h <= 12; h++) m[h] = [];
    Object.entries(planets).forEach(([name, p]) => {
      if (p.house >= 1 && p.house <= 12) m[p.house].push({ name, ...p });
    });
    return m;
  }, [planets]);

  const lagnaIdx = Math.max(0, RASHIS_LIST.indexOf(lagnaRashi));
  const getRashiNum = (h) => ((lagnaIdx + h - 1) % 12) + 1;
  const S = 500, M = 250;

  const getHouseLayout = (h) => {
    const layout = {
      1 : { rx: M,       ry: M - 70,  px: M,           py: M - 25       },
      4 : { rx: M - 70,  ry: M + 5,   px: M/2 - 15,    py: M + 10       },
      7 : { rx: M,       ry: M + 85,  px: M,           py: M + 45       },
      10: { rx: M + 70,  ry: M + 5,   px: (3*M)/2+15,  py: M + 10       },
      2 : { rx: M - 110, ry: 40,      px: M/2,         py: 35           },
      3 : { rx: 30,      ry: M - 140, px: 80,          py: M/2 - 5      },
      5 : { rx: 20,      ry: M + 140, px: 80,          py: (3*S)/4 + 5  },
      6 : { rx: M - 120, ry: S - 35,  px: M/2 + 10,    py: S - 80       },
      8 : { rx: M + 140, ry: S - 35,  px: (3*S)/4 - 10,py: S - 80       },
      9 : { rx: S - 40,  ry: M + 140, px: S - 85,      py: (3*S)/4 + 5  },
      11: { rx: S - 40,  ry: M - 140, px: S - 85,      py: M/2 - 5      },
      12: { rx: M + 140, ry: 40,      px: (3*S)/4 - 10,py: 90           },
    };
    return layout[h];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <p className="text-amber-400 font-bold text-xl tracking-widest uppercase">Lagna Chart</p>
        <p className="text-amber-600/50 text-xs">Vedic North Indian Style</p>
      </div>
      <div className="relative w-full max-w-[500px] aspect-square">
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-full shadow-2xl rounded-lg"
          style={{ background:'#0a0500', border:'3px solid #92400e' }}>
          <rect x="0" y="0" width={S} height={S} fill="none" stroke="#92400e" strokeWidth="3"/>
          <line x1="0" y1="0" x2={S} y2={S} stroke="#92400e" strokeWidth="2"/>
          <line x1={S} y1="0" x2="0" y2={S} stroke="#92400e" strokeWidth="2"/>
          <line x1={M} y1="0" x2="0" y2={M} stroke="#92400e" strokeWidth="2"/>
          <line x1="0" y1={M} x2={M} y2={S} stroke="#92400e" strokeWidth="2"/>
          <line x1={M} y1={S} x2={S} y2={M} stroke="#92400e" strokeWidth="2"/>
          <line x1={S} y1={M} x2={M} y2="0" stroke="#92400e" strokeWidth="2"/>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => {
            const { rx, ry, px, py } = getHouseLayout(h);
            const rashiNum = getRashiNum(h);
            const plist = housePlanets[h] || [];
            return (
              <g key={h}>
                <text x={rx} y={ry} textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold" fontFamily="serif">
                  {rashiNum}
                </text>
                {plist.map((p, i) => (
                  <text key={i} x={px} y={py + (i * 20)} textAnchor="middle"
                    fill={PLANET_COLOR[p.strength] || PLANET_COLOR.NEUTRAL}
                    fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    {SHORT[p.name] || p.name.slice(0,2)}{p.retrograde ? '℞' : ''}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ── Analysis Text Renderer ────────────────────────────────────
function AnalysisText({ text }) {
  if (!text?.trim()) return (
    <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-red-300 text-sm">
      ⚠️ Analysis not available — see Raw tab.
    </div>
  );
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {text.split('\n').map((raw, i) => {
        const l = raw.trim();
        if (!l) return <div key={i} className="h-2"/>;
        if (l.startsWith('## '))  return <h2 key={i} className="text-amber-300 font-bold text-lg mt-5 mb-2 border-b border-amber-700/40 pb-1">{l.slice(3)}</h2>;
        if (l.startsWith('### ')) return <h3 key={i} className="text-amber-400 font-semibold text-base mt-4 mb-1">{l.slice(4)}</h3>;
        if (l.startsWith('#### '))return <h4 key={i} className="text-amber-500 font-medium mt-3">{l.slice(5)}</h4>;
        if (/^[-*•]/.test(l)) return (
          <div key={i} className="flex items-start gap-2 ml-4 my-1">
            <span className="text-amber-500 mt-0.5 shrink-0 text-xs">◆</span>
            <span className="text-amber-100/80">{l.replace(/^[-*•]\s+/,'')}</span>
          </div>
        );
        if (/^\d+\./.test(l)) {
          const num=l.match(/^(\d+)/)[1], rest=l.replace(/^\d+\.\s*/,'');
          return (
            <div key={i} className="flex items-start gap-3 ml-4 my-1">
              <span className="bg-amber-700/40 text-amber-300 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 font-bold">{num}</span>
              <span className="text-amber-100/80">{rest}</span>
            </div>
          );
        }
        if (l==='---') return <hr key={i} className="border-amber-800/40 my-3"/>;
        const color = l.includes('GOOD')?'text-green-400':l.includes('CHALLENGING')?'text-red-400':l.includes('MIXED')?'text-amber-400':'';
        return <p key={i} className={`my-1 ${color||'text-amber-100/75'}`}>{l}</p>;
      })}
    </div>
  );
}

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("hours"); // "hours" | "minutes"
  const [ampm, setAmpm] = useState("AM");
  const [hrs, setHrs] = useState(12);
  const [mins, setMins] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":").map(Number);
    setAmpm(h >= 12 ? "PM" : "AM");
    setHrs(h === 0 ? 12 : h > 12 ? h - 12 : h);
    setMins(m);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const emit = (h, m, ap) => {
    let hr24 = h;
    if (ap === "AM" && hr24 === 12) hr24 = 0;
    if (ap === "PM" && hr24 !== 12) hr24 += 12;
    onChange(String(hr24).padStart(2, "0") + ":" + String(m).padStart(2, "0"));
  };

  const SIZE = 220;
  const CENTER = SIZE / 2;
  const HOUR_R = 80;
  const MIN_R = 80;

  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const minNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const getPos = (index, total, radius) => {
    const angle = ((index / total) * 2 * Math.PI) - Math.PI / 2;
    return {
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
    };
  };

  const getHandAngle = () => {
    if (mode === "hours") return ((hrs % 12) / 12) * 360 - 90;
    return (mins / 60) * 360 - 90;
  };

  const handAngle = getHandAngle();
  const handLength = mode === "hours" ? HOUR_R - 14 : MIN_R - 14;
  const handRad = (handAngle * Math.PI) / 180;
  const handX = CENTER + handLength * Math.cos(handRad);
  const handY = CENTER + handLength * Math.sin(handRad);

  const handleClockClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - CENTER;
    const y = e.clientY - rect.top - CENTER;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    const normalized = ((angle % 360) + 360) % 360;

    if (mode === "hours") {
      const h = Math.round(normalized / 30) % 12 || 12;
      setHrs(h);
      emit(h, mins, ampm);
      setTimeout(() => setMode("minutes"), 200);
    } else {
      const m = Math.round(normalized / 6) % 60;
      setMins(m);
      emit(hrs, m, ampm);
      setOpen(false);
      setMode("hours");
    }
  };

  const hh = String(hrs).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const display = value ? `${hh}:${mm} ${ampm}` : "Select time...";

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setMode("hours"); }}
        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-left flex items-center justify-between transition-colors
          ${open ? "border-amber-500" : "border-amber-800/40 hover:border-amber-600/50"}
          ${value ? "text-amber-100" : "text-amber-800"}`}
      >
        <span className="flex items-center gap-2 text-sm">
          <span className="text-amber-600">🕐</span>{display}
        </span>
        <span className="text-amber-700/50 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-amber-950 border border-amber-700/50 rounded-2xl shadow-2xl overflow-hidden">

          {/* Time Display + AM/PM */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-baseline gap-1">
              <button
                type="button"
                onClick={() => setMode("hours")}
                className={`text-3xl font-bold tabular-nums transition-colors ${mode === "hours" ? "text-amber-300" : "text-amber-700 hover:text-amber-500"}`}
              >
                {hh}
              </button>
              <span className="text-amber-600 text-2xl font-bold">:</span>
              <button
                type="button"
                onClick={() => setMode("minutes")}
                className={`text-3xl font-bold tabular-nums transition-colors ${mode === "minutes" ? "text-amber-300" : "text-amber-700 hover:text-amber-500"}`}
              >
                {mm}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {["AM", "PM"].map((ap) => (
                <button
                  key={ap}
                  type="button"
                  onClick={() => { setAmpm(ap); emit(hrs, mins, ap); }}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all
                    ${ampm === ap ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-800/40"}`}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Label */}
          <p className="text-center text-amber-700/50 text-xs uppercase tracking-widest mb-1">
            {mode === "hours" ? "Select Hour" : "Select Minute"}
          </p>

          {/* Clock Face */}
          <div className="flex justify-center pb-3">
            <svg
              width={SIZE}
              height={SIZE}
              onClick={handleClockClick}
              className="cursor-pointer"
              style={{ userSelect: "none" }}
            >
              {/* Clock background */}
              <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="rgba(0,0,0,0.4)" stroke="rgba(180,120,30,0.2)" strokeWidth="1.5" />

              {/* Tick marks */}
              {Array.from({ length: 60 }, (_, i) => {
                const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
                const isMajor = i % 5 === 0;
                const r1 = CENTER - 8;
                const r2 = isMajor ? CENTER - 16 : CENTER - 12;
                return (
                  <line
                    key={i}
                    x1={CENTER + r1 * Math.cos(angle)}
                    y1={CENTER + r1 * Math.sin(angle)}
                    x2={CENTER + r2 * Math.cos(angle)}
                    y2={CENTER + r2 * Math.sin(angle)}
                    stroke={isMajor ? "rgba(180,120,30,0.5)" : "rgba(180,120,30,0.2)"}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}

              {/* Hand */}
              <line
                x1={CENTER} y1={CENTER}
                x2={handX} y2={handY}
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Hand circle at tip */}
              <circle cx={handX} cy={handY} r="6" fill="#d97706" />
              {/* Center dot */}
              <circle cx={CENTER} cy={CENTER} r="4" fill="#d97706" />

              {/* Hour Numbers */}
              {mode === "hours" && hourNumbers.map((n, i) => {
                const pos = getPos(i + 1, 12, HOUR_R);
                const isSelected = hrs === n;
                return (
                  <g key={n}>
                    {isSelected && <circle cx={pos.x} cy={pos.y} r="14" fill="rgba(217,119,6,0.3)" />}
                    <text
                      x={pos.x} y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="13"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fill={isSelected ? "#fde68a" : "rgba(251,191,36,0.7)"}
                      style={{ pointerEvents: "none" }}
                    >
                      {n}
                    </text>
                  </g>
                );
              })}

              {/* Minute Numbers */}
              {mode === "minutes" && minNumbers.map((n, i) => {
                const pos = getPos(i, 12, MIN_R);
                const isSelected = mins === n;
                return (
                  <g key={n}>
                    {isSelected && <circle cx={pos.x} cy={pos.y} r="14" fill="rgba(217,119,6,0.3)" />}
                    <text
                      x={pos.x} y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fill={isSelected ? "#fde68a" : "rgba(251,191,36,0.7)"}
                      style={{ pointerEvents: "none" }}
                    >
                      {String(n).padStart(2, "0")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Presets */}
          <div className="border-t border-amber-800/30 p-2">
            <p className="text-amber-700/40 text-xs mb-1.5 uppercase tracking-wider px-1">Quick</p>
            <div className="flex flex-wrap gap-1">
              {[
                { l: "Midnight", h: 12, m: 0, ap: "AM" },
                { l: "Sunrise",  h: 6,  m: 0, ap: "AM" },
                { l: "Noon",     h: 12, m: 0, ap: "PM" },
                { l: "Sunset",   h: 6,  m: 0, ap: "PM" },
              ].map((q) => (
                <button
                  key={q.l}
                  type="button"
                  onClick={() => { setHrs(q.h); setMins(q.m); setAmpm(q.ap); emit(q.h, q.m, q.ap); setOpen(false); setMode("hours"); }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-900/40 text-amber-400 hover:bg-amber-700/40 border border-amber-800/30"
                >
                  {q.l}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Location Search ───────────────────────────────────────────
function LocationSearch({ value, onChange, onSelect }) {
  const [query,   setQuery]   = useState(value||'');
  const [sugs,    setSugs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [picked,  setPicked]  = useState(false);
  const [err,     setErr]     = useState('');
  const debRef = useRef(null);

  const guessTimezone = lon => {
    if (lon>=68&&lon<=97)   return 5.5;
    if (lon>=-8&&lon<=2)    return 0;
    if (lon>=-80&&lon<=-66) return -5;
    if (lon>=-125&&lon<=-115) return -8;
    return Math.round(lon/15*2)/2;
  };

  const search = useCallback(async q => {
    if (q.length<3) { setSugs([]); return; }
    setLoading(true); setErr('');
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
        { headers:{'Accept-Language':'en'} }
      );
      setSugs(await r.json());
    } catch { setErr('Location search failed. Enter city manually.'); }
    finally { setLoading(false); }
  }, []);

  const handleInput = e => {
    const v = e.target.value;
    setQuery(v); setPicked(false);
    onChange(v, null, null, null);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(()=>search(v), 500);
  };

  const handleSelect = p => {
    const lat=parseFloat(p.lat), lon=parseFloat(p.lon);
    const tz=guessTimezone(lon);
    const display=p.display_name.split(',').slice(0,3).join(', ');
    setQuery(display); setSugs([]); setPicked(true);
    onSelect(display, lat, lon, tz);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input value={query} onChange={handleInput}
          placeholder="Type city... e.g. Mumbai, Delhi, London"
          className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-amber-100 placeholder-amber-800
            focus:outline-none transition-colors text-sm pr-10
            ${picked?'border-green-500/60':'border-amber-800/40 focus:border-amber-500'}`}/>
        <div className="absolute right-3 top-3">
          {loading && <span className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"/>}
          {picked && !loading && <span className="text-green-400 text-lg">✓</span>}
        </div>
      </div>
      {sugs.length>0 && !picked && (
        <div className="absolute z-50 w-full mt-1 bg-amber-950 border border-amber-700/50 rounded-xl overflow-hidden shadow-2xl">
          {sugs.map((p,i)=>{
            const parts=p.display_name.split(',');
            return (
              <button key={i} onClick={()=>handleSelect(p)}
                className="w-full text-left px-4 py-3 hover:bg-amber-800/30 transition-colors border-b border-amber-900/40 last:border-0">
                <p className="text-amber-200 text-sm font-medium">📍 {parts.slice(0,2).join(',').trim()}</p>
                <div className="flex justify-between mt-0.5">
                  <p className="text-amber-500/60 text-xs">{parts.slice(2,4).join(',').trim()}</p>
                  <p className="text-amber-700/50 text-xs">Lat:{parseFloat(p.lat).toFixed(2)} Lon:{parseFloat(p.lon).toFixed(2)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
      {picked && <p className="text-green-400/70 text-xs mt-1">✅ Coordinates captured — accurate Lagna guaranteed</p>}
      {!picked && query.length>2 && <p className="text-amber-600/60 text-xs mt-1">⚠️ Select from dropdown for accurate Lagna</p>}
    </div>
  );
}

// ── Dosha Card — Full / Partial / Cancelled ───────────────────
function DoshaCard({ d }) {
  const [open, setOpen] = useState(false);
  const typeBadge   = TYPE_BADGE[d.type]  || TYPE_BADGE.FULL;
  const severityCls = SEVERITY_CLS[d.severity] || SEVERITY_CLS.LOW;

  return (
    <div className={`border rounded-xl p-4 cursor-pointer transition-all ${severityCls}`}
      onClick={()=>setOpen(o=>!o)}>

      {/* ── Header Row ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Type Badge */}
          <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${typeBadge.cls}`}>
            {typeBadge.icon} {typeBadge.label}
          </span>
          {/* Name + trigger */}
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base leading-tight">{d.name}</p>
            <p className="text-xs opacity-60 mt-0.5 truncate">{d.trigger}</p>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-xs font-bold px-2 py-0.5 rounded-full border border-current opacity-60">
            {d.severity}
          </span>
          <span className="text-sm">{open?'▲':'▼'}</span>
        </div>
      </div>

      {/* ── Partial Note Banner ── */}
      {d.partialNote && (
        <div className="mt-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-600/40 rounded-lg">
          <p className="text-xs text-yellow-300 font-medium">⚡ {d.partialNote}</p>
        </div>
      )}

      {/* ── Expanded Details ── */}
      {open && (
        <div className="mt-4 space-y-3 border-t border-current/20 pt-4">
          {d.cancellations?.length > 0 && (
            <div className="bg-green-900/30 rounded-lg p-2">
              <p className="text-xs font-bold text-green-400 mb-1">✅ Cancellations / Reductions:</p>
              {d.cancellations.map((c,i) => <p key={i} className="text-xs text-green-300">• {c}</p>)}
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Impact</p>
            <p className="text-sm">{d.impact}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">📖 Reference</p>
            <p className="text-xs italic opacity-70">{d.classicRef}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">🙏 Remedies</p>
            {(d.remedy||[]).map((r,i) => (
              <div key={i} className="flex items-start gap-2 text-sm mb-1">
                <span className="opacity-50 shrink-0">•</span><span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-black/40 p-1 rounded-xl overflow-x-auto">
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)}
          className={`shrink-0 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap
            ${active===t.id?'bg-amber-600 text-white shadow-lg':'text-amber-400/60 hover:text-amber-300 hover:bg-amber-900/30'}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function KundliPortal() {
  const [form, setForm] = useState({
    name:'', dateOfBirth:'', timeOfBirth:'', placeOfBirth:'',
    gender:'Male', latitude:null, longitude:null, timezoneOffset:5.5
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [tab,     setTab]     = useState('planets');
  const resultRef = useRef(null);

  const setF = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const generate = async () => {
    setError(''); setResult(null);
    if (!form.name||!form.dateOfBirth||!form.timeOfBirth||!form.placeOfBirth)
      return setError('Please fill all fields.');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name          : form.name,
          dateOfBirth   : form.dateOfBirth,
          timeOfBirth   : form.timeOfBirth,
          placeOfBirth  : form.placeOfBirth,
          gender        : form.gender,
          latitude      : form.latitude  || 20.5937,
          longitude     : form.longitude || 78.9629,
          timezoneOffset: form.timezoneOffset || 5.5,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data); setTab('planets');
      setTimeout(()=>resultRef.current?.scrollIntoView({behavior:'smooth'}), 200);
    } catch(e) {
      setError(e.message || 'Server error. Check backend is running on port 5000.');
    } finally { setLoading(false); }
  };

  const TABS = [
    {id:'planets', label:'🪐 Planets'},
    {id:'doshas',  label:'⚠️ Doshas'},
    {id:'optionA', label:'📜 Option A'},
    {id:'optionB', label:'📐 Option B'},
    {id:'verdict', label:'✅ Verdict'},
    {id:'raw',     label:'🔍 Raw'},
  ];

  const SOURCE_BADGE = {
    swisseph: {cl:'bg-green-900/40 text-green-300 border-green-700/40', ic:'🌌', t:'Swiss Ephemeris — 0.001 arcsec accuracy'},
    moshier : {cl:'bg-blue-900/40 text-blue-300 border-blue-700/40',   ic:'🔭', t:'Swiss Ephemeris Moshier — ~1 arcsec'},
    mixed   : {cl:'bg-amber-900/40 text-amber-300 border-amber-700/40',ic:'⚡', t:'Swiss Ephe + Math fallback (mixed)'},
    fallback: {cl:'bg-gray-900/40 text-gray-300 border-gray-700/40',   ic:'📐', t:'Mathematical VSOP87 fallback'},
  };

  return (
    <div className="min-h-screen text-white"
      style={{background:'radial-gradient(ellipse at 15% 10%, #3d1500 0%, #1a0800 50%, #080400 100%)'}}>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(80)].map((_,i)=>(
          <div key={i} className="absolute rounded-full bg-amber-100"
            style={{width:`${Math.random()*2+1}px`,height:`${Math.random()*2+1}px`,
              top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,
              opacity:Math.random()*0.35+0.05}}/>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🛕</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2"
            style={{background:'linear-gradient(135deg,#fcd34d,#f59e0b,#d97706)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Kundli Nirman
          </h1>
          <p className="text-amber-500/60 text-sm tracking-widest uppercase mt-1">
            Vedic Birth Chart · Swiss Ephemeris · AI Dual Analysis
          </p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {['🌌 Swiss Ephemeris','📿 Lahiri Ayanamsa','🏠 Whole Sign Houses','🤖 Groq AI'].map(t=>(
              <span key={t} className="text-xs bg-amber-900/30 border border-amber-800/40 text-amber-500/70 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-amber-950/25 border border-amber-800/30 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <h2 className="text-amber-300 font-semibold text-lg mb-5">📋 Birth Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-amber-400/70 text-xs uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input name="name" value={form.name} onChange={setF}
                placeholder="e.g. Ramesh Kumar Sharma"
                className="w-full bg-black/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500 transition-colors text-sm"/>
            </div>
            <div>
              <label className="text-amber-400/70 text-xs uppercase tracking-wider mb-1.5 block">Gender</label>
              <select name="gender" value={form.gender} onChange={setF}
                className="w-full bg-black/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 text-sm">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-amber-400/70 text-xs uppercase tracking-wider mb-1.5 block">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={setF}
                className="w-full bg-black/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"/>
            </div>
            <div>
              <label className="text-amber-400/70 text-xs uppercase tracking-wider mb-1.5 block">
                Time of Birth
                {form.timeOfBirth && <span className="ml-2 text-green-400/60 normal-case text-xs">✓ {form.timeOfBirth}</span>}
              </label>
              <TimePicker value={form.timeOfBirth} onChange={v=>setForm(f=>({...f,timeOfBirth:v}))}/>
            </div>
            <div className="md:col-span-2">
              <label className="text-amber-400/70 text-xs uppercase tracking-wider mb-1.5 block">
                Place of Birth
                {form.latitude && <span className="ml-2 text-green-400/70 normal-case text-xs">
                  📍 {form.latitude?.toFixed(3)}, {form.longitude?.toFixed(3)} TZ:+{form.timezoneOffset}
                </span>}
              </label>
              <LocationSearch
                value={form.placeOfBirth}
                onChange={v=>setForm(f=>({...f,placeOfBirth:v}))}
                onSelect={(d,lat,lon,tz)=>setForm(f=>({...f,placeOfBirth:d,latitude:lat,longitude:lon,timezoneOffset:tz}))}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button onClick={generate} disabled={loading}
            className="mt-6 w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#d97706,#b45309,#92400e)',
              boxShadow:loading?'none':'0 0 30px rgba(217,119,6,0.35)'}}>
            {loading
              ? <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full"/>
                  Swiss Ephemeris calculating + AI analyzing…
                </span>
              : '🛕 Generate Kundli (Swiss Ephemeris + AI)'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-5">

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-amber-900/35 to-amber-800/15 border border-amber-700/35 rounded-2xl p-5 md:p-6">
              <h2 className="text-amber-300 font-bold text-lg mb-4">
                📊 Kundli — {result.kundli.nativeInfo.name}
              </h2>

              {(() => {
                const s = SOURCE_BADGE[result.kundli.dataSource] || SOURCE_BADGE.fallback;
                return (
                  <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-4 border ${s.cl}`}>
                    {s.ic} {s.t}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  {l:'Lagna',     v:result.kundli.lagnaRashi},
                  {l:'Moon Sign', v:result.kundli.planets.Moon.rashi},
                  {l:'Nakshatra', v:result.kundli.nakshatra},
                  {l:'Mahadasha', v:`${result.kundli.mahadasha.planet} (${result.kundli.mahadasha.yearsRemaining} yrs)`},
                ].map(({l,v})=>(
                  <div key={l} className="bg-black/25 rounded-xl p-3 text-center">
                    <p className="text-amber-600/70 text-xs uppercase tracking-wider mb-1">{l}</p>
                    <p className="text-amber-200 font-semibold text-sm">{v}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {result.kundli.strongPlanets?.length > 0 && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3">
                    <p className="text-green-400 text-xs font-bold uppercase mb-1">⬆ Strong</p>
                    <p className="text-green-300 text-sm">{result.kundli.strongPlanets.join(', ')}</p>
                  </div>
                )}
                {result.kundli.weakPlanets?.length > 0 && (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                    <p className="text-red-400 text-xs font-bold uppercase mb-1">⬇ Weak</p>
                    <p className="text-red-300 text-sm">{result.kundli.weakPlanets.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-amber-600/60 bg-black/20 rounded-xl p-3">
                <span>📍 {result.kundli.nativeInfo.placeOfBirth}</span>
                <span>🌐 Ayanamsa: {result.kundli.ayanamsa}°</span>
                <span>⏱ TZ: UTC+{result.kundli.nativeInfo.timezoneOffset}</span>
                {/* Updated dosha count — shows Full + Partial separately */}
                <span>🔴 Full: {result.kundli.fullDoshaCount ?? result.kundli.doshas?.filter(d=>d.type==='FULL'&&d.present).length ?? 0}</span>
                <span>🟡 Partial: {result.kundli.partialDoshaCount ?? result.kundli.doshas?.filter(d=>d.type==='PARTIAL'&&d.present).length ?? 0}</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-amber-950/25 border border-amber-800/30 rounded-2xl p-5 md:p-6 shadow-xl">
              <TabBar tabs={TABS} active={tab} onChange={setTab}/>

              <div className="mt-6">

                {/* ── Planets Tab ── */}
                {tab === 'planets' && (
                  <div className="space-y-6">
                    <KundliChart planets={result.kundli.planets} lagnaRashi={result.kundli.lagnaRashi}/>
                    <div>
                      <h3 className="text-amber-300 font-semibold mb-3">🪐 Planetary Positions</h3>
                      <div className="overflow-x-auto rounded-xl border border-amber-800/40">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-amber-900/40 text-amber-400 text-xs uppercase tracking-widest">
                              <th className="px-4 py-3 text-left">Planet</th>
                              <th className="px-4 py-3 text-left">Rashi</th>
                              <th className="px-4 py-3 text-left">Degree</th>
                              <th className="px-4 py-3 text-left">House</th>
                              <th className="px-4 py-3 text-left">Strength</th>
                              <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(result.kundli.planets).map(([name,p],i)=>(
                              <tr key={name} className={`border-t border-amber-900/30 hover:bg-amber-800/10 ${i%2===0?'bg-black/10':''}`}>
                                <td className="px-4 py-2.5 font-medium text-amber-200">
                                  <span className="mr-2">{PLANET_SYMBOLS[name]||'⭐'}</span>{name}
                                </td>
                                <td className="px-4 py-2.5 text-amber-100/80">{p.rashi}</td>
                                <td className="px-4 py-2.5 text-amber-100/80">{p.degree}°</td>
                                <td className="px-4 py-2.5 text-amber-100/80">H{p.house}</td>
                                <td className={`px-4 py-2.5 text-xs ${STRENGTH_CLS[p.strength]||STRENGTH_CLS.NEUTRAL}`}>
                                  {p.strength==='EXALTED'?'⬆ Exalted':p.strength==='OWN_SIGN'?'🏠 Own':p.strength==='DEBILITATED'?'⬇ Debil':'— Neutral'}
                                </td>
                                <td className="px-4 py-2.5 text-xs text-amber-700/60">
                                  {p.retrograde && <span className="text-orange-400">℞ Retro</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Doshas Tab — Full / Partial / Cancelled sections ── */}
                {tab === 'doshas' && (
                  <div>
                    {/* Summary bar */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <h3 className="text-amber-300 font-semibold text-base mr-auto">⚠️ Dosha Analysis</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-900/50 border border-red-600/60 text-red-300 font-bold">
                        🔴 Full: {result.kundli.doshas.filter(d=>d.present&&d.type==='FULL').length}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-900/50 border border-yellow-600/60 text-yellow-300 font-bold">
                        🟡 Partial: {result.kundli.doshas.filter(d=>d.present&&d.type==='PARTIAL').length}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-600/60 text-gray-400 font-bold">
                        ✅ Cancelled: {result.kundli.doshas.filter(d=>d.type==='CANCELLED').length}
                      </span>
                    </div>

                    {result.kundli.doshas.length === 0 ? (
                      <div className="bg-green-900/25 border border-green-700/40 rounded-xl p-6 text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-green-300 font-semibold">No Doshas Detected</p>
                        <p className="text-green-500/60 text-sm mt-1">Kundli is free from major afflictions</p>
                      </div>
                    ) : (
                      <div className="space-y-5">

                        {/* Full Doshas */}
                        {result.kundli.doshas.filter(d=>d.present&&d.type==='FULL').length > 0 && (
                          <div>
                            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>
                              Full Doshas — Primary Afflictions
                            </p>
                            <div className="space-y-3">
                              {result.kundli.doshas
                                .filter(d=>d.present&&d.type==='FULL')
                                .map((d,i)=><DoshaCard key={i} d={d}/>)}
                            </div>
                          </div>
                        )}

                        {/* Partial Doshas */}
                        {result.kundli.doshas.filter(d=>d.present&&d.type==='PARTIAL').length > 0 && (
                          <div>
                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"/>
                              Partial Doshas — Mild Influence
                            </p>
                            <div className="space-y-3">
                              {result.kundli.doshas
                                .filter(d=>d.present&&d.type==='PARTIAL')
                                .map((d,i)=><DoshaCard key={i} d={d}/>)}
                            </div>
                          </div>
                        )}

                        {/* Cancelled Doshas */}
                        {result.kundli.doshas.filter(d=>d.type==='CANCELLED').length > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gray-500 inline-block"/>
                              Cancelled Doshas — Neutralised
                            </p>
                            <div className="space-y-3">
                              {result.kundli.doshas
                                .filter(d=>d.type==='CANCELLED')
                                .map((d,i)=><DoshaCard key={i} d={d}/>)}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

                {/* ── Option A Tab ── */}
                {tab === 'optionA' && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white">A</div>
                      <h3 className="text-amber-300 font-semibold">Parashari System — BPHS / North Indian</h3>
                    </div>
                    <div className="bg-black/20 rounded-xl p-5 border border-amber-900/30">
                      <AnalysisText text={result.analysis?.optionA}/>
                    </div>
                  </div>
                )}

                {/* ── Option B Tab ── */}
                {tab === 'optionB' && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white">B</div>
                      <h3 className="text-amber-300 font-semibold">KP / Jaimini System — South Indian</h3>
                    </div>
                    <div className="bg-black/20 rounded-xl p-5 border border-orange-900/30">
                      <AnalysisText text={result.analysis?.optionB}/>
                    </div>
                  </div>
                )}

                {/* ── Verdict Tab ── */}
                {tab === 'verdict' && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-3xl">✅</span>
                      <h3 className="text-amber-300 font-semibold">Final Cross-Verified Verdict</h3>
                    </div>
                    <div className="bg-gradient-to-br from-amber-950/40 to-black/40 border border-amber-700/30 rounded-xl p-5">
                      <AnalysisText text={result.analysis?.finalVerdict}/>
                    </div>
                    <p className="text-amber-800/50 text-xs text-right mt-3">
                      {result.meta?.model} · {result.meta?.tokensUsed} tokens
                    </p>
                  </div>
                )}

                {/* ── Raw Tab ── */}
                {tab === 'raw' && (
                  <div>
                    <h3 className="text-amber-300 font-semibold mb-3">🔍 Raw AI Response</h3>
                    <pre className="bg-black/40 border border-amber-900/30 rounded-xl p-4 text-xs text-amber-200/60 whitespace-pre-wrap overflow-auto max-h-[600px]">
                      {result.rawAnalysis}
                    </pre>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-14 text-amber-900/50 text-xs space-y-1">
          <p>🔭 Swiss Ephemeris • 📿 Lahiri Ayanamsa • 🏠 Whole Sign • 🤖 Groq AI LLaMA 3.3</p>
          <p>For important decisions, consult a qualified Jyotishi.</p>
        </div>
      </div>
    </div>
  );
}