import { useEffect, useState } from "react";
import { API } from "../../services/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await API.get(`/users?page=${page}&limit=${limit}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ✅ Frontend Search
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ✅ Delete
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  // ✅ Update
  const updateUser = async () => {
    await API.put(`/users/${editingUser.id}`, editingUser);
    setEditingUser(null);
    fetchUsers();
  };

  // ✅ Add User
  const addUser = async () => {
    await API.post(`/createUser`, newUser);
    setShowAddModal(false);
    setNewUser({ name: "", email: "", phone: "" });
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">All Users</h2>

      {/* SEARCH + ADD */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  {new Date(u.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="px-3 py-1 bg-yellow-400 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-1 bg-gray-100 rounded">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Add User</h3>

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3 rounded"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3 rounded"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="border p-2 w-full mb-3 rounded"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>

            <input
              type="text"
              className="border p-2 w-full mb-3 rounded"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />

            <input
              type="email"
              className="border p-2 w-full mb-3 rounded"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />

            <input
              type="text"
              className="border p-2 w-full mb-3 rounded"
              value={editingUser.phone}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
