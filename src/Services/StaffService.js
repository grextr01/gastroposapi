require("dotenv").config();
const db = require("better-sqlite3")(process.env.DBNAME);
const { hashPassword } = require("./AuthService");
const bcrypt = require("bcrypt");

const getAllStaff = () => {
  const query = `SELECT id,Name,email,admin,created_at FROM Users`;
  const rows = db.prepare(query).all();
  return rows;
};

const createNewStaff = body => {
  var { Name, email, password, admin } = body;
  password = hashPassword(password);
  const now = new Date();
  const query = `INSERT INTO Users(Name,email,password,admin,created_at) 
    VALUES(?,?,?,?,?)`;
  const result = db
    .prepare(query)
    .run(Name, email, password, admin, now.toISOString());
  if (result.changes === 0) {
    throw new Error("An Error occured while creating a new Staff Member");
  }
};

const deleteStaff = staffId => {
  const query = `DELETE FROM Users WHERE id = ?`;
  const result = db.prepare(query).run(staffId);
  if (result.changes === 0) {
    throw new Error("An Error occured while deleting the user");
  }
};

const updatePassword = (userId, password) => {
  password = hashPassword(password);
  const query = `UPDATE Users SET password = ? WHERE id = ?`;
  const result = db.prepare(query).run(password, userId);
  if (result.changes === 0) {
    throw new Error("An Error occured while updating the password");
  }
};

const updateStaff = (staffId, body) => {
  const query = "UPDATE Users SET Name = ? , email = ? WHERE id = ?";
  const { Name, email } = body;
  const result = db.prepare(query).run(Name, email, staffId);
  if (result.changes === 0) {
    throw new Error("An Error occured while updating the User");
  }
};

const checkOldPassword = async (userId, password) => {
  const query = `SELECT password FROM Users WHERE id = ?`;
  const result = db.prepare(query).get(userId);
  if (!result) {
    return false;
  }
  const valid = await bcrypt.compare(password, result.password);
  return valid;
};

module.exports = {
  createNewStaff,
  updatePassword,
  checkOldPassword,
  deleteStaff,
  updateStaff,
  getAllStaff
};
