"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Plus, Star } from "lucide-react"
import { useWishlist } from "../context/WishlistContext"

export default function FoodCard({ food, onAdd }) {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)
  const { isWishlisted, toggleWishlist } = useWishlist()
  const images = food.images?.length > 0 ? food.images : []
  const rating = food.rating || 4.2
  const wishlisted = isWishlisted(food?._id)
  
  return (
    <div
      onClick={() => navigate(`/food/${food._id}`)}
      className="group bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
    >
      {/* 1. Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden p-2"> {/* Added p-2 to give image some breathing room or keep full bleed */}
        <img
          src={images[currentImage] || "/placeholder.svg"}
          alt={food.name}
          className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          <div className={`w-3 h-3 border-2 ${food.type === 'veg' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
            <div className={`w-1.5 h-1.5 rounded-full ${food.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(food)
          }}
          className={`absolute top-5 right-5 z-10 h-9 w-9 rounded-full backdrop-blur-sm border transition-colors flex items-center justify-center cursor-pointer ${
            wishlisted
              ? "bg-rose-500 text-white border-rose-500"
              : "bg-white/90 text-gray-700 border-white hover:bg-white"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Star size={12} fill="#FFC107" className="text-amber-500" />
          <span className="text-xs font-bold text-white">{rating}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col flex-grow">
        <h3 className="font-extrabold text-lg sm:text-xl text-gray-800 line-clamp-1 mb-1">
          {food.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 sm:mb-6 leading-relaxed">
          {food.description || "Freshly prepared homemade delicious meal."}
        </p>

        {/* 3. Footer Row */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Price</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none">₹{food.price}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAdd) onAdd();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100 cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} />
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}