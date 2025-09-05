/*import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();

  function handleAdd(food) {
    if (!user) {
      onLogin();
    } else {
      alert(`Added ${food.name} to cart (demo)`);
    }
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        Available Foods
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {foods.map((f) => (
          <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
        ))}
      </div>
    </div>
  );
}
*//*
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";

export default function BuyerHome({ onLogin }) {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [locationText, setLocationText] = useState(".....");

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/food");
      const data = await res.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching foods:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocode: get city name from coords (using free API)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "your area";
          setLocationText(city);
        } catch (err) {
          console.error("❌ Error fetching city:", err);
        }
      },
      (err) => {
        console.error("❌ Location error:", err);
      }
    );
  };

  useEffect(() => {
    fetchFoods();
    fetchUserLocation();
  }, []);
  function handleAdd(food) {
    if (!user) {
      onLogin();
    } else {
      alert(`Added ${food.name} to cart (demo)`);
    }
  }

  return (
    <div style={{ padding: "16px" }}>
         <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "96px",
          textAlign: "left",
        }}
      >
        Homemade Food in <span style={{color:"blue"}}>{locationText}</span>
      </h2>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        Available Foods
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {foods.length === 0 ? (
          <p>No foods available</p>
        ) : (
          foods.map((f) => (
            <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
          ))
        )}
      </div>
    </div>
  );
}
*//*
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();
  const [locationText, setLocationText] = useState(".....");
 //
  // ✅ Only fetch city name (not foods again)
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
    if (!buyerLoc) return;

    async function fetchCity() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`
        );
        const data = await res.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          "your area";
        setLocationText(city);
      } catch (err) {
        console.error("❌ Error fetching city:", err);
        setLocationText("your area");
      }
    }

    fetchCity();
  }, []);

  function handleAdd(food) {
    if (!user) {
      onLogin();
    } else {
      alert(`Added ${food.name} to cart (demo)`);
    }
  }
  const [foods, setFoods] = useState([]);
  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/food");
      const data = await res.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching foods:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);
  
  return (
    <div style={{ padding: "16px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          textAlign: "left",
        }}
      >
        Homemade Food in <span style={{ color: "blue" }}>{locationText}</span>
      </h2>

      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        Available Foods
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {foods.length === 0 ? (
          <p>No foods available</p>
        ) : (
          foods.map((f) => <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />)
        )}
      </div>
    </div>
  );
}
*//*
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();

  const [locationText, setLocationText] = useState("your area");
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  // Fetch city + nearby foods using saved coords (set by Home)
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
    if (!buyerLoc) {
      setLoadingNearby(false);
      return;
    }

    (async () => {
      try {
        const [cityRes, nearRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`
          ),
          fetch(
            `http://localhost:5000/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`
          ),
        ]);

        // City
        const cityData = await cityRes.json();
        const city =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.village ||
          cityData.address?.state ||
          "your area";
        setLocationText(city);

        // Nearby foods
        const nearData = await nearRes.json();
        setNearbyFoods(Array.isArray(nearData) ? nearData : []);
      } catch (err) {
        console.error("❌ Error fetching city/nearby foods:", err);
      } finally {
        setLoadingNearby(false);
      }
    })();
  }, []);

  function handleAdd(food) {
    if (!user) onLogin();
    else alert(`Added ${food.name} to cart (demo)`);
  }

  // Avoid duplicates in the "All foods" section
  const nearIds = new Set(nearbyFoods.map((f) => f._id));
  const otherFoods =
    Array.isArray(foods) && foods.length > 0
      ? foods.filter((f) => !nearIds.has(f._id))
      : [];

  return (
    <div style={{ padding: "16px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          textAlign: "left",
        }}
      >
        Homemade Food in <span style={{ color: "blue" }}>{locationText}</span>
      </h2>

      
    /*  {!loadingNearby && nearbyFoods.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "green",
            }}
          >
            Foods Near You
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {nearbyFoods.map((f) => (
              <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
            ))}
          </div>
        </div>
      )}

      /*<h2
        style={{ fontSize: "20px", fontWeight: "bold", margin: "24px 0 16px" }}
      >
        Available Foods
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {otherFoods.length === 0 ? (
          <p>No foods available</p>
        ) : (
          otherFoods.map((f) => (
            <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
          ))
        )}
      </div>
    </div>
  );
}
*//*
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();

  const [locationText, setLocationText] = useState("your area");
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  // Fetch city + nearby foods
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
    if (!buyerLoc) {
      setLoadingNearby(false);
      return;
    }

    (async () => {
      try {
        const [cityRes, nearRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`
          ),
          fetch(
            `http://localhost:5000/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`
          ),
        ]);

        // City
        const cityData = await cityRes.json();
        const city =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.village ||
          cityData.address?.state ||
          "your area";
        setLocationText(city);

        // Nearby foods
        const nearData = await nearRes.json();
        setNearbyFoods(Array.isArray(nearData) ? nearData : []);
      } catch (err) {
        console.error("❌ Error fetching city/nearby foods:", err);
      } finally {
        setLoadingNearby(false);
      }
    })();
  }, []);

  function handleAdd(food) {
    if (!user) onLogin();
    else alert(`Added ${food.name} to cart (demo)`);
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          textAlign: "left",
        }}
      >
        Homemade Food in <span style={{ color: "blue" }}>{locationText}</span>
      </h2>

      {!loadingNearby && nearbyFoods.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "green",
            }}
          >
            Foods Near You
          </h3>
          <div
            style={{
              display:"flex",
              flexWrap:"wrap",
          gap:"20px"
        }}
          >
            {nearbyFoods.map((f) => (
              <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
            ))}
          </div>
        </div>
      )}

      <h2
        style={{ fontSize: "20px", fontWeight: "bold", margin: "24px 0 16px" }}
      >
        Available Foods
      </h2>
      <div
        style={{
          display:"flex",
          gap:"20px",
          flexWrap:"wrap"
        }}
      >
        {foods.length === 0 ? (
          <p>No foods available</p>
        ) : (
          foods.map((f) => (
            <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
          ))
        )}
      </div>
    </div>
  );
}
*/
/*
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();

  const [locationText, setLocationText] = useState("your area");
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  // Fetch city + nearby foods
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
    if (!buyerLoc) {
      setLoadingNearby(false);
      return;
    }

    (async () => {
      try {
        const [cityRes, nearRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`
          ),
          fetch(
            `http://localhost:5000/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`
          ),
        ]);

        // City
        const cityData = await cityRes.json();
        const city =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.village ||
          cityData.address?.state ||
          "your area";
        setLocationText(city);

        // Nearby foods
        const nearData = await nearRes.json();
        setNearbyFoods(Array.isArray(nearData) ? nearData : []);
      } catch (err) {
        console.error("❌ Error fetching city/nearby foods:", err);
      } finally {
        setLoadingNearby(false);
      }
    })();
  }, []);

  function handleAdd(food) {
    if (!user) onLogin();
    else alert(`Added ${food.name} to cart (demo)`);
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#111827",
        }}
      >
        🍲 Homemade Food in{" "}
        <span style={{ color: "#2563eb" }}>{locationText}</span>
      </h2>

      {!loadingNearby && nearbyFoods.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "#16a34a",
              textAlign: "left",
            }}
          >
            🌍 Foods Near You
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap:"wrap",
              gap: "20px",
            }}
          >
            {nearbyFoods.map((f) => (
              <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
            ))}
          </div>
        </div>
      )}

      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          margin: "24px 0 16px",
          textAlign: "left",
          color: "#111827",
        }}
      >
        🍴 Available Foods
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap:"wrap",
          gap: "20px",
        }}
      >
        {foods.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No foods available</p>
        ) : (
          foods.map((f) => (
            <FoodCard key={f._id} food={f} onAdd={() => handleAdd(f)} />
          ))
        )}
      </div>
    </div>
  );
}
*/
import { useAuth } from "../context/AuthContext";
import FoodCard from "./FoodCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // 🎉 Import Framer Motion

