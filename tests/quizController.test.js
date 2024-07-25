const { getAllQuizzes } = require('../controllers/quizController'); // Update path based on your file structure
const Quiz = require('../models/quiz'); // Assuming Quiz class is in the models directory

jest.mock('../models/quiz', () => {
  return {
    getAllQuizzes: jest.fn(), // Mock the getAllQuizzes function
  };
});

describe('getAllQuizzes controller test', () => {
  test('should return all quizzes on success', async () => {
    const mockQuizzes = [
      { id: 1, title: 'Quiz 1' },
      { id: 2, title: 'Quiz 2' },
    ];
    Quiz.getAllQuizzes.mockResolvedValue(mockQuizzes);

    const mockReq = {};
    const mockRes = { json: jest.fn() };

    await getAllQuizzes(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ results: mockQuizzes });
  });

  test('should handle errors', async () => {
    const mockError = new Error('Database error');
    Quiz.getAllQuizzes.mockRejectedValue(mockError);

    const mockReq = {};
    const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getAllQuizzes(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith('Error retrieving quizzes');
  });
});
