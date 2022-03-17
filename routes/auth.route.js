const { registerUser } = require("../controllers/auth.controller");

module.exports = (app) => {
	app.post("/api/v1/books/register", registerUser);

}