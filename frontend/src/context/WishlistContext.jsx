import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "quickbites_wishlist_v1";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setWishlist(Array.isArray(parsed) ? parsed : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function isWishlisted(id) {
    return wishlist.some((item) => item._id === id);
  }

  function addToWishlist(food) {
    if (!food?._id) return;
    setWishlist((prev) => (prev.some((item) => item._id === food._id) ? prev : [...prev, food]));
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  }

  function toggleWishlist(food) {
    if (!food?._id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === food._id);
      if (exists) return prev.filter((item) => item._id !== food._id);
      return [...prev, food];
    });
  }

  function clearWishlist() {
    setWishlist([]);
  }

  const value = useMemo(
    () => ({
      wishlist,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
}
