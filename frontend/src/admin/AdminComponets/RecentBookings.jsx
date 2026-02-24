import React from "react";

const RecentBookings = ({ bookings }) => {
  console.log("Recent Bookings:", bookings); // Debugging log
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <span className="text-sm text-gray-500">
          Last {bookings.length} bookings
        </span>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center p-4 border rounded-xl hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">{b.bookingId}</p>
              <p className="text-sm text-gray-500">
                {b.user_name} • {b.puja_name}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-green-600">₹ {b.price}</p>
              <span
                className={`text-xs px-3 py-1 rounded-full 
                ${
                  b.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "declined"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;
