// commentController.test.js
const { getComments, getCommentsById, createComment, deleteComment } = require('../controllers/commentController');
const Comment = require('../models/comment');

jest.mock('../models/comment');

describe('Comment Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      poolPromise: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis() // Proper chaining
    };
    next = jest.fn();
    jest.clearAllMocks();  // Clear all mocks before each test
  });

  describe('getComments', () => {
    it('should return all comments', async () => {
      const comments = [{ id: 1, content: 'Test comment' }];
      Comment.getAll.mockResolvedValue(comments);

      await getComments(req, res, next);

      expect(Comment.getAll).toHaveBeenCalledWith(req.poolPromise);
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Comment.getAll.mockRejectedValue(error);

      await getComments(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCommentsById', () => {
    it('should return comments by id', async () => {
      const comment = { id: 1, content: 'Test comment' };
      req.params.id = 1;
      Comment.getById.mockResolvedValue(comment);

      await getCommentsById(req, res, next);

      expect(Comment.getById).toHaveBeenCalledWith(req.poolPromise, 1);
      expect(res.json).toHaveBeenCalledWith(comment);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params.id = 1;
      Comment.getById.mockRejectedValue(error);

      await getCommentsById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const newComment = { id: 1, content: 'New comment', videoId: 1, username: 'user1' };
      req.body = { content: 'New comment', videoId: 1, username: 'user1' };
      Comment.create.mockResolvedValue(newComment);

      await createComment(req, res, next);

      expect(Comment.create).toHaveBeenCalledWith(req.poolPromise, 'New comment', 1, 'user1');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newComment);
    });

    it('should handle missing fields', async () => {
      req.body = { content: 'New comment', videoId: 1 };

      await createComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.body = { content: 'New comment', videoId: 1, username: 'user1' };
      Comment.create.mockRejectedValue(error);

      await createComment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      req.params.id = 1;
      Comment.delete.mockResolvedValue(true);

      await deleteComment(req, res, next);

      expect(Comment.delete).toHaveBeenCalledWith(req.poolPromise, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
    });

    it('should handle comment not found', async () => {
      req.params.id = 1;
      Comment.delete.mockResolvedValue(false);

      await deleteComment(req, res, next);

      expect(Comment.delete).toHaveBeenCalledWith(req.poolPromise, 1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found' });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      req.params.id = 1;
      Comment.delete.mockRejectedValue(error);

      await deleteComment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
