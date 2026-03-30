import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#f8f6f1] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#b2835f]">Saved For Later</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3c2a1f] mt-2">My Wishlist</h1>
          </div>
          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8d8c9] bg-white text-[#8a4b30] hover:bg-[#fff6ef] transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-[#eadfd3] rounded-3xl p-10 text-center shadow-sm">
            <div className="mx-auto h-14 w-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
              <Heart size={26} />
            </div>
            <h2 className="text-2xl font-semibold text-[#3c2a1f]">Wishlist is empty</h2>
            <p className="text-[#7a6656] mt-2">Tap the heart icon on any food card to save it here.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-[#995014] text-white hover:bg-[#824213] transition-colors"
            >
              Explore Foods
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((food) => (
              <article
                key={food._id}
                className="bg-white border border-[#eadfd3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={food.images?.[0] || "/placeholder.svg"}
                  alt={food.name}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#3f2b1f] line-clamp-1">{food.name}</h3>
                  <p className="text-sm text-[#7a6656] mt-1 line-clamp-2">{food.description || "Fresh homemade food"}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-[#3f2b1f]">Rs {food.price}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(food._id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(food)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1e40af] text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                      >
                        <ShoppingCart size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
