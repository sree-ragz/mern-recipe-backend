import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();
router.get("/", async (req, res) => {
  RecipeModel.find({})
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.post("/", verifyToken, async (req, res) => {
  RecipeModel.insertMany(req.body)
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
  //   try {
  //     const response = await recipe.save();
  //     res.json(response);
  //   } catch (err) {
  //     res.json(err);
  //   }
});
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});
router.get("/savedRecipes/id/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
  }
});
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    console.log({ savedRecipes });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});
export { router as recipeRouter };
