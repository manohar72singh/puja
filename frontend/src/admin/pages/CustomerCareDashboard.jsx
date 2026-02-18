import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, UserCheck, LayoutDashboard, LogOut, Search } from 'lucide-react'; // Icons ke liye

const CustomerCareDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ users: [], pandits: [], pujas: [] });
  const [loading, setLoading] = useState(false);

  // API calls handle karne ke liye (Aapke backend endpoints ke mutabiq)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Example endpoints (Inhe apne backend se match karein)
        // const resUsers = await axios.get('http://localhost:5000/customerCare/all-users', config);
        // const resPujas = await axios.get('http://localhost:5000/customerCare/all-pujas', config);
        
        // Dummy data for UI Preview
        setData({
          users: [{ id: 1, name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com' }],
          pandits: [{ id: 1, name: 'Pandit Ji', phone: '9999988888', status: 'Verified' }],
          pujas: [{ id: 101, user: 'Rahul', puja_name: 'Ganesh Puja', status: 'Pending', date: '2024-05-20' }]
        });
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
        activeTab === id ? 'bg-blue-600 text-white border-r-4 border-blue-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700 hidden md:block">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-blue-400 tracking-tight flex items-center gap-2">
            <UserCheck /> CarePortal
          </h2>
        </div>
        <nav className="mt-4">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="users" icon={Users} label="All Users" />
          <SidebarItem id="pandits" icon={UserCheck} label="All Pandits" />
          <SidebarItem id="pujas" icon={BookOpen} label="Puja Requests" />
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700">
          <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-4 py-2 w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-8">
          <h3 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#0f172a] border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </header>

        {/* Dynamic Content Section */}
        <section className="p-8 overflow-y-auto">
          
          {/* Stats Cards (Overview) */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm">Total Users</p>
                <h4 className="text-3xl font-bold text-white">1,240</h4>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm">Active Pandits</p>
                <h4 className="text-3xl font-bold text-green-400">85</h4>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm">New Requests</p>
                <h4 className="text-3xl font-bold text-blue-400">12</h4>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#161e2d] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {activeTab === 'users' && data.users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-blue-400">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">ACTIVE</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-400 hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
                {/* Puja Requests Table Mapping */}
                {activeTab === 'pujas' && data.pujas.map(puja => (
                  <tr key={puja.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm">#{puja.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{puja.puja_name}</div>
                      <div className="text-xs text-slate-500">User: {puja.user}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{puja.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[10px] font-bold bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 uppercase">{puja.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <button className="px-3 py-1 bg-blue-600 text-xs rounded hover:bg-blue-500 text-white">Approve</button>
                      <button className="px-3 py-1 bg-red-600/20 text-red-500 text-xs rounded hover:bg-red-600 hover:text-white">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="p-10 text-center text-slate-500">Loading data...</div>}
          </div>

        </section>
      </main>
    </div>
  );
};

export default CustomerCareDashboard;