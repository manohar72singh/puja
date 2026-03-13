import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function AIPanditBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  // 🔱 Connection Handle karne ka logic (Sirf jab khule tab)
  const connectSocket = () => {
    socketRef.current = io(`${import.meta.env.VITE_SOCKET_URL}/pandit`, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
      // Nayi Chat ka swagat
      setMessages([{
        text: "🙏 Om Namah Shivay! Main Sri Vedic Puja Kendra ka Pandit Ji hoon.\n\nBatayein yajmaan, aaj kya kasht hai?",
        sender: "bot",
      }]);
    });

    socketRef.current.on("ai_response", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    });

    socketRef.current.on("disconnect", () => setConnected(false));
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setMessages([]); // Purani chat clear
      setConnected(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      connectSocket();
    } else {
      setIsOpen(false);
      disconnectSocket();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping || !connected) return;
    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    socketRef.current.emit("ai_query", { text: userText });
    setIsTyping(true);
  };

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <div className="fixed bottom-8 right-8 z-[9999] pf">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');
        .pf { font-family: 'Noto Serif Devanagari', Georgia, serif; }
        .flame-glow { animation: pulse-glow 2s infinite alternate; }
        @keyframes pulse-glow { 
          0% { shadow: 0 0 10px #fbbf24; transform: scale(1); } 
          100% { shadow: 0 0 25px #f59e0b; transform: scale(1.05); } 
        }
        .scroll-area::-webkit-scrollbar { width: 3px; }
        .scroll-area::-webkit-scrollbar-thumb { background: #78350f; border-radius: 10px; }
      `}</style>

      {/* 🔱 Premium Floating Button (Diya Look) */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="group relative flex items-center justify-center"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping group-hover:bg-amber-500/30"></div>
          
          {/* Main Button */}
          <div className="relative w-20 h-20 bg-gradient-to-t from-[#78350f] via-[#92400e] to-[#b45309] rounded-full shadow-[0_10px_40px_rgba(120,53,15,0.5)] border-4 border-amber-200 flex flex-col items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110">
            <span className="text-3xl filter drop-shadow-md">🔱</span>
            <span className="text-[10px] font-bold text-amber-100 mt-1 uppercase tracking-tighter">AI Pandit</span>
          </div>

          {/* Tooltip Label */}
          <div className="absolute right-24 bg-white/90 backdrop-blur-sm border-l-4 border-amber-600 px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-x-4 group-hover:translate-x-0">
            <p className="text-amber-900 font-bold text-sm whitespace-nowrap">🙏 Kasht batayein yajmaan!</p>
          </div>
        </button>
      )}

      {/* 🔱 Main Chat Window */}
      {isOpen && (
        <div className="w-[360px] md:w-[420px] h-[600px] flex flex-col rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-[5px] border-amber-900/30 bg-[#fffdf7] animate-in zoom-in-95 duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#78350f] to-[#b45309] px-6 py-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-2xl shadow-inner shadow-black/20 text-amber-800">🪔</div>
              <div>
                <h2 className="font-bold text-xl leading-none">Smart Pandit Ji</h2>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}></div>
                  <span className="text-[10px] uppercase font-bold text-amber-100">Pratyaksh (Live)</span>
                </div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scroll-area bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} items-end`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-[15px] leading-relaxed shadow-sm pf ${m.sender === "user"
                    ? "bg-[#78350f] text-amber-50 rounded-br-none"
                    : "bg-white text-slate-800 rounded-tl-none border-l-[6px] border-amber-600 shadow-amber-900/5"
                  }`}>
                  {formatText(m.text)}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-amber-100/50 w-fit">
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-700 animate-bounce [animation-delay:0.4s]"></div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Bar */}
          <div className="p-5 bg-white border-t border-amber-100 flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Apna sawaal likhein..."
              className="flex-1 bg-amber-50/50 border border-amber-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-600/20 pf"
            />
            <button
              onClick={handleSend}
              disabled={!connected || isTyping || !input.trim()}
              className="w-14 h-14 rounded-2xl bg-[#78350f] flex items-center justify-center text-white shadow-lg shadow-amber-900/30 hover:brightness-125 transition-all disabled:opacity-30"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}