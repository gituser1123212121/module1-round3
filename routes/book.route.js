const {
  getBooks,
  createBook,
  getRentedBooks,
  canRent,
  mutateBook,
} = require("../controllers/book.controller");
const { checkToken, checkIfAdmin } = require("../middlewares");

module.exports = (app) => {
  app.post("/api/v1/book", checkToken, mutateBook);
  app.get("/api/v1/book/list", checkToken, getBooks);
  app.post("/api/v1/book/create", checkToken, checkIfAdmin, createBook);
  app.get("/api/v1/rented/:userId", checkToken, getRentedBooks);
  app.get("/api/v1/rented/status/:bookId", checkToken, canRent);
};
