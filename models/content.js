const sql = require('mssql');

class Content {
  static async getAll(pool) {
    const result = await pool.request().query('SELECT * FROM Contents');
    return result.recordset;
  }

  static async getById(pool, id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Contents WHERE VideoId = @id');
    return result.recordset[0];
  }

  static async create(pool, title, description, playlist, thumbnail, video, username, dateUploaded) {
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

  static async update(pool, id, title, description, playlist, thumbnail, video, username, dateUploaded) {
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

  static async delete(pool, id) {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Contents WHERE VideoId = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Content;