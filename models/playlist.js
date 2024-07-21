// Import the mssql library to interact with the SQL Server
const sql = require('mssql');

class Playlist {
  // Method to get all playlists from the database
  static async getAll(pool) {
    // Execute a SQL query to select all records from the Playlists table
    const result = await pool.request().query('SELECT * FROM Playlists');
    return result.recordset;
  }

  // Method to get a specific playlist by its ID
  static async getById(pool, id) {
    // Execute a SQL query to select a record from the Playlists table where the playlistId matches the provided ID
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Playlists WHERE playlistId = @id');
    return result.recordset[0];
  }

  // Method to create a new playlist
  static async create(pool, title, description, thumbnail) {
    // Execute a SQL query to insert a new record into the Playlists table and return the inserted record
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .query('INSERT INTO Playlists (Title, Description, Thumbnail) OUTPUT inserted.* VALUES (@title, @description, @thumbnail)');
    return result.recordset[0];
  }

  // Method to update an existing playlist by its ID
  static async update(pool, id, title, description, thumbnail) {
    // Execute a SQL query to update a record in the Playlists table where the playlistId matches the provided ID
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .query('UPDATE Playlists SET Title = @title, Description = @description, Thumbnail = @thumbnail WHERE playlistId = @id');
    return result.rowsAffected[0] > 0;
  }

  // Method to delete a playlist by its ID
  static async delete(pool, id) {
    // Execute a SQL query to delete a record from the Playlists table where the playlistId matches the provided ID
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Playlists WHERE playlistId = @id');
    return result.rowsAffected[0] > 0;
  }
}

// Export the Playlist class so it can be used in other files
module.exports = Playlist;