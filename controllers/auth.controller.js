const { compareSync, hashSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/").user;

const SECRET_KEY = "my_secret";

const registerUser = (req, res, next) => {
  const userObj = {
    email: req.body.email,
    password: hashSync(req.body.password),
    name: req.body.name,
    role: req.body.role,
  };
  User.findOne({
    where: {
      email: userObj.email,
    },
  })
    .then((userFound) => {
      if (!userFound) {
        User.create(userObj).then((userCreated) => {
          res.status(200).json({
            message: `${userCreated.name} is now registered`,
          });
        });
      } else {
        res.status(200).json({
          message: `${userFound.name} is already registered`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const loginUser = (req, res, next) => {
  const userObj = {
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({
    where: {
      email: userObj.email,
    },
  })
    .then((userFound) => {
      if (userFound) {
        const matchPassword = compareSync(userObj.password, userFound.password);
        if (matchPassword) {
          // login success
          let token = jwt.sign(
            { userId: userFound.id, role: userFound.role },
            SECRET_KEY
          );
          res.status(200).json({
            message: `${userFound.name} has been logged in`,
            token: token,
          });
        } else {
          rese
            .status(400)
            .json({ message: `bad credentials for ${userFound.email}` });
        }
      } else {
        res.status(400).json({ message: `${userObj.email} not found` });
      }
    })
    .catch((err) => {
      message: err.message;
    });
};

module.exports = {
  registerUser,
  loginUser,
};
