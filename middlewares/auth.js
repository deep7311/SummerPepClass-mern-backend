import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.SECRET;

export const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    token = token.split(" ")[1];
    const user = jwt.verify(token, SECRET);

    req.role = user.role;
    next();
  } catch (err) {
    console.log("Token Error:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};


export const authorize = (role) => {
  return (req, res, next) => {
    if (role === req.role) {
      next();
    } else {
      return res.json({ message: "Unauthorized access" });
    }
  };
};
