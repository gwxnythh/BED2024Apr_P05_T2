// Import Needed Model
const Comment = require('../models/comment');

// Retrieve Comments
const getComments = async (req, res, next) => {
  try {
    // Fetch all comments from the database using the getAll method of the Comment model
    const comments = await Comment.getAll(req.poolPromise);
    // Send the retrieved comments as a JSON response
    res.json(comments);
  } catch (error) {
    // Pass any errors to the next middleware for handling
    next(error);
  }
};

// Create New Commnent function
const createComment = async (req, res, next) => {
  // Destructure content, videoId, and username from the request body
  const { content, videoId, username } = req.body;

  // Check if any of the required fields are missing
  if (!content || !videoId || !username) {
    // If any fields are missing, respond with a 400 status and an error message
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new comment in the database using the create method of the Comment model
    const newComment = await Comment.create(req.poolPromise, content, videoId, username);
    // Respond with the newly created comment and a 201 status (created)
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Delete a Comment function
const deleteComment = async (req, res, next) => {
  // Extract the comment ID from the request parameters
  const { id } = req.params;
  try {
    // Attempt to delete the comment from the database using the delete method of the Comment model
    const success = await Comment.delete(req.poolPromise, id);
    if (!success) {
      // If the comment was not found, respond with a 404 status and an error message
      return res.status(404).json({ error: 'Comment not found' });
    }
    // If the deletion was successful, respond with a success message
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
