import React,
 { useState, useRef, useEffect, useCallback, useMemo } from "react";

const API_URL = "http://localhost:5000/api/kundli/generate";

// ── Planet display data ───────────────────────────────────────
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
const SEVERITY_CLS = {
  HIGH:'bg-red-900/40 border-red-500 text-red-300',
  MODERATE:'bg-amber-900/40 border-amber-500 text-amber-300',
  LOW:'bg-green-900/40 border-green-500 text-green-300',
  CANCELLED:'bg-gray-900/40 border-gray-500 text-gray-400',
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
// function KundliChart({ planets, lagnaRashi }) {
//   const housePlanets = useMemo(() => {
//     const m = {};
//     for (let h=1;h<=12;h++) m[h]=[];
//     Object.entries(planets).forEach(([name,p]) => {
//       if (p.house>=1 && p.house<=12) m[p.house].push({ name, ...p });
//     });
//     return m;
//   }, [planets]);

//   const lagnaIdx  = Math.max(0, RASHIS_LIST.indexOf(lagnaRashi));
//   const hRashi    = h => RASHIS_LIST[(lagnaIdx + h - 1) % 12];

//   const S=500, M=250, IH=90;
//   const IL=M-IH, IR=M+IH, IT=M-IH, IB=M+IH;
//   const poly = (...pts) => pts.map(p=>p.join(',')).join(' ');

//   // All corner/side/inner points
//   const TL=[0,0],TM=[M,0],TR=[S,0];
//   const LM=[0,M],RM=[S,M];
//   const BL=[0,S],BM=[M,S],BR=[S,S];
//   const ITL=[IL,IT],ITR=[IR,IT],IBL=[IL,IB],IBR=[IR,IB],C=[M,M];

//   // House definitions: polygon points + label center
//   const HOUSES = {
//     2 :{pts:poly(TM,TR,RM,ITR), tx:M+90, ty:42,    t:'corner'},
//     3 :{pts:poly(RM,ITR,IBR),   tx:S-44, ty:M,     t:'side'  },
//     4 :{pts:poly(RM,BR,BM,IBR), tx:M+90, ty:S-42,  t:'corner'},
//     5 :{pts:poly(BM,IBR,IBL),   tx:M,    ty:IB+28, t:'side'  },
//     6 :{pts:poly(BM,BL,LM,IBL), tx:M-90, ty:S-42,  t:'corner'},
//     7 :{pts:poly(LM,IBL,ITL),   tx:44,   ty:M,     t:'side'  },
//     8 :{pts:poly(LM,TL,TM,ITL), tx:M-90, ty:42,    t:'corner'},
//     9 :{pts:poly(ITR,IBR,C),    tx:IR+30,ty:M,     t:'inner' },
//     10:{pts:poly(IBL,IBR,C),    tx:M,    ty:IB+30, t:'inner' },
//     11:{pts:poly(ITL,IBL,C),    tx:IL-30,ty:M,     t:'inner' },
//     12:{pts:poly(ITL,ITR,C),    tx:M,    ty:IT-30, t:'inner' },
//   };

//   const renderHouse = (h) => {
//     const def  = HOUSES[h]; if (!def) return null;
//     const plist = housePlanets[h] || [];
//     const { tx, ty, t } = def;
//     const inner = t==='inner', side=t==='side';
//     const fsH=inner?8:9.5, fsR=inner?6.5:7.5, fsP=inner?11:12.5;

//     // Label Y — center minus half label block
//     const labelY = ty - (plist.length>0 ? 22 : 12);

//     return (
//       <g key={h}>
//         <polygon points={def.pts} fill="transparent" stroke="#92400e" strokeWidth="1.2"/>
//         <text x={tx} y={labelY}    textAnchor="middle" fill="#a16207" fontSize={fsH} fontWeight="bold" fontFamily="serif">{h}</text>
//         <text x={tx} y={labelY+10} textAnchor="middle" fill="#78350f" fontSize={fsR} fontFamily="serif">{HINDI_HOUSES[h]}</text>
//         <text x={tx} y={labelY+19} textAnchor="middle" fill="#5c2d00" fontSize={fsR} fontFamily="serif">
//           {hRashi(h).length>10 ? hRashi(h).slice(0,9) : hRashi(h)}
//         </text>
//         {plist.map((p,i) => {
//           // Single column for side/inner, 2-col for corners
//           let px=tx, py=labelY+30+i*13;
//           if (!side && !inner && plist.length>1) {
//             px = tx + (i%2===0 ? -13 : 13);
//             py = labelY + 30 + Math.floor(i/2)*13;
//           }
//           return (
//             <text key={i} x={px} y={py} textAnchor="middle"
//               fill={PLANET_COLOR[p.strength]||PLANET_COLOR.NEUTRAL}
//               fontSize={fsP} fontWeight="bold" fontFamily="monospace">
//               {SHORT[p.name]||p.name.slice(0,2)}{p.retrograde?'℞':''}
//             </text>
//           );
//         })}
//       </g>
//     );
//   };

//   return (
//     <div>
//       <div className="text-center mb-3">
//         <p style={{fontFamily:'serif',fontSize:'18px',color:'#fcd34d',fontWeight:'bold',letterSpacing:'1px'}}>
//           जन्म लग्न कुंडली
//         </p>
//         <p className="text-amber-600/50 text-xs mt-0.5">
//           North Indian Style • Sidereal / Vedic • Lahiri Ayanamsa • Swiss Ephemeris
//         </p>
//       </div>
//       <div style={{maxWidth:'500px',margin:'0 auto'}}>
//         <svg viewBox={`0 0 ${S} ${S}`} width="100%"
//           style={{display:'block',background:'rgba(5,2,0,0.92)',borderRadius:'6px',border:'2px solid #92400e'}}>
//           <rect x={0} y={0} width={S} height={S} fill="none" stroke="#92400e" strokeWidth="2"/>
//           {/* Diagonals */}
//           <line x1={0} y1={0} x2={S} y2={S} stroke="#92400e" strokeWidth="1.5"/>
//           <line x1={S} y1={0} x2={0} y2={S} stroke="#92400e" strokeWidth="1.5"/>
//           {/* Edge midpoint to inner box */}
//           {[[M,0,IL,IT],[M,0,IR,IT],[S,M,IR,IT],[S,M,IR,IB],
//             [M,S,IR,IB],[M,S,IL,IB],[0,M,IL,IB],[0,M,IL,IT]].map(([x1,y1,x2,y2],i) => (
//             <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#92400e" strokeWidth="1.2"/>
//           ))}
//           {/* Inner box diagonals */}
//           {[[IL,IT,M,M],[IR,IT,M,M],[IR,IB,M,M],[IL,IB,M,M]].map(([x1,y1,x2,y2],i) => (
//             <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#92400e" strokeWidth="1"/>
//           ))}
//           {/* Houses 2–12 */}
//           {[2,3,4,5,6,7,8,9,10,11,12].map(h => renderHouse(h))}
//           {/* H1 Center */}
//           <g>
//             <rect x={IL} y={IT} width={IH*2} height={IH*2}
//               fill="rgba(100,45,0,0.25)" stroke="#d97706" strokeWidth="2"/>
//             {(() => {
//               const plist = housePlanets[1]||[];
//               const baseY = M - (plist.length>0 ? 24 : 12);
//               return <>
//                 <text x={M} y={baseY-10} textAnchor="middle" fill="#a16207" fontSize={9} fontWeight="bold" fontFamily="serif">1</text>
//                 <text x={M} y={baseY}    textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight="bold" fontFamily="serif">लग्न</text>
//                 <text x={M} y={baseY+13} textAnchor="middle" fill="#fbbf24" fontSize={13} fontWeight="bold" fontFamily="serif">{lagnaRashi}</text>
//                 <text x={M} y={baseY+24} textAnchor="middle" fill="#78350f" fontSize={7.5} fontFamily="serif">Ascendant</text>
//                 {plist.map((p,i) => (
//                   <text key={i} x={plist.length===1?M:M+(i%2===0?-13:13)}
//                     y={baseY+36+Math.floor(i/2)*14}
//                     textAnchor="middle"
//                     fill={PLANET_COLOR[p.strength]||PLANET_COLOR.NEUTRAL}
//                     fontSize={13} fontWeight="bold" fontFamily="monospace">
//                     {SHORT[p.name]||p.name.slice(0,2)}{p.retrograde?'℞':''}
//                   </text>
//                 ))}
//               </>;
//             })()}
//           </g>
//         </svg>
//       </div>
//       {/* Legend */}
//       <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
//         {[['bg-green-400','text-green-400','Exalted'],['bg-blue-400','text-blue-400','Own Sign'],
//           ['bg-red-400','text-red-400','Debilitated'],['bg-amber-400','text-amber-400','Neutral']].map(([bg,tc,l])=>(
//           <span key={l} className="flex items-center gap-1.5 text-xs">
//             <span className={`w-2 h-2 rounded-full ${bg}`}/><span className={tc}>{l}</span>
//           </span>
//         ))}
//       </div>
//       <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
//         {Object.entries(SHORT).map(([f,s])=>(
//           <span key={f} className="text-xs text-amber-700/50">
//             <span className="text-amber-500 font-bold">{s}</span>={f}
//           </span>
//         ))}
//         <span className="text-xs text-amber-700/50"><span className="text-amber-500">℞</span>=Retrograde</span>
//       </div>
//     </div>
//   );
// }

// ── Traditional North Indian Kundli Chart ─────────────────────────────────
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

  // Function to get precise coordinates for Rashi Numbers and Planet groups
// Updated coordinates for better centering and visibility
const getHouseLayout = (h) => {
  const S = 500, M = 250;
  const edge = 50; // Corners se distance
  
  const layout = {
    // rx, ry = Rashi No | px, py = Planets
    // INNER DIAMONDS (Perfected)
    1:  { rx: M,      ry: M - 70,   px: M,      py: M - 25 }, 
    4:  { rx: M - 70, ry: M + 5,    px: M / 2 - 15, py: M + 10 },
    7:  { rx: M,      ry: M + 85,   px: M,      py: M + 45 }, 
    10: { rx: M + 70, ry: M + 5,    px: (3 * M) / 2 + 15, py: M + 10 },

    // OUTER TRIANGLES (Shifted away from inner lines)
    2:  { rx: M - 110, ry: 40,       px: M / 2 + 10, py: 90 },     // Top-Left: Thoda niche aur right shift
    3:  { rx: 30,     ry: M - 140,   px: 80,         py: M / 2 - 5 }, // Left-Mid: Thoda right shift
    5:  { rx: 20,     ry: M + 140,   px: 80,         py: (3 * S) / 4 + 5 }, 
    6:  { rx: M - 120, ry: S - 35,   px: M / 2 + 10, py: S - 80 }, 
    8:  { rx: M + 140, ry: S - 35,   px: (3 * S) / 4 - 10, py: S - 80 },
    9:  { rx: S - 40, ry: M + 140,   px: S - 85,     py: (3 * S) / 4 + 5 },
    11: { rx: S - 40, ry: M - 140,   px: S - 85,     py: M / 2 - 5 },
    12: { rx: M +140, ry: 40,       px: (3 * S) / 4 - 10, py: 90 },
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
             style={{ background: '#0a0500', border: '3px solid #92400e' }}>
          
          {/* Main Frame & Traditional Diagonals */}
          <rect x="0" y="0" width={S} height={S} fill="none" stroke="#92400e" strokeWidth="3"/>
          <line x1="0" y1="0" x2={S} y2={S} stroke="#92400e" strokeWidth="2"/>
          <line x1={S} y1="0" x2="0" y2={S} stroke="#92400e" strokeWidth="2"/>
          
          {/* Inner Diamond Lines */}
          <line x1={M} y1="0" x2="0" y2={M} stroke="#92400e" strokeWidth="2"/>
          <line x1="0" y1={M} x2={M} y2={S} stroke="#92400e" strokeWidth="2"/>
          <line x1={M} y1={S} x2={S} y2={M} stroke="#92400e" strokeWidth="2"/>
          <line x1={S} y1={M} x2={M} y2="0" stroke="#92400e" strokeWidth="2"/>

          {/* Rendering Houses */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => {
            const { rx, ry, px, py } = getHouseLayout(h);
            const rashiNum = getRashiNum(h);
            const plist = housePlanets[h] || [];

            return (
              <g key={h}>
                {/* Rashi Number */}
                <text x={rx} y={ry} textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold" fontFamily="serif">
                  {rashiNum}
                </text>
                
                {/* Planets Grouped in House */}
                {plist.map((p, i) => (
                  <text key={i} x={px} y={py + (i * 20)} textAnchor="middle" 
                        fill={PLANET_COLOR[p.strength] || PLANET_COLOR.NEUTRAL}
                        fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    {SHORT[p.name] || p.name.slice(0, 2)}{p.retrograde ? '℞' : ''}
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




// Helper to get exact traditional positions
function getHouseCoords(h, S, M) {
    const gap = 25;
    const centers = {
        1:  { rx: M+5, ry: M/2-10, px: M, py: M/2 - 40 },   // Top Center
        2:  { rx: M/4+10, ry: M/4+25, px: M/4, py: M/4 },   // Top Left Corner
        3:  { rx: 15, ry: M-10, px: M/4, py: M-20 },       // Left Middle
        4:  { rx: M/4+10, ry: (3*S)/4-10, px: M/4, py: (3*S)/4-30 }, // Bottom Left Corner
        5:  { rx: M-15, ry: S-15, px: M, py: S-60 },       // Bottom Middle
        6:  { rx: (3*S)/4-25, ry: (3*S)/4-10, px: (3*S)/4, py: (3*S)/4-30 }, // Bottom Right Corner
        7:  { rx: S-25, ry: M-10, px: (3*S)/4+20, py: M-20 }, // Right Middle
        8:  { rx: (3*S)/4-25, ry: M/4+25, px: (3*S)/4, py: M/4 }, // Top Right Corner
        9:  { rx: M+10, ry: M/4+35, px: M+40, py: M/4+10 }, // Inner Top Right
        10: { rx: M/2+20, ry: M-10, px: M/2+10, py: M-30 }, // Inner Left
        11: { rx: M+10, ry: (3*M)/2-10, px: M+40, py: (3*M)/2-30 }, // Inner Bottom
        12: { rx: (3*M)/2-30, ry: M-10, px: (3*M)/2-10, py: M-30 }, // Inner Right
    };
    return centers[h];
}

// ── Analysis text renderer ────────────────────────────────────
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
        if (/^[-*•]/.test(l))    return (
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

// ── Time Picker ───────────────────────────────────────────────
function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [ampm, setAmpm] = useState('AM');
  const [hrs,  setHrs ] = useState('12');
  const [mins, setMins] = useState('00');
  const ref = useRef(null);

  useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(':').map(Number);
    setAmpm(h>=12?'PM':'AM');
    setHrs(String(h===0?12:h>12?h-12:h).padStart(2,'0'));
    setMins(String(m).padStart(2,'0'));
  }, []);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const emit = (h, m, ap) => {
    let hr24 = parseInt(h);
    if (ap==='AM' && hr24===12) hr24=0;
    if (ap==='PM' && hr24!==12) hr24+=12;
    onChange(String(hr24).padStart(2,'0')+':'+String(m).padStart(2,'0'));
  };

  const HOURS = Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'));
  const MINS  = Array.from({length:60},(_,i)=>String(i).padStart(2,'0'));
  const display = value ? `${hrs}:${mins} ${ampm}` : 'Select time...';

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={()=>setOpen(o=>!o)}
        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-left flex items-center justify-between transition-colors
          ${open?'border-amber-500':'border-amber-800/40 hover:border-amber-600/50'}
          ${value?'text-amber-100':'text-amber-800'}`}>
        <span className="flex items-center gap-2 text-sm"><span className="text-amber-600">🕐</span>{display}</span>
        <span className="text-amber-700/50 text-xs">{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-amber-950 border border-amber-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-amber-800/40">
            {['AM','PM'].map(ap=>(
              <button key={ap} type="button" onClick={()=>{setAmpm(ap);emit(hrs,mins,ap);}}
                className={`flex-1 py-2.5 text-sm font-bold transition-all
                  ${ampm===ap?'bg-amber-600 text-white':'text-amber-500/60 hover:bg-amber-800/30'}`}>
                {ap==='AM'?'🌅 AM':'🌆 PM'}
              </button>
            ))}
          </div>
          <div className="flex">
            {[['Hour',HOURS,hrs,setHrs,true],['Min',MINS,mins,setMins,false]].map(([label,arr,val,setter,isHour])=>(
              <div key={label} className={isHour?'flex-1 border-r border-amber-800/30':'flex-1'}>
                <p className="text-amber-700/50 text-xs text-center py-1.5 border-b border-amber-800/30 uppercase tracking-wider">{label}</p>
                <div className="overflow-y-auto" style={{maxHeight:'200px'}}>
                  {arr.map(v=>(
                    <button key={v} type="button"
                      onClick={()=>{setter(v); isHour?emit(v,mins,ampm):(emit(hrs,v,ampm),setOpen(false));}}
                      className={`w-full py-2 text-sm text-center transition-all
                        ${val===v?'bg-amber-600/40 text-amber-300 font-bold':'text-amber-500/70 hover:bg-amber-800/30'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-800/30 p-2">
            <p className="text-amber-700/40 text-xs mb-1.5 uppercase tracking-wider px-1">Quick</p>
            <div className="flex flex-wrap gap-1">
              {[{l:'Midnight',h:'12',m:'00',ap:'AM'},{l:'Sunrise',h:'06',m:'00',ap:'AM'},
                {l:'Noon',h:'12',m:'00',ap:'PM'},{l:'Sunset',h:'06',m:'00',ap:'PM'}].map(q=>(
                <button key={q.l} type="button"
                  onClick={()=>{setHrs(q.h);setMins(q.m);setAmpm(q.ap);emit(q.h,q.m,q.ap);setOpen(false);}}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-900/40 text-amber-400 hover:bg-amber-700/40 border border-amber-800/30">
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
    if (lon>=68 && lon<=97)  return 5.5;
    if (lon>=-8 && lon<=2)   return 0;
    if (lon>=-80 && lon<=-66)return -5;
    if (lon>=-125&&lon<=-115)return -8;
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
            ${picked?'border-green-500/60':'border-amber-800/40 focus:border-amber-500'}`}
        />
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
      {picked  && <p className="text-green-400/70 text-xs mt-1">✅ Coordinates captured — accurate Lagna guaranteed</p>}
      {!picked && query.length>2 && <p className="text-amber-600/60 text-xs mt-1">⚠️ Select from dropdown for accurate Lagna</p>}
    </div>
  );
}

// ── Dosha Card ────────────────────────────────────────────────
function DoshaCard({ d }) {
  const [open, setOpen] = useState(false);
  const icon = d.severity==='HIGH'?'🔴':d.severity==='CANCELLED'?'✅':'🟡';
  return (
    <div className={`border rounded-xl p-4 cursor-pointer transition-all ${SEVERITY_CLS[d.severity]||SEVERITY_CLS.LOW}`}
      onClick={()=>setOpen(o=>!o)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-bold text-sm md:text-base">{d.name}</p>
            <p className="text-xs opacity-70 mt-0.5">{d.trigger}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-current opacity-70">{d.severity}</span>
          <span className="text-sm">{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div className="mt-4 space-y-3 border-t border-current/20 pt-4">
          {d.cancellations?.length>0 && (
            <div className="bg-green-900/30 rounded-lg p-2">
              <p className="text-xs font-bold text-green-400 mb-1">✅ Cancellations:</p>
              {d.cancellations.map((c,i)=><p key={i} className="text-xs text-green-300">• {c}</p>)}
            </div>
          )}
          <div><p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Impact</p><p className="text-sm">{d.impact}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">📖 Reference</p><p className="text-xs italic opacity-70">{d.classicRef}</p></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">🙏 Remedies</p>
            {(d.remedy||[]).map((r,i)=>(
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
      const res  = await fetch(API_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name         : form.name,
          dateOfBirth  : form.dateOfBirth,
          timeOfBirth  : form.timeOfBirth,
          placeOfBirth : form.placeOfBirth,
          gender       : form.gender,
          latitude     : form.latitude  || 20.5937,
          longitude    : form.longitude || 78.9629,
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
    {id:'planets',label:'🪐 Planets'},
    {id:'doshas', label:'⚠️ Doshas'},
    {id:'optionA',label:'📜 Option A'},
    {id:'optionB',label:'📐 Option B'},
    {id:'verdict',label:'✅ Verdict'},
    {id:'raw',    label:'🔍 Raw'},
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
                onChange={v => setForm(f=>({...f,placeOfBirth:v}))}
                onSelect={(d,lat,lon,tz) => setForm(f=>({...f,placeOfBirth:d,latitude:lat,longitude:lon,timezoneOffset:tz}))}
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

            {/* Summary */}
            <div className="bg-gradient-to-r from-amber-900/35 to-amber-800/15 border border-amber-700/35 rounded-2xl p-5 md:p-6">
              <h2 className="text-amber-300 font-bold text-lg mb-4">
                📊 Kundli — {result.kundli.nativeInfo.name}
              </h2>

              {/* Source badge */}
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
                  {l:'Lagna',      v:result.kundli.lagnaRashi},
                  {l:'Moon Sign',  v:result.kundli.planets.Moon.rashi},
                  {l:'Nakshatra',  v:result.kundli.nakshatra},
                  {l:'Mahadasha',  v:`${result.kundli.mahadasha.planet} (${result.kundli.mahadasha.yearsRemaining} yrs)`},
                ].map(({l,v})=>(
                  <div key={l} className="bg-black/25 rounded-xl p-3 text-center">
                    <p className="text-amber-600/70 text-xs uppercase tracking-wider mb-1">{l}</p>
                    <p className="text-amber-200 font-semibold text-sm">{v}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {result.kundli.strongPlanets?.length>0 && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3">
                    <p className="text-green-400 text-xs font-bold uppercase mb-1">⬆ Strong</p>
                    <p className="text-green-300 text-sm">{result.kundli.strongPlanets.join(', ')}</p>
                  </div>
                )}
                {result.kundli.weakPlanets?.length>0 && (
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
                <span>⚠️ Doshas: {result.kundli.doshaCount} active</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-amber-950/25 border border-amber-800/30 rounded-2xl p-5 md:p-6 shadow-xl">
              <TabBar tabs={TABS} active={tab} onChange={setTab}/>

              <div className="mt-6">

                {tab==='planets' && (
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

                {tab==='doshas' && (
                  <div>
                    <h3 className="text-amber-300 font-semibold mb-4">⚠️ Dosha Analysis — {result.kundli.doshas.length} found</h3>
                    {result.kundli.doshas.length===0
                      ? <div className="bg-green-900/25 border border-green-700/40 rounded-xl p-6 text-center">
                          <div className="text-4xl mb-2">✅</div>
                          <p className="text-green-300 font-semibold">No Major Doshas Detected</p>
                        </div>
                      : <div className="space-y-3">
                          {result.kundli.doshas.map((d,i)=><DoshaCard key={i} d={d}/>)}
                        </div>
                    }
                  </div>
                )}

                {tab==='optionA' && (
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

                {tab==='optionB' && (
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

                {tab==='verdict' && (
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

                {tab==='raw' && (
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