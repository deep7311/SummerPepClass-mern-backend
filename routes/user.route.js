import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { deleteUser, getAllUser, getUserProfile, login, register, updateUser, updateUserPassword, updateUserProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

// user register
userRouter.post("/register", register);

// user login 
userRouter.post("/login", login);

// get all user details only admin
userRouter.get("/all", authenticate, authorize("admin"), getAllUser);

// get specific user details by id only admin
userRouter.get("/:id", authenticate, authorize("admin"), getUserProfile);

// update user details by id only admin
userRouter.delete("/:id", authenticate, authorize("admin"), deleteUser);

// update user details by id only admin
userRouter.put("/:id", authenticate, authorize("admin"), updateUser);

// get user details by id only user
userRouter.get("/:id/profile", authenticate, authorize("user"), getUserProfile);

// update user details by id only user
userRouter.put("/:id/profile", authenticate, authorize("user"), updateUserProfile);

// update user password by id only user
userRouter.put("/:id/password", authenticate, authorize("user"), updateUserPassword);

export default userRouter
