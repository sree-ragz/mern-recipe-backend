import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  const user = await UserModel.findOne({ userName }).catch((err) =>
    console.log(err)
  );
  if (user) {
    return res.json({ message: "user already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ userName, password: hashedPassword });
  newUser.save();
  res.json({ message: "New user successfully registered" });
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = await UserModel.findOne({ userName });
  if (!user) {
    return res.json({ message: "User doesnt exist!" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ message: "username or passoword is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) {
        return res.sendStatus(401);
      }
      next();
    });
  } else {
    res.sendStatus(403);
  }
};
