import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, User, Gift, Heart, ShoppingBag, LogOut, Search, Mic, MicOff } from "lucide-react";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

function normalizeSearchText(text = "") {
  return text
    .replace(/[.,!?;:।॥]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function SearchInputBar({
  compact = false,
  value,
  onChange,
  onSubmit,
  onVoiceToggle,
  isListening,
  speechSupported,
}) {
  return (
    <form onSubmit={onSubmit} className={`relative w-full ${compact ? "max-w-full" : "max-w-xl"}`}>
      <button
        type="submit"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Search"
      >
        <Search size={compact ? 18 : 18} />
      </button>

      <input
        type="text"
        placeholder="Search foods"
        className={`w-full ${compact ? "h-10" : "h-10"} rounded-full bg-white border border-gray-200 shadow-sm pl-11 pr-11 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-300`}
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={onVoiceToggle}
        disabled={!speechSupported}
        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
          isListening ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
        } ${!speechSupported ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Voice search"
        title={speechSupported ? "Speak to search" : "Voice search not supported in this browser"}
      >
        {isListening ? <MicOff size={compact ? 18 : 18} /> : <Mic size={compact ? 18 : 18} />}
      </button>
    </form>
  );
}

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [roleType, setRoleType] = useState("buyer"); // ✅ buyer/seller role select
  const [search, setSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const recognitionRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setDesktopDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setSearch(q);
  }, [location.search]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      const cleanedTranscript = normalizeSearchText(transcript);

      setVoiceTranscript(transcript);
      setSearch(cleanedTranscript);
      const lastResult = event.results[event.results.length - 1];
      if (lastResult?.isFinal && cleanedTranscript) {
        applySearch(cleanedTranscript);
        setShowVoiceModal(false);
        recognition.stop();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setShowVoiceModal(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setShowVoiceModal(false);
    };

    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function handleLogout() {
    setUser(null);
    navigate("/");
    setDesktopDropdownOpen(false);
  }

  function applySearch(query) {
    const normalized = normalizeSearchText(query);
    if (!normalized) {
      navigate("/");
      return;
    }

    navigate(`/?q=${encodeURIComponent(normalized)}`);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    applySearch(search);
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);

    // Clearing the search box should immediately restore all products.
    if (!value.trim()) {
      navigate("/", { replace: true });
    }
  }

  function toggleVoiceSearch() {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setShowVoiceModal(false);
      return;
    }

    try {
      setVoiceTranscript("");
      setShowVoiceModal(true);
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setShowVoiceModal(false);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100">
      {/* ✅ Unified Navbar */}
      <div className="flex mx-auto items-center justify-between gap-3 md:gap-4 min-h-[64px] px-4 md:px-6 py-2 md:py-0 flex-wrap md:flex-nowrap">
        {/* Left: Logo */}
        <Link to="/" className="order-1 flex-shrink-0 flex items-center group">
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-gray-900 group-hover:text-orange-500 transition-colors">
              QUICK
              <span className="text-orange-500 group-hover:text-gray-900 transition-colors">BITES</span>
            </span>
          </Link>

        {/* Center: Search */}
        <div className="order-3 w-full md:order-2 md:flex-1 flex justify-center md:px-4">
          <SearchInputBar
            value={search}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            onVoiceToggle={toggleVoiceSearch}
            isListening={isListening}
            speechSupported={speechSupported}
          />
        </div>

        {/* Right: Profile + Cart + Help */}
        <div className="order-2 md:order-3 flex items-center gap-4 md:gap-6 ml-auto">
          {/* Profile/Login Dropdown */}
          <div ref={desktopDropdownRef} className="relative">
            <button
              onClick={() => setDesktopDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[#ff7b54] hover:text-[#ff6b9d] cursor-pointer "
            >
              <User size={20} />
              <span className="hidden md:inline">{user ? (user.role === "buyer" ? "Profile" : "Seller") : "Login"}</span>
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
                        className="w-full text-center px-6 py-4 text-lg hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
                      >
                        Login / Sign Up
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col text-center space-y-3 py-4">
                      {user.role === "buyer" ? (
                        <>
                          <Link 
                            to="/Profile" 
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <User size={20} /> My Profile
                          </Link>

                          <Link 
                            to="/profile?tab=orders" 
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <ShoppingBag size={20} /> Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <Heart size={20} /> Wishlist
                          </Link>
                          {/* <span className="flex items-center justify-center gap-2 px-6 py-3 text-lg text-gray-400 cursor-not-allowed">
                            <Gift size={20} /> Rewards
                          </span> */}
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile?tab=seller-profile"
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <User size={20} /> Seller Profile
                          </Link>
                          <Link
                            to="/profile?tab=seller-orders"
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <ShoppingBag size={20} /> Manage Orders
                          </Link>
                          <Link
                            to="/profile?tab=seller-add-product"
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            ➕ Add Product
                          </Link>
                          <Link
                            to="/profile?tab=seller-dashboard"
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-lg hover:bg-gray-100"
                          >
                            <ShoppingBag size={20} /> Seller Dashboard
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
            <ShoppingCart size={20} />
            <span className="hidden md:inline">Cart</span>
          </Link>

          {/* Help */}
          {/* <Link to="/Help" className="px-4 py-2 text-[#ff7b54] hover:text-[#ff6b9d] flex items-center gap-2">
            <HelpCircle size={18} /> Help
          </Link> */}
        </div>
      </div>

      {/* ✅ Login Modal (buyer/seller pass hoga) */}
      {showLogin && (
        <LoginModal
          role={roleType}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showVoiceModal && (
        <div
          className="fixed inset-0 z-[70] bg-[#120d08]/65 backdrop-blur-md flex items-center justify-center px-4"
          onClick={() => {
            recognitionRef.current?.stop();
            setShowVoiceModal(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-[#f1d9c7] bg-gradient-to-b from-[#fffdf9] to-[#fff7ef] p-6 text-center shadow-[0_30px_80px_rgba(30,18,10,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#ffe8d6] flex items-center justify-center border border-[#ffd2ac]">
              <Mic className={`text-orange-500 ${isListening ? "animate-pulse" : ""}`} size={30} />
            </div>

            <h3 className="text-2xl font-semibold text-[#412a1c]">Listening...</h3>
            <p className="text-sm text-[#8a6c58] mt-1">Speak naturally, search will trigger automatically</p>

            <div className="mt-5 min-h-20 rounded-2xl border border-[#efd9c8] bg-white px-4 py-3 text-[#4f3a2b] text-base">
              {voiceTranscript || "Your voice input will appear here..."}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  recognitionRef.current?.stop();
                  setShowVoiceModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#e7d4c4] hover:bg-[#fff3e8] text-[#80563c] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  recognitionRef.current?.stop();
                  setShowVoiceModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#995014] hover:bg-[#7f4110] text-white font-medium"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
