import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { deleteUser, getAllUser, login, register, updateUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.put("/:id", authenticate, authorize("admin"), updateUser)

userRouter.delete("/:id", authenticate, authorize("admin"), deleteUser)

userRouter.get("/users", authenticate, authorize("admin"), getAllUser);

userRouter.post("/login", login);

export default userRouter
