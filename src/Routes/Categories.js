const express = require("express");
const { tryCatch } = require("../Services/utils/TryCatch");
const router = express.Router();
const {
  createCategory,
  getAllCategories
} = require("../Services/CategoriesSerivce");
const { authenticate } = require("../Services/AuthService");

router.post(
  "/api/categories",
  authenticate,
  tryCatch((req, res) => {
    const body = req.body;
    createCategory(body);
    return res.status(201).json({
      message: "Category was created successfully"
    });
  })
);

router.get(
  "/api/categories",
  tryCatch((req, res) => {
    const categories = getAllCategories();
    return res.status(200).json({
      categories: categories
    });
  })
);
module.exports = router;
