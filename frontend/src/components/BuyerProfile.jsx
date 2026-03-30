"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, MessageSquare, MapPin, Calendar, User as UserIcon, LogOut, X, FileText, ShieldCheck } from "lucide-react";
import { useToast } from "../context/ToastContext";

const tabs = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
];

export default function BuyerProfile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "orders" || tab === "addresses") {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;

      try {
        setLoading(true);
        const res = await fetch(`https://quickbitesfinal-2.onrender.com/api/order/${user._id}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const userAvatar = user?.photo
    ? `https://quickbitesfinal-2.onrender.com${user.photo}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`;

  const joinedDate = useMemo(() => {
    const source = user?.createdAt ? new Date(user.createdAt) : null;
    return source && !Number.isNaN(source.getTime())
      ? source.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "Not available";
  }, [user?.createdAt]);

  useEffect(() => {
    if (!user) return;
    setEditForm({
      name: user.name || "",
      contact: user.contact || "",
      address: user.address || "",
    });
  }, [user]);

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      const res = await fetch("https://quickbitesfinal-2.onrender.com/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          name: editForm.name,
          contact: editForm.contact,
          address: editForm.address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }

      setUser(data);
      setShowEditModal(false);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast(error.message || "Unable to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f5f1ea] text-[#7a6a5c] font-semibold">
        Please Login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#4b2f1f] mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-8 items-start">
          <div className="space-y-6">
            <section className="bg-white rounded-3xl border border-[#e6d9cb] shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full bg-[#f3e4d2] flex items-center justify-center border-4 border-[#f8efe5] overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={56} className="text-[#995014]" />
                  )}
                </div>
                <h2 className="mt-6 text-4xl leading-tight font-semibold text-[#3f2b1f]">{user.name}</h2>
                <p className="mt-2 text-xl text-[#8c7766] break-all">{user.email}</p>
              </div>

              <div className="my-6 border-t border-[#eadfd3]" />

              <div className="flex items-start gap-3 text-[#5c4638]">
                <Calendar size={20} className="mt-1" />
                <div>
                  <p className="font-semibold text-xl">Joined:</p>
                  <p className="text-lg text-[#846e5f]">{joinedDate}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="mt-6 w-full bg-[#995014] hover:bg-[#7f4110] text-white text-xl font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Edit Profile
              </button>
            </section>

            <section className="bg-white rounded-3xl border border-[#e6d9cb] shadow-sm p-6">
              <h3 className="text-4xl leading-tight font-semibold text-[#3f2b1f] mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-[#faf7f3] hover:bg-[#f4ede6] text-[#5f493c] font-medium transition-colors"
                >
                  Help & Support
                </button>
                <button
                  type="button"
                  onClick={() => setUser(null)}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-[#fff3f1] hover:bg-[#ffe7e2] text-[#b1462a] font-semibold transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-3xl border border-[#e6d9cb] shadow-sm p-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-lg font-semibold transition-colors ${
                        isActive
                          ? "bg-[#995014] text-white"
                          : "text-[#5f493c] hover:bg-[#f6efe8]"
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-[#e6d9cb] shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-[#eadfd3] flex items-center justify-between">
                <h2 className="text-4xl leading-tight font-semibold text-[#3f2b1f]">
                  {activeTab === "orders" && "My Orders"}
                  {activeTab === "addresses" && "My Addresses"}
                </h2>
                {activeTab === "orders" && <span className="text-lg text-[#8d7868]">({orders.length} orders)</span>}
              </div>

              {activeTab === "orders" && (
                <div className="p-8 min-h-[320px]">
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-[#995014] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-[#907b69]">
                      <Package size={56} className="mb-4 text-[#c7a97f]" />
                      <p className="text-4xl leading-tight font-semibold text-[#5b4638]">You have not placed any orders yet.</p>
                      <p className="text-lg mt-2">Start shopping to see your orders here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <article
                          key={order._id}
                          className="p-5 border border-[#eadfd3] rounded-2xl bg-[#fffdf9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div>
                            <p className="text-lg font-semibold text-[#4e382c]">{order.food?.name || order.foodName || "Order Item"}</p>
                            <p className="text-sm text-[#8f7a6a] mt-1">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-[#4e382c]">Rs {order.totalAmount || (order.food?.price || order.unitPrice || 0) * (order.quantity || 1)}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="p-8 min-h-[320px]">
                  <div className="max-w-2xl border border-dashed border-[#d8c7b7] rounded-2xl bg-[#fcf8f3] p-6">
                    <p className="text-xl font-semibold text-[#4e382c] mb-2">Primary Address</p>
                    <p className="text-lg text-[#7d6959] leading-relaxed">
                      {user.address || "No address added yet. Please update your delivery address."}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {showSupportModal && (
        <div
          className="fixed inset-0 z-50 bg-[#150f0b]/65 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowSupportModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-gradient-to-b from-[#fffdf9] to-[#fff6ed] rounded-3xl border border-[#e6d9cb] shadow-[0_30px_80px_rgba(0,0,0,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 sm:px-8 py-5 border-b border-[#eadfd3] flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-3 text-[#4b2f1f]">
                <MessageSquare size={22} />
                <h3 className="text-2xl font-semibold">Help & Support</h3>
              </div>
              <button
                type="button"
                aria-label="Close support popup"
                onClick={() => setShowSupportModal(false)}
                className="p-2 rounded-xl text-[#7d6959] hover:bg-[#f7f1ea] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 max-h-[75vh] overflow-y-auto space-y-6">
              <section className="bg-white border border-[#eadfd3] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b2f1f] mb-3">
                  <FileText size={18} />
                  <h4 className="text-xl font-semibold">Usage Guidelines</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-[#6a5444]">
                  <li>Order details and delivery address always verify before placing order.</li>
                  <li>Use only your own phone number and email for account access and updates.</li>
                  <li>For refunds or payment issues, contact support within 48 hours of delivery.</li>
                  <li>Do not share OTP, password, or payment information with anyone.</li>
                </ul>
              </section>

              <section className="bg-white border border-[#eadfd3] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b2f1f] mb-3">
                  <ShieldCheck size={18} />
                  <h4 className="text-xl font-semibold">Privacy Policy (Summary)</h4>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-[#6a5444]">
                  <li>We store profile, contact, and order data to process deliveries and support requests.</li>
                  <li>Your personal data is never sold to third-party advertisers.</li>
                  <li>Payment transactions are handled through secure payment partners.</li>
                  <li>You can request account data updates by contacting support.</li>
                </ul>
              </section>

              <div className="text-sm text-[#8a7666]">
                For urgent help, email: support@quickbites.com
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-[#150f0b]/65 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-xl bg-gradient-to-b from-[#fffdf9] to-[#fff6ed] rounded-3xl border border-[#e6d9cb] shadow-[0_30px_80px_rgba(0,0,0,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 sm:px-8 py-5 border-b border-[#eadfd3] flex items-center justify-between bg-white/70">
              <h3 className="text-2xl font-semibold text-[#4b2f1f]">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl text-[#7d6959] hover:bg-[#f7f1ea] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#5f493c]">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#c48145]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5f493c]">Contact</label>
                <input
                  value={editForm.contact}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, contact: e.target.value }))}
                  className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#c48145]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5f493c]">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full border border-[#e6d9cb] rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#c48145]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full bg-[#995014] hover:bg-[#7f4110] disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
