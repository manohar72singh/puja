// import React, { useEffect, useState } from "react";
// import { API } from "../../services/adminApi";
// import {
//   ChevronLeft,
//   ChevronRight,
//   CalendarDays,
//   Clock,
//   IndianRupee,
//   User,
//   BookOpen,
//   Loader2,
//   Filter,
// } from "lucide-react";

// // Updated Colors for Dark Mode
// const STATUS_CONFIG = {
//   completed: {
//     cls: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
//     dot: "bg-emerald-400",
//   },
//   pending: {
//     cls: "bg-amber-900/30 text-amber-400 border border-amber-800",
//     dot: "bg-amber-400",
//   },
//   declined: {
//     cls: "bg-rose-900/30 text-rose-400 border border-rose-800",
//     dot: "bg-rose-400",
//   },
//   accepted: {
//     cls: "bg-sky-900/30 text-sky-400 border border-sky-800",
//     dot: "bg-sky-400",
//   },
// };

// const getStatus = (status) =>
//   STATUS_CONFIG[status?.toLowerCase()] || {
//     cls: "bg-slate-800 text-slate-400 border border-slate-700",
//     dot: "bg-slate-500",
//   };

// const Bookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         let url = `/bookings?page=${page}&limit=10`;
//         if (statusFilter) url += `&status=${statusFilter}`;
//         const res = await API.get(url);
//         setBookings(res.data.bookings);
//         setTotalPages(res.data.totalPages || 1);
//         setTotal(res.data.totalBookings || 0);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page, statusFilter]);

//   const filters = ["all", "pending", "accepted", "declined", "completed"];

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-5">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
//             <BookOpen size={18} className="text-white" />
//           </div>
//           <div>
//             <h1 className="text-base font-extrabold text-white leading-tight">
//               Booking Logs
//             </h1>
//             <p className="text-[11px] text-slate-500">
//               All puja booking records
//             </p>
//           </div>
//         </div>

//         {/* Total badge */}
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131e32] border border-slate-700 rounded-xl">
//           <BookOpen size={13} className="text-orange-500" />
//           <span className="text-xs font-bold text-slate-300">
//             {total} Bookings
//           </span>
//         </div>
//       </div>

//       {/* Filter Pills */}
//       <div className="flex items-center gap-1.5 mb-4">
//         <Filter size={12} className="text-slate-500 mr-1" />
//         {filters.map((f) => (
//           <button
//             key={f}
//             onClick={() => {
//               setStatusFilter(f === "all" ? "" : f);
//               setPage(1);
//             }}
//             className={`px-3 py-1.5 rounded-full text-[11px] font-bold border capitalize transition-all ${
//               (f === "all" && statusFilter === "") || f === statusFilter
//                 ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-900/20"
//                 : "bg-[#131e32] text-slate-400 border-slate-700 hover:bg-[#1a2744]"
//             }`}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {/* Main Card */}
//       <div className="bg-[#131e32] rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex items-center justify-center py-20 gap-2 text-slate-500">
//               <Loader2 size={20} className="animate-spin" />
//               <span className="text-xs">Loading bookings…</span>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-slate-600">
//               <BookOpen size={36} className="mb-2 opacity-30" />
//               <p className="text-xs font-semibold">No bookings found</p>
//             </div>
//           ) : (
//             <table className="w-full text-xs">
//               <thead>
//                 <tr className="bg-[#0f172a] border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
//                   <th className="px-5 py-3 text-left font-semibold">
//                     Booking ID
//                   </th>
//                   <th className="px-5 py-3 text-left font-semibold">
//                     Customer & Service
//                   </th>
//                   <th className="px-5 py-3 text-center font-semibold">
//                     Pandit
//                   </th>
//                   <th className="px-5 py-3 text-center font-semibold">
//                     Schedule
//                   </th>
//                   <th className="px-5 py-3 text-right font-semibold">Price</th>
//                   <th className="px-5 py-3 text-center font-semibold">
//                     Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {bookings.map((b, i) => {
//                   const st = getStatus(b.status);
//                   return (
//                     <tr
//                       key={b.id}
//                       className={`border-b border-slate-800/60 transition-colors hover:bg-[#1a2744] ${i % 2 !== 0 ? "bg-[#0f172a]/40" : ""}`}
//                     >
//                       <td className="px-5 py-4">
//                         <span className="font-mono text-[11px] font-black text-slate-300 tracking-tight">
//                           {b.bookingId}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2">
//                           <div className="w-7 h-7 rounded-lg bg-orange-900/30 flex items-center justify-center text-orange-400 font-bold text-[11px] flex-shrink-0">
//                             {b.user_name?.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-slate-200 leading-none">
//                               {b.user_name}
//                             </p>
//                             <p className="text-[10px] text-slate-500 font-semibold mt-0.5 uppercase">
//                               {b.puja_name}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-5 py-4 text-center">
//                         {b.pandit_name === "Not Assigned" ? (
//                           <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-[#0f172a] px-2 py-0.5 rounded-full border border-slate-800">
//                             <User size={9} /> Unassigned
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 text-[10px] text-violet-300 bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-800 font-semibold">
//                             <User size={9} /> {b.pandit_name}
//                           </span>
//                         )}
//                       </td>

