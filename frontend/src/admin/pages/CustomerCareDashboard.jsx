// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Users,
//   BookOpen,
//   UserCheck,
//   LayoutDashboard,
//   LogOut,
//   Search,
//   Menu,
//   X,
// } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const CustomerCareDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [pandits, setPandits] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [assignModalOpen, setAssignModalOpen] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [panditSearch, setPanditSearch] = useState("");

//   const token = localStorage.getItem("token");
//   const config = { headers: { Authorization: `Bearer ${token}` } };
//   const navigate = useNavigate();

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/customerCare/dashboard`,
//         config,
//       );
//       setBookings(res.data.bookings || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "pujas") fetchBookings();
//     if (activeTab === "pandits") fetchPandits();
//     if (activeTab === "users") fetchUsers();
//     setIsSidebarOpen(false);
//   }, [activeTab]);

//   useEffect(() => {
//     if (assignModalOpen) fetchPandits();
//   }, [assignModalOpen]);

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.put(
//         `${API_BASE_URL}/customerCare/update-status/${id}`,
//         { status },
//         config,
//       );
//       fetchBookings();
//     } catch (err) {
//       console.error("Status update error", err);
//     }
//   };

//   const openAssignModal = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setAssignModalOpen(true);
//   };

//   const assignPandit = async (panditId) => {
//     if (!selectedBookingId) return;
//     try {
//       await axios.patch(
//         `${API_BASE_URL}/customerCare/assign-pandit/${selectedBookingId}`,
//         { panditId },
//         config,
//       );
//       alert("Pandit Assigned Successfully");
//       setAssignModalOpen(false);
//       setSelectedBookingId(null);
//       fetchBookings();
//     } catch (error) {
//       alert("Assign Failed", error);
//     }
//   };

//   const fetchPandits = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/customerCare/allPandits`,
//         config,
//       );
//       setPandits(res.data.pandits || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/customerCare/allUsers`,
//         config,
//       );
//       setUsers(res.data.users || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBookings = bookings.filter((item) =>
//     item.puja_name?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const filteredPandits = pandits.filter(
//     (p) =>
//       p.phone.includes(panditSearch) ||
//       p.name.toLowerCase().includes(panditSearch.toLowerCase()),
//   );

//   const SidebarItem = ({ id, icon: Icon, label }) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
//         activeTab === id
//           ? "bg-blue-600 text-white border-r-4 border-blue-300"
//           : "text-slate-400 hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       <Icon size={20} />
//       <span className="font-medium">{label}</span>
//     </button>
//   );

//   const handelLogout = () => {
//     localStorage.clear();
//     navigate("/customerCare/signIn");
//   };

//   const statusStyle = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//       case "accepted":
//         return "bg-purple-500/10 text-purple-500 border-purple-500/20";
//       case "completed":
//         return "bg-green-500/10 text-green-500 border-green-500/20";
//       case "declined":
//         return "bg-red-500/10 text-red-500 border-red-500/20";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
//       {/* SIDEBAR */}
//       <div
//         className={`fixed inset-0 z-40 transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {isSidebarOpen && (
//           <div
//             className="absolute inset-0 bg-black/50 md:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>
//         )}

//         <aside className="relative w-64 h-full bg-[#1e293b] border-r border-slate-700 flex flex-col">
//           <div className="p-6 border-b border-slate-700 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
//               <UserCheck /> CarePortal
//             </h2>
//             <button
//               className="md:hidden text-slate-400"
//               onClick={() => setIsSidebarOpen(false)}
//             >
//               <X />
//             </button>
//           </div>
//           <nav className="mt-4 flex-1">
//             <SidebarItem
//               id="overview"
//               icon={LayoutDashboard}
//               label="Overview"
//             />
//             <SidebarItem id="pujas" icon={BookOpen} label="Puja Requests" />
//             <SidebarItem id="users" icon={Users} label="Users" />
//             <SidebarItem id="pandits" icon={Users} label="Pandits" />
//           </nav>
//           <div className="p-4 border-t border-slate-700">
//             <button
//               className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full"
//               onClick={handelLogout}
//             >
//               <LogOut size={18} /> Logout
//             </button>
//           </div>
//         </aside>
//       </div>

