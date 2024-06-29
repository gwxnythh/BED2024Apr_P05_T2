const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const config = require('./dbConfig');
const commentController = require('./controllers/commentController');
const playlistController = require('./controllers/playlistController');
const contentController = require('./controllers/contentController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for serving static files
const staticMiddleware = express.static("public");
app.use(staticMiddleware);

// Start server and connect to the database
app.listen(PORT, async () => {
    try {
        // Connect to the database
        const pool = await sql.connect(config);
        console.log("Database connection established successfully");

        // Middleware to pass the pool to the controllers
        app.use((req, res, next) => {
            req.poolPromise = pool;
            next();
        });

        // Routes for Comments
        app.get('/comments', commentController.getComments);
        app.post('/comments', commentController.createComment);
        app.delete('/comments/:id', commentController.deleteComment);

        // Routes for Playlists
        app.get('/playlists', playlistController.getPlaylists);
        app.get('/playlists/:id', playlistController.getPlaylistById);
        app.put('/playlists/:id', playlistController.updatePlaylist);
        app.post('/playlists', playlistController.createPlaylist);
        app.delete('/playlists/:id', playlistController.deletePlaylist);

        // Routes for Contents
        app.get('/contents', contentController.getContents);
        app.get('/contents/:id', contentController.getContentById);
        app.put('/contents/:id', contentController.updateContent);
        app.post('/contents', contentController.createContent);
        app.delete('/contents/:id', contentController.deleteContent);

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: err.message });
        });

        console.log(`Server listening on port ${PORT}`);
        console.log(`Server running on http://localhost:${PORT}/`);
    } catch (err) {
        console.error("Database connection error:", err);
        // Terminate the application with an error code (optional)
        process.exit(1); // Exit with code 1 indicating an error
    }
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
});