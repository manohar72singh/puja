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
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customerCare/dashboard`, config);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pujas") fetchBookings();
    if (activeTab === "pandits") fetchPandits();
    if (activeTab === "users") fetchUsers();
    setIsSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (assignModalOpen) fetchPandits();
  }, [assignModalOpen]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/customerCare/update-status/${id}`, { status }, config);
      fetchBookings();
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const openAssignModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setAssignModalOpen(true);
  };

  const assignPandit = async (panditId) => {
    if (!selectedBookingId) return;
    try {
      await axios.patch(`${API_BASE_URL}/customerCare/assign-pandit/${selectedBookingId}`, { panditId }, config);
      alert("Pandit Assigned Successfully");
      setAssignModalOpen(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch (error) {
      alert("Assign Failed");
    }
  };

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customerCare/allPandits`, config);
      setPandits(res.data.pandits || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customerCare/allUsers`, config);
      setUsers(res.data.users || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const filteredBookings = bookings.filter((item) =>
    item.puja_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPandits = pandits.filter((p) =>
      p.phone.includes(panditSearch) || p.name.toLowerCase().includes(panditSearch.toLowerCase())
  );

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
        activeTab === id
          ? "bg-blue-600 text-white border-r-4 border-blue-300"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const handelLogout = () => {
    localStorage.clear();
    navigate('/customerCare/signIn');
  };

  const statusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "accepted": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "declined": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-0 z-40 transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {isSidebarOpen && (
            <div className="absolute inset-0 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        
        <aside className="relative w-64 h-full bg-[#1e293b] border-r border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <UserCheck /> CarePortal
            </h2>
            <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-4 flex-1">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
            <SidebarItem id="pujas" icon={BookOpen} label="Puja Requests" />
            <SidebarItem id="users" icon={Users} label="Users" />
            <SidebarItem id="pandits" icon={Users} label="Pandits" />
          </nav>
          <div className="p-4 border-t border-slate-700">
            <button className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full" onClick={handelLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-200" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
             <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
          </div>
          
          {activeTab === "pujas" && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0f172a] border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm w-32 sm:w-64 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </header>

        <section className="p-4 md:p-8 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm">Total Bookings</p>
                <h4 className="text-3xl font-bold">{bookings.length}</h4>
              </div>
            </div>
          )}

          {(activeTab === "pujas" || activeTab === "pandits" || activeTab === "users") && (
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase">
                  <tr>
                    {activeTab === "pujas" ? (
                      <React.Fragment>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </React.Fragment>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {activeTab === "pujas" && filteredBookings.map((puja) => (
                    <tr key={puja.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">#{puja.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{puja.puja_name}</div>
                        <div className="text-xs text-slate-400">{puja.puja_type}</div>
                        <div className="text-xs text-slate-500">{puja.city}, {puja.state}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>{puja.user_name}</div>
                        <div className="text-xs text-slate-400">{puja.user_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(puja.preferred_date).toLocaleDateString()}
                        <div className="text-xs text-slate-400">{puja.preferred_time}</div>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-semibold">₹{puja.standard_price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${statusStyle(puja.status)}`}>
                          {puja.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                        {puja.status === "pending" && (
                          <React.Fragment>
                            <button onClick={() => openAssignModal(puja.id)} className="px-3 py-1 bg-purple-600 text-xs rounded hover:bg-purple-500 text-white">Assign</button>
                            <button onClick={() => updateStatus(puja.id, "declined")} className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-500 text-white">Reject</button>
                          </React.Fragment>
                        )}
                        {puja.status === "accepted" && (
                          <button onClick={() => updateStatus(puja.id, "completed")} className="px-3 py-1 bg-green-600 text-xs rounded hover:bg-green-500 text-white">Complete</button>
                        )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === "pandits" || activeTab === "users") && (activeTab === "pandits" ? pandits : users).map((person, index) => (
                    <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-blue-400">#{person.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{person.name}</div>
                        <div className="text-xs text-slate-400">Gotra: {person.gotra || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>{person.phone}</div>
                        <div className="text-xs text-slate-400">{person.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-[200px] truncate">{person.address_line1 || "N/A"}</div>
                        <div className="text-xs text-slate-400">{person.city} {person.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${person.is_blocked ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
                          {person.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className={`px-3 py-1 text-xs rounded text-white ${person.is_blocked ? "bg-green-600" : "bg-red-600"}`} onClick={() => alert("Block/Unblock API call")}>
                          {person.is_blocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div className="p-10 text-center text-slate-500">Loading {activeTab}...</div>}
            </div>
          )}
        </section>
      </main>

      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] w-full max-w-md rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-white">Assign Pandit</h2>
            <input
              type="text"
              placeholder="Search..."
              value={panditSearch}
              onChange={(e) => setPanditSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-[#0f172a] border border-slate-600 text-sm text-white"
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredPandits.map((pandit) => (
                <div key={pandit.id} className="flex justify-between items-center bg-[#0f172a] p-3 rounded border border-slate-700">
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">{pandit.name}</div>
                    <div className="text-xs text-slate-400">{pandit.phone}</div>
                  </div>
                  <button onClick={() => assignPandit(pandit.id)} className="ml-2 px-3 py-1 text-xs bg-green-600 rounded hover:bg-green-500 text-white shrink-0">Select</button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setAssignModalOpen(false)} className="px-4 py-1 text-xs bg-red-600 rounded hover:bg-red-500 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCareDashboard;