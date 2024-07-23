// playlist.test.js
const sql = require('mssql');
const Playlist = require('../models/playlist');

// Mock the mssql library
jest.mock('mssql');

describe('Playlist class', () => {
  let pool;

  beforeEach(() => {
    pool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Retrieve All Playlists
  test('getAll should return all playlists', async () => {
    const mockPlaylists = [{ playlistId: 1, Title: 'Rock', Description: 'Rock hits', Thumbnail: 'rock.jpg' }];
    pool.query.mockResolvedValueOnce({ recordset: mockPlaylists });

    const playlists = await Playlist.getAll(pool);
    expect(playlists).toEqual(mockPlaylists);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Playlists');
  });

  // A Playlist with its contents
  test('getById should return a playlist by ID', async () => {
    const mockPlaylist = { playlistId: 1, Title: 'Rock', Description: 'Rock hits', Thumbnail: 'rock.jpg' };
    pool.input.mockReturnThis();
    pool.query.mockResolvedValueOnce({ recordset: [mockPlaylist] });

    const playlist = await Playlist.getById(pool, 1);
    expect(playlist).toEqual(mockPlaylist);
    expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Playlists WHERE playlistId = @id');
  });

  // Create new playlist
  test('create should insert a new playlist and return it', async () => {
    const newPlaylist = { playlistId: 2, Title: 'Jazz', Description: 'Smooth jazz', Thumbnail: 'jazz.jpg' };
    pool.input.mockReturnThis();
    pool.query.mockResolvedValueOnce({ recordset: [newPlaylist] });

    const playlist = await Playlist.create(pool, 'Jazz', 'Smooth jazz', 'jazz.jpg');
    expect(playlist).toEqual(newPlaylist);
    expect(pool.input).toHaveBeenCalledWith('title', sql.NVarChar, 'Jazz');
    expect(pool.input).toHaveBeenCalledWith('description', sql.NVarChar, 'Smooth jazz');
    expect(pool.input).toHaveBeenCalledWith('thumbnail', sql.NVarChar, 'jazz.jpg');
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO Playlists (Title, Description, Thumbnail) OUTPUT inserted.* VALUES (@title, @description, @thumbnail)');
  });

  // Update a playlist
  test('update should modify an existing playlist and return true if successful', async () => {
    pool.input.mockReturnThis();
    pool.query.mockResolvedValueOnce({ rowsAffected: [1] });

    const result = await Playlist.update(pool, 1, 'Rock Classics', 'Best rock songs', 'rock_classics.jpg');
    expect(result).toBe(true);
    expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
    expect(pool.input).toHaveBeenCalledWith('title', sql.NVarChar, 'Rock Classics');
    expect(pool.input).toHaveBeenCalledWith('description', sql.NVarChar, 'Best rock songs');
    expect(pool.input).toHaveBeenCalledWith('thumbnail', sql.NVarChar, 'rock_classics.jpg');
    expect(pool.query).toHaveBeenCalledWith('UPDATE Playlists SET Title = @title, Description = @description, Thumbnail = @thumbnail WHERE playlistId = @id');
  });

  // Delete a playlist
  test('delete should remove a playlist and return true if successful', async () => {
    pool.input.mockReturnThis();
    pool.query.mockResolvedValueOnce({ rowsAffected: [1] });

    const result = await Playlist.delete(pool, 1);
    expect(result).toBe(true);
    expect(pool.input).toHaveBeenCalledWith('id', sql.Int, 1);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM Playlists WHERE playlistId = @id');
  });
});
