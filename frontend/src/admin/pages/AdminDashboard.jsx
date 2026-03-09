import { useEffect, useState } from "react";
import {
  getDashboardData,
  getMonthlyGrowth,
  getTodayBookings,
} from "../../services/adminApi";
import RecentBookings from "../AdminComponets/RecentBookings";
import Bookings from "../AdminComponets/BookingTable";
import Users from "../AdminComponets/Users";
import Services from "../AdminComponets/AdminServices";
import Pandit from "../AdminComponets/Pandit";
import FinancialDashboard from "../AdminComponets/financialDashboard";

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    dashboard: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    bookings: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    users: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="8" cy="7" r="4" />
        <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
        <circle cx="17" cy="9" r="3" />
        <path d="M22 21v-1a5 5 0 0 0-7-4.6" />
      </svg>
    ),
    pandits: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M12 2v2M8.5 3.5l1 1.5M15.5 3.5l-1 1.5" />
      </svg>
    ),
    services: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    logout: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    refresh: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    wifi: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line
          x1="12"
          y1="20"
          x2="12.01"
          y2="20"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    ),
    financial: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M6 3h12M6 8h12M9 21l6-10H9l6-8" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const menus = [
    { label: "God View", icon: "dashboard" },
    { label: "Product & CMS", icon: "services" },
    { label: "Bookings", icon: "bookings" },
    { label: "Users", icon: "users" },
    { label: "Pandits", icon: "pandits" },
    { label: "Finance", icon: "financial" },
  ];

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#0f1117",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: "24px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            color: "#6b7280",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          MODULES
        </p>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "12px 12px", flex: 1 }}>
        {menus.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                background: isActive ? "rgba(234,88,12,0.18)" : "transparent",
                color: isActive ? "#fb923c" : "#9ca3af",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ active }) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        height: 64,
        background: "#0f1117",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Left: back arrow + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
          }}
        >
          🕉
        </div>
        <div>
          <div style={{ color: "#f9fafb", fontSize: 14, fontWeight: 700 }}>
            Super Admin Control
          </div>
          <div style={{ color: "#6b7280", fontSize: 11 }}>
            Sri Vedic Puja • admin@srivedicpuja.com
          </div>
        </div>
      </div>

      {/* Right: logout */}
      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/";
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          color: "#d1d5db",
          padding: "8px 14px",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          e.currentTarget.style.color = "#f87171";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#d1d5db";
        }}
      >
        <Icon name="logout" />
        Logout
      </button>
    </div>
  );
};

// ─── God View Dashboard Header ────────────────────────────────────────────────
const GodViewHeader = ({ stats, onRefresh }) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* Page title row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              color: "#f9fafb",
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            God View Dashboard
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: 13,
              margin: "4px 0 0",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Real-time overview of all operations
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#22c55e",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Icon name="wifi" />
            <span>Live</span>
          </div>
          <button
            onClick={onRefresh}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#d1d5db",
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Icon name="refresh" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orange banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)",
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 4,
            }}
          >
            Total Revenue (All Time)
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 4,
            }}
          >
            Total Bookings
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {stats.totalBookings || 0}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 11,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 4,
            }}
          >
            Last Updated
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {time}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── God View Stat Tile ───────────────────────────────────────────────────────
const GodTile = ({ icon, value, label, iconBg }) => (
  <div
    style={{
      background: "#161b27",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "border-color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        color: "#f9fafb",
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {value}
    </div>
    <div
      style={{
        color: "#6b7280",
        fontSize: 12,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [active, setActive] = useState("God View");

  const fetchData = async () => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map sidebar active label to internal tab
  const getTab = () => {
    if (active === "God View") return "Dashboard";
    return active;
  };

  const tab = getTab();

  return (
    <>
      {/* Google font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div
        style={{ display: "flex", background: "#0d1117", minHeight: "100vh" }}
      >
        {/* Sidebar */}
        <Sidebar active={active} setActive={setActive} />

        {/* Main content */}
        <div
          style={{
            marginLeft: 220,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Topbar */}
          <Topbar active={active} />

          {/* Page body */}
          <div style={{ padding: "28px 28px", flex: 1 }}>
            {/* ── Dashboard / God View ── */}
            {tab === "Dashboard" && (
              <>
                <GodViewHeader stats={stats} onRefresh={fetchData} />

                {/* 6 stat tiles */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <GodTile
                    icon="🕉"
                    iconBg="rgba(139,92,246,0.2)"
                    value={stats.totalBookings ?? 0}
                    label="Total Booking"
                  />
                  <GodTile
                    icon="⏳"
                    iconBg="rgba(234,179,8,0.2)"
                    value={stats.totalPendingBookings ?? 6}
                    label="Pending Requests"
                  />
                  <GodTile
                    icon="₹"
                    iconBg="rgba(34,197,94,0.2)"
                    value={`₹${stats.todayRevenue ?? 0}`}
                    label="Today's Revenue"
                  />
                  <GodTile
                    icon="📈"
                    iconBg="rgba(59,130,246,0.2)"
                    value={`₹${stats.commission ?? 0}`}
                    label="Commission (30%)"
                  />
                  <GodTile
                    icon="👤"
                    iconBg="rgba(249,115,22,0.2)"
                    value={stats.pendingVerifications ?? 0}
                    label="Pending Verifications"
                  />
                  <GodTile
                    icon="📦"
                    iconBg="rgba(20,184,166,0.2)"
                    value={stats.dispatchPending ?? 3}
                    label="Dispatch Pending"
                  />
                </div>

                {/* All clear banner */}
                <div
                  style={{
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span
                    style={{ color: "#22c55e", fontSize: 18, marginTop: 1 }}
                  >
                    ⚠
                  </span>
                  <div>
                    <div
                      style={{
                        color: "#22c55e",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      All Clear – No At-Risk Bookings
                    </div>
                    <div
                      style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}
                    >
                      All upcoming bookings have pandits assigned. Great job!
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <RecentBookings bookings={stats.recentBookings || []} />
              </>
            )}

            {tab === "Product & CMS" && <Services />}
            {tab === "Bookings" && <Bookings />}
            {tab === "Users" && <Users />}
            {tab === "Pandits" && <Pandit />}
            {tab === "Finance" && <FinancialDashboard />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
