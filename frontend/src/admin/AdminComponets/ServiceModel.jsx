// import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Image,
  Tag,
  AlignLeft,
  IndianRupee,
} from "lucide-react";
import { API } from "../../services/adminApi";
import { useState } from "react";

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
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("puja_name", form.puja_name);
    formData.append("puja_type", form.puja_type);
    formData.append("description", form.description);
    formData.append(
      "prices",
      JSON.stringify(form.prices.filter((p) => p.pricing_type && p.price)),
    );
    if (image) formData.append("image", image);

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

  const typeColor = (type) => {
    const map = {
      home_puja: "border-sky-600 bg-sky-900/20",
      katha: "border-violet-600 bg-violet-900/20",
      temple_puja: "border-amber-600 bg-amber-900/20",
      pind_dan: "border-rose-600 bg-rose-900/20",
    };
    return map[type] || "";
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-[#131e32] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-extrabold text-white">
              {editData ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {editData
                ? "Update service details"
                : "Fill in details to add a service"}
            </p>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          {/* Service Name */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Service Name"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0b1120] border border-slate-700 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              value={form.puja_name}
              onChange={(e) => setForm({ ...form, puja_name: e.target.value })}
            />
          </div>

          {/* Type Select */}
          <select
            className={`w-full px-3 py-2.5 rounded-xl bg-[#0b1120] border text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${
              form.puja_type
                ? typeColor(form.puja_type) + " border-opacity-80"
                : "border-slate-700 text-slate-500"
            }`}
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

          {/* Description */}
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
            <textarea
              placeholder="Description"
              rows={3}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0b1120] border border-slate-700 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Prices */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <IndianRupee size={11} /> Pricing
            </p>

            <div className="space-y-2">
              {form.prices.map((p, index) => (
                <div key={index} className="flex gap-2">
                  {form.puja_type === "temple_puja" && (
                    <select
                      className="flex-1 px-3 py-2 rounded-xl bg-[#0b1120] border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      value={p.pricing_type}
                      onChange={(e) => {
                        const updated = [...form.prices];
                        updated[index].pricing_type = e.target.value;
                        setForm({ ...form, prices: updated });
                      }}
                    >
                      <option value="">Type</option>
                      <option value="standard">Standard</option>
                      <option value="single">Single</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                    </select>
                  )}

                  {form.puja_type !== "temple_puja" && (
                    <div className="flex-1 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-500 capitalize">
                      {p.pricing_type}
                    </div>
                  )}

                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#0b1120] border border-slate-700 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      value={p.price}
                      onChange={(e) => {
                        const updated = [...form.prices];
                        updated[index].price = e.target.value;
                        setForm({ ...form, prices: updated });
                      }}
                    />
                  </div>

                  {form.puja_type === "temple_puja" && (
                    <button
                      onClick={() =>
                        setForm({
                          ...form,
                          prices: form.prices.filter((_, i) => i !== index),
                        })
                      }
                      className="p-2 rounded-xl bg-rose-900/30 hover:bg-rose-900/60 text-rose-400 transition border border-rose-800/50"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {form.puja_type === "temple_puja" && (
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    prices: [...form.prices, { pricing_type: "", price: "" }],
                  })
                }
                className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition px-3 py-1.5 rounded-lg bg-emerald-900/20 border border-emerald-800/40"
              >
                <Plus size={11} /> Add Price Tier
              </button>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Image size={11} /> Service Image
            </p>

            <label className="block cursor-pointer">
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                  preview
                    ? "border-orange-600/50 bg-orange-900/10"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-24 mx-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-slate-600 text-xs">
                    <Image size={24} className="mx-auto mb-1 opacity-40" />
                    Click to upload image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-slate-700/60 bg-[#0f172a]/50">
          <button
            onClick={close}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-700/50 transition text-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white shadow-lg shadow-orange-900/40"
          >
            {editData ? "Update Service" : "Save Service"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
