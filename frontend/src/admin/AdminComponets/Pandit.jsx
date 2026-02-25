import { useEffect, useState, useCallback } from "react";
import { API } from "../../services/adminApi";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  ShieldCheck,
  X,
  User,
  Phone,
  Mail,
  Hash,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Pandits() {
  const [pandits, setPandits] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPandit, setEditingPandit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gotra: "",
    email: "",
    phone: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPandits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/pandits?page=${page}&limit=10&search=${search}`,
      );
      setPandits(res.data.pandits);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      showToast("Failed to fetch pandits", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPandits();
  }, [fetchPandits]);

  const openAddModal = () => {
    setEditingPandit(null);
    setFormData({ name: "", gotra: "", email: "", phone: "" });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingPandit(p);
    setFormData({
      name: p.name,
      gotra: p.gotra || "",
      email: p.email || "",
      phone: p.phone,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPandit(null);
    setFormData({ name: "", gotra: "", email: "", phone: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone)
      return showToast("Name and phone are required", "error");
    setActionLoading("form");
    try {
      if (editingPandit) {
        await API.put(`/pandits/${editingPandit.id}`, formData);
        showToast("Pandit updated successfully");
      } else {
        await API.post(`/pandits`, formData);
        showToast("Pandit created successfully");
      }
      closeModal();
      await fetchPandits();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pandit?")) return;
    setActionLoading(id);
    try {
      await API.delete(`/pandits/${id}`);
      showToast("Pandit deleted");
      await fetchPandits();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBlock = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/pandits/block/${id}`);
      showToast("Status updated");
      await fetchPandits();
    } catch {
      showToast("Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const activeCount = pandits.filter((p) => !p.is_blocked).length;
  const blockedCount = pandits.filter((p) => p.is_blocked).length;

  const avatarColor = (name) => {
    const colors = [
      "bg-violet-100 text-violet-600",
      "bg-sky-100 text-sky-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
      "bg-emerald-100 text-emerald-600",
      "bg-orange-100 text-orange-600",
      "bg-teal-100 text-teal-600",
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-rose-500 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.message}
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-tight">
              Pandit Management
            </h1>
            <p className="text-[11px] text-slate-400">
              Manage registered pandits
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
        >
          <Plus size={14} /> Add Pandit
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          {
            label: "Total Pandits",
            value: total ?? "—",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100",
          },
          {
            label: "Active",
            value: activeCount,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            label: "Blocked",
            value: blockedCount,
            color: "bg-rose-50 text-rose-500 border-rose-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold ${s.color}`}
          >
            <span className="opacity-70">{s.label}</span>
            <span className="text-base font-extrabold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or phone…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {search && (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              Results for "
              <span className="font-semibold text-slate-600">{search}</span>"
            </span>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-xs">Loading…</span>
            </div>
          ) : pandits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <Users size={36} className="mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                No pandits found
              </p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-2.5 text-left font-semibold">
                    Pandit
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold">Gotra</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Phone</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Email</th>
                  <th className="px-4 py-2.5 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pandits.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-50 transition-colors ${
                      actionLoading === p.id
                        ? "opacity-40 pointer-events-none"
                        : "hover:bg-indigo-50/20"
                    } ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${avatarColor(p.name)}`}
                        >
                          {p.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {p.gotra || <span className="text-slate-200">—</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-600">
                      {p.phone}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 max-w-[140px] truncate">
                      {p.email || <span className="text-slate-200">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.is_blocked
                            ? "bg-rose-50 text-rose-500 border-rose-200"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.is_blocked ? "bg-rose-400" : "bg-emerald-400"}`}
                        />
                        {p.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => toggleBlock(p.id)}
                          title={p.is_blocked ? "Unblock" : "Block"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.is_blocked
                              ? "text-slate-300 hover:text-emerald-600 hover:bg-emerald-50"
                              : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"
                          }`}
                        >
                          {actionLoading === p.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : p.is_blocked ? (
                            <ShieldCheck size={13} />
                          ) : (
                            <ShieldOff size={13} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && pandits.length > 0 && (
          <div className="flex justify-between items-center px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-400">
              Page <b className="text-slate-600">{page}</b> /{" "}
              <b className="text-slate-600">{totalPages}</b>
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition bg-white"
              >
                <ChevronLeft size={12} /> Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-7 h-7 text-[11px] font-bold rounded-lg transition ${
                      page === pg
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 hover:bg-white bg-white text-slate-500"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition bg-white"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL — side drawer on mobile, centered on desktop */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-end sm:justify-center z-40"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full sm:max-w-sm h-full sm:h-auto sm:rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <User size={15} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingPandit ? "Edit Pandit" : "Add Pandit"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingPandit ? "Update details" : "Register new pandit"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3 flex-1">
              {[
                {
                  icon: User,
                  key: "name",
                  placeholder: "Full Name *",
                  type: "text",
                },
                {
                  icon: Hash,
                  key: "gotra",
                  placeholder: "Gotra (optional)",
                  type: "text",
                },
                {
                  icon: Phone,
                  key: "phone",
                  placeholder: "Phone Number *",
                  type: "tel",
                },
                {
                  icon: Mail,
                  key: "email",
                  placeholder: "Email (optional)",
                  type: "email",
                },
              ].map(({ icon: Icon, key, placeholder, type }) => (
                <div key={key} className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => {
                      if (key === "phone" && e.target.value.length > 10) return;
                      setFormData({ ...formData, [key]: e.target.value });
                    }}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 placeholder:text-slate-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={actionLoading === "form"}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 shadow-md shadow-indigo-100"
              >
                {actionLoading === "form" ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>{editingPandit ? "Update" : "Create"} Pandit</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
