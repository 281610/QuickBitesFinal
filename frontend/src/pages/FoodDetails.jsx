import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Star, Truck, CircleDot } from "lucide-react";

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [food, setFood] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [activeTag, setActiveTag] = useState("description");

  useEffect(() => {
    async function fetchFood() {
      try {
        const res = await fetch(`https://quickbitesfinal-2.onrender.com/api/food/${id}`);
        const data = await res.json();
        setFood(data);
        setSelectedImg(data?.images?.[0] || "/placeholder.svg");
      } catch (error) {
        console.error("Error loading food details:", error);
      }
    }

    fetchFood();
  }, [id]);

  const imageList = useMemo(() => {
    if (!food?.images || food.images.length === 0) return ["/placeholder.svg"];
    return food.images;
  }, [food]);

  function handleAddToCart() {
    if (!user) {
      showToast("Please login to add items to your cart.", "info");
      return;
    }

    addToCart(food);
    showToast(`${food.name} added to cart`, "success");
  }

  if (!food) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-[120px_minmax(0,1fr)_minmax(320px,420px)] gap-6 lg:gap-8"
        >
          <section className="order-2 lg:order-1 lg:sticky lg:top-24 h-fit">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {imageList.map((img, idx) => {
                const isActive = selectedImg === img;
                return (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-white transition-all ${
                      isActive ? "border-orange-500 shadow" : "border-slate-200 hover:border-orange-300"
                    }`}
                  >
                    <img src={img} alt={`${food.name}-${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="order-1 lg:order-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
              <img
                src={selectedImg}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                <Star size={14} className="text-amber-500" fill="#F59E0B" />
                <span className="text-sm font-semibold text-slate-700">{food.rating || "4.4"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  navigate("/cartpage");
                }}
                className="h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </section>

          <section className="order-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">QuickBites Assured</p>
            <h1 className="mt-2 text-3xl leading-tight font-extrabold text-slate-900">{food.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                <BadgeCheck size={14} /> In Stock
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                <CircleDot size={14} className={food.type === "veg" ? "text-green-600" : "text-red-600"} />
                {food.type || "veg"}
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <p className="text-4xl font-extrabold text-slate-900">Rs {food.price}</p>
              <p className="text-sm text-slate-500 line-through">Rs {Math.round((food.price || 0) * 1.2)}</p>
              <p className="text-sm font-semibold text-green-600">20% off</p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 px-3 py-3 flex items-center gap-2 text-slate-700">
                <Truck size={16} className="text-orange-500" />
                <span className="text-sm font-medium">Fast Delivery Available</span>
              </div>
              <div className="rounded-xl border border-slate-200 px-3 py-3 flex items-center gap-2 text-slate-700">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-sm font-medium">Hygiene Checked Kitchen</span>
              </div>
            </div>

            <div className="mt-7">
              <div className="inline-flex p-1 rounded-xl bg-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTag("description")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTag === "description" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTag("details")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTag === "details" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Product Details
                </button>
              </div>

              {activeTag === "description" ? (
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {food.description || "Freshly prepared homemade meal made with quality ingredients and rich flavors."}
                </p>
              ) : (
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-900">Category:</span> Food</p>
                  <p><span className="font-semibold text-slate-900">Cuisine Type:</span> {food.type || "veg"}</p>
                  <p><span className="font-semibold text-slate-900">Seller Contact:</span> {food.contact || "Available after order"}</p>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
