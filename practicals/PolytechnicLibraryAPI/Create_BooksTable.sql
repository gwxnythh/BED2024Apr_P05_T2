-- Create Books table
CREATE TABLE Books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    availability CHAR(1) CHECK (availability IN ('Y', 'N'))
);