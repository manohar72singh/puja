import { useEffect, useState } from "react";
import { API } from "../../services/adminApi";
import { ChevronLeft, ChevronRight, IdCard } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // Status filter

  // Fetch bookings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `/bookings?page=${page}&limit=10`;
        if (statusFilter) url += `&status=${statusFilter}`;

        const res = await API.get(url);
        setBookings(res.data.bookings);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page, statusFilter]);

  // Status pill styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500 text-white shadow-emerald-100";
      case "pending":
        return "bg-amber-500 text-white shadow-amber-100";
      case "declined":
        return "bg-rose-500 text-white shadow-rose-100";
      case "accepted":
        return "bg-sky-500 text-white shadow-sky-100";
      default:
        return "bg-gray-400 text-white shadow-gray-200";
    }
  };

  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col overflow-hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
              Booking Logs
            </h2>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
              Management Dashboard
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs px-2 py-1 border rounded-md"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
            <IdCard className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700">
              Total Pages: {totalPages}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-[10px] uppercase tracking-[0.15em] font-black">
                <th className="px-6 py-3 w-24">DB ID</th>
                <th className="px-6 py-3">Booking Identifier</th>
                <th className="px-6 py-3">Customer & Service</th>
                <th className="px-6 py-3 text-center">Assignee</th>
                <th className="px-6 py-3 text-center">Schedule</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50/80 transition-all duration-200 group"
                >
                  <td className="px-6 py-2.5">
                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono text-xs font-bold group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      #{b.id}
                    </span>
                  </td>
                  <td className="px-6 py-2.5">
                    <span className="text-sm font-black text-gray-700 tracking-tight">
                      {b.bookingId}
                    </span>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 leading-none">
                        {b.user_name}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-500 mt-1 uppercase leading-none">
                        {b.puja_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2.5 text-center">
                    <div
                      className={`text-[10px] font-bold px-2 py-1 rounded uppercase inline-block border ${
                        b.pandit_name === "Not Assigned"
                          ? "border-gray-200 text-gray-400 bg-gray-50"
                          : "border-purple-100 text-purple-700 bg-purple-50"
                      }`}
                    >
                      {b.pandit_name}
                    </div>
                  </td>
                  <td className="px-6 py-2.5 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-gray-700 uppercase">
                        {new Date(b.preferred_date).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium lowercase italic">
                        at {b.preferred_time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2.5 text-right font-black text-gray-900 text-sm">
                    ₹{b.price}
                  </td>
                  <td className="px-6 py-2.5 text-center">
                    <span
                      className={`inline-block w-24 py-1.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm border-b-2 border-black/10 ${getStatusStyles(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-gray-100 bg-white flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center px-4 gap-2">
              {[...Array(totalPages)]
                .map((_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 3))
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all border ${
                      page === num
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                        : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
