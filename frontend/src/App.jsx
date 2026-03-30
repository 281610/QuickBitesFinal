import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FoodDetails from "./pages/FoodDetails";
import CartPage from "./pages/CartPage";
import Wishlist from "./pages/Wishlist";
import CookieConsent from "react-cookie-consent";
import { initPush } from "./utils/pushNotifications";
import { useEffect } from "react";
import Banner from "./components/Banner";
import { useAuth } from "./context/AuthContext";
// import Help from "./components/help";
import Footer from "./components/Footer";

function AppShell() {
  const location = useLocation();
  const { user } = useAuth();

  const hideFooterForSellerProfile = location.pathname === "/profile" && user?.role === "seller";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/SellerDashboard" element={<Navigate to="/profile?tab=seller-dashboard" replace />} />
           <Route path="/SellerOrders" element={<Navigate to="/profile?tab=seller-orders" replace />} />
           <Route path="/AddProduct" element={<Navigate to="/profile?tab=seller-add-product" replace />} />
           {/* <Route path="/Help" element={<Help />} /> */}
        </Routes>
      </main>
      {!hideFooterForSellerProfile && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initPush();
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>

      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Decline"
        cookieName="userConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        enableDeclineButton
      >
        This website uses cookies to enhance the user experience.{" "}
        <span style={{ fontSize: "10px" }}>Read our Privacy Policy.</span>
      </CookieConsent>
    </>
  );
}
