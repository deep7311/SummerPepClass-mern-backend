import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "User" },
    mobile: {type: Number}
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);