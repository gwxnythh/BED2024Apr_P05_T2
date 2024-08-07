const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
const sql = require('mssql');
const config = require('./dbConfig');
const commentController = require('./controllers/commentController');
const playlistController = require('./controllers/playlistController');
const contentController = require('./controllers/contentController');
const usersController = require('./controllers/usersController');
const favouriteControler = require('./controllers/favouriteController');
const validateUser = require("./middlewares/validateUser");
const quizController = require("./controllers/quizController");
const validateQuiz = require('./middlewares/validateQuiz');
const issuesController = require("./controllers/issuesController");
const logger = require("./middlewares/logger");
const validateIssue = require("./middlewares/validateIssues");
const authController = require('./controllers/loginController');
const authenticateToken = require('./middlewares/autToken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger [http://localhost:3000/api-docs/]
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

// Middleware for serving static files
const staticMiddleware = express.static("public");
app.use(staticMiddleware);

app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ToDoListScreen.html'));
});

// forget password route
app.post('/forgot-password', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Here you would handle sending the reset email
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

// serving static folder for uploading
app.use('/uploads', express.static('uploads'));

const createDirectoryIfNotExist = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true }); // Use { recursive: true } to create parent directories if necessary
  }
};

app.post('/forgot-password', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    //sending the reset email
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

// File uploading for playlist - multer configuration
const playlistStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = 'uploads/playlists/' + req.body.title + "/";
    createDirectoryIfNotExist(uploadDir);
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Rename uploaded file (optional)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const uploadPlaylist = multer({ storage: playlistStorage });

// File uploading for content - multer configuration
const contentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = "";
    if (file.fieldname === 'thumbnail') {
      uploadDir = 'uploads/contents/thumbnail/' + req.body.title + "/";
    } else {
      uploadDir = 'uploads/contents/video/' + req.body.title + "/";
    }
    createDirectoryIfNotExist(uploadDir);
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Rename uploaded file (optional)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const uploadContent = multer({ storage: contentStorage });

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

    // Routes for Users
    app.post("/register", validateUser, usersController.registerUser);
    app.post("/login", usersController.loginUser);
    app.get("/profile", authenticateToken, usersController.getUserInfo);

    // Routes for Comments
    app.get('/comments', commentController.getComments);
    app.get('/comments/:id', commentController.getCommentsById);
    app.post('/comments', commentController.createComment);
    app.delete('/comments/:id', commentController.deleteComment);

    // Routes for Playlists
    app.get('/playlists', playlistController.getPlaylists);
    app.get('/playlists/:id', playlistController.getPlaylistById);
    app.put('/playlists/:id', playlistController.updatePlaylist);
    app.post('/playlists', uploadPlaylist.single('thumbnail'), playlistController.createPlaylist);
    app.delete('/playlists/:id', playlistController.deletePlaylist);

    app.get('/playlist/contents/:id', contentController.getContentByPlaylistId);

    // Routes for Contents
    app.get('/contents', contentController.getContents);
    app.get('/contents/:username', contentController.getFavouriteContents);
    app.get('/contents/member/:id', contentController.getContentById);
    app.get('/contents/:username/:id', contentController.getContentByIdAndUsername);
    app.put('/contents/:id', contentController.updateContent);
    app.post('/contents', uploadContent.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), contentController.createContent);
    app.delete('/contents/:id', contentController.deleteContent);

    // Favourite contents
    app.post('/favourite', favouriteControler.favouriteContents);
    app.delete('/unfavourite', favouriteControler.unfavouriteContents);

    // Route for (examiner)
    app.get("/quizzes", quizController.getAllQuizzes); // Use the quizController methods
    app.get("/quizzes/:id", quizController.getQuizById);
    app.post("/quizzes", validateQuiz, quizController.createQuiz);
    app.put("/quizzes/:id", validateQuiz, quizController.updateQuiz);
    app.delete("/quizzes/:id", quizController.deleteQuiz);

    // Route for (customerissues)
    app.get("/issues", issuesController.getAllIssues);
    app.post("/issues", validateIssue, issuesController.createIssue);
    app.delete("/issues/:id", issuesController.deleteIssue);

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