/*import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddFoodModal({ onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    type: "veg",  // ✅ must be "veg" or "non-veg"
    description: "",
    price: "",
    lat: "",
    lng: "",
    contact: "",
  });
  const [images, setImages] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ✅ Auto-capture seller location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Location error:", err);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLoadingLocation(false);
    }
  }, []);

  function handleImageChange(e) {
    setImages([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    images.forEach((file) => fd.append("images", file));
    fd.append("seller", user?._id);

    const res = await fetch("http://localhost:5000/api/food", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      alert("✅ Food added successfully!");
      onClose();
    } else {
      const err = await res.json();
      alert("❌ Error: " + err.error);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "380px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Add Food
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            placeholder="Name of food"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

        
          {loadingLocation ? (
            <p style={{ fontSize: "12px", color: "gray" }}>Fetching location...</p>
          ) : form.lat && form.lng ? (
            <p style={{ fontSize: "12px", color: "green" }}>
              📍 Location captured: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
            </p>
          ) : (
            <p style={{ fontSize: "12px", color: "red" }}>
              ⚠ Could not fetch location, please enable GPS.
            </p>
          )}

          <input type="file" multiple onChange={handleImageChange} />

          <button
            type="submit"
            style={{
              background: "#16a34a",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
*/

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiUrl } from "../config/api";

export default function AddFoodModal({ onClose }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    type: "veg",
    description: "",
    price: "",
    lat: "",
    lng: "",
    contact: "",
  });
  const [images, setImages] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ✅ Auto-capture seller location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Location error:", err);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLoadingLocation(false);
    }
  }, []);

  function handleImageChange(e) {
    setImages([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    images.forEach((file) => fd.append("images", file));
    fd.append("seller", user?._id);

    const res = await fetch(apiUrl("/api/food"), {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      showToast("Food added successfully", "success");
      onClose();
    } else {
      const err = await res.json();
      showToast(err?.error || "Unable to add food", "error");
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-[#140f0a]/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-[#f1d9c7] bg-gradient-to-b from-[#fffdf9] to-[#fff6ed] shadow-[0_30px_80px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-[#eadfd3] bg-white/70 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#3f2b1f]">Add Food Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-[#e8d8c9] text-[#8d6b55] hover:bg-[#fff0e3]"
            aria-label="Close add food popup"
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 py-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-[#5f493c]">Food Name</label>
            <input
              placeholder="Name of food"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#c48145]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5f493c]">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#c48145]"
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#5f493c]">Description</label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#c48145]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5f493c]">Price</label>
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#c48145]"
            />
          </div>

          {loadingLocation ? (
            <p className="text-sm text-[#846e5f]">Fetching location...</p>
          ) : form.lat && form.lng ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              Location captured: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
            </p>
          ) : (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              Could not fetch location, please enable GPS.
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-[#5f493c]">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-[#6d5648] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f2e7dc] file:px-3 file:py-2 file:text-[#6d4123] hover:file:bg-[#ead8c6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-[#e7d4c4] bg-white text-[#80563c] hover:bg-[#fff3e8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-[#995014] hover:bg-[#7f4110] text-white font-semibold"
            >
              Save Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
