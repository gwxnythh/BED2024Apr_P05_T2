-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    passwordHash VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);
-- Create Books table
CREATE TABLE Books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    availability CHAR(1) CHECK (availability IN ('Y', 'N'))
);
-- Create UserBooks table
CREATE TABLE UserBooks (
    userbook_id INT PRIMARY KEY,
    user_id INT,
    book_id INT,
    borrowed_date DATE,
    return_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- Sample Data
-- Seed data into Users table
INSERT INTO Users (user_id, username, passwordHash, role) VALUES
(1, 'john_doe', 'hashed_password_1', 'member'),
(2, 'jane_smith', 'hashed_password_2', 'librarian'),
(3, 'alice_jones', 'hashed_password_3', 'member');

-- Seed data into Books table
INSERT INTO Books (book_id, title, author, availability) VALUES
(1, 'To Kill a Mockingbird', 'Harper Lee', 'Y'),
(2, '1984', 'George Orwell', 'Y'),
(3, 'Moby Dick', 'Herman Melville', 'N');

-- Seed data into UserBooks table
INSERT INTO UserBooks (userbook_id, user_id, book_id, borrowed_date, return_date) VALUES
(1, 1, 1, '2024-01-01', '2024-01-15'),
(2, 3, 2, '2024-02-01', '2024-02-15');