// playlistController.test.js
const playlistController = require('../controllers/playlistController');

// Mock the mssql module
jest.mock('mssql', () => ({
  connect: jest.fn(),
  query: jest.fn(),
}));

describe('Playlist Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      poolPromise: Promise.resolve({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
      }),
      params: {},
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('getPlaylists', () => {
    // Retrieve All Playlists
    test('should return all playlists', async () => {
      const mockPlaylists = [{ id: 1, title: 'Playlist 1' }, { id: 2, title: 'Playlist 2' }];
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ recordset: mockPlaylists }));

      await playlistController.getPlaylists(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockPlaylists);
    });

    test('should call next with error if query fails', async () => {
      const mockError = new Error('Database error');
      mockReq.poolPromise.then(pool => pool.query.mockRejectedValue(mockError));

      await playlistController.getPlaylists(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getPlaylistById', () => {
    // A Playlist with its contents
    test('should return a playlist with its contents', async () => {
      const mockPlaylist = { playlistId: 1, title: 'Playlist 1' };
      const mockContents = [{ id: 1, title: 'Content 1' }];
      mockReq.params.id = 1;
      mockReq.poolPromise.then(pool => {
        pool.query
          .mockResolvedValueOnce({ recordset: [mockPlaylist] })
          .mockResolvedValueOnce({ recordset: mockContents });
      });

      await playlistController.getPlaylistById(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ ...mockPlaylist, contents: mockContents });
    });

    test('should return 404 if playlist not found', async () => {
      mockReq.params.id = 999;
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ recordset: [] }));

      await playlistController.getPlaylistById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Playlist not found' });
    });
  });

  describe('createPlaylist', () => {
    // Create new playlist
    test('should create a new playlist', async () => {
      const newPlaylist = { playlistId: 1, title: 'New Playlist' };
      mockReq.body = { title: 'New Playlist', description: 'Description', username: 'user1' };
      mockReq.file = { destination: '/uploads/', filename: 'thumbnail.jpg' };
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ recordset: [newPlaylist] }));

      await playlistController.createPlaylist(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(newPlaylist);
    });

    test('should call next with error if creation fails', async () => {
      const mockError = new Error('Creation failed');
      mockReq.body = { title: 'New Playlist', description: 'Description', username: 'user1' };
      mockReq.file = { destination: '/uploads/', filename: 'thumbnail.jpg' };
      mockReq.poolPromise.then(pool => pool.query.mockRejectedValue(mockError));

      await playlistController.createPlaylist(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updatePlaylist', () => {
    // Update a playlist
    test('should update an existing playlist', async () => {
      mockReq.params.id = 1;
      mockReq.body = { Title: 'Updated Title', Description: 'Updated Description', Thumbnail: 'new-thumbnail.jpg' };
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ rowsAffected: [1] }));

      await playlistController.updatePlaylist(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Playlist updated successfully' });
    });

    test('should return 404 if playlist not found during update', async () => {
      mockReq.params.id = 999;
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ rowsAffected: [0] }));

      await playlistController.updatePlaylist(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Playlist not found' });
    });

    test('should call next with error if update fails', async () => {
      const mockError = new Error('Update failed');
      mockReq.params.id = 1;
      mockReq.body = { Title: 'Updated Title', Description: 'Updated Description', Thumbnail: 'new-thumbnail.jpg' };
      mockReq.poolPromise.then(pool => pool.query.mockRejectedValue(mockError));

      await playlistController.updatePlaylist(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deletePlaylist', () => {
    // Delete a playlist
    test('should delete an existing playlist', async () => {
      mockReq.params.id = 1;
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ rowsAffected: [1] }));

      await playlistController.deletePlaylist(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Playlist deleted successfully' });
    });

    test('should return 404 if playlist not found during deletion', async () => {
      mockReq.params.id = 999;
      mockReq.poolPromise.then(pool => pool.query.mockResolvedValue({ rowsAffected: [0] }));

      await playlistController.deletePlaylist(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Playlist not found' });
    });

    test('should call next with error if deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      mockReq.params.id = 1;
      mockReq.poolPromise.then(pool => pool.query.mockRejectedValue(mockError));

      await playlistController.deletePlaylist(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});