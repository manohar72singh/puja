import React from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

const RecentBookings = ({ bookings = [] }) => {
  return (
    <div
      style={{
        background: "#161b27",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 16 }}>📅</span>
        <span
          style={{
            color: "#f9fafb",
            fontWeight: 700,
            fontSize: 16,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Recent Bookings
        </span>
      </div>

      {/* Bookings List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bookings.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            No recent bookings found.
          </p>
        ) : (
          bookings.map((b, index) => {
            const formattedDate = new Date(b.created_at).toLocaleString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            const statusColors = {
              accepted: "#3b82f6",
              pending: "#f59e0b",
              completed: "#22c55e",
              declined: "#ef4444",
            };

            return (
              <div
                key={index}
                style={{
                  background: "#1c2233",
                  padding: "14px 16px",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      background: "#2a3145",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <BoltIcon width={16} color="#cbd5e1" />
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {b.user_name}
                    </div>
                    <div
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                      }}
                    >
                      {b.puja_name} • {formattedDate}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      color: "#22c55e",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    ₹{Number(b.price).toLocaleString("en-IN")}
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 20,
                      display: "inline-block",
                      background: `${statusColors[b.status]}20`,
                      color: statusColors[b.status],
                      textTransform: "capitalize",
                    }}
                  >
                    {b.status === "accepted"
                      ? "confirmed"
                      : b.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentBookings;