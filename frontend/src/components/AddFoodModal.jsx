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

export default function AddFoodModal({ onClose }) {
  const { user } = useAuth();
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
      onClick={onClose} // ✅ close when clicking outside
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(6px)", // ✅ blur background
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside modal
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          width: "380px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)", // ✅ nice shadow
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
            textAlign: "center",
            color: "#16a34a",
          }}
        >
          🍽 Add Food
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            placeholder="Name of food"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={inputStyle}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, height: "70px" }}
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={inputStyle}
          />

          {loadingLocation ? (
            <p style={{ fontSize: "12px", color: "gray" }}>📍 Fetching location...</p>
          ) : form.lat && form.lng ? (
            <p style={{ fontSize: "12px", color: "green" }}>
              Location captured: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
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
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#15803d")}
            onMouseOut={(e) => (e.target.style.background = "#16a34a")}
          >
            ✅ Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable input style
const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
};
