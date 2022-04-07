// importing the book model
const Book = require("../models/").book;
const jwt = require("jsonwebtoken");

const SECRET_KEY = "my_secret";

// fetch all books from db
const getBooks = (req, res, next) => {
  Book.findAll()
    .then((booksFound) => {
      res.status(200).json({ books: booksFound });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// create a new book, if not exists
const createBook = (req, res, next) => {
  //rentedBy is null
  const bookObj = {
    isbn: req.body.isbn,
    name: req.body.name,
    author: req.body.author,
    publishedOn: req.body.publishedOn,
    addedOn: req.body.addedOn,
  };

  // check if a book with same isbn exists
  Book.findOne({
    where: {
      isbn: bookObj.isbn,
    },
  })
    .then((bookFound) => {
      // if the book with same isbn was not found
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
        // the book with same isbn already exists
        res.status(400).json({ message: `book already exists` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// localhost:8000/api/v1/book?list=true
// the informataion will be passed in the body
// In the body - id
// delete/renting/return
const mutateBook = (req, res, next) => {
  const bookId = req.body.bookId;
  // decode the auth token
  // the token has the role
  const decodedToken = jwt.verify(req.headers.authorization, SECRET_KEY);

  /**
   * '?delete=true'
   *
   * express will construct a query object
   * req = {
   *      query = {
   *        "return": "true"
   *      }
   * }
   *
   */
  if (req.query.delete === "true") {
    // if the book exists
    // atmost one book will exist
    // SELECT * FROM BOOK WHERE id=1;
    Book.findOne({ where: { id: bookId } })
      .then((bookFound) => {
        // I successfully query the database
        // if book exists delete it
        // TODO: What if the book doesn't exist?
        if (bookFound) {
          // if bookFound is not empty
          Book.destroy({ where: { id: bookFound.id } })
            .then(() => {
              res
                .status(200)
                .json({ message: `book with id ${bookId} has been deleted` });
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        } else {
          // invalid id has been passed
          res.status(400).json({ message: `book with that id does not exist` });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else if (req.query.rent === "true") {
    //find all the books that have been rented by this user
    // SELECT * FROM BOOK WHERE rentedBy = userId;
    // 2 === 1 -> false
    // null === 1 -> false
    // 1 === 1 -> true
    // findAll will return an array of Book objects
    //[{book1}, {book2},...]
    Book.findAll({
      where: {
        rentedBy: decodedToken.userId,
      },
    })
      .then((booksFound) => {
        // check if user has two books
        // booksFound: 0
        if (booksFound.length !== 2) {
          //check if book is available to rent
          Book.findOne({ where: { id: bookId } })
            .then((bookFound) => {
              // rentedBy = null, !rentedBy = true
              if (!bookFound.rentedBy) {
                // if the book is not rented
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
    // set rentedBy is null
    // UPDATE BOOK SET rentedBy = null WHERE id=bookId;
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

// tell you if a book can be rented
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

// get all books rented by user
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
