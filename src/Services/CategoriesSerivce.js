require("dotenv").config();
const db = require("better-sqlite3")(process.env.DBNAME);

const createCategory = category => {
  const query =
    "INSERT INTO Categories(description,active,created_at) VALUES(?,?,?)";
  const currentTime = new Date().now;
  const result = db.prepare(query).run(category.description, 1, currentTime);
  if (result.changes === 0) {
    throw new Error("An unkown error occured while creating a new Category");
  }
};

const getAllCategories = () => {
  const query = "SELECT id,description FROM Categories WHERE active = 1";
  const result = db.prepare(query).all();
  return result;
};

module.exports = {
  createCategory,
  getAllCategories
};
