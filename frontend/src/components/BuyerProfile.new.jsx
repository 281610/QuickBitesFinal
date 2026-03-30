"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Mail, 
  Phone,
  FileText,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-all duration-200 border-l-4 ${
      active
        ? "bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold"
        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2.5 bg-indigo-100 rounded-lg">
        <Icon size={20} className="text-indigo-600" />
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-lg font-bold text-gray-900 ml-11">{value || "Not Provided"}</p>
  </div>
);

const OrderCard = ({ order }) => (
  <motion.div 
    layout
    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
  >
    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-transparent">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-indigo-600" />
          <span className="font-semibold text-gray-900 text-sm">Order #{order._id?.slice(-8) || 'N/A'}</span>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
          <CheckCircle2 size={14} /> Delivered
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Amount</p>
          <p className="text-xl font-bold text-gray-900">₹{order.totalAmount || "0"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Status</p>
          <p className="text-sm font-semibold text-green-600">Delivered</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Clock size={16} />
        <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
      </div>
    </div>
  </motion.div>
);

export default function BuyerProfile() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await fetch(`https://quickbitesfinal-2.onrender.com/api/order/${user._id}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  const userAvatar = user?.photo 
    ? `https://quickbitesfinal-2.onrender.com${user.photo}` 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans">
      {/* HERO HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative px-6 sm:px-10 py-10 flex items-center gap-6 sm:gap-8">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={userAvatar}
              alt={user?.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl object-cover flex-shrink-0"
            />
            <div className="text-white flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">Welcome back, {user?.name}!</h1>
              <p className="text-indigo-100 text-lg mb-4">Manage your account and orders</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Mail size={16} />
                  {user?.email}
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Phone size={16} />
                  {user?.contact}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex flex-col gap-4"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <SidebarItem 
              icon={<User size={20} />} 
              label="Profile Information" 
              active={activeTab === "profile"} 
              onClick={() => setActiveTab("profile")}
            />
            <div className="border-t border-gray-100">
              <SidebarItem 
                icon={<Package size={20} />} 
                label="My Orders" 
                active={activeTab === "orders"} 
                onClick={() => setActiveTab("orders")}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 rounded-xl border-2 border-red-200 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* CONTACT INFO GRID */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard icon={User} label="Full Name" value={user?.name} />
                    <InfoCard icon={Mail} label="Email Address" value={user?.email} />
                    <InfoCard icon={Phone} label="Phone Number" value={user?.contact} />
                  </div>
                </div>

                {/* ADDRESS SECTION */}
                {user?.address && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Address</h2>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <MapPin size={24} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900 mb-1">Your Address</p>
                          <p className="text-gray-600 text-base leading-relaxed">{user.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KYC DOCUMENTS */}
                {(user?.panNumber || user?.aadhaarNumber) && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">KYC Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-blue-100 rounded-lg">
                            <FileText size={20} className="text-blue-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">PAN Number</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900 ml-11 tracking-widest">{user.panNumber || "Not Provided"}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-green-100 rounded-lg">
                            <FileText size={20} className="text-green-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Aadhaar Number</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900 ml-11 tracking-widest">{user.aadhaarNumber || "Not Provided"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
                  <p className="text-gray-600">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-semibold text-gray-600 mb-2">No orders yet</p>
                    <p className="text-gray-500">Start exploring and place your first order!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((order, idx) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <OrderCard order={order} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
