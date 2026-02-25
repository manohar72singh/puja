// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { API } from "../../services/adminApi";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const limit = 10;

  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/users?page=${page}&limit=${limit}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total || 0);
    } catch (err) {
      showToast("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setActionLoading(id);
    try {
      await API.delete(`/users/${id}`);
      showToast("User deleted");
      await fetchUsers();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const updateUser = async () => {
    setActionLoading("edit");
    try {
      await API.put(`/users/${editingUser.id}`, editingUser);
      showToast("User updated");
      setEditingUser(null);
      await fetchUsers();
    } catch {
      showToast("Update failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.phone)
      return showToast("Name and phone required", "error");
    setActionLoading("add");
    try {
      await API.post(`/createUser`, newUser);
      showToast("User created");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", phone: "" });
      await fetchUsers();
    } catch {
      showToast("Failed to create user", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const avatarColor = (name) => {
    const colors = [
      "bg-violet-100 text-violet-600",
      "bg-sky-100 text-sky-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
      "bg-emerald-100 text-emerald-600",
      "bg-orange-100 text-orange-600",
      "bg-teal-100 text-teal-600",
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const ModalWrapper = ({ children, onClose }) => (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {children}
      </div>
    </div>
  );

  const ModalField = ({
    icon: Icon,
    placeholder,
    type = "text",
    value,
    onChange,
  }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-300"
      />
    </div>
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-rose-500 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <UsersIcon size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-tight">
              User Management
            </h1>
            <p className="text-[11px] text-slate-400">
              Manage all registered users
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
        >
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border bg-indigo-50 text-indigo-600 border-indigo-100 text-xs font-bold">
          <span className="opacity-70">Total Users</span>
          <span className="text-base font-extrabold">{total}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-100 text-xs font-bold">
          <span className="opacity-70">This Page</span>
          <span className="text-base font-extrabold">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs">Loading…</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <UsersIcon size={36} className="mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                No users found
              </p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-2.5 text-left font-semibold">#</th>
                  <th className="px-4 py-2.5 text-left font-semibold">User</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Email</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Phone</th>
                  <th className="px-4 py-2.5 text-center font-semibold">
                    Role
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold">
                    Joined
                  </th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-50 transition-colors ${
                      actionLoading === u.id
                        ? "opacity-40 pointer-events-none"
                        : "hover:bg-indigo-50/20"
                    } ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                  >
                    <td className="px-4 py-2.5 text-slate-300 font-mono">
                      {u.id}
                    </td>

                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${avatarColor(u.name)}`}
                        >
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-slate-400 max-w-[160px] truncate">
                      {u.email || <span className="text-slate-200">—</span>}
                    </td>

                    <td className="px-4 py-2.5 font-medium text-slate-600">
                      {u.phone}
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.role === "admin"
                            ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                            : u.role === "pandit"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-0.5">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
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

      {/* ADD MODAL */}
      {showAddModal && (
        <ModalWrapper onClose={() => setShowAddModal(false)}>
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <User size={15} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Add User
                </h3>
                <p className="text-[11px] text-gray-400">Register a new user</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <ModalField
              icon={User}
              placeholder="Full Name *"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <ModalField
              icon={Mail}
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <ModalField
              icon={Phone}
              placeholder="Phone *"
              type="tel"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 px-5 py-4 border-t border-gray-100 bg-slate-50/50">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={addUser}
              disabled={actionLoading === "add"}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 shadow-md shadow-indigo-100"
            >
              {actionLoading === "add" ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Saving…
                </>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <ModalWrapper onClose={() => setEditingUser(null)}>
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${avatarColor(editingUser.name)}`}
              >
                {editingUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  Edit User
                </h3>
                <p className="text-[11px] text-gray-400">Update user details</p>
              </div>
            </div>
            <button
              onClick={() => setEditingUser(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <ModalField
              icon={User}
              placeholder="Full Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            <ModalField
              icon={Mail}
              placeholder="Email"
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <ModalField
              icon={Phone}
              placeholder="Phone"
              type="tel"
              value={editingUser.phone}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 px-5 py-4 border-t border-gray-100 bg-slate-50/50">
            <button
              onClick={() => setEditingUser(null)}
              className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={updateUser}
              disabled={actionLoading === "edit"}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 shadow-md shadow-indigo-100"
            >
              {actionLoading === "edit" ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Saving…
                </>
              ) : (
                "Update User"
              )}
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default Users;