//                       <td className="px-5 py-4 text-center">
//                         <div className="flex flex-col items-center gap-0.5">
//                           <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300">
//                             <CalendarDays size={9} className="text-slate-500" />
//                             {new Date(b.preferred_date).toLocaleDateString(
//                               "en-IN",
//                               {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               },
//                             )}
//                           </span>
//                           <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
//                             <Clock size={9} /> {b.preferred_time}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-5 py-4 text-right">
//                         <span className="inline-flex items-center gap-0.5 font-black text-emerald-400 text-xs">
//                           <IndianRupee size={11} className="text-emerald-500" />
//                           {b.price}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4 text-center">
//                         <span
//                           className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${st.cls}`}
//                         >
//                           <span
//                             className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
//                           />
//                           {b.status}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {!loading && bookings.length > 0 && (
//           <div className="flex justify-between items-center px-5 py-3 border-t border-slate-800 bg-[#0f172a]">
//             <span className="text-[11px] text-slate-500">
//               Page <b className="text-slate-300">{page}</b> /{" "}
//               <b className="text-slate-300">{totalPages}</b>
//             </span>
//             <div className="flex gap-1">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage(page - 1)}
//                 className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition bg-[#131e32] text-slate-300"
//               >
//                 <ChevronLeft size={12} /> Prev
//               </button>
//               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                 const pg =
//                   totalPages <= 5
//                     ? i + 1
//                     : page <= 3
//                       ? i + 1
//                       : page >= totalPages - 2
//                         ? totalPages - 4 + i
//                         : page - 2 + i;
//                 return (
//                   <button
//                     key={pg}
//                     onClick={() => setPage(pg)}
//                     className={`w-7 h-7 text-[11px] font-bold rounded-lg transition ${
//                       page === pg
//                         ? "bg-orange-500 text-white shadow-md shadow-orange-900"
//                         : "border border-slate-700 hover:bg-[#1a2744] bg-[#131e32] text-slate-400"
//                     }`}
//                   >
//                     {pg}
//                   </button>
//                 );
//               })}
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage(page + 1)}
//                 className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition bg-[#131e32] text-slate-300"
//               >
//                 Next <ChevronRight size={12} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Bookings;
import React, { useEffect, useState } from "react";
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
  Search,
} from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    cls: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
    dot: "bg-emerald-400",
  },
  pending: {
    cls: "bg-amber-900/30 text-amber-400 border border-amber-800",
    dot: "bg-amber-400",
  },
  declined: {
    cls: "bg-rose-900/30 text-rose-400 border border-rose-800",
    dot: "bg-rose-400",
  },
  accepted: {
    cls: "bg-sky-900/30 text-sky-400 border border-sky-800",
    dot: "bg-sky-400",
  },
};

