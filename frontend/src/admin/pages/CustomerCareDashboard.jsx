import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  BookOpen,
  UserCheck,
  LayoutDashboard,
  LogOut,
  Search,
  Menu,
  X,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Headphones,
  Loader2,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Tag,
  AlignLeft,
  CheckCheck,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/* ── Booking Status config ── */
const STATUS_CFG = {
  pending: {
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/25",
    dot: "bg-amber-400",
  },
  accepted: {
    badge: "bg-violet-400/10 text-violet-400 border border-violet-400/25",
    dot: "bg-violet-400",
  },
  completed: {
    badge: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  declined: {
    badge: "bg-rose-400/10 text-rose-400 border border-rose-400/25",
    dot: "bg-rose-400",
  },
};
const getStatus = (s) =>
  STATUS_CFG[s?.toLowerCase()] || {
    badge: "bg-slate-700 text-slate-400 border border-slate-600",
    dot: "bg-slate-500",
  };

/* ── Query Status config ── */
const QUERY_STATUS_CFG = {
  Open: {
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/25",
    dot: "bg-amber-400",
  },
  Resolved: {
    badge: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  Closed: {
    badge: "bg-slate-500/10 text-slate-400 border border-slate-500/25",
    dot: "bg-slate-500",
  },
};
const getQueryStatus = (s) =>
  QUERY_STATUS_CFG[s] || {
    badge: "bg-slate-700 text-slate-400 border border-slate-600",
    dot: "bg-slate-500",
  };

/* ── StatusBadge (bookings) ── */
const StatusBadge = ({ status }) => {
  const cfg = getStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {status}
    </span>
  );
};

/* ── QueryStatusBadge ── */
const QueryStatusBadge = ({ status }) => {
  const cfg = getQueryStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {status}
    </span>
  );
};

/* ── IdBadge ── */
const IdBadge = ({ id }) => (
  <span className="font-mono text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/15 px-2 py-0.5 rounded-md">
    #{id}
  </span>
);

