import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();

const dbuser = encodeURIComponent(process.env.DB_USER);
const dbpass = encodeURIComponent(process.env.DB_PASS);

// mongoose.connect("mongodb://localhost:27017/merncafe").then(() => {
//   console.log("Connected to MongoDB");
//   app.listen(8080, () => {
//     console.log("Server started at Port 8080");
//   });
// });


mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.0c8m8ik.mongodb.net/merncafe?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  console.log("Connected to MongoDB");
  app.listen(8080, () => {
    console.log("Server started at Port 8080");
  });
});

app.use(cors())
app.use(express.json());
app.use(express.static("public"))

app.use("/api/users", userRouter);