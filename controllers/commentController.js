const Comment = require('../models/comment');

// Retrieve Comments
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.getAll(req.poolPromise);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// Create New Commnent function
const createComment = async (req, res, next) => {
  const { content, videoId, username } = req.body;
  if (!content || !videoId || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newComment = await Comment.create(req.poolPromise, content, videoId, username);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Delete a Comment function
const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const success = await Comment.delete(req.poolPromise, id);
    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment
};
