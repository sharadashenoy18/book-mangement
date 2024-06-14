const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all the books
 * Access: Public
 * Parameters: none
 */
router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: books });
});


/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: none
 */
router.get("/issued", (req, res) => {
  const usersWithIssuedBook = users.filter((each) => each.issuedBook);
  const issuedBooks = usersWithIssuedBook.map((each) => {
    const book = books.find((book) => book.id === each.issuedBook);
    if (book) {
      return {
        ...book,
        issuedBy: each.name,
        issuedDate: each.issuedDate,
        returnDate: each.returnDate,
      };
    }
  }).filter(Boolean);

  if (issuedBooks.length === 0) {
    return res.status(404).json({ success: false, message: "No books have been issued" });
  }

  return res.status(200).json({ success: true, data: issuedBooks });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by their id
 * Access: Public
 * Parameters: id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);

  if (!book) {
    console.log(`Book with ID ${id} not found`);
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  return res.status(200).json({ success: true, data: book });
});

/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 */
router.post("/", (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "No data was provided",
    });
  }

  const book = books.find((each) => each.id === data.id);

  if (book) {
    return res.status(400).json({
      success: false,
      message: "Book already exists with the same ID",
    });
  }

  books.push(data);

  return res.status(201).json({
    success: true,
    data: books,
  });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating a book
 * Access: Public
 * Parameters: id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const bookIndex = books.findIndex((each) => each.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Book not found with that particular ID",
    });
  }

  books[bookIndex] = { ...books[bookIndex], ...data };

  return res.status(200).json({
    success: true,
    data: books[bookIndex],
  });
});

module.exports = router;
