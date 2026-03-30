"use client"

import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import FoodCard from "./FoodCard"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Banner from "./Banner"
import { useToast } from "../context/ToastContext"

export default function BuyerHome({ foods, onLogin, searchTerm = "" }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [locationText, setLocationText] = useState("your area")
  const [nearbyFoods, setNearbyFoods] = useState([])
  const [loadingNearby, setLoadingNearby] = useState(true)

  // ✅ Fetch city + nearby foods
  useEffect(() => {
    const buyerLoc = JSON.parse(localStorage.getItem("buyerLocation"))
    if (!buyerLoc) {
      setLoadingNearby(false)
      return
    }
    ;(async () => {
      try {
        const [cityRes, nearRes] = await Promise.all([
          fetch(
            `https://quickbitesfinal-2.onrender.com/api/location/reverse?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}`,
          ),
          fetch(
            `https://quickbitesfinal-2.onrender.com/api/food/near?lat=${buyerLoc.latitude}&lng=${buyerLoc.longitude}&maxDistance=5000`,
          ),
        ])

        // City
        const cityData = await cityRes.json()
        const city =
          cityData.address?.city ||
          cityData.address?.town ||
          cityData.address?.village ||
          cityData.address?.state ||
          "your area"
        setLocationText(city)

        // Nearby foods
        const nearData = await nearRes.json()
        setNearbyFoods(Array.isArray(nearData) ? nearData : [])
      } catch (err) {
        console.error("❌ Error fetching city/nearby foods:", err)
      } finally {
        setLoadingNearby(false)
      }
    })()
  }, [])

  function handleAdd(food) {
    if (!user) {
      onLogin()
      return
    }

    addToCart(food)
    showToast(`${food.name} added to cart`, "success")
  }

  const filteredNearbyFoods = useMemo(() => {
    if (!searchTerm) return nearbyFoods

    return nearbyFoods.filter((food) => {
      const searchable = `${food?.name || ""} ${food?.description || ""} ${food?.type || ""}`.toLowerCase()
      return searchable.includes(searchTerm)
    })
  }, [nearbyFoods, searchTerm])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="font-sans bg-gray-50 min-h-screen"
    >
      {/* 👇 Banner */}
      <Banner />

<div className="px-4 sm:px-6 lg:px-8 pb-8">
    {/* Heading */}
    {!searchTerm && (
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold mb-6 text-center text-gray-900"
      >
        🍲 Homemade Food in <span className="text-blue-600">{locationText}</span>
      </motion.h2>
    )}

    {/* Nearby Foods */}
    {!searchTerm && !loadingNearby && filteredNearbyFoods.length > 0 && (
      <div className="mb-10 ">
        <motion.h3
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-bold text-green-600 text-center mb-20"
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
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredNearbyFoods.map((f) => (
            <motion.div
              key={f._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="w-full"
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
      className="text-2xl font-bold text-gray-900 mb-6 text-center"
    >
      {searchTerm ? `Search results for "${searchTerm}"` : "🍴 Available Foods"}
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
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {foods.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium">{searchTerm ? "No match found" : "No foods available"}</p>
      ) : (
        foods.map((f) => (
          <motion.div
            key={f._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="w-full"
          >
            <FoodCard food={f} onAdd={() => handleAdd(f)} />
          </motion.div>
        ))
      )}
    </motion.div>
  </div>
</motion.div>
  )
}
