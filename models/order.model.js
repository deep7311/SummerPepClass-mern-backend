import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderValue: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "Pending",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;