/* ── StatCard ── */
const StatCard = ({ label, value, icon, gradient, iconColor }) => (
  <div
    className={`rounded-2xl border border-white/5 p-5 bg-gradient-to-br ${gradient} hover:-translate-y-0.5 transition-transform duration-200`}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${iconColor.bg} ${iconColor.border}`}
    >
      <span className={iconColor.text}>{icon}</span>
    </div>
    <div className="font-mono text-3xl font-bold text-slate-100 tracking-tight leading-none mb-1">
      {value}
    </div>
    <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
      {label}
    </div>
  </div>
);

/* ── TableCard ── */
const TableCard = ({ title, count, children }) => (
  <div className="bg-gradient-to-br from-[#0d1829] to-[#080f1c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
      <span className="text-sm font-bold text-slate-200 tracking-tight">
        {title}
      </span>
      <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/15 px-2.5 py-1 rounded-full">
        {count}
      </span>
    </div>
    {children}
  </div>
);

/* ── LoadingRow ── */
const LoadingRow = ({ cols }) => (
  <tr>
    <td colSpan={cols} className="py-16 text-center">
      <Loader2
        size={22}
        className="animate-spin text-blue-500/50 mx-auto mb-2"
      />
      <span className="text-xs text-slate-600">Loading...</span>
    </td>
  </tr>
);

/* ── Th ── */
const Th = ({ children, center }) => (
  <th
    className={`px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest ${center ? "text-center" : "text-left"}`}
  >
    {children}
  </th>
);

const CustomerCareDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pandits, setPandits] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [panditSearch, setPanditSearch] = useState("");

  // Queries
  const [queries, setQueries] = useState([]);
  const [queryPage, setQueryPage] = useState(1);
  const [queryTotalPages, setQueryTotalPages] = useState(1);
  const [queryTotal, setQueryTotal] = useState(0);
  const [queryStatusFilter, setQueryStatusFilter] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [queryActionLoading, setQueryActionLoading] = useState(null);
  const [expandedQuery, setExpandedQuery] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  /* ── Fetchers ── */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/customerCare/dashboard`,
        config,
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/customerCare/allPandits`,
        config,
      );
      setPandits(res.data.pandits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/customerCare/allUsers`,
        config,
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuery = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/customerCare/support-queries?page=${queryPage}&limit=10`;
      if (queryStatusFilter) url += `&status=${queryStatusFilter}`;
      const res = await axios.get(url, config);
      setQueries(res.data.queries || []);
      setQueryTotal(res.data.total || 0);
      setQueryTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overview" || activeTab === "pujas") fetchBookings();
    if (activeTab === "pandits") fetchPandits();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "querys") fetchQuery();
    setIsSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "querys") fetchQuery();
  }, [queryPage, queryStatusFilter]);

  useEffect(() => {
    if (assignModalOpen) fetchPandits();
  }, [assignModalOpen]);

  /* ── Actions ── */
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/customerCare/update-status/${id}`,
        { status },
        config,
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQueryStatus = async (id, status) => {
    setQueryActionLoading(id);
    try {
      await axios.put(
        `${API_BASE_URL}/customerCare/support-queries/${id}/status`,
        { status },
        config,
      );
      await fetchQuery();
    } catch (err) {
      console.error(err);
    } finally {
      setQueryActionLoading(null);
    }
  };

  const assignPandit = async (panditId) => {
    if (!selectedBookingId) return;
    try {
      await axios.patch(
        `${API_BASE_URL}/customerCare/assign-pandit/${selectedBookingId}`,
        { panditId },
        config,
      );
      setAssignModalOpen(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch (err) {
      console.log("error", err);
      alert("Assign Failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/customerCare/signIn");
  };

  /* ── Filtered lists ── */
  const filteredBookings = bookings.filter((b) =>
    b.puja_name?.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredPandits = pandits.filter(
    (p) =>
      p.phone.includes(panditSearch) ||
      p.name.toLowerCase().includes(panditSearch.toLowerCase()),
  );
  const filteredQueries = queries.filter(
    (q) =>
      q.subject?.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.user_name?.toLowerCase().includes(querySearch.toLowerCase()),
  );

  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "pujas", icon: BookOpen, label: "Puja Requests" },
    { id: "users", icon: Users, label: "Users" },
    { id: "pandits", icon: UserCheck, label: "Pandits" },
    { id: "querys", icon: MessageSquare, label: "Support Queries" },
  ];

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: <BookOpen size={20} />,
      gradient: "from-[#0d1829] to-[#080f1c]",
      iconColor: {
        bg: "bg-blue-500/15",
        border: "border-blue-500/20",
        text: "text-blue-400",
      },
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: <Clock size={20} />,
      gradient: "from-[#0d1829] to-[#080f1c]",
      iconColor: {
        bg: "bg-amber-500/15",
        border: "border-amber-500/20",
        text: "text-amber-400",
      },
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: <CheckCircle size={20} />,
      gradient: "from-[#0d1829] to-[#080f1c]",
      iconColor: {
        bg: "bg-emerald-500/15",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
      },
    },
    {
      label: "Total Users",
      value: users.length,
      icon: <Users size={20} />,
      gradient: "from-[#0d1829] to-[#080f1c]",
      iconColor: {
        bg: "bg-violet-500/15",
        border: "border-violet-500/20",
        text: "text-violet-400",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#060d1a] text-slate-300 flex">
      {/* Sidebar overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] z-50 flex flex-col
        bg-gradient-to-b from-[#0d1829] to-[#0a1220] border-r border-blue-500/[0.07]
        transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-7 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 border border-blue-400/20 rounded-xl px-3.5 py-2.5 w-fit">
            <Headphones size={18} className="text-blue-400" />
            <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              CarePortal
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-2.5 tracking-wider uppercase">
            Customer Support
          </p>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500/15 to-indigo-500/8 text-blue-300 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.06)_inset]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
                }`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight size={14} className="ml-auto text-blue-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/[0.07] border border-rose-500/15 hover:bg-rose-500/[0.12] hover:border-rose-500/25 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col md:ml-[260px] min-w-0">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 h-16 bg-[#0d1829]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-base font-bold text-slate-200 tracking-tight">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
              {navItems.find((n) => n.id === activeTab)?.label}
            </div>
          </div>

          {/* Search bars in topbar */}
          {(activeTab === "pujas" || activeTab === "querys") && (
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder={
                  activeTab === "pujas" ? "Search puja..." : "Search queries..."
                }
                value={activeTab === "pujas" ? search : querySearch}
                onChange={(e) =>
                  activeTab === "pujas"
                    ? setSearch(e.target.value)
                    : setQuerySearch(e.target.value)
                }
                className="bg-[#0f172a]/80 border border-blue-500/10 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 placeholder:text-slate-600 w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30"
              />
            </div>
          )}
        </header>

        {/* CONTENT */}
        <div className="p-4 md:p-8 flex-1">
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <StatCard key={i} {...s} />
                ))}
              </div>
              <TableCard
                title="Recent Puja Requests"
                count={`${bookings.length} total`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#05080f]/60 border-b border-white/[0.03]">
                      <tr>
                        <Th>ID</Th>
                        <Th>Puja</Th>
                        <Th>User</Th>
                        <Th>Status</Th>
                        <Th>Price</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.025]">
                      {loading ? (
                        <LoadingRow cols={5} />
                      ) : (
                        bookings.slice(0, 6).map((b) => (
                          <tr
                            key={b.id}
                            className="hover:bg-blue-500/[0.03] transition-colors"
                          >
                            <td className="px-5 py-4">
                              <IdBadge id={b.id} />
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-200">
                                {b.puja_name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {b.puja_type}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-200">
                                {b.user_name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {b.user_phone}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={b.status} />
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                ₹{b.standard_price}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TableCard>
            </>
          )}

          {/* ── PUJAS ── */}
          {activeTab === "pujas" && (
            <TableCard
              title="All Puja Bookings"
              count={`${filteredBookings.length} results`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#05080f]/60 border-b border-white/[0.03]">
                    <tr>
                      <Th>ID</Th>
                      <Th>Puja Details</Th>
                      <Th>Customer</Th>
                      <Th>Schedule</Th>
                      <Th>Price</Th>
                      <Th>Status</Th>
                      <Th center>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.025]">
                    {loading ? (
                      <LoadingRow cols={7} />
                    ) : (
                      filteredBookings.map((puja) => (
                        <tr
                          key={puja.id}
                          className="hover:bg-blue-500/[0.03] transition-colors"
                        >
                          <td className="px-5 py-4">
                            <IdBadge id={puja.id} />
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-200">
                              {puja.puja_name}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 capitalize">
                              {puja.puja_type}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                              <MapPin size={9} /> {puja.city}, {puja.state}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-200">
                              {puja.user_name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                              <Phone size={9} /> {puja.user_phone}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                              <CalendarDays
                                size={10}
                                className="text-slate-500"
                              />
                              {new Date(puja.preferred_date).toLocaleDateString(
                                "en-IN",
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 italic">
                              <Clock size={9} /> {puja.preferred_time}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              ₹{puja.standard_price}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={puja.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {puja.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedBookingId(puja.id);
                                      setAssignModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition"
                                  >
                                    Assign
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateStatus(puja.id, "declined")
                                    }
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {puja.status === "accepted" && (
                                <button
                                  onClick={() =>
                                    updateStatus(puja.id, "completed")
                                  }
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          )}

          {/* ── PANDITS / USERS ── */}
          {(activeTab === "pandits" || activeTab === "users") && (
            <TableCard
              title={activeTab === "pandits" ? "All Pandits" : "All Users"}
              count={`${(activeTab === "pandits" ? pandits : users).length} total`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#05080f]/60 border-b border-white/[0.03]">
                    <tr>
                      <Th>ID</Th>
                      <Th>Details</Th>
                      <Th>Contact</Th>
                      <Th>Address</Th>
                      <Th>Status</Th>
                      <Th center>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.025]">
                    {loading ? (
                      <LoadingRow cols={6} />
                    ) : (
                      (activeTab === "pandits" ? pandits : users).map(
                        (person, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-500/[0.03] transition-colors"
                          >
                            <td className="px-5 py-4">
                              <IdBadge id={person.id} />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-[11px] flex-shrink-0">
                                  {person.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-200">
                                    {person.name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    Gotra: {person.gotra || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                                <Phone size={9} className="text-slate-500" />{" "}
                                {person.phone}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                                <Mail size={9} /> {person.email || "—"}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-slate-300 text-[11px] max-w-[160px] truncate">
                                {person.address_line1 || "N/A"}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                                <MapPin size={9} /> {person.city} {person.state}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                  person.is_blocked
                                    ? "bg-rose-400/10 text-rose-400 border-rose-400/25"
                                    : "bg-emerald-400/10 text-emerald-400 border-emerald-400/25"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${person.is_blocked ? "bg-rose-400" : "bg-emerald-400"}`}
                                />
                                {person.is_blocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => alert("Block/Unblock API call")}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
                                  person.is_blocked
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                }`}
                              >
                                {person.is_blocked ? "Unblock" : "Block"}
                              </button>
                            </td>
                          </tr>
                        ),
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          )}

          {/* ── SUPPORT QUERIES ── */}
          {activeTab === "querys" && (
            <div className="space-y-4">
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Total",
                    value: queryTotal,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    label: "Open",
                    value: queries.filter((q) => q.status === "Open").length,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                  },
                  {
                    label: "Resolved",
                    value: queries.filter((q) => q.status === "Resolved")
                      .length,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border ${s.bg}`}
                  >
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${s.color} opacity-70`}
                    >
                      {s.label}
                    </span>
                    <span className={`font-mono text-xl font-bold ${s.color}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  {
                    val: "",
                    label: "All",
                    active: "bg-blue-500/15 text-blue-400 border-blue-500/25",
                  },
                  {
                    val: "Open",
                    label: "Open",
                    active:
                      "bg-amber-500/15 text-amber-400 border-amber-500/25",
                  },
                  {
                    val: "Resolved",
                    label: "Resolved",
                    active:
                      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
                  },
                  {
                    val: "Closed",
                    label: "Closed",
                    active:
                      "bg-slate-500/15 text-slate-400 border-slate-500/25",
                  },
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => {
                      setQueryStatusFilter(f.val);
                      setQueryPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      queryStatusFilter === f.val
                        ? f.active
                        : "bg-transparent text-slate-500 border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <TableCard title="Support Queries" count={`${queryTotal} total`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#05080f]/60 border-b border-white/[0.03]">
                      <tr>
                        <Th>ID</Th>
                        <Th>User</Th>
                        <Th>Category</Th>
                        <Th>Subject & Message</Th>
                        <Th>Date</Th>
                        <Th center>Status</Th>
                        <Th center>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.025]">
                      {loading ? (
                        <LoadingRow cols={7} />
                      ) : filteredQueries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-16 text-center">
                            <MessageSquare
                              size={28}
                              className="mx-auto mb-2 text-slate-700"
                            />
                            <span className="text-xs text-slate-600">
                              No queries found
                            </span>
                          </td>
                        </tr>
                      ) : (
                        filteredQueries.map((q) => (
                          <React.Fragment key={q.id}>
                            <tr
                              className={`transition-colors hover:bg-blue-500/[0.03] ${queryActionLoading === q.id ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              {/* ID */}
                              <td className="px-5 py-4">
                                <IdBadge id={q.id} />
                              </td>

                              {/* User */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-[11px] flex-shrink-0">
                                    {q.user_name?.charAt(0).toUpperCase() ||
                                      "?"}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-200">
                                      {q.user_name || "Unknown"}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                                      <Mail size={8} /> {q.user_email || "—"}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="px-5 py-4">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold whitespace-nowrap">
                                  <Tag size={8} /> {q.category}
                                </span>
                              </td>

                              {/* Subject + Message */}
                              <td className="px-5 py-4 max-w-[220px]">
                                <p className="font-semibold text-slate-200 truncate">
                                  {q.subject}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                  {q.message}
                                </p>
                                <button
                                  onClick={() =>
                                    setExpandedQuery(
                                      expandedQuery === q.id ? null : q.id,
                                    )
                                  }
                                  className="mt-1 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                                >
                                  <AlignLeft size={9} />
                                  {expandedQuery === q.id
                                    ? "Hide"
                                    : "Read full"}
                                </button>
                              </td>

                              {/* Date */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                                  <CalendarDays
                                    size={9}
                                    className="text-slate-500"
                                  />
                                  {new Date(q.created_at).toLocaleDateString(
                                    "en-IN",
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5 ml-3.5">
                                  {new Date(q.created_at).toLocaleTimeString(
                                    "en-IN",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4 text-center">
                                <QueryStatusBadge status={q.status} />
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  {q.status === "Open" && (
                                    <button
                                      onClick={() =>
                                        updateQueryStatus(q.id, "Resolved")
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition whitespace-nowrap"
                                    >
                                      {queryActionLoading === q.id ? (
                                        <Loader2
                                          size={11}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <CheckCheck size={11} />
                                      )}
                                      Resolve
                                    </button>
                                  )}
                                  {q.status !== "Closed" && (
                                    <button
                                      onClick={() =>
                                        updateQueryStatus(q.id, "Closed")
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition whitespace-nowrap"
                                    >
                                      <XCircle size={11} /> Close
                                    </button>
                                  )}
                                  {q.status === "Closed" && (
                                    <span className="text-[10px] text-slate-600 italic">
                                      No actions
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Expanded full message row */}
                            {expandedQuery === q.id && (
                              <tr className="bg-[#05080f]/40">
                                <td colSpan={7} className="px-8 py-4">
                                  <div className="bg-[#0a1220] border border-white/[0.06] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <AlignLeft
                                        size={12}
                                        className="text-blue-400"
                                      />
                                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Full Message
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                      {q.message}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.04]">
                                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                        <Phone size={9} /> {q.user_phone || "—"}
                                      </span>
                                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                        <Mail size={9} /> {q.user_email || "—"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {queryTotalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-slate-500">
                      Page <b className="text-slate-400">{queryPage}</b> /{" "}
                      <b className="text-slate-400">{queryTotalPages}</b>
                    </span>
                    <div className="flex gap-1">
                      <button
                        disabled={queryPage === 1}
                        onClick={() => setQueryPage(queryPage - 1)}
                        className="px-3 py-1 text-[11px] font-semibold bg-[#05080f]/60 border border-white/[0.06] rounded-lg disabled:opacity-30 hover:bg-white/[0.04] transition text-slate-400"
                      >
                        Prev
                      </button>
                      {Array.from(
                        { length: Math.min(queryTotalPages, 5) },
                        (_, i) => {
                          const pg =
                            queryTotalPages <= 5
                              ? i + 1
                              : queryPage <= 3
                                ? i + 1
                                : queryPage >= queryTotalPages - 2
                                  ? queryTotalPages - 4 + i
                                  : queryPage - 2 + i;
                          return (
                            <button
                              key={pg}
                              onClick={() => setQueryPage(pg)}
                              className={`w-7 h-7 text-[11px] font-bold rounded-lg transition ${
                                queryPage === pg
                                  ? "bg-blue-600 text-white"
                                  : "bg-[#05080f]/60 border border-white/[0.06] text-slate-500 hover:bg-white/[0.04]"
                              }`}
                            >
                              {pg}
                            </button>
                          );
                        },
                      )}
                      <button
                        disabled={queryPage === queryTotalPages}
                        onClick={() => setQueryPage(queryPage + 1)}
                        className="px-3 py-1 text-[11px] font-semibold bg-[#05080f]/60 border border-white/[0.06] rounded-lg disabled:opacity-30 hover:bg-white/[0.04] transition text-slate-400"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </TableCard>
            </div>
          )}
        </div>
      </main>

      {/* ── ASSIGN PANDIT MODAL ── */}
      {assignModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setAssignModalOpen(false)
          }
        >
          <div className="bg-gradient-to-br from-[#0d1829] to-[#080f1c] border border-blue-400/12 rounded-2xl p-6 w-full max-w-sm shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <UserCheck size={15} className="text-blue-400" />
                </div>
                <span className="font-bold text-slate-200">Assign Pandit</span>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={panditSearch}
                onChange={(e) => setPanditSearch(e.target.value)}
                className="w-full bg-[#05080f]/80 border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/25"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredPandits.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-600">
                  No pandits found
                </div>
              ) : (
                filteredPandits.map((pandit) => (
                  <div
                    key={pandit.id}
                    className="flex items-center justify-between bg-[#05080f]/60 border border-white/[0.04] rounded-xl px-3.5 py-3 hover:border-blue-500/20 hover:bg-blue-500/[0.04] transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-[11px] flex-shrink-0">
                        {pandit.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">
                          {pandit.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {pandit.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => assignPandit(pandit.id)}
                      className="ml-3 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition flex-shrink-0"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.04] flex justify-end">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/18 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCareDashboard;
