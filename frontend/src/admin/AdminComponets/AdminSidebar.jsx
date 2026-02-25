import React from "react";

const AdminSidebar = ({ active, setActive }) => {
  const menus = ["Dashboard", "Bookings", "Users", "Pandits", "Services"];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-8">🕉 Admin Panel</h2>

      <ul className="space-y-4">
        {menus.map((item) => (
          <li
            key={item}
            onClick={() => setActive(item)}
            className={`cursor-pointer p-2 rounded transition
              ${
                active === item
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-700"
              }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
