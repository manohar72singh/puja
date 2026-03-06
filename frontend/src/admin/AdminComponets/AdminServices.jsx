import React, { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  LayoutGrid, MapPin, Home, CheckCircle2, XCircle
} from "lucide-react";
import ServiceModal from "./ServiceModel";
import { API } from "../../services/adminApi";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [category, setCategory] = useState("");

  const fetchServices = async () => {
    try {
      const { data } = await API.get(`/services`, {
        params: { page, limit: 15, category: category || undefined },
      });
      if (data.success) {
        setServices(data.services);
        setTotalPages(data.totalPages);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchServices(); }, [page, category]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await API.delete(`/services/${id}`);
    fetchServices();
  };

  const typeColor = (type) => {
    const map = {
      home_puja: "bg-sky-900/60 text-sky-300 border border-sky-700",
      katha: "bg-violet-900/60 text-violet-300 border border-violet-700",
      temple_puja: "bg-amber-900/60 text-amber-300 border border-amber-700",
      pind_dan: "bg-rose-900/60 text-rose-300 border border-rose-700",
    };
    return map[type] || "bg-slate-700 text-slate-300 border border-slate-600";
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Product & CMS</h1>
          <p className="text-[12px] text-slate-500">Manage spiritual services and temple data</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-[#131e32] border border-slate-700 text-slate-300 text-xs px-4 py-2.5 rounded-xl outline-none focus:border-orange-500 transition-all"
          >
            <option value="">All Categories</option>
            <option value="home_puja">Home Puja</option>
            <option value="katha">Katha</option>
            <option value="temple_puja">Temple Puja</option>
            <option value="pind_dan">Pind Dan</option>
          </select>

          <button
            onClick={() => { setEditData(null); setOpenModal(true); }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-orange-900/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      <div className="bg-[#131e32] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#0f172a] border-b border-slate-800 text-slate-500 uppercase tracking-widest text-[10px]">
              <th className="px-6 py-4 text-left font-bold">Service Info</th>
              <th className="px-6 py-4 text-center font-bold">Category</th>
              <th className="px-6 py-4 text-center font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Pricing Tier</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-600">
                  <LayoutGrid size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No services found in this category</p>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-[#1a2744] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 text-sm mb-1">{service.puja_name}</span>
                      {["temple_puja", "pind_dan"].includes(service.puja_type) ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-orange-400/70">
                          <MapPin size={12} />
                          <span className="truncate max-w-[180px]">{service.address || "No Address Set"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-sky-400/70">
                          <Home size={12} />
                          <span>Pandit Visit Service</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${typeColor(service.puja_type)}`}>
                      {service.puja_type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase ${
                      service.status === 'active' 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {service.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {service.status || 'active'}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {service.prices?.length > 0 ? (
                        service.prices.slice(0, 2).map((p, idx) => (
                          <span key={idx} className="text-emerald-400 font-mono text-[11px] font-bold">
                            ₹{p.price} <span className="text-[9px] text-slate-500 font-sans uppercase">({p.pricing_type})</span>
                          </span>
                        ))
                      ) : <span className="text-slate-600">—</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditData(service); setOpenModal(true); }} className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination component here */}
      {openModal && <ServiceModal close={() => setOpenModal(false)} editData={editData} refresh={fetchServices} />}
    </div>
  );
};

export default AdminServices;