//       <main className="flex-1 flex flex-col min-w-0">
//         <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-4 md:px-8">
//           <div className="flex items-center gap-4">
//             <button
//               className="md:hidden text-slate-200"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu />
//             </button>
//             <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
//           </div>

//           {activeTab === "pujas" && (
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-2.5 text-slate-500"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="bg-[#0f172a] border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm w-32 sm:w-64 focus:ring-1 focus:ring-blue-500 outline-none"
//               />
//             </div>
//           )}
//         </header>

//         <section className="p-4 md:p-8 overflow-y-auto">
//           {activeTab === "overview" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
//                 <p className="text-slate-400 text-sm">Total Bookings</p>
//                 <h4 className="text-3xl font-bold">{bookings.length}</h4>
//               </div>
//             </div>
//           )}

//           {(activeTab === "pujas" ||
//             activeTab === "pandits" ||
//             activeTab === "users") && (
//             <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-x-auto">
//               <table className="w-full text-left min-w-[800px]">
//                 <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase">
//                   <tr>
//                     {activeTab === "pujas" ? (
//                       <React.Fragment>
//                         <th className="px-6 py-4">ID</th>
//                         <th className="px-6 py-4">Details</th>
//                         <th className="px-6 py-4">Contact</th>
//                         <th className="px-6 py-4">Date & Time</th>
//                         <th className="px-6 py-4">Price</th>
//                         <th className="px-6 py-4">Status</th>
//                         <th className="px-6 py-4 text-center">Actions</th>
//                       </React.Fragment>
//                     ) : (
//                       <React.Fragment>
//                         <th className="px-6 py-4">ID</th>
//                         <th className="px-6 py-4">Details</th>
//                         <th className="px-6 py-4">Contact</th>
//                         <th className="px-6 py-4">Address</th>
//                         <th className="px-6 py-4">Status</th>
//                         <th className="px-6 py-4 text-center">Actions</th>
//                       </React.Fragment>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-700">
//                   {activeTab === "pujas" &&
//                     filteredBookings.map((puja) => (
//                       <tr key={puja.id} className="hover:bg-slate-800/50">
//                         <td className="px-6 py-4">#{puja.id}</td>
//                         <td className="px-6 py-4">
//                           <div className="font-semibold text-white">
//                             {puja.puja_name}
//                           </div>
//                           <div className="text-xs text-slate-400">
//                             {puja.puja_type}
//                           </div>
//                           <div className="text-xs text-slate-500">
//                             {puja.city}, {puja.state}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm">
//                           <div>{puja.user_name}</div>
//                           <div className="text-xs text-slate-400">
//                             {puja.user_phone}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm">
//                           {new Date(puja.preferred_date).toLocaleDateString()}
//                           <div className="text-xs text-slate-400">
//                             {puja.preferred_time}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-green-400 font-semibold">
//                           ₹{puja.standard_price}
//                         </td>
//                         <td className="px-6 py-4">
//                           <span
//                             className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${statusStyle(puja.status)}`}
//                           >
//                             {puja.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex justify-center gap-2">
//                             {puja.status === "pending" && (
//                               <React.Fragment>
//                                 <button
//                                   onClick={() => openAssignModal(puja.id)}
//                                   className="px-3 py-1 bg-purple-600 text-xs rounded hover:bg-purple-500 text-white"
//                                 >
//                                   Assign
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     updateStatus(puja.id, "declined")
//                                   }
//                                   className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-500 text-white"
//                                 >
//                                   Reject
//                                 </button>
//                               </React.Fragment>
//                             )}
//                             {puja.status === "accepted" && (
//                               <button
//                                 onClick={() =>
//                                   updateStatus(puja.id, "completed")
//                                 }
//                                 className="px-3 py-1 bg-green-600 text-xs rounded hover:bg-green-500 text-white"
//                               >
//                                 Complete
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   {(activeTab === "pandits" || activeTab === "users") &&
//                     (activeTab === "pandits" ? pandits : users).map(
//                       (person, index) => (
//                         <tr
//                           key={index}
//                           className="hover:bg-slate-800/50 transition-colors"
//                         >
//                           <td className="px-6 py-4 font-mono text-blue-400">
//                             #{person.id}
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="font-semibold text-white">
//                               {person.name}
//                             </div>
//                             <div className="text-xs text-slate-400">
//                               Gotra: {person.gotra || "N/A"}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-sm">
//                             <div>{person.phone}</div>
//                             <div className="text-xs text-slate-400">
//                               {person.email}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-sm">
//                             <div className="max-w-[200px] truncate">
//                               {person.address_line1 || "N/A"}
//                             </div>
//                             <div className="text-xs text-slate-400">
//                               {person.city} {person.state}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <span
//                               className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${person.is_blocked ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}
//                             >
//                               {person.is_blocked ? "Blocked" : "Active"}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-center">
//                             <button
//                               className={`px-3 py-1 text-xs rounded text-white ${person.is_blocked ? "bg-green-600" : "bg-red-600"}`}
//                               onClick={() => alert("Block/Unblock API call")}
//                             >
//                               {person.is_blocked ? "Unblock" : "Block"}
//                             </button>
//                           </td>
//                         </tr>
//                       ),
//                     )}
//                 </tbody>
//               </table>
//               {loading && (
//                 <div className="p-10 text-center text-slate-500">
//                   Loading {activeTab}...
//                 </div>
//               )}
//             </div>
//           )}
//         </section>
//       </main>

//       {assignModalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-[#1e293b] w-full max-w-md rounded-xl p-6 border border-slate-700">
//             <h2 className="text-lg font-semibold mb-4 text-white">
//               Assign Pandit
//             </h2>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={panditSearch}
//               onChange={(e) => setPanditSearch(e.target.value)}
//               className="w-full mb-4 px-3 py-2 rounded bg-[#0f172a] border border-slate-600 text-sm text-white"
//             />
//             <div className="max-h-60 overflow-y-auto space-y-2">
//               {filteredPandits.map((pandit) => (
//                 <div
//                   key={pandit.id}
//                   className="flex justify-between items-center bg-[#0f172a] p-3 rounded border border-slate-700"
//                 >
//                   <div className="min-w-0">
//                     <div className="font-medium text-white truncate">
//                       {pandit.name}
//                     </div>
//                     <div className="text-xs text-slate-400">{pandit.phone}</div>
//                   </div>
//                   <button
//                     onClick={() => assignPandit(pandit.id)}
//                     className="ml-2 px-3 py-1 text-xs bg-green-600 rounded hover:bg-green-500 text-white shrink-0"
//                   >
//                     Select
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 text-right">
//               <button
//                 onClick={() => setAssignModalOpen(false)}
//                 className="px-4 py-1 text-xs bg-red-600 rounded hover:bg-red-500 text-white"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerCareDashboard;




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
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Headphones,
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
      await axios.patch(
        `${API_BASE_URL}/customerCare/assign-pandit/${selectedBookingId}`,
        { panditId },
        config
      );
      alert("Pandit Assigned Successfully");
      setAssignModalOpen(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch (error) {
      alert("Assign Failed", error);
    }
  };

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customerCare/allPandits`, config);
      setPandits(res.data.pandits || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/customerCare/allUsers`, config);
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((item) =>
    item.puja_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPandits = pandits.filter(
    (p) =>
      p.phone.includes(panditSearch) ||
      p.name.toLowerCase().includes(panditSearch.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/customerCare/signIn");
  };

  const statusConfig = {
    pending: {
      cls: "bg-amber-400/10 text-amber-400 border-amber-400/25 ring-1 ring-amber-400/20",
      dot: "bg-amber-400",
      icon: <Clock size={10} />,
    },
    accepted: {
      cls: "bg-violet-400/10 text-violet-400 border-violet-400/25 ring-1 ring-violet-400/20",
      dot: "bg-violet-400",
      icon: <CheckCircle size={10} />,
    },
    completed: {
      cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/25 ring-1 ring-emerald-400/20",
      dot: "bg-emerald-400",
      icon: <CheckCircle size={10} />,
    },
    declined: {
      cls: "bg-rose-400/10 text-rose-400 border-rose-400/25 ring-1 ring-rose-400/20",
      dot: "bg-rose-400",
      icon: <XCircle size={10} />,
    },
  };

  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "pujas", icon: BookOpen, label: "Puja Requests" },
    { id: "users", icon: Users, label: "Users" },
    { id: "pandits", icon: UserCheck, label: "Pandits" },
  ];

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: <BookOpen size={22} />,
      color: "from-blue-500/20 to-blue-600/5",
      accent: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: <Clock size={22} />,
      color: "from-amber-500/20 to-amber-600/5",
      accent: "text-amber-400",
      border: "border-amber-500/20",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: <CheckCircle size={22} />,
      color: "from-emerald-500/20 to-emerald-600/5",
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: <Users size={22} />,
      color: "from-violet-500/20 to-violet-600/5",
      accent: "text-violet-400",
      border: "border-violet-500/20",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .cc-root {
          font-family: 'Sora', sans-serif;
          background: #060d1a;
          min-height: 100vh;
          color: #cbd5e1;
        }

        .sidebar {
          width: 260px;
          background: linear-gradient(160deg, #0d1829 0%, #0a1220 100%);
          border-right: 1px solid rgba(99,179,237,0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .sidebar-logo {
          padding: 28px 24px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1));
          border: 1px solid rgba(99,179,237,0.2);
          border-radius: 12px;
          padding: 8px 14px;
        }

        .logo-badge span {
          font-size: 15px;
          font-weight: 700;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.3px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          margin: 3px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid transparent;
          text-decoration: none;
          background: none;
          width: calc(100% - 24px);
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(99,179,237,0.06);
          color: #94a3b8;
          border-color: rgba(99,179,237,0.08);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.08));
          color: #93c5fd;
          border-color: rgba(59,130,246,0.25);
          box-shadow: 0 0 20px rgba(59,130,246,0.08) inset;
        }

        .nav-item .nav-indicator {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          margin-left: auto;
          opacity: 0;
        }

        .nav-item.active .nav-indicator { opacity: 1; }

        .logout-btn {
          margin: 12px;
          padding: 11px 16px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.15);
          border-radius: 10px;
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          width: calc(100% - 24px);
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.3);
        }

        .main-area {
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 64px;
          background: rgba(13,24,41,0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .page-title {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-title::before {
          content: '';
          width: 4px; height: 18px;
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 4px;
        }

        .search-wrap {
          position: relative;
        }

        .search-wrap svg {
          position: absolute;
          left: 12px; top: 50%;
          transform: translateY(-50%);
          color: #475569;
        }

        .search-input {
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(99,179,237,0.1);
          border-radius: 10px;
          padding: 8px 14px 8px 38px;
          font-size: 13px;
          color: #cbd5e1;
          font-family: 'Sora', sans-serif;
          width: 240px;
          outline: none;
          transition: all 0.2s;
        }

        .search-input::placeholder { color: #475569; }
        .search-input:focus {
          border-color: rgba(59,130,246,0.35);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }

        .content-area {
          padding: 32px;
          flex: 1;
        }

        /* STAT CARDS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(13,24,41,0.9), rgba(10,18,32,0.95));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          opacity: 0.6;
        }

        .stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 6px;
          font-family: 'JetBrains Mono', monospace;
        }

        .stat-label {
          font-size: 12px;
          color: #475569;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* TABLE */
        .table-container {
          background: linear-gradient(160deg, #0d1829 0%, #080f1c 100%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }

        .table-header {
          padding: 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-title {
          font-size: 15px;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.3px;
        }

        .count-badge {
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.2);
          color: #60a5fa;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: rgba(5,10,20,0.5);
        }

        th {
          padding: 14px 20px;
          font-size: 10px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.025);
          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.15s;
        }

        tbody tr:hover {
          background: rgba(59,130,246,0.03);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .cell-primary {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .cell-sub {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }

        .id-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #3b82f6;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.15);
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-block;
        }

        .price-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #34d399;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
        }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
        }

        /* ACTION BUTTONS */
        .btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
          font-family: 'Sora', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-assign {
          background: rgba(139,92,246,0.15);
          color: #a78bfa;
          border-color: rgba(139,92,246,0.25);
        }
        .btn-assign:hover {
          background: rgba(139,92,246,0.25);
          border-color: rgba(139,92,246,0.4);
        }

        .btn-reject {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border-color: rgba(239,68,68,0.2);
        }
        .btn-reject:hover {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.35);
        }

        .btn-complete {
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border-color: rgba(52,211,153,0.2);
        }
        .btn-complete:hover {
          background: rgba(52,211,153,0.2);
          border-color: rgba(52,211,153,0.35);
        }

        .btn-block {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border-color: rgba(239,68,68,0.2);
        }
        .btn-block:hover {
          background: rgba(239,68,68,0.2);
        }

        .btn-unblock {
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border-color: rgba(52,211,153,0.2);
        }
        .btn-unblock:hover {
          background: rgba(52,211,153,0.2);
        }

        /* LOADING */
        .loading-row {
          padding: 60px;
          text-align: center;
          color: #334155;
        }

        .loading-spinner {
          display: inline-block;
          width: 24px; height: 24px;
          border: 2px solid rgba(59,130,246,0.1);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* MOBILE OVERLAY */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 40;
        }

        .hamburger {
          display: none;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          padding: 8px;
          color: #60a5fa;
          cursor: pointer;
          margin-right: 12px;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-box {
          background: linear-gradient(160deg, #0d1829, #080f1c);
          border: 1px solid rgba(99,179,237,0.12);
          border-radius: 20px;
          padding: 28px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 20px;
          letter-spacing: -0.4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-search {
          width: 100%;
          background: rgba(5,10,20,0.8);
          border: 1px solid rgba(99,179,237,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: #cbd5e1;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }

        .modal-search:focus {
          border-color: rgba(59,130,246,0.35);
        }

        .modal-search::placeholder { color: #475569; }

        .pandit-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(5,10,20,0.5);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          transition: border-color 0.2s;
        }

        .pandit-item:hover {
          border-color: rgba(59,130,246,0.2);
          background: rgba(59,130,246,0.04);
        }

        .btn-select {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(52,211,153,0.12);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-select:hover {
          background: rgba(52,211,153,0.22);
          border-color: rgba(52,211,153,0.35);
        }

        .btn-close {
          padding: 8px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .btn-close:hover {
          background: rgba(239,68,68,0.18);
        }

        /* MOBILE CARD VIEW (for tables) */
        .mobile-cards {
          display: none;
        }

        .booking-card {
          background: linear-gradient(135deg, rgba(13,24,41,0.95), rgba(8,15,28,0.95));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }

        .booking-card:hover {
          border-color: rgba(59,130,246,0.15);
        }

        .card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-overlay {
            display: block;
          }
          .main-area {
            margin-left: 0;
          }
          .hamburger {
            display: flex;
          }
          .content-area {
            padding: 16px;
          }
          .topbar {
            padding: 0 16px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .stat-card {
            padding: 16px;
          }
          .stat-value {
            font-size: 24px;
          }
          /* Hide table, show cards on mobile */
          .desktop-table {
            display: none;
          }
          .mobile-cards {
            display: block;
          }
          .search-input {
            width: 160px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
        }
      `}</style>

      <div className="cc-root">
        {/* SIDEBAR MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-badge">
              <Headphones size={18} color="#60a5fa" />
              <span>CarePortal</span>
            </div>
            <p style={{ fontSize: 11, color: "#334155", marginTop: 8, letterSpacing: "0.5px" }}>
              Customer Support Dashboard
            </p>
          </div>

          <nav style={{ flex: 1, padding: "12px 0", marginTop: 4 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                <ChevronRight size={14} className="nav-indicator" />
              </button>
            ))}
          </nav>

          <div style={{ padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-area">
          {/* TOPBAR */}
          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="hamburger" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="page-title">
                {navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
              </div>
            </div>

            {activeTab === "pujas" && (
              <div className="search-wrap">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search puja..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
          </header>

          {/* CONTENT */}
          <div className="content-area">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <>
                <div className="stats-grid">
                  {stats.map((s, i) => (
                    <div key={i} className="stat-card" style={{ background: `linear-gradient(135deg, #0d1829, #080f1c)`, borderColor: `rgba(255,255,255,0.06)` }}>
                      <div
                        className="stat-icon"
                        style={{
                          background: `linear-gradient(135deg, ${
                            ["rgba(59,130,246,0.15)", "rgba(245,158,11,0.15)", "rgba(52,211,153,0.15)", "rgba(139,92,246,0.15)"][i]
                          }, transparent)`,
                          border: `1px solid ${["rgba(59,130,246,0.2)", "rgba(245,158,11,0.2)", "rgba(52,211,153,0.2)", "rgba(139,92,246,0.2)"][i]}`,
                        }}
                      >
                        <span style={{ color: ["#60a5fa", "#fbbf24", "#34d399", "#a78bfa"][i] }}>{s.icon}</span>
                      </div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="table-container">
                  <div className="table-header">
                    <span className="table-title">Recent Puja Requests</span>
                    <span className="count-badge">{bookings.length} total</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Puja</th>
                          <th>User</th>
                          <th>Status</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((puja) => {
                          const sc = statusConfig[puja.status] || {};
                          return (
                            <tr key={puja.id}>
                              <td><span className="id-badge">#{puja.id}</span></td>
                              <td>
                                <div className="cell-primary">{puja.puja_name}</div>
                                <div className="cell-sub">{puja.puja_type}</div>
                              </td>
                              <td>
                                <div className="cell-primary">{puja.user_name}</div>
                                <div className="cell-sub">{puja.user_phone}</div>
                              </td>
                              <td>
                                <span className={`status-badge ${sc.cls}`}>
                                  <span className={`status-dot ${sc.dot}`}></span>
                                  {puja.status}
                                </span>
                              </td>
                              <td><span className="price-badge">₹{puja.standard_price}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {loading && (
                      <div className="loading-row">
                        <div className="loading-spinner"></div>
                        <div>Loading data...</div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── PUJAS TABLE ── */}
            {activeTab === "pujas" && (
              <div className="table-container">
                <div className="table-header">
                  <span className="table-title">All Puja Bookings</span>
                  <span className="count-badge">{filteredBookings.length} results</span>
                </div>

                {/* Desktop Table */}
                <div className="desktop-table" style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Puja Details</th>
                        <th>Customer</th>
                        <th>Date & Time</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((puja) => {
                        const sc = statusConfig[puja.status] || {};
                        return (
                          <tr key={puja.id}>
                            <td><span className="id-badge">#{puja.id}</span></td>
                            <td>
                              <div className="cell-primary">{puja.puja_name}</div>
                              <div className="cell-sub">{puja.puja_type}</div>
                              <div className="cell-sub">{puja.city}, {puja.state}</div>
                            </td>
                            <td>
                              <div className="cell-primary">{puja.user_name}</div>
                              <div className="cell-sub">{puja.user_phone}</div>
                            </td>
                            <td>
                              <div className="cell-primary">
                                {new Date(puja.preferred_date).toLocaleDateString()}
                              </div>
                              <div className="cell-sub">{puja.preferred_time}</div>
                            </td>
                            <td><span className="price-badge">₹{puja.standard_price}</span></td>
                            <td>
                              <span className={`status-badge ${sc.cls}`}>
                                <span className={`status-dot ${sc.dot}`}></span>
                                {puja.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                                {puja.status === "pending" && (
                                  <>
                                    <button className="btn btn-assign" onClick={() => openAssignModal(puja.id)}>
                                      Assign
                                    </button>
                                    <button className="btn btn-reject" onClick={() => updateStatus(puja.id, "declined")}>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {puja.status === "accepted" && (
                                  <button className="btn btn-complete" onClick={() => updateStatus(puja.id, "completed")}>
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {loading && (
                    <div className="loading-row">
                      <div className="loading-spinner"></div>
                      <div style={{ marginTop: 8 }}>Loading bookings...</div>
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={{ padding: "16px" }}>
                  {filteredBookings.map((puja) => {
                    const sc = statusConfig[puja.status] || {};
                    return (
                      <div key={puja.id} className="booking-card">
                        <div className="card-row">
                          <div>
                            <div className="cell-primary">{puja.puja_name}</div>
                            <div className="cell-sub">{puja.puja_type} · {puja.city}</div>
                          </div>
                          <span className={`status-badge ${sc.cls}`}>
                            <span className={`status-dot ${sc.dot}`}></span>
                            {puja.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Customer</div>
                            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{puja.user_name}</div>
                            <div className="cell-sub">{puja.user_phone}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Date</div>
                            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                              {new Date(puja.preferred_date).toLocaleDateString()}
                            </div>
                            <div className="cell-sub">{puja.preferred_time}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Price</div>
                            <span className="price-badge">₹{puja.standard_price}</span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <span className="id-badge">#{puja.id}</span>
                          {puja.status === "pending" && (
                            <>
                              <button className="btn btn-assign" onClick={() => openAssignModal(puja.id)}>Assign</button>
                              <button className="btn btn-reject" onClick={() => updateStatus(puja.id, "declined")}>Reject</button>
                            </>
                          )}
                          {puja.status === "accepted" && (
                            <button className="btn btn-complete" onClick={() => updateStatus(puja.id, "completed")}>Complete</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {loading && (
                    <div className="loading-row">
                      <div className="loading-spinner"></div>
                      <div style={{ marginTop: 8 }}>Loading...</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── PANDITS / USERS TABLE ── */}
            {(activeTab === "pandits" || activeTab === "users") && (
              <div className="table-container">
                <div className="table-header">
                  <span className="table-title">
                    {activeTab === "pandits" ? "All Pandits" : "All Users"}
                  </span>
                  <span className="count-badge">
                    {(activeTab === "pandits" ? pandits : users).length} total
                  </span>
                </div>

                {/* Desktop */}
                <div className="desktop-table" style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Details</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === "pandits" ? pandits : users).map((person, idx) => (
                        <tr key={idx}>
                          <td><span className="id-badge">#{person.id}</span></td>
                          <td>
                            <div className="cell-primary">{person.name}</div>
                            <div className="cell-sub">Gotra: {person.gotra || "N/A"}</div>
                          </td>
                          <td>
                            <div className="cell-primary">{person.phone}</div>
                            <div className="cell-sub">{person.email}</div>
                          </td>
                          <td>
                            <div className="cell-primary" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {person.address_line1 || "N/A"}
                            </div>
                            <div className="cell-sub">{person.city} {person.state}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${person.is_blocked ? "bg-rose-400/10 text-rose-400 border-rose-400/25 ring-1 ring-rose-400/20" : "bg-emerald-400/10 text-emerald-400 border-emerald-400/25 ring-1 ring-emerald-400/20"}`}>
                              <span className={`status-dot ${person.is_blocked ? "bg-rose-400" : "bg-emerald-400"}`}></span>
                              {person.is_blocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className={`btn ${person.is_blocked ? "btn-unblock" : "btn-block"}`}
                              onClick={() => alert("Block/Unblock API call")}
                            >
                              {person.is_blocked ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && (
                    <div className="loading-row">
                      <div className="loading-spinner"></div>
                      <div style={{ marginTop: 8 }}>Loading {activeTab}...</div>
                    </div>
                  )}
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={{ padding: "16px" }}>
                  {(activeTab === "pandits" ? pandits : users).map((person, idx) => (
                    <div key={idx} className="booking-card">
                      <div className="card-row">
                        <div>
                          <div className="cell-primary">{person.name}</div>
                          <div className="cell-sub">Gotra: {person.gotra || "N/A"}</div>
                        </div>
                        <span className={`status-badge ${person.is_blocked ? "bg-rose-400/10 text-rose-400 border-rose-400/25 ring-1 ring-rose-400/20" : "bg-emerald-400/10 text-emerald-400 border-emerald-400/25 ring-1 ring-emerald-400/20"}`}>
                          <span className={`status-dot ${person.is_blocked ? "bg-rose-400" : "bg-emerald-400"}`}></span>
                          {person.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Phone</div>
                          <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{person.phone}</div>
                          <div className="cell-sub">{person.email}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>Location</div>
                          <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{person.city || "N/A"}</div>
                          <div className="cell-sub">{person.state}</div>
                        </div>
                      </div>
                      <div className="card-actions">
                        <span className="id-badge">#{person.id}</span>
                        <button
                          className={`btn ${person.is_blocked ? "btn-unblock" : "btn-block"}`}
                          onClick={() => alert("Block/Unblock API call")}
                        >
                          {person.is_blocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="loading-row">
                      <div className="loading-spinner"></div>
                      <div style={{ marginTop: 8 }}>Loading...</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── ASSIGN PANDIT MODAL ── */}
        {assignModalOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-title">
                <UserCheck size={20} color="#60a5fa" />
                Assign Pandit
              </div>
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={panditSearch}
                onChange={(e) => setPanditSearch(e.target.value)}
                className="modal-search"
              />
              <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
                {filteredPandits.map((pandit) => (
                  <div key={pandit.id} className="pandit-item">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>
                        {pandit.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{pandit.phone}</div>
                    </div>
                    <button className="btn-select" onClick={() => assignPandit(pandit.id)}>
                      Select
                    </button>
                  </div>
                ))}
                {filteredPandits.length === 0 && (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#334155", fontSize: 13 }}>
                    No pandits found
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <button className="btn-close" onClick={() => setAssignModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerCareDashboard;