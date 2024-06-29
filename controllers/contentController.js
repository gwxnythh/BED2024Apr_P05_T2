const sql = require('mssql');
const Content = require('../models/content');

const getContents = async (req, res, next) => {
    try {
        const contents = await Content.getAll(req.poolPromise);
        res.json(contents);
    } catch (error) {
        next(error);
    }
};

const getContentById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const content = await Content.getById(req.poolPromise, id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const createContent = async (req, res, next) => {
    const { Title, Description, Playlist, Thumbnail, Video, username, dateUploaded } = req.body;

    try {
        const pool = await req.poolPromise;
        const result = await pool.request()
            .input('Title', sql.NVarChar, Title)
            .input('Description', sql.NVarChar, Description)
            .input('Playlist', sql.Int, Playlist)
            .input('Thumbnail', sql.NVarChar, Thumbnail)
            .input('Video', sql.NVarChar, Video)
            .input('username', sql.NVarChar, username)
            .input('dateUploaded', sql.DateTime, dateUploaded)
            .query('INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded) OUTPUT inserted.* VALUES (@Title, @Description, @Playlist, @Thumbnail, @Video, @username, @dateUploaded)');

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating content:', error.message);
        next(error);
    }
};

const updateContent = async (req, res, next) => {
    const { id } = req.params;
    const { Title, Description, Playlist, Thumbnail, Video, username, dateUploaded } = req.body;

    try {
        const pool = await req.poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('Title', sql.NVarChar, Title)
            .input('Description', sql.NVarChar, Description)
            .input('Playlist', sql.Int, Playlist)
            .input('Thumbnail', sql.NVarChar, Thumbnail)
            .input('Video', sql.NVarChar, Video)
            .input('username', sql.NVarChar, username)
            .input('dateUploaded', sql.DateTime, dateUploaded)
            .query('UPDATE Contents SET Title = @Title, Description = @Description, Playlist = @Playlist, Thumbnail = @Thumbnail, Video = @Video, username = @username, dateUploaded = @dateUploaded WHERE VideoId = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error updating content:', error.message);
        next(error);
    }
};

const deleteContent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const pool = await req.poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Contents WHERE VideoId = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error.message);
        next(error);
    }
};


module.exports = {
    getContents,
    getContentById,
    createContent,
    updateContent,
    deleteContent
};