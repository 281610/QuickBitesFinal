import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, User, Gift, Heart, ShoppingBag, LogOut, HelpCircle } from "lucide-react";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [roleType, setRoleType] = useState("buyer"); // ✅ buyer/seller role select
  const [search, setSearch] = useState("");
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setUser(null);
    navigate("/");
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* ✅ Desktop Navbar */}
      <div className="hidden md:flex mx-auto items-center justify-between h-[64px] px-6">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center text-2xl font-bold text-[#ff7b54]">
          QuickBites
        </Link>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder='Search for "banana"'
              className="w-full pl-10 pr-4 h-8 rounded-md border-2 border-[#ff7b54] bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Profile + Cart + Help */}
        <div className="flex items-center gap-6">
          {/* Profile/Login Dropdown */}
          <div ref={desktopDropdownRef} className="relative">
            <button
              onClick={() => setDesktopDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[#ff7b54] hover:text-[#ff6b9d] cursor-pointer "
            >
              <User size={20} />
              {user ? (user.role === "buyer" ? "Profile" : "Seller") : "Login"}
            </button>

            {desktopDropdownOpen && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                >
                  {!user ? (
                    <>
                      {/* ✅ Role Selector */}
                      <div className="flex justify-between items-center px-6 py-3 text-sm border-b border-gray-200 bg-gray-50">
                        <span className="text-gray-600">Login as:</span>
                        <select
                          value={roleType}
                          onChange={(e) => setRoleType(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setDesktopDropdownOpen(false);
                        }}
                        className="w-full text-center px-6 py-4 text-lg hover:bg-gray-100 border-b border-gray-200"
                      >
                        Login / Sign Up
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col text-center space-y-3 py-4">
                      {user.role === "buyer" ? (
                        <>
                          <Link to="/Profile" className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <User size={20} /> My Profile
                          </Link>
                          <Link className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <ShoppingBag size={20} /> Orders
                          </Link>
                          <Link className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <Heart size={20} /> Wishlist
                          </Link>
                          <Link className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <Gift size={20} /> Rewards
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/SellerDashboard" className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <User size={20} /> Seller Panel
                          </Link>
                          <Link to="/SellerOrders" className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            <ShoppingBag size={20} /> Manage Orders
                          </Link>
                          <Link to="/AddProduct" className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100">
                            ➕ Add Product
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-lg text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Cart */}
          <Link to="/CartPage" className="flex items-center gap-1 text-[#ff7b54] hover:text-[#ff6b9d]">
            <ShoppingCart size={20} /> Cart
          </Link>

          {/* Help */}
          <Link to="/Help" className="px-4 py-2 text-[#ff7b54] hover:text-[#ff6b9d] flex items-center gap-2">
            <HelpCircle size={18} /> Help
          </Link>
        </div>
      </div>

      {/* ✅ Mobile Navbar */}
      <div className="md:hidden flex flex-col w-full px-4 py-2">
        {/* Row 1: Logo + Profile + Cart */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-purple-600">
            QuickBites
          </Link>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div ref={mobileDropdownRef} className="relative">
              <button
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600"
              >
                <User size={22} />
              </button>

              {mobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="flex flex-col py-2">
                    {!user ? (
                      <>
                        {/* ✅ Role Select */}
                        <div className="flex justify-between items-center px-4 py-2 text-sm border-b border-gray-200 bg-gray-50">
                          <span className="text-gray-600">Login as:</span>
                          <select
                            value={roleType}
                            onChange={(e) => setRoleType(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            setShowLogin(true);
                            setMobileDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <User size={18} /> Login / Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        {user.role === "buyer" ? (
                          <>
                            <Link to="/Profile" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <User size={18} /> My Profile
                            </Link>
                            <Link to="/CartPage" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <ShoppingCart size={18} /> Cart
                            </Link>
                            <Link to="/offers" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              🎁 Offers
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link to="/SellerDashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <User size={18} /> Seller Panel
                            </Link>
                            <Link to="/SellerOrders" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              <ShoppingBag size={18} /> Orders
                            </Link>
                            <Link to="/AddProduct" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                              ➕ Add Product
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Shortcut */}
            <Link to="/CartPage" className="text-gray-700 hover:text-purple-600">
              <ShoppingCart size={22} />
            </Link>
          </div>
        </div>

        {/* Row 2: Search */}
      <div className="w-full mt-2 flex justify-center">
      <input
        type="text"
        placeholder="Search for Products"
        className="w-[90%] pl-10 pr-4 h-12 rounded-md border-2 border-purple-500 bg-gray-50 
                  focus:ring-purple-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

      </div>

      {/* ✅ Login Modal (buyer/seller pass hoga) */}
      {showLogin && (
        <LoginModal
          role={roleType}
          onClose={() => setShowLogin(false)}
        />
      )}
    </nav>
  );
}
