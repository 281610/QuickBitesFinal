import Order from "../models/Order.js";
import Food from "../models/Food.js";

/*export const placeOrder = async (req, res) => {
  try {
    const { buyerId, foodId, quantity } = req.body;

    // 1. Create order
    const order = new Order({
      buyer: buyerId,
      food: foodId,
      quantity,
      status: "pending",
    });
    await order.save();

    // 2. Delete food from Food collection (so no one else buys it again)
    await Food.findByIdAndDelete(foodId);

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Place Order Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};
*/
export const placeOrder = async (req, res) => {
  try {
    const { buyerId, foodId, quantity = 1, paymentMethod = "online" } = req.body;

    // 1. Check if food exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    // 2. Check stock (if you track stock)
    if (food.stock !== undefined && food.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // 3. Create order
    const qty = Number(quantity) || 1;
    const unitPrice = Number(food.price) || 0;
    const order = new Order({
      buyer: buyerId,
      food: foodId,
      foodName: food.name,
      quantity: qty,
      unitPrice,
      totalAmount: unitPrice * qty,
      paymentMethod,
      status: "pending",
    });
    await order.save();

    // 4. Decrease stock instead of deleting
    if (food.stock !== undefined) {
      food.stock -= qty;
      await food.save();
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Place Order Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // populate food so we can show its name
    const orders = await Order.find({ buyer: buyerId })
      .populate("food")
      .sort({ createdAt: -1 });

    const normalizedOrders = orders.map((order) => {
      const totalAmount =
        order.totalAmount && order.totalAmount > 0
          ? order.totalAmount
          : (order.food?.price || order.unitPrice || 0) * (order.quantity || 1);

      return {
        ...order.toObject(),
        totalAmount,
      };
    });

    res.json(normalizedOrders);
  } catch (err) {
    console.error("❌ Get Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const sellerFoods = await Food.find({ seller: sellerId }).select("_id");
    const foodIds = sellerFoods.map((item) => item._id);

    if (foodIds.length === 0) {
      return res.json([]);
    }

    const orders = await Order.find({ food: { $in: foodIds } })
      .populate("food")
      .populate("buyer", "name email contact")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Get Seller Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};
