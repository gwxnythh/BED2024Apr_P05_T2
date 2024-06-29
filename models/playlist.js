const sql = require('mssql');

class Playlist {
  static async getAll(pool) {
    const result = await pool.request().query('SELECT * FROM Playlists');
    return result.recordset;
  }

  static async getById(pool, id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Playlists WHERE playlistId = @id');
    return result.recordset[0];
  }

  static async create(pool, title, description, thumbnail) {
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .query('INSERT INTO Playlists (Title, Description, Thumbnail) OUTPUT inserted.* VALUES (@title, @description, @thumbnail)');
    return result.recordset[0];
  }

  static async update(pool, id, title, description, thumbnail) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('thumbnail', sql.NVarChar, thumbnail)
      .query('UPDATE Playlists SET Title = @title, Description = @description, Thumbnail = @thumbnail WHERE playlistId = @id');
    return result.rowsAffected[0] > 0;
  }

  static async delete(pool, id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Playlists WHERE playlistId = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Playlist;