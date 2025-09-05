/*import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "buyer", contact: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUser(data);
      onClose();
    }
  }

  return (
    <div
    onClick={onClose} // ✅ clicking background closes modal
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)", // ✅ blur background
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
    >
      <div
               onClick={(e) => e.stopPropagation()} // ✅ prevent close when clicking inside modal
               style={{
                 backgroundColor: "white",
                 padding: "24px",
                 borderRadius: "8px",
                 width: "380px",
                 boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
               }}
       
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          {isRegister ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isRegister && (
            <input
              placeholder="Name"
              style={{
                width: "100%",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "4px",
              }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            placeholder="Email"
            style={{
              width: "100%",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {isRegister && (
            <>
              <div style={{ display: "flex", gap: "16px" }}>
                <label>
                  <input
                    type="radio"
                    checked={form.role === "buyer"}
                    onChange={() => setForm({ ...form, role: "buyer" })}
                  />{" "}
                  Buyer
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.role === "seller"}
                    onChange={() => setForm({ ...form, role: "seller" })}
                  />{" "}
                  Seller
                </label>
              </div>
              <input
                placeholder="Contact No."
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "4px",
                }}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              
            </>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p style={{ fontSize: "14px", marginTop: "12px" }}>
          {isRegister ? "Already have an account?" : "New user?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              marginLeft: "4px",
              cursor: "pointer",
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
*//*
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "buyer",
    contact: "",
    address: "",
    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    bankDetails: { accountHolder: "", accountNumber: "", ifscCode: "", upiId: "" },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    let body;
    let headers = {};

    if (isRegister && form.role === "seller") {
      // if seller uploading photo → multipart form
      body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "object") {
          Object.entries(v).forEach(([subKey, subVal]) => body.append(`bankDetails.${subKey}`, subVal));
        } else {
          body.append(k, v);
        }
      });
    } else {
      // JSON for buyer/simple
      body = JSON.stringify(form);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUser(data);
      onClose();
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "420px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          {isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isRegister && (
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {isRegister && (
            <>
              <div style={{ display: "flex", gap: "16px" }}>
                <label>
                  <input
                    type="radio"
                    checked={form.role === "buyer"}
                    onChange={() => setForm({ ...form, role: "buyer" })}
                  /> Buyer
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.role === "seller"}
                    onChange={() => setForm({ ...form, role: "seller" })}
                  /> Seller
                </label>
              </div>

              <input
                placeholder="Contact No."
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              {form.role === "buyer" && (
                <input
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              )}

              {isRegister &&form.role === "seller" && (
                <>
                  <input
                    placeholder="PAN Number"
                    value={form.panNumber}
                    onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                  />
                  <input
                    placeholder="Aadhaar Number"
                    value={form.aadhaarNumber}
                    onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                  />
                  <input
                    placeholder="GST Number"
                    value={form.gstNumber}
                    onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                  />
                  <input
                    placeholder="Account Holder"
                    value={form.bankDetails.accountHolder}
                    onChange={(e) => setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountHolder: e.target.value },
                    })}
                  />
                  <input
                    placeholder="Account Number"
                    value={form.bankDetails.accountNumber}
                    onChange={(e) => setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                    })}
                  />
                  <input
                    placeholder="IFSC Code"
                    value={form.bankDetails.ifscCode}
                    onChange={(e) => setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, ifscCode: e.target.value },
                    })}
                  />
                  <input
                    placeholder="UPI ID"
                    value={form.bankDetails.upiId}
                    onChange={(e) => setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, upiId: e.target.value },
                    })}
                  />
                  <input type="file" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
                </>
              )}
            </>
          )}

          <button type="submit" style={{ background: "#4f46e5", color: "white", padding: "10px" }}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p style={{ fontSize: "14px", marginTop: "12px" }}>
          {isRegister ? "Already have an account?" : "New user?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ marginLeft: "4px", color: "#4f46e5" }}>
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
*//*
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css"; // ✅ import css file

export default function LoginModal({ onClose }) {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "buyer",
    contact: "",
    address: "",
    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    bankDetails: { accountHolder: "", accountNumber: "", ifscCode: "", upiId: "" },
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  async function handleSendOtp() {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("OTP sent to your email");
      setOtpSent(true);
    }
  }
  
  async function handleVerifyOtp(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUser(data.user);
      onClose();
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    let body;
    let headers = {};

    if (isRegister && form.role === "seller") {
      body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "object") {
          Object.entries(v).forEach(([subKey, subVal]) =>
            body.append(`bankDetails.${subKey}`, subVal)
          );
        } else {
          body.append(k, v);
        }
      });
    } else {
      body = JSON.stringify(form);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUser(data);
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isRegister ? "Register" : "Login"}</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          {isRegister && (
            <input
              className="modal-input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            className="modal-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {isRegister && (
            <>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={form.role === "buyer"}
                    onChange={() => setForm({ ...form, role: "buyer" })}
                  />{" "}
                  Buyer
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.role === "seller"}
                    onChange={() => setForm({ ...form, role: "seller" })}
                  />{" "}
                  Seller
                </label>
              </div>

              <input
                className="modal-input"
                placeholder="Contact No."
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              {form.role === "buyer" && (
                <input
                  className="modal-input"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              )}

              {form.role === "seller" && (
                <>
                  <input
                    className="modal-input"
                    placeholder="PAN Number"
                    value={form.panNumber}
                    onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                  />
                  <input
                    className="modal-input"
                    placeholder="Aadhaar Number"
                    value={form.aadhaarNumber}
                    onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                  />
                  <input
                    className="modal-input"
                    placeholder="GST Number"
                    value={form.gstNumber}
                    onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                  />
                  <input
                    className="modal-input"
                    placeholder="Account Holder"
                    value={form.bankDetails.accountHolder}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountHolder: e.target.value },
                      })
                    }
                  />
                  <input
                    className="modal-input"
                    placeholder="Account Number"
                    value={form.bankDetails.accountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                      })
                    }
                  />
                  <input
                    className="modal-input"
                    placeholder="IFSC Code"
                    value={form.bankDetails.ifscCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, ifscCode: e.target.value },
                      })
                    }
                  />
                  <input
                    className="modal-input"
                    placeholder="UPI ID"
                    value={form.bankDetails.upiId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, upiId: e.target.value },
                      })
                    }
                  />
                  <input type="file" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
                </>
              )}
            </>
          )}

          <button type="submit" className="modal-btn">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="modal-footer">
          {isRegister ? "Already have an account?" : "New user?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="modal-switch"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
*/
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css"; // ✅ import css file

