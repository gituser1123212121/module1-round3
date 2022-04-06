const jwt = require("jsonwebtoken");

const SECRET_KEY = "my_secret";

// for protected routes, we need the checkToken
const checkToken = (req, res, next) => {
  //check if user is logged in
  if (!req.headers.authorization) {
    res.status(400).json({ message: `this request is not authorized` });
  } else {
    // decode the token and verify it
    let decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);
    if (!decodedToken) {
      // token has expired
      res.status(400).json({ message: `this token is invalid` });
    } else {
      next();
    }
  }
};

// checks if a user with "admin" role is making request
const checkIfAdmin = (req, res, next) => {
  let decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);
  if (decodedToken.role !== "admin") {
    res.status(400).json({ message: `you are not admin` });
  } else {
    next();
  }
};

module.exports = { checkToken, checkIfAdmin };
