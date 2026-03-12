import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}/pandit`, {
  transports: ["polling", "websocket"],
});

export default function AIPanditBot() {
  const [messages, setMessages] = useState([
    {
      text: "🙏 Om Namah Shivay! Main Sri Vedic Puja Kendra ka Pandit Ji hoon.\n\nApni har samasya — ghar, rishta, naukri, swasthya — sab ka samadhan puja se hoga.\n\nBatayein yajmaan, aaj kya kasht hai?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("ai_response", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ai_response");
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping || !connected) return;
    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    socket.emit("ai_query", { text: userText });
    setIsTyping(true);
    inputRef.current?.focus();
  };

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <div style={{ fontFamily: "Georgia, serif" }} className="flex items-center justify-center min-h-screen bg-amber-950 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');
        .pf { font-family: 'Noto Serif Devanagari', Georgia, serif; }
        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-thumb { background: #d97706; border-radius: 2px; }
        .flame { animation: flicker 1.5s ease-in-out infinite alternate; display: inline-block; }
        @keyframes flicker { 0% { transform: scale(1) rotate(-2deg); } 100% { transform: scale(1.1) rotate(2deg); } }
        .td { animation: bounce 1.2s infinite; }
        .td:nth-child(2) { animation-delay: 0.2s; }
        .td:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0);opacity:.4; } 40% { transform:translateY(-6px);opacity:1; } }
        .msg-enter { animation: slideIn 0.3s ease-out; }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .send-btn:active { transform: scale(0.93); }
        input:focus { outline: none; box-shadow: 0 0 0 2px #d97706; }
      `}</style>

      <div className="w-full max-w-md h-[640px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-700"
        style={{ background: "linear-gradient(180deg,#fffbeb,#fef3c7)" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#92400e,#b45309,#92400e)" }}
          className="relative px-5 py-4 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow border-2 border-amber-300 flex-shrink-0">🔱</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="pf font-bold text-xl">AI Pandit Ji</h2>
                <span className="flame text-lg">🪔</span>
              </div>
              <p className="text-amber-200 text-xs">Sri Vedic Puja Kendra</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                <span className={`text-xs ${connected ? "text-green-300" : "text-red-300"}`}>
                  {connected ? "Upasthit hain" : "Connect ho rahe hain..."}
                </span>
              </div>
            </div>
            <div className="text-amber-200 text-xs opacity-70 text-right"><div>ॐ</div><div>नमः</div><div>शिवाय</div></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 10px,#92400e 10px,#92400e 20px)" }} />
        </div>

        {/* Messages */}
        <div className="scroll-area flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`msg-enter flex ${m.sender === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {m.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow">🔱</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md pf ${
                m.sender === "user" ? "text-white rounded-br-none" : "text-gray-800 rounded-tl-none border border-amber-200"
              }`} style={m.sender === "user"
                ? { background: "linear-gradient(135deg,#b45309,#92400e)" }
                : { background: "linear-gradient(135deg,#fffbeb,#fef9ee)", borderLeft: "3px solid #d97706" }}>
                {formatText(m.text)}
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow border border-amber-300">🙏</div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-sm flex-shrink-0 shadow">🔱</div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow border border-amber-200"
                style={{ background: "linear-gradient(135deg,#fffbeb,#fef9ee)", borderLeft: "3px solid #d97706" }}>
                <p className="pf text-amber-700 text-xs italic mb-1">Pandit Ji dhyan laga rahe hain...</p>
                <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="td w-2 h-2 rounded-full bg-amber-600" />)}</div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Quick buttons */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-amber-100" style={{ background: "#fffbeb" }}>
          {["💼 Naukri", "❤️ Vivah", "🏠 Ghar", "💰 Dhan", "😷 Swasthya"].map((q) => (
            <button key={q}
              onClick={() => { setInput(q.split(" ").slice(1).join(" ") + " ki samasya hai"); inputRef.current?.focus(); }}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors pf">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 flex gap-2 items-center flex-shrink-0 border-t-2 border-amber-200"
          style={{ background: "linear-gradient(180deg,#fef3c7,#fffbeb)" }}>
          <input ref={inputRef} type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Apni samasya likhein, yajmaan..."
            className="flex-1 bg-white border-2 border-amber-300 rounded-2xl px-4 py-2.5 text-sm text-gray-700 pf" />
          <button onClick={handleSend}
            disabled={isTyping || !input.trim() || !connected}
            className="send-btn w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg transition-all flex-shrink-0 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}