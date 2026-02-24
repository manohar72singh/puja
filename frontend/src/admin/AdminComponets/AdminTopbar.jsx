const AdminTopbar = () => {
  return (
    <div className="h-16 bg-white shadow flex justify-between items-center px-8">
      <h1 className="text-xl font-semibold">Dashboard Overview</h1>
      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/";
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminTopbar;
