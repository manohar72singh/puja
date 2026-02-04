import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Phone, Mail, Send, ChevronDown, ArrowLeft } from "lucide-react";

const HelpSupportSection = () => {
  // FAQ questions and answers
  const faqs = [
    {
      question: "How do I cancel a booking?",
      answer: "You can cancel a booking from the 'My Bookings' section. Navigate to the booking you want to cancel and click the 'Cancel Booking' button. Please note that cancellations made within 24 hours of the scheduled time may incur a cancellation fee. Refunds are processed within 5-7 business days to your original payment method. For cancellations made more than 24 hours before the puja, you will receive a full refund. Cancellations within 24 hours may have a 20% deduction."
    },
    {
      question: "Do I need to arrange Samagri?",
      answer: "No, we offer optional Samagri kits that include all necessary items for your puja. During booking, you can choose to include our curated Samagri kit which will be delivered to your doorstep before the puja."
    },
    {
      question: "How are Pandits verified?",
      answer: "All our Pandits undergo a thorough verification process including document verification, tradition expertise assessment, and background checks. Each Pandit is rated by previous devotees to ensure quality service."
    },
    {
      question: "What is the refund policy?",
      answer: "Refunds are processed within 5-7 business days to your original payment method. Full refunds are provided if cancellation is done more than 24 hours before the scheduled puja. Cancellations within 24 hours may have a 20% deduction."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-8 font-sans">
      
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-4">
        <button className="flex items-center gap-1 text-gray-400 text-m font-medium hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-[#F59E0B] w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-orange-100">
          <span className="text-xl font-bold">?</span>
        </div>
        <h1 className="text-xl md:text-2xl font-serif font-bold text-[#2D1B0B] mb-1">
          How can we help you?
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Choose a way to reach us or browse FAQs
        </p>
      </div>

      {/* Contact Cards */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ContactCard 
          icon={<div className="bg-green-50 p-2 rounded-full"><MessageCircle className="text-green-500" size={18}/></div>} 
          title="Chat on WhatsApp" 
          sub="Quick responses" 
        />
        <ContactCard 
          icon={<div className="bg-blue-50 p-2 rounded-full"><Phone className="text-blue-500" size={18}/></div>} 
          title="Call Support" 
          sub="+91 98765 43210" 
        />
        <ContactCard 
          icon={<div className="bg-purple-50 p-2 rounded-full"><Mail className="text-purple-500" size={18}/></div>} 
          title="Email Us" 
          sub="Detailed queries" 
        />
      </div>

      {/* FAQ Section */}
      <div className="max-w-xl mx-auto bg-white rounded-[1.5rem] border border-orange-200 shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h3 className="text-base font-bold text-[#2D1B0B] mb-4">Frequently Asked Questions</h3>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="max-w-xl mx-auto bg-white rounded-[1.5rem] border border-orange-200 shadow-md p-6">
        <h3 className="text-base font-bold text-[#2D1B0B] mb-5">Submit a Ticket</h3>
        
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Subject</label>
            <input 
              placeholder="Brief description" 
              className="w-full p-3 bg-[#FFF4E1] border border-orange-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-100 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Message</label>
            <textarea 
              rows="3" 
              placeholder="Describe your issue..." 
              className="w-full p-3 bg-[#FFF4E1] border border-orange-200 rounded-xl text-sm outline-none resize-none focus:ring-1 focus:ring-orange-100"
            ></textarea>
          </div>

          <button className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            <Send size={16} /> Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ icon, title, sub }) => (
  <div className="bg-white p-5 rounded-[1.5rem] border border-orange-200 hover:shadow-md transition-all duration-300 cursor-pointer text-center flex flex-col items-center">
    <div className="mb-2.5">{icon}</div>
    <h4 className="text-sm font-bold text-[#2D1B0B]">{title}</h4>
    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
  </div>
);

// FAQ Item Component - Smooth open/close
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef, answer]);

  return (
    <div
      className="py-3.5 cursor-pointer rounded-xl px-3 hover:bg-orange-50 transition-colors"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs md:text-sm text-gray-600 font-medium">{question}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Smooth height animation */}
      <div
        style={{
          height: open ? `${height}px` : "0px",
        }}
        className="overflow-hidden transition-all duration-300 mt-2"
      >
        <div ref={contentRef} className="text-gray-500 text-[11px] md:text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default HelpSupportSection;
