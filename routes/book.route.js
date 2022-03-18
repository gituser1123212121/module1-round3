const {
  getBooks,
  createBook,
  getRentedBooks,
} = require("../controllers/book.controller");
const { checkToken, checkIfAdmin } = require("../middlewares");

module.exports = (app) => {
  app.get("/api/v1/book/list", checkToken, getBooks);
  app.post("/api/v1/book/create", checkToken, checkIfAdmin, createBook);
  app.get("/api/v1/rented/:userId", checkToken, getRentedBooks);
};
