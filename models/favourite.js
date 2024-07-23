// Import the mssql library to interact with the SQL Server
const sql = require('mssql');

class Favourite {
  // Method to create a new favourite record
  static async create(pool, videoId, username) {
    // Execute a SQL query to insert a new record into the favourites table and return the inserted record
    const result = await pool.request()
      .input('videoId', sql.Int, videoId)
      .input('username', sql.NVarChar, username)
      .query('INSERT INTO Favourites (videoId, username, dateFavourited) OUTPUT inserted.* VALUES (@videoId, @username, GETDATE())');
    return result.recordset[0];
  }

  // Method to delete a favourite record by id
  static async delete(pool, id) {
    // Execute a SQL query to delete a record from the favourite table where the id matches the provided ID
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Favourites WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }
}

// Export the Playlist class so it can be used in other files
module.exports = Favourite;