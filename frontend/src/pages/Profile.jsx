import { useAuth } from "../context/AuthContext";
import BuyerProfile from "../components/BuyerProfile";
import SellerPanel from "../components/SellerPanel";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <p className="p-4">Please login to view profile</p>;

  return (
    <div>
      {user.role === "buyer" && <BuyerProfile />}
      {user.role === "seller" && <SellerPanel />}
    </div>
  );
}
