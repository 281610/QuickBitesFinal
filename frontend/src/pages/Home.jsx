/*import { useEffect, useState } from "react";
import BuyerHome from "../components/BuyerHome";
import SellerPanel from "../components/SellerPanel";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    async function fetchFoods() {
      const res = await fetch("http://localhost:5000/api/food");
      const data = await res.json();
      setFoods(data);
    }
    fetchFoods();
  }, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          localStorage.setItem("buyerLocation", JSON.stringify({ latitude, longitude }));
        },
        (err) => {
          console.error("Location permission denied:", err);
        }
      );
    }
  }, []);
  useEffect(() => {
    async function fetchFoods() {
      const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
      let url = "http://localhost:5000/api/food";
      
      if (buyerLoc) {
        url = `http://localhost:5000/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`;
      }
  
      const res = await fetch(url);
      const data = await res.json();
      setFoods(data);
    }
    fetchFoods();
  }, []);
  
  return (
    <div style={{ padding: "0", margin: "0" }}>
      {!user && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "buyer" && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "seller" && <SellerPanel />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}*/


/*
import { useEffect, useState } from "react";
import BuyerHome from "../components/BuyerHome";
import SellerPanel from "../components/SellerPanel";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  // ✅ Fetch foods depending on location
  useEffect(() => {
    async function fetchFoods() {
      try {
        let url = "http://localhost:5000/api/food"; // default all foods

        const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
        if (buyerLoc) {
          url = `http://localhost:5000/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setFoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching foods:", err);
      }
    }

    // First get location (only once)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          localStorage.setItem("buyerLocation", JSON.stringify({ latitude, longitude }));
          fetchFoods();
        },
        () => fetchFoods() // fallback if permission denied
      );
    } else {
      fetchFoods();
    }
  }, []);

  return (
    <div style={{ padding: "0", margin: "0" }}>
      {!user && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "buyer" && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "seller" && <SellerPanel />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
*/
/*import { useEffect, useState } from "react";
import BuyerHome from "../components/BuyerHome";
import SellerPanel from "../components/SellerPanel";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  // Get coords once and stash for BuyerHome
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        localStorage.setItem(
          "buyerLocation",
          JSON.stringify({ latitude, longitude })
        );
      },
      () => {} // ignore errors, BuyerHome has fallbacks
    );
  }, []);

  // Fetch ALL foods (BuyerHome will fetch nearby separately)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://quickbitesfinal-2.onrender.com/api/food");
        const data = await res.json();
        setFoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching foods:", err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: "0", margin: "0" }}>
      {!user && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "buyer" && (
        <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />
      )}
      {user?.role === "seller" && <SellerPanel />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
*/
import { useEffect, useState } from "react";
import BuyerHome from "../components/BuyerHome";
import SellerPanel from "../components/SellerPanel";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  // Get coords once and stash for BuyerHome
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        localStorage.setItem(
          "buyerLocation",
          JSON.stringify({ latitude, longitude })
        );
      },
      () => {} // ignore errors, BuyerHome has fallbacks
    );
  }, []);

  // Fetch ALL foods (BuyerHome will fetch nearby separately)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://quickbitesfinal-2.onrender.com/api/food");
        const data = await res.json();
        setFoods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching foods:", err);
      }
    })();
  }, []);

  return (
    <div
      style={{
        padding: "0",
        margin: "0",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {!user && <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />}
      {user?.role === "buyer" && (
        <BuyerHome foods={foods} onLogin={() => setShowLogin(true)} />
      )}
      {user?.role === "seller" && <SellerPanel />}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Optional: global responsive tweaks */}
      <style>
        {`
          @media (max-width: 768px) {
            body, html, #root {
              padding: 0;
              margin: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}