export default function LoginModal({ onClose }) {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "buyer",
    contact: "",
    address: "",
    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    bankDetails: { accountHolder: "", accountNumber: "", ifscCode: "", upiId: "" },
  });

  // 🔹 OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // 🔹 Send OTP
  async function handleSendOtp() {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("OTP sent to your email");
      setOtpSent(true);
    }
  }

  // 🔹 Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setUser(data.user);
      onClose();
    }
  }

  // 🔹 Register (buyers/sellers)
  async function handleRegister(e) {
    e.preventDefault();

    let body;
    let headers = {};

    if (form.role === "seller") {
      // Seller → multipart
      body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "object") {
          Object.entries(v).forEach(([subKey, subVal]) =>
            body.append(`bankDetails.${subKey}`, subVal)
          );
        } else {
          body.append(k, v);
        }
      });
    } else {
      // Buyer → JSON
      body = JSON.stringify(form);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("✅ Registered successfully! Now login with OTP");
      setIsRegister(false); // switch to login
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isRegister ? "Register" : "Login"}</h2>

        {/* 🔹 Register Form */}
        {isRegister ? (
          <form onSubmit={handleRegister} className="modal-form">
            <input
              className="modal-input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="modal-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  checked={form.role === "buyer"}
                  onChange={() => setForm({ ...form, role: "buyer" })}
                />{" "}
                Buyer
              </label>
              <label>
                <input
                  type="radio"
                  checked={form.role === "seller"}
                  onChange={() => setForm({ ...form, role: "seller" })}
                />{" "}
                Seller
              </label>
            </div>

            <input
              className="modal-input"
              placeholder="Contact No."
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            {form.role === "buyer" && (
              <input
                className="modal-input"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            )}

            {form.role === "seller" && (
              <>
                <input
                  className="modal-input"
                  placeholder="PAN Number"
                  value={form.panNumber}
                  onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                />
                <input
                  className="modal-input"
                  placeholder="Aadhaar Number"
                  value={form.aadhaarNumber}
                  onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                />
                <input
                  className="modal-input"
                  placeholder="GST Number"
                  value={form.gstNumber}
                  onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                />
                <input
                  className="modal-input"
                  placeholder="Account Holder"
                  value={form.bankDetails.accountHolder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountHolder: e.target.value },
                    })
                  }
                />
                <input
                  className="modal-input"
                  placeholder="Account Number"
                  value={form.bankDetails.accountNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                    })
                  }
                />
                <input
                  className="modal-input"
                  placeholder="IFSC Code"
                  value={form.bankDetails.ifscCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, ifscCode: e.target.value },
                    })
                  }
                />
                <input
                  className="modal-input"
                  placeholder="UPI ID"
                  value={form.bankDetails.upiId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, upiId: e.target.value },
                    })
                  }
                />
                <input type="file" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
              </>
            )}

            <button type="submit" className="modal-btn">
              Register
            </button>
          </form>
        ) : (
          // 🔹 OTP Login Form
          <form className="modal-form">
            <input
              className="modal-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {!otpSent ? (
              <button type="button" onClick={handleSendOtp} className="modal-btn">
                Get Code
              </button>
            ) : (
              <>
                <input
                  className="modal-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit" onClick={handleVerifyOtp} className="modal-btn">
                  Verify & Login
                </button>
              </>
            )}
          </form>
        )}

        <p className="modal-footer">
          {isRegister ? "Already have an account?" : "New user?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="modal-switch"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
