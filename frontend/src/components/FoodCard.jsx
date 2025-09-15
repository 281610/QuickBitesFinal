"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FoodCard({ food }) {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)

  const images = food.images?.length > 0 ? food.images : []

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-4 flex flex-col cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 overflow-hidden max-w-full"
      style={{
        minHeight: "320px",
      }}
    >
      {/* Food Image */}
      <div className="mb-3 rounded-lg overflow-hidden relative">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={food.name}
              className="h-48 w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />

            {/* Dots Pagination */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${
                      currentImage === idx ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Food Info */}
      <h3 className="font-bold text-lg mb-1.5 text-gray-900 line-clamp-1">{food.name}</h3>
      <p className={`text-sm font-medium mb-1.5 ${food.type === "veg" ? "text-green-600" : "text-red-600"}`}>
        {food.type === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}
      </p>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">{food.description}</p>

      {/* Price + Button */}
<div className="flex items-center justify-center gap-2 md:gap-32 mt-auto">
  <span className="font-bold text-base text-gray-900 relative -translate-y-0.5">
    ₹ {food.price}
  </span>
  <button
    onClick={() => navigate(`/food/${food._id}`)}
    className="px-7 py-3 
               bg-gradient-to-r from-blue-600 to-purple-600 
               text-white font-semibold text-lg 
               border-none rounded-xl 
               cursor-pointer transition-all duration-300 
               hover:scale-110 hover:from-blue-700 hover:to-purple-700 
               shadow-md hover:shadow-lg 
               relative -translate-y-1"
  >
    🍽 Order Food
  </button>
</div>

    </div>
  )
}
