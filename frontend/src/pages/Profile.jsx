"use client"

import { useAuth } from "../context/AuthContext"
import BuyerProfile from "../components/BuyerProfile"
import SellerPanel from "../components/SellerPanel"

export default function Profile() {
  const { user } = useAuth()

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-2">Access Denied</p>
          <p className="text-lg text-gray-600">Please login to view your profile</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {user.role === "buyer" && <BuyerProfile />}
      {user.role === "seller" && <SellerPanel />}
    </div>
  )
}
