// Import the mssql library to interact with the SQL Server
const sql = require('mssql');

class Content {
  // Method to get all records from the Contents table
  static async getAll(pool) {
    // Execute a SQL query to select all records from the Contents table
    const result = await pool.request().query('SELECT * FROM Contents');
    return result.recordset;
  }

  // Method to get all records from the Contents table that is favourite by username
  static async getAllFavouriteByUsername(pool, username) {
    // Execute a SQL query to select all records from the Contents table
    const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT ct.VideoId, ct.Title, ct.Description, ct.Playlist, ct.Thumbnail, ct.Video, ct.username, ct.dateUploaded, fv.id AS favouriteId FROM Contents ct INNER JOIN Favourites fv ON ct.VideoId = fv.videoId WHERE ct.username = @username');
    return result.recordset;
  }

  // Method to get a specific record by its ID from the Contents table
  static async getById(pool, id) {
    // Execute a SQL query to select a record from the Contents table where VideoId matches the provided id
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Contents WHERE VideoId = @id');
    return result.recordset[0];
  }


    // Method to get a specific record by its ID and username from the Contents and Favourite table 
    static async getByIdAndUsername(pool, id, username) {
      // Execute a SQL query to select a record from the Contents table where VideoId matches the provided id
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('username', sql.VarChar, username)
        .query('SELECT ct.VideoId, ct.Title, ct.Description, ct.Playlist, ct.Thumbnail, ct.Video, ct.username, ct.dateUploaded, fv.id AS favouriteId FROM Contents ct LEFT JOIN Favourites fv ON ct.VideoId = fv.videoId WHERE ct.VideoId = @id AND ct.username = @username');
      return result.recordset[0];
    }

    // Method to get a specific record by Playlist ID from the Contents table
    static async getByPlaylistId(pool, id) {
      // Execute a SQL query to select a record from the Contents table where VideoId matches the provided id
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Contents WHERE Playlist = @id');
      return result.recordset;
    }
  

  // Method to create a new record in the Contents table
  static async create(pool, title, description, playlist, thumbnail, video, username, dateUploaded) {
    // Execute a SQL query to insert a new record into the Contents table
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('playlist', sql.Int, playlist)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .input('video', sql.NVarChar, video)
      .input('username', sql.NVarChar, username)
      .input('dateUploaded', sql.DateTime, dateUploaded)
      .query('INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded) OUTPUT inserted.* VALUES (@title, @description, @playlist, @thumbnail, @video, @username, @dateUploaded)');
    return result.recordset[0];
  }

  // Method to update an existing record in the Contents table
  static async update(pool, id, title, description, playlist, thumbnail, video, username, dateUploaded) {
     // Execute a SQL query to update a record in the Contents table where VideoId matches the provided id
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('playlist', sql.Int, playlist)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .input('video', sql.NVarChar, video)
      .input('username', sql.NVarChar, username)
      .input('dateUploaded', sql.DateTime, dateUploaded)
      .query('UPDATE Contents SET Title = @title, Description = @description, Playlist = @playlist, Thumbnail = @thumbnail, Video = @video, username = @username, dateUploaded = @dateUploaded WHERE VideoId = @id');
    return result.rowsAffected[0] > 0;
  }

  // Method to delete a record from the Contents table
  static async delete(pool, id) {
    // Execute a SQL query to delete a record from the Contents table where VideoId matches the provided id
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Contents WHERE VideoId = @id');
    return result.rowsAffected[0] > 0;
  }
}

// Export the Content class so it can be used in other files
module.exports = Content;