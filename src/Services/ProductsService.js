require("dotenv").config();
const db = require("better-sqlite3")(process.env.DBNAME);
const createProduct = (product, image) => {
  const { title, description, Price, Category } = product;
  const now = new Date();
  const query = `INSERT INTO Products(title,description,Price,Category,Image,created_at) VALUES(?,?,?,?,?,?)`;
  const result = db
    .prepare(query)
    .run(title, description, Price, Category, image, now.toISOString());
  if (result.changes === 0) {
    throw new Error("An unkown error occured while creating a new product");
  }
};

module.exports = {
  createProduct
};
