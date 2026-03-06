import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  {
    hindi: '"जो खो गया वो मिल जाएगा, बस सही मार्ग चुनो।"',
    english: "What is lost shall be found — choose the right path.",
    author: "— Bhagavad Gita, Ch.6",
  },
  {
    hindi: '"अंधेरे में भी दिया जलाना होता है, राह खुद बन जाती है।"',
    english: "Even in darkness, light your lamp — the path reveals itself.",
    author: "— Ancient Vedic Wisdom",
  },
  {
    hindi: '"हर भटकन एक नई खोज का आरंभ है।"',
    english: "Every wrong turn is the beginning of a new discovery.",
    author: "— Upanishads",
  },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(15);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const [typed, setTyped] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const canvasRef = useRef(null);

  const fullText = "PAGE NOT FOUND";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    setTyped("");
    const t = setInterval(() => {
      if (i < fullText.length) {
        setTyped(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t);
      }
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (count <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  // Quote rotate
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 380);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Particles
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 7 + Math.random() * 7,
        size: 10 + Math.floor(Math.random() * 12),
        emoji: ["🌸", "🪷", "✨", "🌼", "⭐", "💫", "🕉️"][
          Math.floor(Math.random() * 7)
        ],
      })),
    );
  }, []);

  // Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
    const ripples = [];
    let tick = 0;
    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const op = 0.12 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.0008 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253,200,110,${op})`;
        ctx.fill();
      });
      tick++;
      if (tick % 100 === 0) ripples.push({ r: 0, opacity: 0.2 });
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 2;
        ripples[i].opacity -= 0.003;
        if (ripples[i].opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          ripples[i].r,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(249,115,22,${ripples[i].opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const q = QUOTES[quoteIdx];
  const circumference = 2 * Math.PI * 22;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #130a00 0%, #080b18 55%, #020408 100%)",
      }}
    >
      <style>{`
        @keyframes spin   { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes fall   { 0%{opacity:0;transform:translateY(-3rem) rotate(0deg);} 8%{opacity:.7;} 90%{opacity:.3;} 100%{opacity:0;transform:translateY(105vh) rotate(400deg);} }
        @keyframes flicker{ 0%{transform:scaleX(1) scaleY(1) skewX(0deg);} 25%{transform:scaleX(.87) scaleY(1.08) skewX(-3.5deg);} 55%{transform:scaleX(1.12) scaleY(.92) skewX(2.5deg);} 80%{transform:scaleX(.93) scaleY(1.09) skewX(-2deg);} 100%{transform:scaleX(1.06) scaleY(.97) skewX(1.5deg);} }
        @keyframes levitate{ 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-7px);} }
        @keyframes omPulse { 0%,100%{opacity:.28; letter-spacing:1.8rem;} 50%{opacity:.8; letter-spacing:2.2rem;} }
        @keyframes glow404 { from{filter:drop-shadow(0 0 12px rgba(249,115,22,.2));} to{filter:drop-shadow(0 0 45px rgba(249,115,22,.65)) drop-shadow(0 0 90px rgba(249,115,22,.2));} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes wmPulse { from{opacity:.1;} to{opacity:.28;} }

        .anim-levitate { animation: levitate 4s ease-in-out infinite; }
        .anim-flicker  { animation: flicker 1.3s ease-in-out infinite alternate; }
        .anim-om       { animation: omPulse 4s ease-in-out infinite; }
        .anim-404      { animation: glow404 4s ease-in-out infinite alternate; }
        .anim-fu-0     { animation: fadeUp .65s ease .00s both; }
        .anim-fu-1     { animation: fadeUp .65s ease .12s both; }
        .anim-fu-2     { animation: fadeUp .65s ease .24s both; }
        .anim-fu-3     { animation: fadeUp .65s ease .38s both; }
        .anim-fu-4     { animation: fadeUp .65s ease .52s both; }
        .anim-fu-5     { animation: fadeUp .65s ease .66s both; }
        .anim-fu-6     { animation: fadeUp .65s ease .80s both; }
      `}</style>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 65%, rgba(249,115,22,0.15) 0%, transparent 70%), radial-gradient(ellipse 80% 40% at 50% 100%, rgba(120,40,0,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Mandala rings */}
      <div
        className="fixed top-1/2 left-1/2 pointer-events-none z-[1]"
        style={{ transform: "translate(-50%,-50%)" }}
      >
        {[680, 500, 340, 210].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              border:
                i % 2 === 0
                  ? "1px solid rgba(249,115,22,0.06)"
                  : "1px dashed rgba(249,115,22,0.09)",
              animation: `spin ${[60, 34, 24, 14][i]}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
            }}
          />
        ))}
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none z-[2]"
          style={{
            top: "-3rem",
            left: `${p.left}%`,
            fontSize: p.size,
            opacity: 0,
            animation: `fall ${p.duration}s ${p.delay}s linear infinite`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Watermark */}
      <div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[2] text-xs tracking-widest whitespace-nowrap pointer-events-none select-none"
        style={{
          color: "rgba(249,115,22,0.18)",
          animation: "wmPulse 6s ease-in-out infinite alternate",
        }}
      >
        ॐ नमः शिवाय • सर्वे भवन्तु सुखिनः • ॐ
      </div>

      {/* ── MAIN LAYOUT — 2 column on md, 1 col on mobile ── */}
      <div className="relative z-10 w-full max-w-5xl px-5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* LEFT — Diya + 404 + Om */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Diya */}
          <div className="anim-fu-0 anim-levitate flex flex-col items-center mb-3 relative">
            <div
              className="anim-flicker relative"
              style={{
                width: 30,
                height: 48,
                background:
                  "linear-gradient(to top,#c2410c 0%,#f97316 35%,#fbbf24 68%,#fef9c3 100%)",
                borderRadius: "50% 50% 28% 28% / 58% 58% 42% 42%",
                filter: "blur(.3px)",
                boxShadow:
                  "0 0 14px rgba(249,115,22,1),0 0 36px rgba(249,115,22,.6),0 0 80px rgba(249,115,22,.18)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 7,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 12,
                  height: 22,
                  background: "linear-gradient(to top,#4c1d95,#7c3aed,#f97316)",
                  borderRadius: "50%",
                  filter: "blur(2px)",
                }}
              />
            </div>
            <div
              style={{
                width: 56,
                height: 18,
                marginTop: -4,
                background:
                  "linear-gradient(135deg,#d97706 0%,#b45309 40%,#78350f 100%)",
                borderRadius: "0 0 50% 50% / 0 0 100% 100%",
                boxShadow:
                  "0 5px 16px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,200,80,.2)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 16,
                background:
                  "radial-gradient(ellipse,rgba(249,115,22,.5) 0%,transparent 70%)",
                filter: "blur(7px)",
              }}
            />
          </div>

          {/* Om */}
          <p
            className="anim-fu-1 anim-om text-lg mb-1"
            style={{ color: "rgba(249,115,22,0.38)", letterSpacing: "1.8rem" }}
          >
            ॐ &nbsp; ॐ &nbsp; ॐ
          </p>

          {/* 404 */}
          <h1
            className="anim-fu-2 anim-404 font-black leading-none"
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(6rem,15vw,9rem)",
              letterSpacing: "-0.05em",
              background:
                "linear-gradient(165deg,#fef3c7 0%,#fbbf24 18%,#f97316 40%,#ea580c 60%,#f97316 78%,#fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
        </div>

        {/* RIGHT — Typewriter title + quote + buttons */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
          {/* Typewriter heading */}
          <div className="anim-fu-2 mb-3">
            <h2
              className="font-black tracking-widest uppercase"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.18em",
              }}
            >
              {typed}
              <span
                style={{
                  opacity: cursorOn ? 1 : 0,
                  color: "#f97316",
                  transition: "opacity 0.1s",
                  fontWeight: 100,
                }}
              >
                |
              </span>
            </h2>
            <p
              className="mt-1 italic"
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(.85rem, 2vw, 1rem)",
                color: "rgba(255,255,255,.3)",
              }}
            >
              The sacred page you seek has wandered beyond this realm.
            </p>
          </div>

          {/* Divider */}
          <div className="anim-fu-3 flex items-center gap-2 w-full mb-4">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right,rgba(249,115,22,0.4),transparent)",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(249,115,22,0.5)" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "rgba(249,115,22,0.85)",
                boxShadow: "0 0 7px rgba(249,115,22,.6)",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(249,115,22,0.5)" }}
            />
          </div>

          {/* Quote block */}
          <div
            className="anim-fu-4 w-full relative rounded-xl overflow-hidden mb-4"
            style={{
              padding: "1.4rem 1.6rem",
              background:
                "linear-gradient(135deg,rgba(249,115,22,.07) 0%,rgba(234,179,8,.03) 100%)",
              border: "1px solid rgba(249,115,22,0.14)",
            }}
          >
            <span
              className="absolute pointer-events-none select-none"
              style={{
                top: "-1rem",
                left: "1rem",
                fontSize: "5rem",
                lineHeight: 1,
                color: "rgba(249,115,22,0.1)",
                fontFamily: "Georgia,serif",
              }}
            >
              ❝
            </span>
            <div
              style={{
                transition: "opacity .4s, transform .4s",
                opacity: quoteVisible ? 1 : 0,
                transform: quoteVisible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <p
                className="font-semibold leading-snug mb-2"
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "clamp(1rem, 2.8vw, 1.25rem)",
                  color: "rgba(255,255,255,.88)",
                }}
              >
                {q.hindi}
              </p>
              <p
                className="italic mb-1.5"
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "clamp(.85rem, 2vw, 1rem)",
                  color: "rgba(255,255,255,.4)",
                }}
              >
                {q.english}
              </p>
              <p
                className="text-xs tracking-wide"
                style={{
                  color: "rgba(249,115,22,.58)",
                  fontFamily: "Georgia,serif",
                }}
              >
                {q.author}
              </p>
            </div>
            {/* dots */}
            <div className="flex gap-1.5 mt-3">
              {QUOTES.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setQuoteVisible(false);
                    setTimeout(() => {
                      setQuoteIdx(i);
                      setQuoteVisible(true);
                    }, 350);
                  }}
                  className="rounded-full cursor-pointer transition-all duration-500"
                  style={{
                    width: i === quoteIdx ? 18 : 5,
                    height: 5,
                    background:
                      i === quoteIdx
                        ? "rgba(249,115,22,.85)"
                        : "rgba(249,115,22,.22)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Countdown + Buttons */}
          <div className="anim-fu-5 flex flex-wrap items-center gap-4">
            {/* Ring */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg
                className="w-12 h-12"
                viewBox="0 0 52 52"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  fill="none"
                  stroke="rgba(249,115,22,0.1)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  fill="none"
                  stroke="url(#rg)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - count / 15)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center font-bold"
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "1rem",
                  color: "#f97316",
                }}
              >
                {count}
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white font-semibold rounded-full px-6 py-2.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "1rem",
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                boxShadow:
                  "0 4px 20px rgba(249,115,22,.4),inset 0 1px 0 rgba(255,255,255,.18)",
              }}
            >
              🏠 Ghar Wapas
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-full px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "1rem",
                color: "rgba(255,255,255,.4)",
                border: "1px solid rgba(255,255,255,.1)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(249,115,22,.9)";
                e.currentTarget.style.borderColor = "rgba(249,115,22,.4)";
                e.currentTarget.style.background = "rgba(249,115,22,.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,.4)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              ← Pichhe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
