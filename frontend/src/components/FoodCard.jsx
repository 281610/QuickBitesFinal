/*export default function FoodCard({ food, onAdd }) {
    return (
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "128px",
            backgroundColor: "#e5e7eb",
            borderRadius: "6px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {food.images?.[0] ? (
          <img
          src={`http://localhost:5000${food.images[0]}`}
          alt={food.name}
          style={{
            height: "128px",
            width: "100%",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
        ) : (
            "No Image"
          )}
        </div>
        <h3 style={{ fontWeight: "600", fontSize: "16px", margin: "0 0 4px" }}>
          {food.name}
        </h3>
        <p style={{ fontSize: "14px", color: "#4b5563", margin: "0" }}>
        {food.type === "veg" ? "Veg" : "Non-Veg"}

        </p>
        <p style={{ fontSize: "14px", marginTop: "4px", marginBottom: "0" }}>
          {food.description}
        </p>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>₹ {food.price}</span>
          <button
            onClick={onAdd}
            style={{
              padding: "6px 12px",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
  *//*
  import { useNavigate } from "react-router-dom";

  export default function FoodCard({ food }) {
    const navigate = useNavigate();
  
    return (
      <div
        style={{
          backgroundColor: "white",
          width:"300px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      ><div style={{ marginBottom: "12px" }}>
      {food.images?.length > 0 ? (
        food.images.length === 1 ? (
          // ✅ Case 1: Single image (full width)
          <img
            src={`http://localhost:5000${food.images[0]}`}
            alt={food.name}
            style={{
              height: "200px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        ) : (
          // ✅ Case 2: Multiple images (show in row, scrollable)
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
            }}
          >
            {food.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${img}`}
                alt={`${food.name} ${idx + 1}`}
                style={{
                  height: "200px",
                  width: "128px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  flexShrink: 0, // prevents squishing
                }}
              />
            ))}
          </div>
        )
      ) : (
        // ❌ No image
        <div
          style={{
            height: "128px",
            backgroundColor: "#e5e7eb",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
          }}
        >
          No Image
        </div>
      )}
    </div>
    
        <h3 style={{ fontWeight: "600", fontSize: "16px", margin: "0 0 4px" }}>
          {food.name}
        </h3>
        <p style={{ fontSize: "14px", color: "#4b5563", margin: "0" }}>
          {food.type === "veg" ? "Veg" : "Non-Veg"}
        </p>
        <p style={{ fontSize: "14px", marginTop: "4px", marginBottom: "0" }}>
          {food.description}
        </p>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>₹ {food.price}</span>
          <button
            onClick={() => navigate(`/food/${food._id}`)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Order Food
          </button>
        </div>
      </div>
    );
  }
  */
  import { useNavigate } from "react-router-dom";

  export default function FoodCard({ food }) {
    const navigate = useNavigate();
  
    return (
      <div
        style={{
          backgroundColor: "white",
          width: "300px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        {/* Food Image */}
        <div style={{ marginBottom: "12px", borderRadius: "10px", overflow: "hidden" }}>
          {food.images?.length > 0 ? (
            food.images.length === 1 ? (
              <img
                src={food.images[0]}
                alt={food.name}
                style={{
                  height: "200px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {food.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${food.name} ${idx + 1}`}
                    style={{
                      height: "200px",
                      width: "140px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )
          ) : (
            <div
              style={{
                height: "200px",
                backgroundColor: "#f3f4f6",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              No Image
            </div>
          )}
        </div>
  
        {/* Food Info */}
        <h3 style={{ fontWeight: "700", fontSize: "18px", margin: "0 0 6px", color: "#111827" }}>
          {food.name}
        </h3>
        <p style={{ fontSize: "14px", fontWeight: "500", color: food.type === "veg" ? "green" : "red", margin: "0" }}>
          {food.type === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginTop: "6px",
            marginBottom: "0",
            lineHeight: "1.4",
          }}
        >
          {food.description}
        </p>
  
        {/* Price + Button */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "16px", color: "#111827" }}>
            ₹ {food.price}
          </span>
          <button
            onClick={() => navigate(`/food/${food._id}`)}
            style={{
              padding: "8px 14px",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "linear-gradient(135deg, #4338ca, #4f46e5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "linear-gradient(135deg, #4f46e5, #6366f1)";
            }}
          >
            🍽 Order Food
          </button>
        </div>
      </div>
    );
  }
  