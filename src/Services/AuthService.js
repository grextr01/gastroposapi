require("dotenv").config();
const db = require("better-sqlite3")(process.env.DBNAME);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateLogin = async (email, pass) => {
  const query = "SELECT * FROM Users WHERE email = ?";
  const row = db.prepare(query).get(email);
  if (!row) {
    return {
      valid: false
    };
  }
  const valid = await bcrypt.compare(pass, row.password);
  if (!valid) {
    return {
      valid: false
    };
  }
  const { Name, ...result } = row;
  const payload = {
    userId: row.id,
    admin: row.admin
  };
  const token = generateToken(payload);
  const returnResult = {
    token,
    Name
  };
  return {
    valid: true,
    result: returnResult
  };
};

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { valid, decodedToken } = validateToken(token);
    if (!valid) {
      throw new Error();
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "UnAuthorized"
    });
  }
};

const validateToken = token => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);
    if (!decodedToken.userId) {
      return {
        valid: false
      };
    }
    return {
      valid: true,
      decodedToken
    };
  } catch (err) {
    return {
      valid: false
    };
  }
};

const generateToken = payload => {
  var secretKey = process.env.SECRETKEY;
  const token = jwt.sign(payload, secretKey);
  return token;
};

const createUser = user => {
  const { Name, email, password, admin } = user;
  const query =
    "INSERT INTO Users(Name,email,password,admin,created_at) VALUES(?,?,?,?,?)";
  const changes = db
    .prepare(query)
    .run(Name, email, hashPassword(password), admin, Date.now());
  if (changes === 0) {
    throw new Error("An Error occured while creating a new user");
  }
};

const hashPassword = password => {
  var hash = bcrypt.hashSync(password, 10);
  return hash;
};

module.exports = {
  createUser,
  validateLogin,
  authenticate
};
