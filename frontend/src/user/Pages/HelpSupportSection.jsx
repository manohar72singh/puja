import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Phone, Mail, Send, ChevronDown, ArrowLeft } from "lucide-react";
import {useNavigate} from "react-router-dom"

const HelpSupportSection = () => {
  const navigate = useNavigate()
  const faqs = [
    {
      question: "How do I cancel a booking?",
      answer: "You can cancel a booking from the 'My Bookings' section. Navigate to the booking you want to cancel and click the 'Cancel Booking' button. Please note that cancellations made within 24 hours of the scheduled time may incur a cancellation fee. Refunds are processed within 5-7 business days to your original payment method."
    },
    {
      question: "Do I need to arrange Samagri?",
      answer: "No, we offer optional Samagri kits that include all necessary items for your puja. During booking, you can choose to include our curated Samagri kit which will be delivered to your doorstep before the puja."
    },
    {
      question: "How are Pandits verified?",
      answer: "All our Pandits undergo a thorough verification process including document verification, tradition expertise assessment, and background checks. Each Pandit is rated by previous devotees to ensure quality service."
    }
  ];

  // Consistency Styles (Based on your previous Profile/Booking code)
  const primaryBtnStyle = "w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-md border border-orange-300 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]";
  const inputStyle = "w-full bg-orange-50/30 border border-orange-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-400 transition-all placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-8 font-sans antialiased text-[#2D2D2D]">
      
      {/* Container restricted to max-xl (same width as FAQ/Ticket sections) */}
      <div className="max-w-xl mx-auto">
        
        {/* Back Button */}
        <button className="flex items-center gap-1 text-gray-500 text-sm font-bold hover:text-orange-500 transition-colors mb-6 group"
        onClick={()=>navigate(-1)}>
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg border border-orange-300">
            <span className="text-2xl font-bold italic">?</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">
            How can we help you?
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest opacity-80">
            Reach out or browse FAQs
          </p>
        </div>

        {/* Contact Cards - Now aligned to max-xl width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <ContactCard 
            icon={<MessageCircle className="text-green-500" size={20}/>} 
            title="WhatsApp" 
            sub="Quick chat" 
          />
          <ContactCard 
            icon={<Phone className="text-blue-500" size={20}/>} 
            title="Call Support" 
            sub="Expert help" 
          />
          <ContactCard 
            icon={<Mail className="text-purple-500" size={20}/>} 
            title="Email Us" 
            sub="24h response" 
          />
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-[1.5rem] border border-orange-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Common Questions</h3>
            <div className="divide-y divide-orange-50">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white rounded-[1.5rem] border border-orange-200 shadow-sm p-6 mb-10">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-gray-400 mb-5">Submit a Ticket</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Subject</label>
              <input 
                placeholder="What is your query about?" 
                className={inputStyle}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Message</label>
              <textarea 
                rows="3" 
                placeholder="Describe your issue in detail..." 
                className={`${inputStyle} resize-none`}
              ></textarea>
            </div>

            <div className="pt-2">
              <button className={primaryBtnStyle}>
                <Send size={18} /> <span>Submit Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, sub }) => (
  <div className="bg-white p-4 rounded-2xl border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-pointer text-center flex flex-col items-center group">
    <div className="mb-2 bg-orange-50 p-2.5 rounded-full group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-[13px] font-bold text-gray-900">{title}</h4>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{sub}</p>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="py-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center gap-4">
        <span className="text-sm text-gray-700 font-bold leading-tight">{question}</span>
        <ChevronDown
          size={16}
          className={`text-orange-400 transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-40 mt-3' : 'max-h-0'}`}
      >
        <div ref={contentRef} className="text-gray-500 text-xs font-medium leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportSection;