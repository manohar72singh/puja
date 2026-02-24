import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ServiceModal from "./ServiceModel";
import { API } from "../../services/adminApi";
const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchServices = async () => {
    const { data } = await API.get(`/services`, {
      params: {
        page,
        limit: 5,
      },
    });

    if (data.success) {
      setServices(data.services);
      setTotalPages(data.totalPages);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await API.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product & CMS</h1>
        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#172554] text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Base Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-gray-700 hover:bg-[#0f172a]"
              >
                <td className="p-3">{service.puja_name}</td>

                <td className="p-3 text-center">
                  <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                    {service.puja_type}
                  </span>
                </td>

                <td className="p-3 text-center text-green-400">
                  ₹{service.prices[0]?.price || "—"}
                </td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setEditData(service);
                      setOpenModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 Pagination UI */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-3 py-1 rounded ${
              page === index + 1 ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <ServiceModal
          close={() => setOpenModal(false)}
          editData={editData}
          refresh={fetchServices}
        />
      )}
    </div>
  );
};

export default AdminServices;
