const { registerUser, loginUser } = require("../controllers/auth.controller");

module.exports = (app) => {
  app.post("/api/v1/register", registerUser);
  app.post("/api/v1/login", loginUser);
};
