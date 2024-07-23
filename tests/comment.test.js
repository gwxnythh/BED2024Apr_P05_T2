// comment.test.js
const sql = require('mssql');
const Comment = require('../models/comment');

jest.mock('mssql');

describe('Comment Model', () => {
  let pool;

  beforeEach(() => {
    pool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };
    sql.NVarChar = jest.fn();
    sql.Int = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all comments', async () => {
      const comments = [{ id: 1, content: 'Test comment' }];
      pool.query.mockResolvedValue({ recordset: comments });

      const result = await Comment.getAll(pool);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith('SELECT cm.id, cm.content, cm.videoid, cm.username, cm.datePosted, ct.Title FROM Comments cm LEFT JOIN Contents ct ON cm.videoId = ct.VideoId');
      expect(result).toEqual(comments);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValue(error);

      await expect(Comment.getAll(pool)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const newComment = { id: 1, content: 'New comment', videoId: 1, username: 'user1', datePosted: new Date() };
      pool.query.mockResolvedValue({ recordset: [newComment] });

      const result = await Comment.create(pool, 'New comment', 1, 'user1');

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith('content', sql.NVarChar, 'New comment');
      expect(pool.input).toHaveBeenCalledWith('videoId', sql.Int, 1);
      expect(pool.input).toHaveBeenCalledWith('username', sql.NVarChar, 'user1');
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO Comments (content, videoId, username, datePosted) OUTPUT inserted.* VALUES (@content, @videoId, @username, GETDATE())');
      expect(result).toEqual(newComment);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValue(error);

      await expect(Comment.create(pool, 'New comment', 1, 'user1')).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      pool.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await Comment.delete(pool, 1);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM Comments WHERE id = @id');
      expect(result).toBe(true);
    });

    it('should return false if no comment was deleted', async () => {
      pool.query.mockResolvedValue({ rowsAffected: [0] });

      const result = await Comment.delete(pool, 1);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM Comments WHERE id = @id');
      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValue(error);

      await expect(Comment.delete(pool, 1)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return comments by video id', async () => {
      const comments = [{ id: 1, content: 'Test comment' }];
      pool.query.mockResolvedValue({ recordset: comments });

      const result = await Comment.getById(pool, 1);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Comments WHERE videoId = @id');
      expect(result).toEqual(comments);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      pool.query.mockRejectedValue(error);

      await expect(Comment.getById(pool, 1)).rejects.toThrow('Database error');
    });
  });
});
