const Book = require("../models/").book;
const jwt = require("jsonwebtoken");

const SECRET_KEY = "my_secret";

const getBooks = (req, res, next) => {
  Book.findAll()
    .then((booksFound) => {
      res.status(200).json({ books: booksFound });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const createBook = (req, res, next) => {
  const bookObj = {
    isbn: req.body.isbn,
    name: req.body.name,
    author: req.body.author,
    publishedOn: req.body.publishedOn,
    addedOn: req.body.addedOn,
  };

  Book.findOne({
    where: {
      isbn: bookObj.isbn,
    },
  })
    .then((bookFound) => {
      if (!bookFound) {
        // create the book
        Book.create(bookObj)
          .then((bookCreated) => {
            res
              .status(200)
              .json({ message: `${bookCreated.name} has been created` });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      } else {
        res.status(400).json({ message: `book already exists` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const mutateBook = (req, res, next) => {
  const bookId = req.body.bookId;
  const decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);

  if (req.query.delete === "true") {
    Book.findOne({ where: { id: bookId } })
      .then((bookFound) => {
        //if book exists delete it
        Book.destroy({ where: { id: bookFound.id } })
          .then(() => {
            res
              .status(200)
              .json({ message: `book with id ${bookId} has been deleted` });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else if (req.query.rent === "true") {
    Book.findAll({
      where: {
        rentedBy: decodedToken.userId,
      },
    })
      .then((booksFound) => {
        if (booksFound.length !== 2) {
          //check if book is available to rent
          Book.findOne({ where: { id: bookId } })
            .then((bookFound) => {
              if (!bookFound.rentedBy) {
                Book.update(
                  { rentedBy: decodedToken.userId },
                  { where: { id: bookId } }
                )
                  .then(() => {
                    res.status(200).json({
                      message: `book with id ${bookId} has been rented to you`,
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({ message: err.message });
                  });
              } else {
                if (bookFound.rentedBy === decodedToken.userId) {
                  res.status(200).json({
                    message: `you cannot rent the same book twice, return it to re-rent it`,
                  });
                } else {
                  res
                    .status(400)
                    .json({ message: `that book cannot be rented` });
                }
              }
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        } else {
          res.status(400).json({
            message: `you cannot rent anymore books, return some to rent more`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else if (req.query.return === "true") {
    Book.update(
      { rentedBy: null },
      {
        where: { id: bookId },
      }
    )
      .then(() => {
        res.status(200).json({
          message: `book with id ${bookId} has been returned`,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: `that's not a valid option`,
    });
  }
};

const canRent = (req, res, next) => {
  let bookId = req.params.bookId;

  Book.findOne({
    where: {
      id: bookId,
    },
  })
    .then((bookFound) => {
      let canRent = false;
      if (!bookFound.rentedBy) {
        canRent = true;
      }
      res.status(200).json({ canRent: canRent });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const getRentedBooks = (req, res, next) => {
  const userId = req.params.userId;
  Book.findAll({
    where: {
      rentedBy: userId,
    },
  })
    .then((rentedBooksFound) => {
      res.status(200).json({ books: rentedBooksFound });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findOne({ where: { id: bookId } })
    .then((bookFound) => {
      //if book exists delete it
      Book.destroy({ where: { id: bookFound.id } })
        .then(() => {
          res
            .status(200)
            .json({ message: `book with id ${bookId} has been deleted` });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getBooks,
  createBook,
  getRentedBooks,
  canRent,
  mutateBook,
};
