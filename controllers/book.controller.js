const Book = require("../models/").book;

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

module.exports = {
  getBooks,
  createBook,
  getRentedBooks,
};
