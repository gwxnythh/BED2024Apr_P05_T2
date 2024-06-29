const sql = require('mssql');

class Comment {
  static async getAll(pool) {
    const result = await pool.request().query('SELECT * FROM Comments');
    return result.recordset;
  }

  static async create(pool, content, videoId, username) {
    const result = await pool.request()
      .input('content', sql.NVarChar, content)
      .input('videoId', sql.Int, videoId)
      .input('username', sql.NVarChar, username)
      .query('INSERT INTO Comments (content, videoId, username, datePosted) OUTPUT inserted.* VALUES (@content, @videoId, @username, GETDATE())');
    return result.recordset[0];
  }

  static async delete(pool, id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Comments WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Comment;