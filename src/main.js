const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const PORT = process.env.PORT || 3030;
const Categories = require("./Routes/Categories");
const Products = require("./Routes/Products");
const errorHandler = require("./Services/utils/ErrorHanlder");

app.use(Categories);
app.use(Products);
app.use(express.static("public"));
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
