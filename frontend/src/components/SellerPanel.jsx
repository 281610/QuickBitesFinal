import { useState, useEffect } from "react";
import AddFoodModal from "./AddFoodModal";
import { useAuth } from "../context/AuthContext";

export default function SellerPanel() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const fetchFoods = async () => {
    const res = await fetch(`http://localhost:5000/api/food/seller/${user._id}`);
    const data = await res.json();
    setFoods(Array.isArray(data) ? data : []);
  };
  useEffect(() => {
    async function fetchFoods() {
        const res = await fetch(`http://localhost:5000/api/food/seller/${user._id}`);
        const data = await res.json();
       setFoods(Array.isArray(data) ? data : []);

    }
    fetchFoods();
  }, [user]);

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Seller Panel</h2>
        <button
          onClick={() => setShowAddFood(true)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Food
        </button>
      </div>

      <div style={{ marginTop: "16px" }}>
        {foods.length === 0 ? (
          <p>No foods added yet.</p>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", padding: 0, margin: 0, listStyle: "none" }}>
            {foods.map((f) => (
              <li
                key={f._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {f.name} - ₹{f.price}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showAddFood && (
  <AddFoodModal 
    onClose={() => {
      setShowAddFood(false);
      fetchFoods(); // 👈 refetch after adding
    }} 
  />
)}
    </div>
  );
}
