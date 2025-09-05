// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(food) {
    setCart((prev) => [...prev, food]);
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ Hook to use anywhere
export function useCart() {
  return useContext(CartContext);
}
