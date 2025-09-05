import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FoodDetails from "./pages/FoodDetails";
import CartPage from "./pages/CartPage";
import CookieConsent from "react-cookie-consent";

export default function App() {
  return (<>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cartpage" element={<CartPage />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
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
