import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { recipeRouter } from "./routes/recipe.js";
import { userRouter } from "./routes/user.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);
mongoose
  .connect("mongodb://127.0.0.1:27017/recipeAppDB")
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => console.log("server running on port 3000"));
