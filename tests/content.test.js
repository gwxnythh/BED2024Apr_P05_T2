// content.test.js
const sql = require('mssql');
const Content = require('../models/content');

jest.mock('mssql', () => ({
  connect: jest.fn(),
  request: jest.fn().mockImplementation(() => ({
    input: jest.fn().mockReturnThis(),
    query: jest.fn()
  })),
}));

describe('Content Model', () => {
  let pool;

  beforeEach(() => {
    pool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should retrieve all contents', async () => {
      const mockContents = [{ id: 1, title: 'Content 1' }];
      pool.query.mockResolvedValue({ recordset: mockContents });

      const result = await Content.getAll(pool);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Contents');
      expect(result).toEqual(mockContents);
    });
  });

  describe('getById', () => {
    test('should retrieve content by ID', async () => {
      const mockContent = { id: 1, title: 'Content 1' };
      const id = 1;
      pool.input.mockReturnThis();
      pool.query.mockResolvedValue({ recordset: [mockContent] });

      const result = await Content.getById(pool, id);

      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, id);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Contents WHERE VideoId = @id');
      expect(result).toEqual(mockContent);
    });

    test('should return undefined if content not found', async () => {
      const id = 1;
      pool.input.mockReturnThis();
      pool.query.mockResolvedValue({ recordset: [] });

      const result = await Content.getById(pool, id);

      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, id);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Contents WHERE VideoId = @id');
      expect(result).toBeUndefined();
    });
  });

  describe('getByPlaylistId', () => {
    test('should retrieve contents by Playlist ID', async () => {
      const mockContents = [{ id: 1, title: 'Content 1' }];
      const playlistId = 1;
      pool.input.mockReturnThis();
      pool.query.mockResolvedValue({ recordset: mockContents });

      const result = await Content.getByPlaylistId(pool, playlistId);

      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, playlistId);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Contents WHERE Playlist = @id');
      expect(result).toEqual(mockContents);
    });
  });

  describe('create', () => {
    test('should create new content and return it', async () => {
      const mockContent = { id: 1, title: 'Content 1' };
      const title = 'Content 1';
      const description = 'Description 1';
      const playlist = 1;
      const thumbnail = 'thumbnail.jpg';
      const video = 'video.mp4';
      const username = 'user';
      const dateUploaded = new Date();

      pool.query.mockResolvedValue({ recordset: [mockContent] });

      const result = await Content.create(pool, title, description, playlist, thumbnail, video, username, dateUploaded);

      expect(pool.input).toHaveBeenCalledWith('title', sql.NVarChar, title);
      expect(pool.input).toHaveBeenCalledWith('description', sql.NVarChar, description);
      expect(pool.input).toHaveBeenCalledWith('playlist', sql.Int, playlist);
      expect(pool.input).toHaveBeenCalledWith('thumbnail', sql.NVarChar, thumbnail);
      expect(pool.input).toHaveBeenCalledWith('video', sql.NVarChar, video);
      expect(pool.input).toHaveBeenCalledWith('username', sql.NVarChar, username);
      expect(pool.input).toHaveBeenCalledWith('dateUploaded', sql.DateTime, dateUploaded);
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded) OUTPUT inserted.* VALUES (@title, @description, @playlist, @thumbnail, @video, @username, @dateUploaded)');
      expect(result).toEqual(mockContent);
    });
  });

  describe('update', () => {
    test('should update existing content and return true', async () => {
      const id = 1;
      const title = 'Updated Title';
      const description = 'Updated Description';
      const playlist = 1;
      const thumbnail = 'updated_thumbnail.jpg';
      const video = 'updated_video.mp4';
      const username = 'updated_user';
      const dateUploaded = new Date();

      pool.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await Content.update(pool, id, title, description, playlist, thumbnail, video, username, dateUploaded);

      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, id);
      expect(pool.input).toHaveBeenCalledWith('title', sql.NVarChar, title);
      expect(pool.input).toHaveBeenCalledWith('description', sql.NVarChar, description);
      expect(pool.input).toHaveBeenCalledWith('playlist', sql.Int, playlist);
      expect(pool.input).toHaveBeenCalledWith('thumbnail', sql.NVarChar, thumbnail);
      expect(pool.input).toHaveBeenCalledWith('video', sql.NVarChar, video);
      expect(pool.input).toHaveBeenCalledWith('username', sql.NVarChar, username);
      expect(pool.input).toHaveBeenCalledWith('dateUploaded', sql.DateTime, dateUploaded);
      expect(pool.query).toHaveBeenCalledWith('UPDATE Contents SET Title = @title, Description = @description, Playlist = @playlist, Thumbnail = @thumbnail, Video = @video, username = @username, dateUploaded = @dateUploaded WHERE VideoId = @id');
      expect(result).toBe(true);
    });

    test('should return false if no rows were affected', async () => {
      const id = 1;
      const title = 'Updated Title';
      const description = 'Updated Description';
      const playlist = 1;
      const thumbnail = 'updated_thumbnail.jpg';
      const video = 'updated_video.mp4';
      const username = 'updated_user';
      const dateUploaded = new Date();

      pool.query.mockResolvedValue({ rowsAffected: [0] });

      const result = await Content.update(pool, id, title, description, playlist, thumbnail, video, username, dateUploaded);

      expect(pool.query).toHaveBeenCalledWith('UPDATE Contents SET Title = @title, Description = @description, Playlist = @playlist, Thumbnail = @thumbnail, Video = @video, username = @username, dateUploaded = @dateUploaded WHERE VideoId = @id');
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    test('should delete content and return true', async () => {
      const id = 1;
      pool.query.mockResolvedValue({ rowsAffected: [1] });

      const result = await Content.delete(pool, id);

      expect(pool.input).toHaveBeenCalledWith('id', sql.Int, id);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM Contents WHERE VideoId = @id');
      expect(result).toBe(true);
    });

    test('should return false if no rows were affected', async () => {
      const id = 1;
      pool.query.mockResolvedValue({ rowsAffected: [0] });

      const result = await Content.delete(pool, id);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM Contents WHERE VideoId = @id');
      expect(result).toBe(false);
    });
  });
});
