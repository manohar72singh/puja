// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { API } from "../../services/adminApi";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  IndianRupee,
  User,
  BookOpen,
  Loader2,
  Filter,
} from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: "bg-emerald-400",
  },
  pending: {
    cls: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-400",
  },
  declined: {
    cls: "bg-rose-50 text-rose-500 border-rose-200",
    dot: "bg-rose-400",
  },
  accepted: { cls: "bg-sky-50 text-sky-600 border-sky-200", dot: "bg-sky-400" },
};

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || {
    cls: "bg-slate-50 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  };

const STATUS_COUNTS_COLORS = {
  all: "bg-indigo-50 text-indigo-600 border-indigo-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  accepted: "bg-sky-50 text-sky-600 border-sky-200",
  declined: "bg-rose-50 text-rose-500 border-rose-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/bookings?page=${page}&limit=10`;
        if (statusFilter) url += `&status=${statusFilter}`;
        const res = await API.get(url);
        setBookings(res.data.bookings);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, statusFilter]);

  const filters = ["all", "pending", "accepted", "declined", "completed"];

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-tight">
              Booking Logs
            </h1>
            <p className="text-[11px] text-slate-400">
              All puja booking records
            </p>
          </div>
        </div>

        {/* Total badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <BookOpen size={13} className="text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600">
            {total} Bookings
          </span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 mb-3">
        <Filter size={12} className="text-slate-400" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              setStatusFilter(f === "all" ? "" : f);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border capitalize transition-all ${
              (f === "all" && statusFilter === "") || f === statusFilter
                ? STATUS_COUNTS_COLORS[f] + " shadow-sm"
                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs">Loading bookings…</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <BookOpen size={36} className="mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                No bookings found
              </p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Customer & Service
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Pandit
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, i) => {
                  const st = getStatus(b.status);
                  return (
                    <tr
                      key={b.id}
                      className={`border-b border-slate-50 transition-colors hover:bg-indigo-50/20 ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                    >
                      {/* DB ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{b.id}
                        </span>
                      </td>

                      {/* Booking ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-black text-slate-700 tracking-tight">
                          {b.bookingId}
                        </span>
                      </td>

                      {/* Customer + Service */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[11px] flex-shrink-0">
                            {b.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 leading-none">
                              {b.user_name}
                            </p>
                            <p className="text-[10px] text-indigo-400 font-semibold mt-0.5 uppercase">
                              {b.puja_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Pandit */}
                      <td className="px-4 py-3 text-center">
                        {b.pandit_name === "Not Assigned" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <User size={9} /> Unassigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 font-semibold">
                            <User size={9} /> {b.pandit_name}
                          </span>
                        )}
                      </td>

                      {/* Schedule */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                            <CalendarDays size={9} className="text-slate-400" />
                            {new Date(b.preferred_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 italic">
                            <Clock size={9} /> {b.preferred_time}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-0.5 font-black text-slate-800 text-xs">
                          <IndianRupee size={11} className="text-emerald-500" />
                          {b.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${st.cls}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                          />
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && bookings.length > 0 && (
          <div className="flex justify-between items-center px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[11px] text-slate-400">
              Page <b className="text-slate-600">{page}</b> /{" "}
              <b className="text-slate-600">{totalPages}</b>
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition bg-white"
              >
                <ChevronLeft size={12} /> Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-7 h-7 text-[11px] font-bold rounded-lg transition ${
                      page === pg
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 hover:bg-white bg-white text-slate-500"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition bg-white"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
