import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    BookOpen,
    UserCheck,
    LayoutDashboard,
    LogOut,
    Search,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CustomerCareDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pandits, setPandits] = useState([]);
    const [users, setUsers] = useState([]);

    // Existing states ke neeche add karo
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [panditSearch, setPanditSearch] = useState("");


    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ================= FETCH BOOKINGS =================
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/customerCare/dashboard`,
                config,
            );
            setBookings(res.data.bookings || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (activeTab === "pujas") {
            fetchBookings();
        }

        if (activeTab === "pandits") {
            fetchPandits();
        }

        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab]);

    useEffect(() => {
        if (assignModalOpen) {
            fetchPandits();
        }
    }, [assignModalOpen]);
    // ================= UPDATE STATUS =================
    const updateStatus = async (id, status) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/customerCare/update-status/${id}`,
                { status },
                config,
            );
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
        if (!selectedBookingId) {
            alert("No booking selected");
            return;
        }

        try {
            const res = await axios.patch(
                `${API_BASE_URL}/customerCare/assign-pandit/${selectedBookingId}`,
                { panditId },
                config
            );

            console.log("Assign Response:", res.data);

            alert("Pandit Assigned Successfully");

            setAssignModalOpen(false);
            setSelectedBookingId(null);

            fetchBookings();
        } catch (error) {
            console.error("Assign Error:", error.response || error);
            alert("Assign Failed");
        }
    };



    // get All pandits
    const fetchPandits = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/customerCare/allPandits`,
                config,
            );
            setPandits(res.data.pandits || []);
        } catch (error) {
            console.error("Error fetching pandits:", error);
        } finally {
            setLoading(false);
        }
    };

    // get All users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_BASE_URL}/customerCare/allUsers`,
                config,
            );
            console.log("Users Data:", res.data);
            setUsers(res.data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= SEARCH FILTER =================
    const filteredBookings = bookings.filter((item) =>
        item.puja_name?.toLowerCase().includes(search.toLowerCase()),
    );

    const filteredPandits = pandits.filter((p) =>
        p.phone.includes(panditSearch) ||
        p.name.toLowerCase().includes(panditSearch.toLowerCase())
    );


    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${activeTab === id
                ? "bg-blue-600 text-white border-r-4 border-blue-300"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    const statusStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "assigned":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "completed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "declined":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "";
        }
    };


    return (
        <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
            {/* SIDEBAR */}
            <aside className="w-64 bg-[#1e293b] border-r border-slate-700 hidden md:block">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <UserCheck /> CarePortal
                    </h2>
                </div>
                <nav className="mt-4">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
                    <SidebarItem id="pujas" icon={BookOpen} label="Puja Requests" />
                    <SidebarItem id="users" icon={Users} label="Users" />
                    <SidebarItem id="pandits" icon={Users} label="Pandits" />
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700">
                    <button className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 w-full">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col">
                {/* HEADER */}
                <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-8">
                    <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
                    {activeTab === "pujas" && (
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-2.5 text-slate-500"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search Puja..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-[#0f172a] border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    )}
                </header>

                {/* CONTENT */}
                <section className="p-8 overflow-y-auto">
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                                <p>Total Bookings</p>
                                <h4 className="text-3xl font-bold">{bookings.length}</h4>
                            </div>
                        </div>
                    )}

                    {activeTab === "pujas" && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Details</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Pandit Assign</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-700">
                                    {filteredBookings.map((puja) => (
                                        <tr key={puja.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4">#{puja.id}</td>

                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">
                                                    {puja.puja_name}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    Type: {puja.puja_type}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {puja.address}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {puja.city}, {puja.state}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <div>{puja.user_name}</div>
                                                <div className="text-xs text-slate-400">
                                                    {puja.user_phone}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {new Date(puja.preferred_date).toLocaleDateString()}
                                                <div className="text-xs text-slate-400">
                                                    {puja.preferred_time}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-green-400 font-semibold">
                                                ₹{puja.standard_price}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${statusStyle(
                                                        puja.status,
                                                    )}`}
                                                >
                                                    {puja.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center flex justify-center gap-2">

                                                {puja.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => openAssignModal(puja.id)}
                                                            className="px-3 py-1 bg-purple-600 text-xs rounded hover:bg-purple-500 text-white"
                                                        >
                                                            Assign
                                                        </button>

                                                        <button
                                                            onClick={() => updateStatus(puja.id, "declined")}
                                                            className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-500 text-white"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {puja.status === "assigned" && (
                                                    <button
                                                        onClick={() => updateStatus(puja.id, "completed")}
                                                        className="px-3 py-1 bg-green-600 text-xs rounded hover:bg-green-500 text-white"
                                                    >
                                                        Complete
                                                    </button>
                                                )}

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {loading && (
                                <div className="p-10 text-center text-slate-500">
                                    Loading data...
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "pandits" && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Pandit Details</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-700">
                                    {pandits && pandits.length > 0 ? (
                                        pandits.map((pandit, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-800/50 transition-colors"
                                            >
                                                {/* ID */}
                                                <td className="px-6 py-4 font-mono text-blue-400">
                                                    #{pandit.id}
                                                </td>

                                                {/* Name + Gotra */}
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-white">
                                                        {pandit.name}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        Gotra: {pandit.gotra || "N/A"}
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="px-6 py-4 text-sm">
                                                    <div>{pandit.phone}</div>
                                                    <div className="text-xs text-slate-400">
                                                        {pandit.email}
                                                    </div>
                                                </td>

                                                {/* Address */}
                                                <td className="px-6 py-4 text-sm">
                                                    <div>
                                                        {pandit.address_line1 || "No Address Available"}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {pandit.city || ""} {pandit.state ? "," : ""}{" "}
                                                        {pandit.state}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {pandit.pincode}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${pandit.is_blocked
                                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                            : "bg-green-500/10 text-green-500 border-green-500/20"
                                                            }`}
                                                    >
                                                        {pandit.is_blocked ? "Blocked" : "Active"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        className={`px-3 py-1 text-xs rounded text-white ${pandit.is_blocked
                                                            ? "bg-green-600 hover:bg-green-500"
                                                            : "bg-red-600 hover:bg-red-500"
                                                            }`}
                                                        onClick={() =>
                                                            alert("Block/Unblock API yaha call karein")
                                                        }
                                                    >
                                                        {pandit.is_blocked ? "Unblock" : "Block"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-10 text-slate-500"
                                            >
                                                No Pandits Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {loading && (
                                <div className="p-10 text-center text-slate-500">
                                    Loading Pandits...
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Pandit Details</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-700">
                                    {users && users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-800/50 transition-colors"
                                            >
                                                {/* ID */}
                                                <td className="px-6 py-4 font-mono text-blue-400">
                                                    #{user.id}
                                                </td>

                                                {/* Name + Gotra */}
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        Gotra: {user.gotra || "N/A"}
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="px-6 py-4 text-sm">
                                                    <div>{user.phone}</div>
                                                    <div className="text-xs text-slate-400">
                                                        {user.email}
                                                    </div>
                                                </td>

                                                {/* Address */}
                                                <td className="px-6 py-4 text-sm">
                                                    <div>
                                                        {user.address_line1 || "No Address Available"}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {user.city || ""} {user.state ? "," : ""}{" "}
                                                        {user.state}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {user.pincode}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase ${user.is_blocked
                                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                            : "bg-green-500/10 text-green-500 border-green-500/20"
                                                            }`}
                                                    >
                                                        {user.is_blocked ? "Blocked" : "Active"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        className={`px-3 py-1 text-xs rounded text-white ${user.is_blocked
                                                            ? "bg-green-600 hover:bg-green-500"
                                                            : "bg-red-600 hover:bg-red-500"
                                                            }`}
                                                        onClick={() =>
                                                            alert("Block/Unblock API yaha call karein")
                                                        }
                                                    >
                                                        {user.is_blocked ? "Unblock" : "Block"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-10 text-slate-500"
                                            >
                                                No Pandits Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {loading && (
                                <div className="p-10 text-center text-slate-500">
                                    Loading Pandits...
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {assignModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] w-[500px] rounded-xl p-6 border border-slate-700">

                        <h2 className="text-lg font-semibold mb-4 text-white">
                            Assign Pandit
                        </h2>

                        <input
                            type="text"
                            placeholder="Search by name or phone"
                            value={panditSearch}
                            onChange={(e) => setPanditSearch(e.target.value)}
                            className="w-full mb-4 px-3 py-2 rounded bg-[#0f172a] border border-slate-600 text-sm"
                        />

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredPandits.map((pandit) => (
                                <div
                                    key={pandit.id}
                                    className="flex justify-between items-center bg-[#0f172a] p-3 rounded border border-slate-700"
                                >
                                    <div>
                                        <div className="font-medium text-white">
                                            {pandit.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {pandit.phone}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => assignPandit(pandit.id)}
                                        // onClick={() => {
                                        //     console.log("Assign Clicked", puja.id);
                                        //     openAssignModal(puja.id);
                                        // }}

                                        className="px-3 py-1 text-xs bg-green-600 rounded hover:bg-green-500 text-white"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="px-4 py-1 text-xs bg-red-600 rounded hover:bg-red-500 text-white"
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
