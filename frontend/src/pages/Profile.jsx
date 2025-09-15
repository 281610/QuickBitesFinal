"use client"

import { useAuth } from "../context/AuthContext"
import BuyerProfile from "../components/BuyerProfile"
import SellerPanel from "../components/SellerPanel"

export default function Profile() {
  const { user } = useAuth()

  if (!user)
    return (
      <p
        style={{
          padding: "16px",
          textAlign: "center",
          fontSize: "16px",
          color: "#374151",
        }}
      >
        Please login to view profile
      </p>
    )

  return (
    <div
      className="profile-container"
      style={{
        padding: "16px",
        maxWidth: "1000px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {user.role === "buyer" && <BuyerProfile />}
      {user.role === "seller" && <SellerPanel />}

      <style jsx>{`
        .profile-container {
          padding: 16px;
        }
        @media (max-width: 768px) {
          .profile-container {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}
