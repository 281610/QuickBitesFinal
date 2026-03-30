"use client"

import { useCart } from "../context/CartContext"
import { useState } from "react" 
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { apiUrl } from "../config/api"



function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [quantities, setQuantities] = useState({})
  const [paymentMethod, setPaymentMethod] = useState("online")

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }))
  }

  const getQuantity = (itemId) => {
    return quantities[itemId] || 1
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const quantity = getQuantity(item._id)
      return sum + item.price * quantity
    }, 0)
  }

  async function handlePayment() {
    if (!user?._id) {
      showToast("Please login to place order", "info")
      return
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if (!res) {
      showToast("Razorpay SDK failed to load.", "error")
      return
    }

    const finalTotal = calculateTotal()
    const orderRes = await fetch(apiUrl("/api/payment/create-order"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalTotal }),
    })
    const order = await orderRes.json()

    if (!order) {
      showToast("Server error. Order not created.", "error")
      return
    }

    const options = {
      key: "rzp_test_RDpNcfQBrQHLXU",
      amount: order.amount,
      currency: order.currency,
      name: "Homemade Food App",
      description: "Cart Payment",
      order_id: order.id,
      handler: async (response) => {
        const items = cart.map((item) => ({
          foodId: item._id,
          quantity: getQuantity(item._id),
        }))

        const verifyRes = await fetch(apiUrl("/api/payment/verify"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            buyerId: user._id,
            items,
          }),
        })

        const verifyData = await verifyRes.json()

        if (verifyData.status === "success") {
          showToast("Payment successful", "success")
          clearCart()
        } else {
          showToast("Payment verification failed", "error")
        }
      },
      prefill: {
        name: "Anurag Sharma",
        email: "anurag@example.com",
        contact: "8699949187",
      },
      theme: { color: "#4f46e5" },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  async function handleCODOrder() {
    if (!user?._id) {
      showToast("Please login to place COD order", "info")
      return
    }

    try {
      const orderPromises = cart.map((item) => {
        const quantity = getQuantity(item._id)
        return fetch(apiUrl("/api/order"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerId: user._id,
            foodId: item._id,
            quantity,
            paymentMethod: "cod",
          }),
        })
      })

      const responses = await Promise.all(orderPromises)
      const hasFailure = responses.some((res) => !res.ok)

      if (hasFailure) {
        showToast("Some items could not be ordered. Please try again.", "error")
        return
      }

      clearCart()
      showToast("Order placed successfully with Cash on Delivery", "success")
    } catch (error) {
      console.error("COD order error:", error)
      showToast("Failed to place COD order", "error")
    }
  }

  function handleCheckout() {
    if (paymentMethod === "cod") {
      handleCODOrder()
      return
    }

    handlePayment()
  }

  // Empty cart UI
  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">Your cart is empty</h2>
          <p className="text-black">Add some delicious items to get started!</p>
        </div>
      </div>
    )
  }

  // When cart has items
  return (
    <div className="min-h-screen flex justify-center mt-8 py-8">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mx-auto">
          <div className="w-full lg:w-3/5 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-gray-900">Cart Items ({cart.length})</span>
              <span className="text-lg font-semibold text-gray-900">₹{calculateTotal()}</span>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.images?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description || "Delicious homemade food"}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item._id, getQuantity(item._id) - 1)}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{getQuantity(item._id)}</span>
                      <button
                        onClick={() => updateQuantity(item._id, getQuantity(item._id) + 1)}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-semibold text-gray-900">₹{item.price * getQuantity(item._id)}</div>
                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 p-1">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

         {/* Payment Section - Desktop only */}
<div className="hidden lg:block w-full lg:w-2/5 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-lg">
  <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h2>

  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
    <p className="text-sm font-semibold text-gray-800 mb-3">Payment Method</p>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="online"
          checked={paymentMethod === "online"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Online Payment (Razorpay)
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery (COD)
      </label>
    </div>
  </div>

  <div className="space-y-4 mb-6">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Subtotal</span>
      <span className="text-gray-900">₹{calculateTotal()}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Shipping</span>
      <span className="text-gray-900">Free</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Tax</span>
      <span className="text-gray-900">₹0</span>
    </div>
    <hr className="border-gray-200" />
    <div className="flex justify-between text-base font-semibold">
      <span className="text-gray-900">Total</span>
      <span className="text-gray-900">₹{calculateTotal()}</span>
    </div>
  </div>
 <div className="flex justify-center">
  <button
      onClick={handleCheckout}
    className="w-3/4 h-10 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
  >
      {paymentMethod === "cod" ? "Place COD Order" : "Continue to Payment"}
  </button>
</div>

  <p className="text-sm text-gray-500 text-center">🔄 30-day return policy</p>
</div>

{/* ✅ Mobile Fixed Payment Footer (above footer) */}
<div className="lg:hidden fixed bottom-16 left-0 right-0 bg-gray-50 border-t border-gray-300 shadow-lg p-4 rounded-t-xl flex flex-col items-center">
  <h2 className="text-base font-semibold text-gray-900 mb-3">Payment Details</h2>

  <div className="w-full px-4 mb-4 p-3 bg-white rounded-lg border border-gray-200">
    <p className="text-sm font-semibold text-gray-800 mb-2">Payment Method</p>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="paymentMethodMobile"
          value="online"
          checked={paymentMethod === "online"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Online Payment
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="radio"
          name="paymentMethodMobile"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
      </label>
    </div>
  </div>
  
  <div className="space-y-2 mb-4 text-sm w-full px-4">
    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal</span>
      <span className="text-gray-900">₹{calculateTotal()}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping</span>
      <span className="text-gray-900">Free</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Tax</span>
      <span className="text-gray-900">₹0</span>
    </div>
    <hr className="border-gray-200" />
    <div className="flex justify-between font-semibold text-base">
      <span className="text-gray-900">Total</span>
      <span className="text-gray-900">₹{calculateTotal()}</span>
    </div>
  </div>

  <button
    onClick={handleCheckout}
    className="w-3/4 h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
  >
    {paymentMethod === "cod" ? "Place COD Order" : "Continue to Payment"}
  </button>
</div>

        </div>
      </div>
    </div>
  )
}
