import React from "react";
import { MessageCircle, Phone, Mail, Send, ChevronDown } from "lucide-react";

const HelpSupportSection = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">?</div>
        <h1 className="text-2xl font-serif font-bold text-[#2D1B0B]">How can we help you?</h1>
        <p className="text-gray-500 text-sm">Choose a way to reach us or browse FAQs</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <ContactCard icon={<MessageCircle className="text-green-500"/>} title="Chat on WhatsApp" sub="Quick responses" />
        <ContactCard icon={<Phone className="text-blue-500"/>} title="Call Support" sub="+91 98765 43210" />
        <ContactCard icon={<Mail className="text-purple-500"/>} title="Email Us" sub="Detailed queries" />
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-orange-50 overflow-hidden mb-10 p-6">
        <h3 className="font-bold text-[#2D1B0B] mb-4 text-left">Frequently Asked Questions</h3>
        {[ "How do I cancel a booking?", "What is the refund policy?", "Do I need to arrange Samagri?", "How are Pandits verified?" ].map((q, i) => (
          <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-orange-50/30 px-2 rounded-lg transition-all">
            <span className="text-sm font-medium text-gray-700">{q}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        ))}
      </div>

      {/* Support Ticket Form */}
      <div className="bg-white rounded-2xl border border-orange-50 p-6 text-left">
        <h3 className="font-bold text-[#2D1B0B] mb-4">Submit a Ticket</h3>
        <div className="space-y-4">
          <input placeholder="Subject" className="w-full p-3 bg-[#FFFCF7] border border-orange-100 rounded-xl outline-none" />
          <textarea rows="4" placeholder="Describe your issue in detail..." className="w-full p-3 bg-[#FFFCF7] border border-orange-100 rounded-xl outline-none resize-none"></textarea>
          <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            <Send size={18} /> Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, sub }) => (
  <div className="bg-white p-6 rounded-2xl border border-orange-50 hover:shadow-md transition-shadow cursor-pointer text-center">
    <div className="flex justify-center mb-3 text-2xl">{icon}</div>
    <h4 className="font-bold text-sm text-[#2D1B0B]">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{sub}</p>
  </div>
);

export default HelpSupportSection;