-- Users Table
CREATE TABLE Users (
    userId INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL
);

-- Playlists Table
CREATE TABLE Playlists (
    playlistId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX),
    Thumbnail NVARCHAR(MAX),
    username NVARCHAR(50) NOT NULL,
    dateUploaded DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Contents Table
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

-- Comments Table
CREATE TABLE Comments (
    id INT PRIMARY KEY IDENTITY(1,1),
    content NVARCHAR(MAX) NOT NULL,
    videoId INT NOT NULL,
    username NVARCHAR(50) NOT NULL,
    datePosted DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (videoId) REFERENCES Contents(VideoId),
    FOREIGN KEY (username) REFERENCES Users(username)
);

/* DUMMY DATA (TEMPORARY) */
-- Insert Users
INSERT INTO Users (username, name, email, password, role)
VALUES 
('john_doe', 'John Doe', 'john.doe@example.com', 'potato', 'user'),
('jane_smith', 'Jane Smith', 'jane.smith@example.com', 'mashed', 'admin');

-- Insert Playlists
INSERT INTO Playlists (Title, Description, Thumbnail, username, dateUploaded)
VALUES 
('Playlist 1', 'Description for Playlist 1', 'path/to/playlist1_thumbnail.jpg', 'john_doe', GETDATE()),
('Playlist 2', 'Description for Playlist 2', 'path/to/playlist2_thumbnail.jpg', 'jane_smith', GETDATE());

-- Insert Contents
INSERT INTO Contents (Title, Description, Playlist, Thumbnail, Video, username, dateUploaded)
VALUES 
('Video 1', 'Description for Video 1', 1, 'path/to/video1_thumbnail.jpg', 'path/to/video1.mp4', 'john_doe', GETDATE()),
('Video 2', 'Description for Video 2', 2, 'path/to/video2_thumbnail.jpg', 'path/to/video2.mp4', 'jane_smith', GETDATE()),
('Video 3', 'Description for Video 3', 1, 'path/to/video3_thumbnail.jpg', 'path/to/video3.mp4', 'john_doe', GETDATE()),
('Video 4', 'Description for Video 4', 2, 'path/to/video4_thumbnail.jpg', 'path/to/video4.mp4', 'jane_smith', GETDATE());

-- Insert Comments
INSERT INTO Comments (content, videoId, username, datePosted)
VALUES 
('Great video!', 1, 'john_doe', GETDATE()),
('Nice content!', 2, 'jane_smith', GETDATE());