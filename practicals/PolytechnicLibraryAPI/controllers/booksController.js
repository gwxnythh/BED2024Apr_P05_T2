const Book = require("../models/books");

const getAllBooks = async (req, res) => {
    try{
        const books = await Book.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).send("Error retrieving books");
    }
};

const getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const book = await Book.getBookById(bookId);
        if (!book) {
            return res.status(404).send("Book not found");
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving book");
    }
};


const createBook = async (req, res) => {
    const newBook = req.body;
    try {
      const createdBook = await Book.createBook(newBook);
      res.status(201).json(createdBook);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating book");
    }
};

const updateBook = async (req, res) => {
    const bookId = parseInt(req.params.id);
    const newBook = req.body;

    try{
        const updatedBook = await Book.updateBook(bookId, newBook);
        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }
        res.json(updatedBook);
    } catch (error){
        console.error(error);
        res.status(500).send("Error updating book");
    }
}

const deleteBook = async (req, res) => {
    const BookId = parseInt(req.params.id);

    try{
        const success = await Book.deleteBook(BookId);
        if (!success){
            return res.status(404).send("Book not found");
        }
        res.status(204).send("Book deleted");
    } catch (error){
        console.error(error);
        res.status(500).send("Error deleting book");
    }
}

const getBooksCount = async (req, res) => {
    try{
        const count = await Book.countBooks();
        res.json(count);
    } catch (error){
        console.error(error);
        res.status(500).send("Error retrieving book count");
    }
}

async function searchBooks(req, res) {
    const searchTerm = req.query.searchTerm; // Extract search term from query params
  
    try {    
      const books = await Book.searchBooks(searchTerm);
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching books" });
    }
}

const updateBookAvailability = async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const { availability } = req.body;

    try {
        const updatedBook = await Book.updateBookAvailability(bookId, availability);
        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book availability");
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getBooksCount,
    searchBooks,
    updateBookAvailability
};