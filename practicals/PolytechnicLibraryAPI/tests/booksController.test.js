// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/books");

// Mock the Book model
jest.mock("../models/books"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { book_id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", availability: "Y" },
      { book_id: 2, title: "1984", author: "George Orwell", availability: "Y" },
      { book_id: 3, title: "Moby Dick", author: "Herman Melville", availability: "N" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
    expect(console.error).toHaveBeenCalledWith("Error retrieving books:", expect.any(Error));
  });
});
