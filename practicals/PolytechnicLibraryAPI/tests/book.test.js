// book.test.js
const Book = require("../models/books");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { }); // Mock console.error
    });

    it("should retrieve all books from the database", async () => {
        const mockBooks = [
            {
                book_id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                availability: "Y",
            },
            {
                book_id: 2,
                title: "1984",
                author: "George Orwell",
                availability: "Y",
            },
            {
                book_id: 3,
                title: "Moby Dick",
                author: "Herman Melville",
                availability: "N",
            },
        ];

        const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);

        const books = await Book.getAllBooks();

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(books).toHaveLength(3); // Updated length
        expect(books[0]).toBeInstanceOf(Book);
        expect(books[0].book_id).toBe(1); // Adjusted ID
        expect(books[0].title).toBe("To Kill a Mockingbird");
        expect(books[0].author).toBe("Harper Lee");
        expect(books[0].availability).toBe("Y");

        // Add assertions for the second book
        expect(books[1].book_id).toBe(2);
        expect(books[1].title).toBe("1984");
        expect(books[1].author).toBe("George Orwell");
        expect(books[1].availability).toBe("Y");

        // Add assertions for the third book
        expect(books[2].book_id).toBe(3);
        expect(books[2].title).toBe("Moby Dick");
        expect(books[2].author).toBe("Herman Melville");
        expect(books[2].availability).toBe("N");
    });

    it("should handle errors when retrieving books", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));

        await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
        expect(console.error).toHaveBeenCalledWith("Error fetching all books:", errorMessage);
    });
});


describe("Book.updateBookAvailability", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully update the availability of a book", async () => {
        const mockBook = {
            book_id: 1,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            availability: "Y",
        };

        const mockUpdatedBook = { ...mockBook, availability: "N" };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [mockUpdatedBook] }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);

        const updatedBook = await Book.updateBookAvailability(1, "N");

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.request).toHaveBeenCalledTimes(2);
        expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
        expect(mockRequest.input).toHaveBeenCalledWith("book_id", 1);
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Books SET availability = @availability WHERE book_id = @book_id"));
        expect(mockConnection.close).toHaveBeenCalledTimes(2);

        expect(updatedBook).toBeInstanceOf(Book);
        expect(updatedBook.book_id).toBe(1);
        expect(updatedBook.title).toBe("To Kill a Mockingbird");
        expect(updatedBook.author).toBe("Harper Lee");
        expect(updatedBook.availability).toBe("N");
    });

    it("should return null if book with the given id does not exist", async () => {
        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [] }), // Simulate no book found
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);

        const result = await Book.updateBookAvailability(999, "N");

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.request).toHaveBeenCalledTimes(2);
        expect(mockRequest.input).toHaveBeenCalledWith("book_id", 999);
        expect(mockRequest.input).toHaveBeenCalledWith("availability", "N");
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Books SET availability = @availability WHERE book_id = @book_id"));
        expect(mockConnection.close).toHaveBeenCalledTimes(2);

        expect(result).toBeNull(); // Ensure the method returns null
    });

    it("should handle database errors when updating book availability", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));

        await expect(Book.updateBookAvailability(1, "N")).rejects.toThrow(errorMessage);
    });
});
