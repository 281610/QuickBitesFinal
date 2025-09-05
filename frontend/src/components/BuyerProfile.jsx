/*import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function BuyerProfile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch(`http://localhost:5000/api/orders?buyerId=${user._id}`);
      const data = await res.json();
      setOrders(data);
    }
    fetchOrders();
  }, [user]);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
        Your Orders
      </h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: 0,
            margin: 0,
            listStyle: "none",
          }}
        >
          {orders.map((o) => (
            <li
              key={o._id}
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              {o.foodName} - {o.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
*/
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function BuyerProfile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/order/${user._id}`);

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    }
    fetchOrders();
  }, [user]);

  if (!user) return <p>Please login to view profile.</p>;

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
      {/* User Info */}
      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
        👤 Your Profile
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {user.photo && (
          <img
            src={`http://localhost:5000${user.photo}`}
            alt="User"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #4f46e5",
            }}
          />
        )}
        <div>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Contact:</b> {user.contact}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>PAN:</b> {user.panNumber || "Not provided"}</p>
          <p><b>Aadhaar:</b> {user.aadhaarNumber || "Not provided"}</p>
        </div>
      </div>

      {/* Orders 
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
        📦 Your Orders
      </h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: 0,
            margin: 0,
            listStyle: "none",
          }}
        >
          {orders.map((o) => (
            <li
              key={o._id}
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
{o.food?.name || "Deleted Food"} (x{o.quantity}) - <b>{o.status}</b>
</li>
          ))}
        </ul>
      )}*/}
    </div>
  );
}
