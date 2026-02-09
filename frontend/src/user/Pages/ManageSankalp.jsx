import React, { useEffect, useState } from 'react';
import { ChevronLeft, Users, Plus, ShieldCheck, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageSankalp = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/get-members", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMembers(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this family member?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/delete-member/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        // UI se turant hatane ke liye state filter kar do
        setMembers(members.filter(m => m.id !== id));
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-6 font-sans antialiased">
      <div className="max-w-xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-8 text-[#1A2B47] font-bold hover:opacity-70 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span className="text-sm">Back</span>
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
            Manage Sankalp
          </h1>
          <p className="text-[#8E97A4] text-[11px] font-bold tracking-[0.15em] uppercase mt-1">
            Family details for sacred rituals
          </p>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="py-20 text-center  text-orange-400 animate-pulse font-bold italic">
            Connecting to your family details...
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-[32px] py-16 px-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] mb-8 border border-orange-200">
            <div className="w-20 h-20 bg-[#FFF9F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-orange-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A2B47] mb-3">No family members yet</h2>
            <p className="text-[#6B7280] text-[15px] max-w-[280px] mx-auto">
              Add family details for easier sankalp during future puja bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white p-6 rounded-[24px] shadow-sm border border-orange-200 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#FFF9F2] text-[#FF822D] rounded-2xl">
                      <User size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2B47] leading-none mb-1.5">
                        {member.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-orange-50 text-[#FF822D] text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {member.relation}
                      </span>
                    </div>
                  </div>

                  {/* DELETE BUTTON (Icon Style) */}
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-[#8E97A4] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Member"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-6 text-[13px] border-t border-orange-50 pt-4">
                  {member.rashi && (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#8E97A4] font-bold uppercase">Rashi</span>
                      <span className="font-semibold text-[#1A2B47]">{member.rashi}</span>
                    </div>
                  )}
                  {member.gotra && (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#8E97A4] font-bold uppercase">Gotra</span>
                      <span className="font-semibold text-[#1A2B47]">{member.gotra}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={() => navigate('/manageSankalp/add')}
          className="w-full bg-[#FF822D] hover:bg-[#E66F1C] text-white py-4 rounded-[20px] flex justify-center items-center gap-2 font-bold text-lg shadow-[0_10px_25px_-5px_rgba(255,130,45,0.4)] transition-all active:scale-95"
        >
          <Plus size={22} strokeWidth={3} />
          <span>Add Family Member</span>
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 text-[#8E97A4] font-bold text-[10px] tracking-[0.2em] uppercase">
          <ShieldCheck size={14} className="text-emerald-500" />
          100% Secure & Private
        </div>
      </div>
    </div>
  );
};

export default ManageSankalp;