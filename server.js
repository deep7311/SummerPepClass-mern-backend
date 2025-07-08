import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// const dbuser = encodeURIComponent(process.env.DB_USER);
// const dbpass = encodeURIComponent(process.env.DB_PASS);

// mongoose.connect(`mongodb://${dbuser}:${dbpass}@localhost:27017/lpu?authSource=admin`).then(() => {
//   console.log("Connected to MongoDB");
//   app.listen(8080, () => {
//     console.log("Server started at Port 8080");
//   });
// });

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(8080, () => {
    console.log("Server started at Port 8080");
  });
});


app.use(express.json());

app.use("/api/users", userRouter);