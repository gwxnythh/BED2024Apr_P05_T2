-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    passwordHash VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);