-- Users Table [Member]
CREATE TABLE Users (
    userId INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL
);

-- Playlists Table [Instructor]
CREATE TABLE Playlists (
    playlistId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX),
    Thumbnail NVARCHAR(MAX),
    username NVARCHAR(50) NOT NULL,
    dateUploaded DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Contents Table [Instructor]
CREATE TABLE Contents (
    VideoId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX),
    Playlist INT FOREIGN KEY REFERENCES Playlists(playlistId) ON DELETE SET NULL,
    Thumbnail NVARCHAR(MAX),
    Video NVARCHAR(MAX),
    username NVARCHAR(50) NOT NULL,
    dateUploaded DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Comments Table [Instructor]
CREATE TABLE Comments (
    id INT PRIMARY KEY IDENTITY(1,1),
    content NVARCHAR(MAX) NOT NULL,
    videoId INT NOT NULL,
    username NVARCHAR(50) NOT NULL,
    datePosted DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (videoId) REFERENCES Contents(VideoId),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Favourite Table [Instructor]
CREATE TABLE Favourites (
    id INT PRIMARY KEY IDENTITY(1,1),
    videoId INT NOT NULL,
    username NVARCHAR(50) NOT NULL,
    dateFavourited DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (videoId) REFERENCES Contents(VideoId),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Customer Issues  Table [CS-Staff]
CREATE TABLE customerissues (
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    message VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    date DATETIME NOT NULL
);

-- Questions  Table [Examiner]
CREATE TABLE questions (
    id INT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL,
    options VARCHAR(255) DEFAULT NULL  -- Stores options as comma-separated string
);

/* DUMMY DATA (TEMPORARY) */
-- Insert Users
INSERT INTO Users (username, name, email, password, role)
VALUES 
('john_doe', 'John Doe', 'john.doe@example.com', 'potato', 'user'),
('jane_smith', 'Jane Smith', 'jane.smith@example.com', 'mashed', 'admin');

-- Insert Playlists [Instructor]
INSERT INTO Playlists (Title, Description, Thumbnail, username, dateUploaded)
VALUES 
('Playlist 1', 'Description for Playlist 1', '../../images/thumb-nail.png', 'john_doe', GETDATE()),
('Playlist 2', 'Description for Playlist 2', '../../images/thumb-nail.png', 'jane_smith', GETDATE());

-- Insert Contents [Instructor]
INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded)
VALUES 
('Video 1', 'Description for Video 1', 1, 'path/to/video1_thumbnail.jpg', 'path/to/video1.mp4', 'john_doe', GETDATE()),
('Video 2', 'Description for Video 2', 2, 'path/to/video2_thumbnail.jpg', 'path/to/video2.mp4', 'jane_smith', GETDATE()),
('Video 3', 'Description for Video 3', 1, 'path/to/video3_thumbnail.jpg', 'path/to/video3.mp4', 'john_doe', GETDATE()),
('Video 4', 'Description for Video 4', 2, 'path/to/video4_thumbnail.jpg', 'path/to/video4.mp4', 'jane_smith', GETDATE());

-- Insert Comments [Instructor]
INSERT INTO Comments (content, videoId, username, datePosted)
VALUES 
('Great video!', 1, 'john_doe', GETDATE()),
('Nice content!', 2, 'jane_smith', GETDATE());

-- Insert Customer Issues [CS-Staff]
INSERT INTO customerissues (id, message, email, name, date) VALUES
('M01', 'API response delay', 'jack@example.com', 'Jack Wilson', '2024-03-29 19:25:00'),
('M02', 'App crashes on startup', 'frank@example.com', 'Frank Wright', '2024-03-25 12:00:00'),
('M03', 'Broken image link on homepage', 'eve@example.com', 'Eve Davis', '2024-03-24 10:20:00'),
('M04', 'Error 404 on product page', 'bob@example.com', 'Bob Johnson', '2024-03-21 11:30:00'),
('M05', 'JavaScript error on checkout', 'irene@example.com', 'Irene Thomas', '2024-03-28 17:10:00'),
('M06', 'Login page not loading', 'alice@example.com', 'Alice Smith', '2024-03-20 09:15:00'),
('M07', 'Missing CSS file', 'grace@example.com', 'Grace Lee', '2024-03-26 13:35:00')

-- Insert Questions [Examiner]
INSERT INTO questions (id, question, answer, options) VALUES
(1, 'What is the capital of France?', 'Paris', 'Paris,Lyon,Marseille,Bordeaux'),
(2, 'Which planet is known as the Red Planet?', 'Mars', 'Earth,Mars,Jupiter,Venus'),
(3, 'What is the largest ocean on Earth?', 'Pacific', 'Atlantic,Pacific,Indian,Arctic'),
(4, 'Who wrote "To Kill a Mockingbird"?', 'Harper Lee', 'Harper Lee,J.K. Rowling,Mark Twain,Jane Austen'),
(5, 'What is the square root of 64?', '8', '6,7,8,9');
