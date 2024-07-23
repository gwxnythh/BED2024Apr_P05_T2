const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");
const validateBook = require("./middlewares/validateBook");
const validateUser = require("./middlewares/validateUser");
const verifyJWT = require("./middlewares/verifyJWT");

const app = express();
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public");

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware);

// Routes
app.post("/register", validateUser, usersController.registerUser);
app.post("/login", validateUser, usersController.loginUser);
app.get("/books", booksController.getAllBooks);
app.post("/books", verifyJWT, validateBook, booksController.createBook);
app.put("/books/:bookId/availability", verifyJWT, validateBook, booksController.updateBookAvailability);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig); //Establish a connection to the database using the configuration details in dbConfig
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
// Usually sent when you terminate the application using Ctrl+C
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});