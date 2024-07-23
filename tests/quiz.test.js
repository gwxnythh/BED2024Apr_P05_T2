const sql = require("mssql");
const Quiz = require("../models/quiz"); // Ensure this path is correct

jest.mock("mssql"); // Mock the mssql library

describe("Quiz.getAllQuizzes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all quizzes from the database", async () => {
    const mockQuizzes = [
      { id: 1, question: "What is 2+2?", answer: "4", options: "2,3,4,5" },
      { id: 2, question: "What is the capital of France?", answer: "Paris", options: "Berlin,London,Paris,Rome" },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockQuizzes }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const quizzes = await Quiz.getAllQuizzes();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(quizzes).toHaveLength(2);
    expect(quizzes[0]).toBeInstanceOf(Quiz);
    expect(quizzes[0].id).toBe(1);
    expect(quizzes[0].question).toBe("What is 2+2?");
    expect(quizzes[0].answer).toBe("4");
    expect(quizzes[0].options).toEqual(["2", "3", "4", "5"]);
    // Add assertions for the second quiz
  });

  it("should handle errors when retrieving quizzes", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Quiz.getAllQuizzes()).rejects.toThrow(errorMessage);
  });
});
