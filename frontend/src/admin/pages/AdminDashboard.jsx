import React from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

const AdminDashboard = () => {
  const bookings = [
    {
      id: "BK-001",
      name: "Ram Kumar",
      date: "25 Feb 2024",
      status: "Completed",
      amount: "₹5,000",
    },
    {
      id: "BK-002",
      name: "Satyanarayan Katha",
      date: "26 Feb 2024",
      status: "In Progress",
      amount: "₹8,300",
    },
    {
      id: "BK-003",
      name: "Priya Puja",
      date: "27 Feb 2024",
      status: "Completed",
      amount: "₹6,000",
    },
    {
      id: "BK-004",
      name: "Maha Mritunjay",
      date: "27 Feb 2024",
      status: "Pending",
      amount: "₹15,000",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-orange-500 mb-10">
          Admin Panel
        </h1>
        <nav className="space-y-4">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <NavItem icon={<Package size={20} />} label="Operations" />
          <NavItem icon={<Users size={20} />} label="User CRM" />
          <NavItem icon={<ShoppingCart size={20} />} label="Bookings" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>
        <div className="mt-auto pt-10">
          <button className="flex items-center space-x-3 text-gray-400 hover:text-red-400 transition">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section (Banner style from Capture3) */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-6 mb-8 shadow-lg">
          <p className="text-sm opacity-90">Total Revenue (All Time)</p>
          <h2 className="text-4xl font-bold">₹42,801</h2>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Bookings" value="1,700" color="bg-[#1e293b]" />
          <StatCard label="Active Services" value="340" color="bg-[#1e293b]" />
          <StatCard label="Pending Requests" value="12" color="bg-[#1e293b]" />
          <StatCard label="New Users" value="85" color="bg-[#1e293b]" />
        </div>

        {/* Data Table (Based on your last image) */}
        <section className="bg-[#1e293b] rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Booking Stats</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#334155] text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">User Name / ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bookings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#334155] transition">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                    <td className="px-6 py-4 font-bold text-orange-300">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Completed"
                            ? "bg-green-900 text-green-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:underline text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
      active
        ? "bg-orange-500 text-white shadow-md"
        : "text-gray-400 hover:bg-[#334155] hover:text-white"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`${color} p-6 rounded-xl border border-gray-700 shadow-sm`}>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <h4 className="text-2xl font-bold">{value}</h4>
  </div>
);

export default AdminDashboard;
