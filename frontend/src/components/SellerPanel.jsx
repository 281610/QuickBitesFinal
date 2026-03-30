import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddFoodModal from "./AddFoodModal";
import { useAuth } from "../context/AuthContext";
import { Package, ShoppingBag, User, PlusCircle } from "lucide-react";
import { apiUrl } from "../config/api";

const sellerTabs = [
  { key: "seller-profile", label: "Profile", icon: User },
  { key: "seller-dashboard", label: "Dashboard", icon: Package },
  { key: "seller-orders", label: "Orders", icon: ShoppingBag },
  { key: "seller-add-product", label: "Add Product", icon: PlusCircle },
];

export default function SellerPanel() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);

  const getOrderAmount = (order) => {
    const totalAmount = Number(order?.totalAmount);
    if (Number.isFinite(totalAmount) && totalAmount > 0) {
      return totalAmount;
    }

    const quantity = Number(order?.quantity) || 1;
    const unitPrice = Number(order?.unitPrice);
    if (Number.isFinite(unitPrice) && unitPrice > 0) {
      return unitPrice * quantity;
    }

    const foodPrice = Number(order?.food?.price);
    if (Number.isFinite(foodPrice) && foodPrice > 0) {
      return foodPrice * quantity;
    }

    return 0;
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + getOrderAmount(order), 0);
  }, [orders]);

  const activeTab = useMemo(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return sellerTabs.some((item) => item.key === tab) ? tab : "seller-dashboard";
  }, [location.search]);

  const fetchFoods = async () => {
    const res = await fetch(apiUrl(`/api/food/seller/${user._id}`));
    const data = await res.json();
    setFoods(Array.isArray(data) ? data : []);
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(apiUrl(`/api/order/seller/${user._id}`));
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch seller orders", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    async function fetchFoods() {
        const res = await fetch(apiUrl(`/api/food/seller/${user._id}`));
        const data = await res.json();
       setFoods(Array.isArray(data) ? data : []);

    }
    fetchFoods();
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    if (activeTab === "seller-orders" || activeTab === "seller-dashboard") {
      fetchOrders();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "seller-add-product") {
      setShowAddFood(true);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Seller Hub</h2>
          <button
            onClick={() => {
              navigate("/profile?tab=seller-add-product");
              setShowAddFood(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#995014] hover:bg-[#7f4110] text-white font-semibold"
          >
            Add Food
          </button>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {sellerTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => navigate(`/profile?tab=${tab.key}`)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {activeTab === "seller-profile" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Seller Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
                <p className="text-lg font-semibold mt-1">{user?.name || "Not available"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
                <p className="text-lg font-semibold mt-1 break-all">{user?.email || "Not available"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs uppercase tracking-wider text-slate-500">Contact</p>
                <p className="text-lg font-semibold mt-1">{user?.contact || "Not available"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs uppercase tracking-wider text-slate-500">Role</p>
                <p className="text-lg font-semibold mt-1">Seller</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "seller-dashboard" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{foods.length}</p>
              </article>
              <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</p>
              </article>
              <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Recent Revenue</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  Rs {totalRevenue}
                </p>
              </article>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900 mb-4">My Products</h4>
              {foods.length === 0 ? (
                <p className="text-slate-500">No foods added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {foods.map((f) => (
                    <li key={f._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between">
                      <span className="font-medium text-slate-800">{f.name}</span>
                      <span className="font-semibold text-slate-900">Rs {f.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeTab === "seller-orders" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Manage Orders</h3>
            {loadingOrders ? (
              <p className="text-slate-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-slate-500">No orders received yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{order.food?.name || order.foodName || "Order Item"}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Buyer: {order.buyer?.name || "Unknown"} ({order.buyer?.email || "No email"})
                        </p>
                        <p className="text-sm text-slate-600 mt-1">Qty: {order.quantity || 1} | Method: {order.paymentMethod || "online"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">Rs {getOrderAmount(order)}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "seller-add-product" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">Add Product</h3>
            <p className="text-slate-600 mb-4">Open the add product popup to create a new listing.</p>
            <button
              type="button"
              onClick={() => setShowAddFood(true)}
              className="px-4 py-2.5 rounded-xl bg-[#995014] hover:bg-[#7f4110] text-white font-semibold"
            >
              Open Add Product Popup
            </button>
          </section>
        )}
      </div>

      {showAddFood && (
        <AddFoodModal
          onClose={() => {
            setShowAddFood(false);
            fetchFoods();
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
