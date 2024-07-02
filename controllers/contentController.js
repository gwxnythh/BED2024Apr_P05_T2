// Import Needed Model + Module
const sql = require('mssql');
const Content = require('../models/content');

// Retrieve All Contents
const getContents = async (req, res, next) => {
    try {
        // Retrieve all content from the database using the Content model
        const contents = await Content.getAll(req.poolPromise);
        res.json(contents);
    } catch (error) {
        next(error);
    }
};

// Specific content by its ID function
const getContentById = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Retrieve the content with the specified ID using the Content model
        const content = await Content.getById(req.poolPromise, id);
        if (!content) {
            // If no content is found, send a 404 Not Found response
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        next(error);
    }
};

// Create a new content function
const createContent = async (req, res, next) => {
    const { Title, Description, Playlist, Thumbnail, Video, username, dateUploaded } = req.body;

    try {
        // Get a connection pool from the request object
        const pool = await req.poolPromise;
        // Insert the new content into the database
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

// Update an existing content
const updateContent = async (req, res, next) => {
    const { id } = req.params;
    const { Title, Description, Playlist, Thumbnail, Video, username, dateUploaded } = req.body;

    try {
        // Get a connection pool from the request object
        const pool = await req.poolPromise;
        // Update the content with the specified ID in the database
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
            // If no rows were affected, send a 404 Not Found response
            return res.status(404).json({ error: 'Content not found' });
        }

        res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error updating content:', error.message);
        next(error);
    }
};

// Delete a content by its ID function
const deleteContent = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Get a connection pool from the request object
        const pool = await req.poolPromise;
        // Delete the content with the specified ID from the database
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Contents WHERE VideoId = @id');

        if (result.rowsAffected[0] === 0) {
            // If no rows were affected, send a 404 Not Found response
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