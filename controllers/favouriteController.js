// Import Needed Model + Module
const sql = require('mssql');
const Favourite = require('../models/favourite');

// Retrieve All Contents
const favouriteContents = async (req, res, next) => {
    const { videoId, username } = req.body;
    try {
        // Get a connection pool from the request object
        const pool = await req.poolPromise;
        // Retrieve favourited record
        const favContents = await Favourite.create(pool, videoId, username);
        res.json(favContents);
    } catch (error) {
        next(error);
    }
};


// Delete a content by its ID function
const unfavouriteContents = async (req, res, next) => {
    const { id } = req.body;
    try {
        // Get a connection pool from the request object
        const pool = await req.poolPromise;
        // Removed favourite record from table
        const favContents = await Favourite.delete(pool, id);
        res.json(favContents);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    favouriteContents,
    unfavouriteContents
};