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

const getProducts = () => {
  const query =
    "SELECT p.id,title,p.description,Price,c.description as Category,Image FROM Products p JOIN Categories c ON p.Category = c.id";
  const rows = db.prepare(query).all();
  return rows;
};

const getProductById = id => {
  const prodcuts = getProducts();
  const product = prodcuts.filter(product => product.id === id);
  if (product.length === 0) {
    return null;
  }
  return product[0];
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};
