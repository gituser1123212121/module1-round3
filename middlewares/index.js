const jwt = require("jsonwebtoken");

const SECRET_KEY = "my_secret";

const checkToken = (req, res, next) => {
  //check if user is logged in
  if (!req.headers.authorization) {
    res.status(400).json({ message: `this request is not authorized` });
  } else {
    let decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);
    if (!decodedToken) {
      res.status(400).json({ message: `this token is invalid` });
    } else {
      next();
    }
  }
};

const checkIfAdmin = (req, res, next) => {
  let decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);
  if (decodedToken.role !== "admin") {
    res.status(400).json({ message: `you are not admin` });
  } else {
    next();
  }
};

module.exports = { checkToken, checkIfAdmin };
