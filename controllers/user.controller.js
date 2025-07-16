import bcrypt from "bcryptjs";
import {userModel} from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedpwd,
    };
    const result = await userModel.create(user);
    res.status(201).json({message: "User registered successfully", result, success: true});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const getAllUser = async (req, res) => {
  try {
    const {page = 1, limit = 3, search = ""} = req.query
    const skip = (page - 1) * limit
    const count = await userModel.countDocuments({name: {$regex: search, $options: 'i'}})
    const total = Math.ceil(count / limit)
    const users = await userModel.find({name: {$regex: search, $options: "i"}})
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    res.status(200).json({users, totalPages: total, success: true});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, role } = req.body;

    const updateData = { name, email, role };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findByIdAndDelete(id);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        const token = jwt.sign(userObj, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ userObj, token });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const updateUserPassword = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id);
    if (user) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (isMatch) {
        const hashedpwd = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedpwd;
        await user.save();
        res.status(201).json(user);
      } else {
        res.status(400).json({ message: "Invalid old password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const addUserByAdmin = async (req, res) => {
  try {
    const {name, email, password, role} = req.body
    const user = await userModel.findOne({email})
    if(user) {
      return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await userModel.create({name, email, password: hashedPassword, role})

    res.status(201).json({message: "New User Added successfully", newUser, success: true})

  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Something went wrong"})
  }
}