export default function BuyerHome({ foods, onLogin }) {
  const { user } = useAuth();

  const [locationText, setLocationText] = useState("your area");
  const [nearbyFoods, setNearbyFoods] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  // Fetch city + nearby foods
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"));
    if (!buyerLoc) {
      setLoadingNearby(false);
      return;
    }

    (async () => {
      try {
        const [cityRes, nearRes] = await Promise.all([
          fetch(
            `https://quickbitesfinal-2.onrender.com/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`
          ),
          fetch(
            `https://quickbitesfinal-2.onrender.com/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`
          ),
        ]);

        // City
        const cityData = await cityRes.json();
        const city =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.village ||
          cityData.address?.state ||
          "your area";
        setLocationText(city);

        // Nearby foods
        const nearData = await nearRes.json();
        setNearbyFoods(Array.isArray(nearData) ? nearData : []);
      } catch (err) {
        console.error("❌ Error fetching city/nearby foods:", err);
      } finally {
        setLoadingNearby(false);
      }
    })();
  }, []);

  function handleAdd(food) {
    if (!user) onLogin();
    else alert(`Added ${food.name} to cart (demo)`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Start hidden
      animate={{ opacity: 1, y: 0 }} // Animate in
      transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#111827",
        }}
      >
        🍲 Homemade Food in{" "}
        <span style={{ color: "#2563eb" }}>{locationText}</span>
      </motion.h2>

      {/* Nearby foods section */}
      {!loadingNearby && nearbyFoods.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <motion.h3
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: "16px 0",
              color: "#16a34a",
              textAlign: "left",
            }}
          >
            🌍 Foods Near You
          </motion.h3>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }, // Delay between items
              },
            }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {nearbyFoods.map((f) => (
              <motion.div
                key={f._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <FoodCard food={f} onAdd={() => handleAdd(f)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* All foods */}
      <motion.h2
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          margin: "24px 0 16px",
          textAlign: "left",
          color: "#111827",
        }}
      >
        🍴 Available Foods
      </motion.h2>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {foods.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No foods available</p>
        ) : (
          foods.map((f) => (
            <motion.div
              key={f._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <FoodCard food={f} onAdd={() => handleAdd(f)} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