const getStatus = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || {
    cls: "bg-slate-800 text-slate-400 border border-slate-700",
    dot: "bg-slate-500",
  };

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/bookings?page=${page}&limit=10`;
        if (statusFilter) url += `&status=${statusFilter}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        const res = await API.get(url);
        setBookings(res.data.bookings);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.totalBookings || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, statusFilter, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const filters = ["all", "pending", "accepted", "declined", "completed"];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              Booking Logs
            </h1>
            <p className="text-[11px] text-slate-500">
              All puja booking records
            </p>
          </div>
        </div>

        {/* Right: Search + Total badge */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by Booking ID…"
                className="pl-8 pr-3 py-2 text-[12px] bg-[#131e32] border border-slate-700 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500 w-52 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold rounded-xl transition shadow-md shadow-orange-900/20"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setPage(1);
                }}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[12px] font-bold rounded-xl transition"
              >
                Clear
              </button>
            )}
          </form>

          {/* Total badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131e32] border border-slate-700 rounded-xl">
            <BookOpen size={13} className="text-orange-500" />
            <span className="text-xs font-bold text-slate-300">
              {total} Bookings
            </span>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 mb-4">
        <Filter size={12} className="text-slate-500 mr-1" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              setStatusFilter(f === "all" ? "" : f);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border capitalize transition-all ${
              (f === "all" && statusFilter === "") || f === statusFilter
                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-900/20"
                : "bg-[#131e32] text-slate-400 border-slate-700 hover:bg-[#1a2744]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-[#131e32] rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-slate-500">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs">Loading bookings…</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <BookOpen size={36} className="mb-2 opacity-30" />
              <p className="text-xs font-semibold">No bookings found</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0f172a] border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3 text-left font-semibold">
                    Booking ID
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">
                    Customer & Service
                  </th>
                  <th className="px-5 py-3 text-center font-semibold">
                    Pandit
                  </th>
                  <th className="px-5 py-3 text-center font-semibold">
                    Schedule
                  </th>
                  <th className="px-5 py-3 text-right font-semibold">Price</th>
                  <th className="px-5 py-3 text-center font-semibold">
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
                      className={`border-b border-slate-800/60 transition-colors hover:bg-[#1a2744] ${i % 2 !== 0 ? "bg-[#0f172a]/40" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-[11px] font-black text-slate-300 tracking-tight">
                          {b.bookingId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-900/30 flex items-center justify-center text-orange-400 font-bold text-[11px] flex-shrink-0">
                            {b.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 leading-none">
                              {b.user_name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 uppercase">
                              {b.puja_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {b.pandit_name === "Not Assigned" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-[#0f172a] px-2 py-0.5 rounded-full border border-slate-800">
                            <User size={9} /> Unassigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-violet-300 bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-800 font-semibold">
                            <User size={9} /> {b.pandit_name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300">
                            <CalendarDays size={9} className="text-slate-500" />
                            {new Date(b.preferred_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock size={9} /> {b.preferred_time}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-0.5 font-black text-emerald-400 text-xs">
                          <IndianRupee size={11} className="text-emerald-500" />
                          {b.price}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
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
          <div className="flex justify-between items-center px-5 py-3 border-t border-slate-800 bg-[#0f172a]">
            <span className="text-[11px] text-slate-500">
              Page <b className="text-slate-300">{page}</b> /{" "}
              <b className="text-slate-300">{totalPages}</b>
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition bg-[#131e32] text-slate-300"
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
                        ? "bg-orange-500 text-white shadow-md shadow-orange-900"
                        : "border border-slate-700 hover:bg-[#1a2744] bg-[#131e32] text-slate-400"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-semibold border border-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2744] transition bg-[#131e32] text-slate-300"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
