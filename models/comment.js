// Import the mssql library to interact with the SQL Server
const sql = require('mssql');

class Comment {
  // Method to get all comments from the database
  static async getAll(pool) {
    // Use the pool to send a SQL query to get all rows from the Comments table
    const result = await pool.request().query('SELECT cm.id, cm.content, cm.videoid, cm.username, cm.datePosted, ct.Title FROM Comments cm LEFT JOIN Contents ct ON cm.videoId = ct.VideoId');
    // Return the rows (comments) from the result
    return result.recordset;
  }

  // Mthod to create a new comment in the database
  static async create(pool, content, videoId, username) {
    const result = await pool.request()
      // Bind the parameters to the SQL query to prevent SQL injection
      .input('content', sql.NVarChar, content)
      .input('videoId', sql.Int, videoId)
      .input('username', sql.NVarChar, username)
      // Execute the SQL query to insert the comment and get the inserted row
      .query('INSERT INTO Comments (content, videoId, username, datePosted) OUTPUT inserted.* VALUES (@content, @videoId, @username, GETDATE())');
    return result.recordset[0];
  }

  // Method to delete a comment from the database
  static async delete(pool, id) {
    const result = await pool.request()
      // Bind the parameter to the SQL query to prevent SQL injection
      .input('id', sql.Int, id)
      // Execute the SQL query to delete the comment
      .query('DELETE FROM Comments WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }

  // Method to get comment from database based on video id
  static async getById(pool, id) {
    // Execute a SQL query to select a record from the Playlists table where the playlistId matches the provided ID
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Comments WHERE videoId = @id');
    return result.recordset;
  }
}

// Export the Comment class to be used in other files
module.exports = Comment;