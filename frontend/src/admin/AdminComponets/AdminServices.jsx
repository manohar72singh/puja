import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import ServiceModal from "./ServiceModel";
import { API } from "../../services/adminApi";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchServices = async () => {
    const { data } = await API.get(`/services`, {
      params: { page, limit: 12 },
    });
    if (data.success) {
      setServices(data.services);
      setTotalPages(data.totalPages);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

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

  const typeLabel = (type) => {
    const map = {
      home_puja: "Home Puja",
      katha: "Katha",
      temple_puja: "Temple Puja",
      pind_dan: "Pind Dan",
    };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-900">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              Product & CMS
            </h1>
            <p className="text-[11px] text-slate-500">Manage puja services</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-900/40"
        >
          <Plus size={14} /> Add Service
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#131e32] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#0f172a] border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <th className="px-5 py-3 text-left font-semibold">
                Service Name
              </th>
              <th className="px-5 py-3 text-center font-semibold">Category</th>
              <th className="px-5 py-3 text-center font-semibold">Pricing</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-600">
                  <LayoutGrid size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No services found</p>
                </td>
              </tr>
            ) : (
              services.map((service, i) => (
                <tr
                  key={service.id}
                  className={`border-b border-slate-800/60 transition-colors hover:bg-[#1a2744] ${i % 2 !== 0 ? "bg-[#0f172a]/40" : ""}`}
                >
                  {/* Name */}
                  <td className="px-5 py-3">
                    <span className="font-semibold text-slate-200">
                      {service.puja_name}
                    </span>
                  </td>

                  {/* Category badge */}
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${typeColor(service.puja_type)}`}
                    >
                      {typeLabel(service.puja_type)}
                    </span>
                  </td>

                  {/* Prices */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {(service.prices?.length > 0
                        ? service.prices
                        : [
                            {
                              price_id: null,
                              pricing_type: "standard",
                              price: "",
                            },
                          ]
                      ).map((p, index) => (
                        <span
                          key={p.price_id ?? index}
                          className="inline-flex items-center gap-1 bg-emerald-900/40 border border-emerald-800 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        >
                          <span className="text-emerald-600 capitalize">
                            {p.pricing_type}:
                          </span>
                          {p.price ? `₹${p.price}` : "—"}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditData(service);
                          setOpenModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-0.5 px-2.5 py-1.5 text-[11px] font-semibold bg-[#131e32] border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition text-slate-300"
          >
            <ChevronLeft size={12} /> Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`w-7 h-7 text-[11px] font-bold rounded-lg transition ${
                page === index + 1
                  ? "bg-orange-500 text-white shadow-md shadow-orange-900"
                  : "bg-[#131e32] border border-slate-700 text-slate-400 hover:bg-[#1a2744]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-0.5 px-2.5 py-1.5 text-[11px] font-semibold bg-[#131e32] border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition text-slate-300"
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <ServiceModal
          close={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchServices}
        />
      )}
    </div>
  );
};

export default AdminServices;
