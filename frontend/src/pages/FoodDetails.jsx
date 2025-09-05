// src/pages/FoodDetails.jsx
/*import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);

  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`http://localhost:5000/api/food/${id}`);
      const data = await res.json();
      setFood(data);
    }
    fetchFood();
  }, [id]);

  if (!food) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{food.name}</h2>
      <img
        src={`http://localhost:5000${food.images?.[0]}`}
        alt={food.name}
        style={{ width: "300px", borderRadius: "8px" }}
      />
      <p><strong>Price:</strong> ₹{food.price}</p>
      <p><strong>Type:</strong> {food.type}</p>
      <p><strong>Description:</strong> {food.description}</p>
      <p><strong>Contact:</strong> {food.contact}</p>

      <button style={{ marginRight: "10px", padding: "10px 16px", background: "green", color: "white", border: "none", borderRadius: "4px" }}>
        Add to Cart
      </button>
      <button style={{ padding: "10px 16px", background: "blue", color: "white", border: "none", borderRadius: "4px" }}>
        Buy Now
      </button>
    </div>
  );
}
*/
// src/pages/FoodDetails.jsx
/*
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ import AuthContext
import {Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const { user } = useAuth(); // ✅ get user
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`http://localhost:5000/api/food/${id}`);
      const data = await res.json();
      setFood(data);
      setSelectedImg(data.images?.[0] || null); // default main image
    }
    fetchFood();
  }, [id]);

  if (!food) return <p>Loading...</p>;
  
  function handleAddToCart() {
    if (!user) {
      alert("⚠️ Please login to add items to your cart.");
    
    } else {
      addToCart(food);
      alert(`✅ ${food.name} added to cart!`);
      navigate("/cartpage"); // redirect to cart page
    }
  }return (
    <div style={{ padding: "20px", display: "flex", gap: "30px" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        {food.images?.length > 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowY: "auto",
              maxHeight: "400px",
            }}
          >
            {food.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${img}`}
                alt={`${food.name} ${idx + 1}`}
                onClick={() => setSelectedImg(img)}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: selectedImg === img ? "2px solid blue" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <img
            src={`http://localhost:5000${selectedImg}`}
            alt={food.name}
            style={{
              width: "400px",
              height: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>

      <div>
        <h2 style={{fontSize:"30px"}}>{food.name}</h2><br /><br />
        <p><strong>Price:</strong> ₹{food.price}</p>
        <p><strong>Type:</strong> {food.type}</p>
        <p><strong>Description:</strong> {food.description}</p>
<br />
        <button
          onClick={handleAddToCart} // ✅ check login
          style={{
            marginRight: "10px",
            padding: "10px 16px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>  </div>
    </div>
  );
}*/
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion"; // 🎉 Import Framer Motion

export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`http://localhost:5000/api/food/${id}`);
      const data = await res.json();
      setFood(data);
      setSelectedImg(data.images?.[0] || null);
    }
    fetchFood();
  }, [id]);

  if (!food) return <p style={{ padding: "20px" }}>Loading...</p>;

  function handleAddToCart() {
    if (!user) {
      alert("⚠️ Please login to add items to your cart.");
    } else {
      addToCart(food);
      alert(`✅ ${food.name} added to cart!`);
      navigate("/cartpage");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "40px",
        display: "flex",
        gap: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
        alignItems: "flex-start",
      }}
    >
      {/* ✅ Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ display: "flex", gap: "16px" }}
      >
        {/* Thumbnails */}
        {food.images?.length > 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              overflowY: "auto",
              maxHeight: "450px",
            }}
          >
            {food.images.map((img, idx) => (
              <motion.img
                key={idx}
                src={`http://localhost:5000${img}`}
                alt={`${food.name} ${idx + 1}`}
                onClick={() => setSelectedImg(img)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border:
                    selectedImg === img
                      ? "3px solid #2563eb"
                      : "1px solid #ddd",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <img
            src={`http://localhost:5000${selectedImg}`}
            alt={food.name}
            style={{
              width: "450px",
              height: "450px",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ✅ Details Section */}
      <motion.div
        style={{ flex: 1 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: "32px",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          {food.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "20px", color: "#16a34a", marginBottom: "10px" }}
        >
          <strong>₹{food.price}</strong>
        </motion.p>

        <p style={{ fontSize: "15px", marginBottom: "8px" }}>
          <strong>Type:</strong>{" "}
          <span
            style={{
              color: food.type === "veg" ? "green" : "red",
              fontWeight: "600",
            }}
          >
            {food.type}
          </span>
        </p>
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            marginBottom: "20px",
            color: "#374151",
          }}
        >
          {food.description}
        </p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", gap: "12px" }}
        >
          <button onClick={handleAddToCart} style={btnStyle("#16a34a")}>
            🛒 Add to Cart
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ✅ Reusable Button Style
function btnStyle(bg) {
  return {
    padding: "12px 20px",
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };
}

