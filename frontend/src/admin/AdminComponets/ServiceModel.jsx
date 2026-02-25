import React, { useState } from "react";
import { API } from "../../services/adminApi";

const ServiceModal = ({ close, editData, refresh }) => {
  const [form, setForm] = useState({
    puja_name: editData?.puja_name || "",
    puja_type: editData?.puja_type || "",
    description: editData?.description || "",
    prices:
      editData?.prices?.length > 0
        ? editData.prices
        : [{ pricing_type: "standard", price: "" }],
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

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editData) {
        await API.put(`/services/${editData.id}`, formData);
      } else {
        await API.post(`/services`, formData);
      }
      refresh();
      close();
    } catch (err) {
      console.error(err);
      alert("Error saving service.");
    }
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
          onChange={(e) => {
            const type = e.target.value;
            let prices = form.prices;

            if (type === "temple_puja") {
              if (prices.length === 1) {
                prices = [
                  { pricing_type: "standard", price: "" },
                  { pricing_type: "single", price: "" },
                  { pricing_type: "couple", price: "" },
                ];
              }
            } else {
              prices = [{ pricing_type: "standard", price: "" }];
            }

            setForm({ ...form, puja_type: type, prices });
          }}
        >
          <option value="">Select Type</option>
          <option value="home_puja">Home Puja</option>
          <option value="katha">Katha</option>
          <option value="temple_puja">Temple Puja</option>
          <option value="pind_dan">Pind Dan</option>
        </select>

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 rounded bg-[#0f172a]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Prices */}
        <div className="mb-3">
          <label className="block mb-1">Prices</label>

          {form.prices.map((p, index) => (
            <div key={index} className="flex gap-2 mb-2">
              {form.puja_type === "temple_puja" && (
                <select
                  className="p-2 rounded bg-[#0f172a] flex-1"
                  value={p.pricing_type}
                  onChange={(e) => {
                    const updated = [...form.prices];
                    updated[index].pricing_type = e.target.value;
                    setForm({ ...form, prices: updated });
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="standard">Standard</option>
                  <option value="single">Single</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                </select>
              )}

              <input
                type="number"
                placeholder="Price"
                className="p-2 rounded bg-[#0f172a] flex-1"
                value={p.price}
                onChange={(e) => {
                  const updated = [...form.prices];
                  updated[index].price = e.target.value;
                  setForm({ ...form, prices: updated });
                }}
              />

              {form.puja_type === "temple_puja" && (
                <button
                  onClick={() => {
                    const updated = form.prices.filter((_, i) => i !== index);
                    setForm({ ...form, prices: updated });
                  }}
                  className="bg-red-500 px-2 rounded text-white"
                >
                  X
                </button>
              )}
            </div>
          ))}

          {form.puja_type === "temple_puja" && (
            <button
              onClick={() =>
                setForm({
                  ...form,
                  prices: [...form.prices, { pricing_type: "", price: "" }],
                })
              }
              className="bg-green-500 px-3 py-1 rounded text-white"
            >
              Add Price
            </button>
          )}
        </div>

        {/* Image */}
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
