import { userModel } from "../models/user.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";


export const adminDashBoard = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments()
        const totalProducts = await productModel.countDocuments()
        const totalOrders = await orderModel.countDocuments()

        const pendingOrders = await orderModel.countDocuments({status: "Pending"})
        const shippedOrders = await orderModel.countDocuments({status: "Shipped"})
        const deliveredOrders = await orderModel.countDocuments({status: "Delivered"})

        res.status(200).json({totalUsers, totalProducts, totalOrders, pendingOrders, shippedOrders, deliveredOrders})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}
