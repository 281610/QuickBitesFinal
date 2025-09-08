/*import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  if (!cart.length) return <h2 style={{ padding: "20px" }}>🛒 Cart is empty</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.map(item => (
        <div
          key={item._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />
          <div style={{ marginLeft: "12px", flexGrow: 1 }}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
          </div>
          <button onClick={() => removeFromCart(item._id)} style={{ background: "red", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px" }}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button
        onClick={() => {
          alert("Redirecting to payment gateway...");
          clearCart();
        }}
        style={{
          background: "#4f46e5",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "6px",
          marginTop: "20px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}*/

/*
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

// ✅ Helper to load Razorpay script dynamically
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  // ✅ Razorpay checkout function
  async function displayRazorpay() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // ✅ Call backend to create order
    const result = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await result.json();

    if (!order) {
      alert("Server error. Order not created.");
      return;
    }

    // ✅ Configure Razorpay options
    const options = {
      key: "rzp_test_RDpNcfQBrQHLXU",
       // ⚠️ Replace with your Razorpay Test Key ID
      amount: order.amount,
      currency: order.currency,
      name: "Homemade Food App",
      description: "Food Purchase Payment",
      order_id: order.id,
      handler: function (response) {
        alert("✅ Payment Successful!");
        console.log("Payment Response:", response);
        clearCart();
      },
      prefill: {
        name: "Anurag Sharma",
        email: "anurag@example.com",
        contact: "8699949187",
      },
      notes: {
        address: "Test Address",
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  if (!cart.length) return <h2 style={{ padding: "20px" }}>🛒 Cart is empty</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <img
            src={`http://localhost:5000${item.images[0]}`}
            alt={item.name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <div style={{ marginLeft: "12px", flexGrow: 1 }}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button
        onClick={displayRazorpay}
        style={{
          background: "#4f46e5",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "6px",
          marginTop: "20px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}
*/
import { useCart } from "../context/CartContext";

// ✅ Helper: load Razorpay script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  // ✅ Pay for all items in cart
  async function handlePayment() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    // ✅ Create order
    const orderRes = await fetch("https://quickbitesfinal-2.onrender.com/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const order = await orderRes.json();

    if (!order) {
      alert("Server error. Order not created.");
      return;
    }

    const options = {
      key: "rzp_test_RDpNcfQBrQHLXU", // ⚠️ Replace with your Key ID
      amount: order.amount,
      currency: order.currency,
      name: "Homemade Food App",
      description: "Cart Payment",
      order_id: order.id,
      handler: async function (response) {
        // ✅ Verify & delete all foods
        const foodIds = cart.map((item) => item._id);

        const verifyRes = await fetch("https://quickbitesfinal-2.onrender.com/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            foodIds,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status === "success") {
          alert("✅ Payment Successful & Foods Deleted!");
          clearCart(); // clear cart frontend
        } else {
          alert("❌ Payment verification failed");
        }
      },
      prefill: {
        name: "Anurag Sharma",
        email: "anurag@example.com",
        contact: "8699949187",
      },
      theme: { color: "#4f46e5" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  if (!cart.length) return <h2 style={{ padding: "20px" }}>🛒 Cart is empty</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <img
            src={item.images[0]}
            alt={item.name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <div style={{ marginLeft: "12px", flexGrow: 1 }}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button
        onClick={handlePayment}
        style={{
          background: "#4f46e5",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "6px",
          marginTop: "20px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}
