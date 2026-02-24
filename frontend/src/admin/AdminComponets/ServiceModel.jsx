import React, { useState } from "react";
import { API } from "../../services/adminApi";

const ServiceModal = ({ close, editData, refresh }) => {
  const [form, setForm] = useState({
    puja_name: editData?.puja_name || "",
    puja_type: editData?.puja_type || "",
    description: editData?.description || "",
    prices: editData?.prices || [{ pricing_type: "", price: "" }],
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("puja_name", form.puja_name);
    formData.append("puja_type", form.puja_type);
    formData.append("description", form.description);
    formData.append(
      "prices",
      JSON.stringify(form.prices.filter((p) => p.pricing_type && p.price)),
    );

    // Agar new image select hui hai
    if (image) {
      formData.append("image", image);
    }

    if (editData) {
      await API.put(`/services/${editData.id}`, formData);
    } else {
      await API.post(`/services`, formData);
    }

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-[#1e293b] p-6 rounded-xl w-[500px] text-white">
        <h2 className="text-xl mb-4">
          {editData ? "Edit Service" : "Add New Service"}
        </h2>

        <input
          type="text"
          placeholder="Service Name"
          className="w-full mb-3 p-2 rounded bg-[#0f172a]"
          value={form.puja_name}
          onChange={(e) => setForm({ ...form, puja_name: e.target.value })}
        />

        <select
          className="w-full mb-3 p-2 rounded bg-[#0f172a]"
          value={form.puja_type}
          onChange={(e) => setForm({ ...form, puja_type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="home_puja">Home Puja</option>
          <option value="temple_puja">Temple Puja</option>
        </select>

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 rounded bg-[#0f172a]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* 🔥 Image Upload */}
        <input
          type="file"
          accept="image/*"
          className="mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 py-2 rounded-lg hover:bg-orange-600"
        >
          Save Service
        </button>

        <button
          onClick={close}
          className="w-full mt-2 bg-gray-600 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ServiceModal;
