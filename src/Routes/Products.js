const express = require("express");
const path = require("path");
const { tryCatch, tryCatchAsync } = require("../Services/utils/TryCatch");
const { authenticate } = require("../Services/AuthService");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById
} = require("../Services/ProductsService");
const { validateProducts } = require("../Services/utils/Validator");
const sharp = require("sharp");
const multer = require("multer");

const s = multer.memoryStorage();
const upload = multer({
  storage: s
});

router.get(
  "/api/products",
  authenticate,
  tryCatch((req, res) => {
    const products = getProducts();
    return res.status(200).json({
      products
    });
  })
);

router.get(
  "/api/products/:id",
  tryCatch((req, res) => {
    const productId = req.params.id;
    const product = getProductById(parseInt(productId));
    if (!product) {
      return res.status(404).json({
        message: "Product was not found"
      });
    }
    return res.status(200).json(product);
  })
);

router.post(
  "/api/products",
  authenticate,
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
