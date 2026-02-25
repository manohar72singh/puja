import { useEffect, useState } from "react";
import {
  getDashboardData,
  getMonthlyGrowth,
  getTodayBookings,
} from "../../services/adminApi";
import AdminSidebar from "../AdminComponets/AdminSidebar";
import AdminTopbar from "../AdminComponets/AdminTopbar";
import StatCard from "../AdminComponets/StatCard";
import RevenueCard from "../AdminComponets/RevenueCard";
import MonthlyChart from "../AdminComponets/MonthlyChart";
import RecentBookings from "../AdminComponets/RecentBookings";
import Bookings from "../AdminComponets/BookingTable"; // 👈 import this
import Users from "../AdminComponets/Users";
import Services from "../AdminComponets/AdminServices";
import Pandit from "../AdminComponets/Pandit";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    const fetchData = async () => {
      const dashboard = await getDashboardData();
      const monthly = await getMonthlyGrowth();
      const todayBookings = await getTodayBookings();

      setStats({
        ...dashboard.data,
        monthlyGrowth: monthly.data,
        totalTodayBookings: todayBookings.data.totalTodayBookings,
      });
      const formatted = monthly.data.months.map((month, index) => ({
        month,
        bookings: monthly.data.bookings[index],
        revenue: monthly.data.revenue[index],
      }));

      setChartData(formatted);
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      {/* ✅ Pass props here */}
      <AdminSidebar active={active} setActive={setActive} />

      <div className="ml-64 w-full bg-gray-100 min-h-screen">
        <AdminTopbar />

        <div className="p-8 space-y-8">
          {/* 🔥 Dashboard Tab */}
          {active === "Dashboard" && (
            <>
              <div className="grid grid-cols-4 gap-6">
                <StatCard
                  title="Total Bookings"
                  value={stats.totalBookings}
                  color="bg-blue-600"
                />
                <StatCard
                  title="Today Bookings"
                  value={stats.totalTodayBookings}
                  color="bg-purple-600"
                />
                <StatCard
                  title="Users"
                  value={stats.totalUsers}
                  color="bg-indigo-600"
                />
                <StatCard
                  title="Pandits"
                  value={stats.totalPandits}
                  color="bg-pink-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <RevenueCard
                  title="Total Revenue"
                  amount={stats.totalRevenue}
                />
                <RevenueCard
                  title="Today Revenue"
                  amount={stats.todayRevenue}
                />
              </div>

              <MonthlyChart data={chartData} />

              <RecentBookings bookings={stats.recentBookings || []} />
            </>
          )}
          {/* 🔥 Bookings Tab */}
          {active === "Bookings" && <Bookings />}
          {/* 🔥 Users Tab */}
          {active === "Users" && <Users />}
          {/* pandit */}
          {active === "Pandits" && <Pandit />}
          {/* 🔥 Services Tab */}
          {active === "Services" && <Services />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
