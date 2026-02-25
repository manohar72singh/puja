import React, { useState, useEffect } from "react";
import { Phone, Mail, ChevronRight, ArrowLeft, Headphones, MessageSquare, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpSupportSection = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/puja/my-support-queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setConversations(Array.isArray(result) ? result : result.data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const faqs = [
    { question: "How do I cancel a booking?", answer: "You can cancel a booking from the 'My Bookings' section." },
    { question: "Do I need to arrange Samagri?", answer: "No, we offer optional Samagri kits." },
    { question: "How are Pandits verified?", answer: "All our Pandits undergo a thorough verification process." },
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-8 font-sans antialiased text-[#2D2D2D]">
      <div className="max-w-xl mx-auto">

        {/* Back Button */}
        <button className="flex items-center gap-1 text-gray-500 text-sm font-bold mb-8 hover:text-orange-500 transition-colors" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md">
            <span className="text-2xl font-bold">?</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">How can we help you?</h1>
          <p className="text-gray-500 text-sm font-medium">Choose a way to reach us or browse FAQs</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div onClick={() => navigate("/help/support")} className="cursor-pointer">
            <ContactCard icon={<Headphones className="text-green-500" size={24} />} title="Talk to Support" sub="Live assistance" />
          </div>
          <ContactCard icon={<Phone className="text-blue-500" size={24} />} title="Call Support" sub="+91 98765 43210" />
          <ContactCard icon={<Mail className="text-purple-500" size={24} />} title="Email Us" sub="Detailed queries" />
        </div>

        {/* My Support Tickets Section */}
        <div className="bg-white rounded-[1rem] border border-orange-100 p-6 md:p-8 shadow-sm mb-8">
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-6">My Support Tickets</h3>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">Fetching your tickets...</p>
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((query, i) => (
                <div key={i} className="p-5 bg-white rounded-2xl border border-orange-200 shadow-sm hover:border-orange-300 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-bold text-gray-800 mb-1">{query.subject}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{query.message}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider ${query.status === "Open" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
                      }`}>
                      {query.status === "Open" ? "● Open" : "✓ Resolved"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-md uppercase">
                      {query.category}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {new Date(query.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <MessageSquare size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No support tickets found</p>
            </div>
          )}
        </div>

        {/* FAQ Section - Bottom */}
        <div className="bg-white rounded-[2rem] border border-orange-100 p-6 md:p-8 shadow-sm mb-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Common Questions</h3>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.question} a={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ContactCard = ({ icon, title, sub }) => (
  <div className="bg-white p-4 rounded-2xl border border-orange-200 text-center flex flex-col items-center hover:shadow-xl hover:border-orange-300 transition-all duration-300">
    <div className="mb-4 bg-gray-50 p-4 rounded-full">{icon}</div>
    <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
    <p className="text-xs text-gray-400 font-medium">{sub}</p>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="py-3 cursor-pointer border-b border-orange-50 last:border-none"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="text-[15px] text-gray-700 font-bold leading-tight pr-5">
          {q}
        </span>
        <ChevronRight
          size={18}
          className={`text-orange-400 transition-transform duration-300 shrink-0 ${open ? "rotate-90" : ""}`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
          {a}
        </p>
      </div>
    </div>
  );
};
export default HelpSupportSection;