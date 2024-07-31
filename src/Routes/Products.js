const express = require("express");
const path = require("path");
const { tryCatch, tryCatchAsync } = require("../Services/utils/TryCatch");
const router = express.Router();
const { createProduct } = require("../Services/ProductsService");
const { validateProducts } = require("../Services/utils/Validator");
const sharp = require("sharp");
const multer = require("multer");

const s = multer.memoryStorage();
const upload = multer({
  storage: s
});

router.post(
  "/api/products",
  upload.fields([
    {
      name: "productImage",
      maxCount: 1
    }
  ]),
  validateProducts,
  tryCatchAsync(async (req, res) => {
    const file = req.files.productImage[0];
    if (!file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }
    const compressedImageBuffer = await sharp(file.buffer)
      .jpeg({ quality: 60 })
      .toBuffer();
    const filename = `Product_${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(`./public/images/Products`, filename);
    const product = req.body;
    createProduct(product, `images/Products/${filename}`);
    await sharp(compressedImageBuffer).toFile(filePath);
    return res.status(201).json({
      message: "product was created succesfully"
    });
  })
);

module.exports = router;
