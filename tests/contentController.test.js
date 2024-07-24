// contentController.test.js
const sql = require('mssql');
const Content = require('../models/content');
const {
    getContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    getContentByPlaylistId
} = require('../controllers/contentController');

jest.mock('../models/content');
jest.mock('mssql', () => ({
    connect: jest.fn(),
    request: jest.fn().mockImplementation(() => ({
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
    })),
}));

describe('Content Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            poolPromise: {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                query: jest.fn()
            },
            params: {},
            body: {},
            files: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getContents', () => {
        // Retrieve All Contents
        test('should retrieve all contents', async () => {
            const mockContents = [{ id: 1, title: 'Content 1' }];
            Content.getAll.mockResolvedValue(mockContents);

            await getContents(req, res, next);

            expect(Content.getAll).toHaveBeenCalledWith(req.poolPromise);
            expect(res.json).toHaveBeenCalledWith(mockContents);
        });

        test('should call next with error if query fails', async () => {
            const mockError = new Error('Database error');
            Content.getAll.mockRejectedValue(mockError);

            await getContents(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getContentById', () => {
        // Retrieve content by its ID
        test('should retrieve content by ID', async () => {
            const mockContent = { id: 1, title: 'Content 1' };
            req.params.id = 1;
            Content.getById.mockResolvedValue(mockContent);

            await getContentById(req, res, next);

            expect(Content.getById).toHaveBeenCalledWith(req.poolPromise, 1);
            expect(res.json).toHaveBeenCalledWith(mockContent);
        });

        test('should return 404 if content is not found', async () => {
            req.params.id = 1;
            Content.getById.mockResolvedValue(null);

            await getContentById(req, res, next);

            expect(Content.getById).toHaveBeenCalledWith(req.poolPromise, 1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Content not found' });
        });
    });

    describe('createContent', () => {
        // Create new content
        test('should create new content and return it', async () => {
            const mockContent = { id: 1, title: 'Content 1' };
            req.body = {
                title: 'Content 1',
                description: 'Description 1',
                playlist: 1,
                thumbnail: 'thumbnail.jpg',
                video: 'video.mp4',
                username: 'user'
            };
            req.files = {
                thumbnail: [{ destination: '/uploads/', filename: 'thumbnail.jpg' }],
                video: [{ destination: '/uploads/', filename: 'video.mp4' }]
            };
    
            // Mock the query result
            req.poolPromise.query.mockResolvedValue({ recordset: [mockContent] });
    
            await createContent(req, res, next);
    
            // Check the request to the poolPromise
            expect(req.poolPromise.request).toHaveBeenCalled();
            expect(req.poolPromise.input).toHaveBeenCalledWith('Title', sql.NVarChar, 'Content 1');
            expect(req.poolPromise.input).toHaveBeenCalledWith('Description', sql.NVarChar, 'Description 1');
            expect(req.poolPromise.input).toHaveBeenCalledWith('Playlist', sql.Int, 1);
            expect(req.poolPromise.input).toHaveBeenCalledWith('Thumbnail', sql.NVarChar, '/uploads/thumbnail.jpg');
            expect(req.poolPromise.input).toHaveBeenCalledWith('Video', sql.NVarChar, '/uploads/video.mp4');
            expect(req.poolPromise.input).toHaveBeenCalledWith('username', sql.NVarChar, 'user');
            expect(req.poolPromise.query).toHaveBeenCalledWith('INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded) OUTPUT inserted.* VALUES (@Title, @Description, @Playlist, @Thumbnail, @Video, @username, GETDATE())');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockContent);
        });
    
        test('should call next with error if creation fails', async () => {
            const mockError = new Error('Creation failed');
            req.body = {
                title: 'Content 1',
                description: 'Description 1',
                playlist: 1,
                thumbnail: 'thumbnail.jpg',
                video: 'video.mp4',
                username: 'user'
            };
            req.files = {
                thumbnail: [{ destination: '/uploads/', filename: 'thumbnail.jpg' }],
                video: [{ destination: '/uploads/', filename: 'video.mp4' }]
            };
    
            req.poolPromise.query.mockRejectedValue(mockError);
    
            await createContent(req, res, next);
    
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
    

    describe('updateContent', () => {
        // Update existing content
        test('should update existing content and return success message', async () => {
            req.params.id = 1;
            req.body = {
                Title: 'Updated Title',
                Description: 'Updated Description',
                Playlist: 1,
                Thumbnail: 'updated_thumbnail.jpg',
                Video: 'updated_video.mp4',
                username: 'updated_user',
                dateUploaded: new Date()
            };
            req.poolPromise.query.mockResolvedValue({ rowsAffected: [1] });

            await updateContent(req, res, next);

            expect(req.poolPromise.request).toHaveBeenCalled();
            expect(req.poolPromise.input).toHaveBeenCalledWith('id', sql.Int, 1);
            expect(req.poolPromise.input).toHaveBeenCalledWith('Title', sql.NVarChar, 'Updated Title');
            expect(req.poolPromise.input).toHaveBeenCalledWith('Description', sql.NVarChar, 'Updated Description');
            expect(req.poolPromise.input).toHaveBeenCalledWith('Playlist', sql.Int, 1);
            expect(req.poolPromise.input).toHaveBeenCalledWith('username', sql.NVarChar, 'updated_user');
            // expect(req.poolPromise.input).toHaveBeenCalledWith('dateUploaded', sql.DateTime, req.body.dateUploaded);
            expect(req.poolPromise.query).toHaveBeenCalledWith('UPDATE Contents SET Title = @Title, Description = @Description, Playlist = @Playlist, username = @username, dateUploaded = GETDATE() WHERE VideoId = @id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Content updated successfully' });
        });

        test('should return 404 if content to update is not found', async () => {
            req.params.id = 1;
            req.body = {
                Title: 'Updated Title',
                Description: 'Updated Description',
                Playlist: 1,
                Thumbnail: 'updated_thumbnail.jpg',
                Video: 'updated_video.mp4',
                username: 'updated_user',
                dateUploaded: new Date()
            };
            req.poolPromise.query.mockResolvedValue({ rowsAffected: [0] });

            await updateContent(req, res, next);

            expect(req.poolPromise.query).toHaveBeenCalledWith('UPDATE Contents SET Title = @Title, Description = @Description, Playlist = @Playlist, username = @username, dateUploaded = GETDATE() WHERE VideoId = @id');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Content not found' });
        });
    });

    describe('deleteContent', () => {
        // Delete a content
        test('should delete content and return success message', async () => {
            req.params.id = 1;
            req.poolPromise.query.mockResolvedValue({ rowsAffected: [1] });

            await deleteContent(req, res, next);

            expect(req.poolPromise.request).toHaveBeenCalled();
            expect(req.poolPromise.input).toHaveBeenCalledWith('id', sql.Int, 1);
            expect(req.poolPromise.query).toHaveBeenCalledWith('DELETE FROM Contents WHERE VideoId = @id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Content deleted successfully' });
        });

        test('should return 404 if content to delete is not found', async () => {
            req.params.id = 1;
            req.poolPromise.query.mockResolvedValue({ rowsAffected: [0] });

            await deleteContent(req, res, next);

            expect(req.poolPromise.query).toHaveBeenCalledWith('DELETE FROM Contents WHERE VideoId = @id');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Content not found' });
        });
    });

    describe('getContentByPlaylistId', () => {
        // Retrieve content by playlist ID
        test('should retrieve content by playlist ID', async () => {
            const mockContent = [{ id: 1, title: 'Content 1' }];
            req.params.id = 1;
            Content.getByPlaylistId.mockResolvedValue(mockContent);

            await getContentByPlaylistId(req, res, next);

            expect(Content.getByPlaylistId).toHaveBeenCalledWith(req.poolPromise, 1);
            expect(res.json).toHaveBeenCalledWith(mockContent);
        });

        test('should return 404 if content is not found', async () => {
            req.params.id = 1;
            Content.getByPlaylistId.mockResolvedValue(null);

            await getContentByPlaylistId(req, res, next);

            expect(Content.getByPlaylistId).toHaveBeenCalledWith(req.poolPromise, 1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Content not found' });
        });
    });
});