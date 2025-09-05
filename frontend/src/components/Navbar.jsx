import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal"; // import modal

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  function handleLogout() {
    setUser(null);
    navigate("/");
  }

  return (
    <nav
      style={{
        backgroundColor: "black",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "38px",
          fontWeight:"bolder",
          textDecoration: "none",
          color: "white",
          fontStyle:"italic",
          fontFamily:"sans-serif",
          
        }}
      >
        QuickBites
      </Link>

      <div>
        {!user ? (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #4338ca, #4f46e5)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(67, 56, 202, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #4f46e5, #6366f1)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(79, 70, 229, 0.3)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }} >
            Login / Sign Up
          </button>
        ) : (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "17px",color:"white" }}>Hi, {user.name}</span>

            {user.role === "buyer" && (
              <Link
                to="/profile"
                style={{
                  padding: "6px 12px",
                  border: "1px solid white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Profile
              </Link>
            )}

            {user.role === "seller" && (
              <Link
                to="/profile"
                style={{
                  padding: "6px 12px",
                  border: "1px solid white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Seller Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Show Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}
