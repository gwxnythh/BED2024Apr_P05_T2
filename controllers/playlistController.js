const sql = require('mssql');

const getPlaylists = async (req, res, next) => {
  try {
    const pool = await req.poolPromise;
    const result = await pool.request().query('SELECT * FROM Playlists');
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
};

const getPlaylistById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pool = await req.poolPromise;

    // Query to get the playlist details
    const playlistResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Playlists WHERE playlistId = @id');

    if (playlistResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Query to get the contents of the playlist
    const contentsResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Contents WHERE Playlist = @id');

    // Combine the playlist details with its contents
    const playlist = playlistResult.recordset[0];
    playlist.contents = contentsResult.recordset;

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

const createPlaylist = async (req, res, next) => {
  const { Title, Description, Thumbnail, username } = req.body;

  try {
    const pool = await req.poolPromise;
    const result = await pool.request()
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('Thumbnail', sql.NVarChar, Thumbnail)
      .input('username', sql.NVarChar, username)
      .query('INSERT INTO Playlists (Title, Description, Thumbnail, username, dateUploaded) OUTPUT inserted.* VALUES (@Title, @Description, @Thumbnail, @username, GETDATE())');

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
};

const updatePlaylist = async (req, res, next) => {
  const { id } = req.params;
  const { Title, Description, Thumbnail } = req.body;

  try {
    const pool = await req.poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('Thumbnail', sql.NVarChar, Thumbnail)
      .query('UPDATE Playlists SET Title = @Title, Description = @Description, Thumbnail = @Thumbnail WHERE playlistId = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ message: 'Playlist updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deletePlaylist = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pool = await req.poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Playlists WHERE playlistId = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
};