import orderModel from "../models/order.model.js";

// Place new order
export const placeOrder = async (req, res) => {
  try {
    const { orderValue, userId, items } = req.body;
    const order = await orderModel.create({ orderValue, userId, items });
    res
      .status(201)
      .json({ message: "Order placed successfully", order, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};

// Get all orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await orderModel
      .find({ userId })
      .populate("items.productId", "productName productImage price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching orders" });
  }
};

// Get all orders (for admin maybe)
export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .populate("items.productId", "productName productImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error fetching orders" });
  }
};


// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

