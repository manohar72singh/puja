import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// const socket = io(import.meta.env.VITE_SOCKET_URL);

export default function AIPanditBot() {
//   const [messages, setMessages] = useState([
//     { text: "Om Namah Shivay! Main AI Pandit Ji hoon. Apne dukh batayein, main puja se samadhan doonga.", sender: "bot" }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     socket.on("ai_response", (msg) => {
//       setMessages(prev => [...prev, msg]);
//       setIsTyping(false);
//     });
//     return () => socket.off("ai_response");
//   }, []);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;
//     const userMsg = { text: input, sender: "user", timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);
//     socket.emit("ai_query", { text: input });
//     setInput("");
//     setIsTyping(true);
//   };

  return (
    <>
        hello
    </>
    // <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-orange-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-orange-200">
    //   {/* Vedic Header */}
    //   <div className="bg-gradient-to-r from-orange-600 to-red-600 p-5 text-white">
    //     <div className="flex items-center gap-3">
    //       <span className="text-3xl">🔱</span>
    //       <div>
    //         <h3 className="font-bold text-xl tracking-wide">AI Pandit Bot</h3>
    //         <p className="text-xs font-light text-orange-100">Shubh Muhurat & Puja Expert</p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Chat Area */}
    //   <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
    //     {messages.map((m, i) => (
    //       <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    //         <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
    //           m.sender === 'user' 
    //             ? 'bg-orange-600 text-white rounded-br-none' 
    //             : 'bg-white text-gray-800 border-l-4 border-orange-500 rounded-tl-none'
    //         }`}>
    //           {m.text}
    //         </div>
    //       </div>
    //     ))}
    //     {isTyping && (
    //       <div className="flex gap-2 p-2 items-center text-orange-600 text-sm italic font-medium">
    //         <span className="animate-bounce">🔸</span> Pandit ji dhyan laga rahe hain...
    //       </div>
    //     )}
    //     <div ref={scrollRef} />
    //   </div>

    //   {/* Vedic Input Box */}
    //   <div className="p-4 bg-white border-t-2 border-orange-100 flex gap-2">
    //     <input 
    //       type="text" 
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //       onKeyDown={(e) => e.key === 'Enter' && handleSend()}
    //       placeholder="Apni samasya likhein..."
    //       className="flex-1 bg-orange-50 border-2 border-orange-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
    //     />
    //     <button 
    //       onClick={handleSend} 
    //       className="bg-orange-600 text-white p-3 rounded-full hover:bg-red-600 shadow-lg active:scale-95 transition-all"
    //     >
    //       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //         <line x1="22" y1="2" x2="11" y2="13"></line>
    //         <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    //       </svg>
    //     </button>
    //   </div>
    // </div>
  );
}