import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { addUserByAdmin, deleteUser, getAllUser, getUserProfile, login, register, updateUser, updateUserPassword, updateUserProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

// user register
userRouter.post("/register", register);

// user login
userRouter.post("/login", login);

// get all user details only admin
userRouter.get("/all", authenticate, authorize("Admin"), getAllUser);
// userRouter.get("/all", getAllUser);

// get specific user details by id only admin
userRouter.get("/:id", authenticate, authorize("Admin"), getUserProfile);

// delete user details by id only admin
userRouter.delete("/:id", authenticate, authorize("Admin"), deleteUser);
// userRouter.delete("/:id", deleteUser);

// update user details by id only admin
userRouter.put("/update-user/:id", authenticate, authorize("Admin"), updateUser);
// userRouter.put("/update-user/:id", updateUser);

// get user details by id only user
userRouter.get("/:id/profile", authenticate, getUserProfile);

// update user details by id only user
userRouter.put("/:id/update-profile", authenticate, updateUserProfile);

// update user password by id only user
userRouter.put("/:id/password", authenticate, updateUserPassword);

// admin can create user by
userRouter.post("/create-user", addUserByAdmin);

export default userRouter
