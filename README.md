# Project Overview [Episteme] - BED2024Apr_P05_T2

#### Members
    S10262576 | Ggwendolynn Lee Rasni
    S10262569 | Jovan Tan Hao
    S10262840 | Daphne Cheng Pei En
    S10262621 | Tan Han Yan

> [!NOTE]
> Topic 2: Social Impact

![Logo](./public/images/logo-icon-2.png)

## Introduction
Episteme [ep-is-teem] | knowledge; specifically : intellectually certain knowledge.
    
Tagline: **J**ust **G**aining Knowledge in **HD**
    
Episteme is a cutting-edge virtual learning tool created to enable individuals in their quest for education and career advancement. Episteme offers a variety of expert-led courses and tutorials in business, technology, creative fields, and personal development, creating a dynamic learning experience designed for today's learner. Our platform prioritizes accessibility and excellence, providing users with the necessary skills and insights to succeed in today's competitive environment. Episteme empowers individuals to realize their complete potential and reach their professional goals with a carefully crafted curriculum and engaging learning resources.

## CRUD Operations
### **S10262576 | Ggwendolynn Lee Rasni | Instructor**
##### Comments  Operations:
1. GET - Retrieve All Comments. <code>http://localhost:3000/comments</code><br/>
Output:
```json
{
    "id": 1,
    "content": "Great video!",
    "videoId": 1,
    "username": "john_doe",
    "datePosted": "2024-06-29T04:14:14.863Z"
},
{
    "id": 2,
    "content": "Nice content!",
    "videoId": 2,
    "username": "jane_smith",
    "datePosted": "2024-06-29T04:14:14.863Z"
},
{
    "id": 6,
    "content": "Thanks for teaching!",
    "videoId": 2,
    "username": "jane_smith",
    "datePosted": "2024-06-29T22:48:54.753Z"
}
```
2. POST - Create a Comment(User). <code>http://localhost:3000/comments</code><br/>
Request Body:
```json
{
    "content": "Thanks for teaching!",
    "videoId": 2,
    "username": "jane_smith",
    "datePosted": "2024-06-29T00:00:00.000Z"
}
```
3. DELETE - Delete a Comment. <code>http://localhost:3000/comments/:id</code><br/>
Output:
```json
{
    "message": "Comment deleted successfully"
}
```
##### Playlists Operations:
1. GET - Retrieve Playlists' Content. <code>http://localhost:3000/playlists</code><br/>
Output:
```json
{
    "playlistId": 1,
    "Title": "Playlist 1",
    "Description": "Description for Playlist 1",
    "Thumbnail": "path/to/playlist1_thumbnail.jpg",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
},
{
    "playlistId": 2,
    "Title": "Playlist 2",
    "Description": "Description for Playlist 2",
    "Thumbnail": "path/to/playlist2_thumbnail.jpg",
    "username": "jane_smith",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
    }
```
2. GET - Retrieve Specific Playlist. <code>http://localhost:3000/playlists/id</code><br/>
Request: Retrieve Content in Playlist **2**<br/>
Output:
```json
{
    "playlistId": 2,
    "Title": "Playlist 2",
    "Description": "Description for Playlist 2",
    "Thumbnail": "path/to/playlist2_thumbnail.jpg",
    "username": "jane_smith",
    "dateUploaded": "2024-06-29T00:00:00.000Z",
    "contents": [
        {
            "VideoId": 2,
            "Title": "Video 2",
            "Description": "Description for Video 2",
            "Playlist": 2,
            "Thumbnail": "path/to/video2_thumbnail.jpg",
            "Video": "path/to/video2.mp4",
            "username": "jane_smith",
            "dateUploaded": "2024-06-29T00:00:00.000Z"
        },
        {
            "VideoId": 4,
            "Title": "Video 4",
            "Description": "Description for Video 4",
            "Playlist": 2,
            "Thumbnail": "path/to/video4_thumbnail.jpg",
            "Video": "path/to/video4.mp4",
            "username": "jane_smith",
            "dateUploaded": "2024-06-29T00:00:00.000Z"
        }
    ]
}
```
3. PUT - Update Playlists. <code>http://localhost:3000/playlists/:id</code><br/>
Request Body:
```json
{
    "Title": "Playlist 3",
    "Description": "Description for Playlist 3.1",
    "Thumbnail": "path/to/playlist3_thumbnail.jpg",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
Output:
```json
{
    "message": "Playlist updated successfully"
}
```
4. POST - Create New Playlists. <code>http://localhost:3000/playlists</code><br/>
Request Body:
```json
{
    "Title": "Playlist 3",
    "Description": "Description for Playlist 3",
    "Thumbnail": "path/to/playlist3_thumbnail.jpg",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
5. DELETE - Delete a Playlist. <code>http://localhost:3000/playlists/:id</code><br/>
Output:
```json
{
    "message": "Playlist deleted successfully"
}
```
    
##### Contents Operations:
1. GET - Retrieve All the Contents. <code>http://localhost:3000/contents</code><br/>
Output:
```json
{
    "VideoId": 1,
    "Title": "Video 1",
    "Description": "Description for Video 1",
    "Playlist": 1,
    "Thumbnail": "path/to/video1_thumbnail.jpg",
    "Video": "path/to/video1.mp4",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
},
{
    "VideoId": 2,
    "Title": "Video 2",
    "Description": "Description for Video 2",
    "Playlist": 2,
    "Thumbnail": "path/to/video2_thumbnail.jpg",
    "Video": "path/to/video2.mp4",
    "username": "jane_smith",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
},
{
    "VideoId": 3,
    "Title": "Video 3",
    "Description": "Description for Video 3",
    "Playlist": 1,
    "Thumbnail": "path/to/video3_thumbnail.jpg",
    "Video": "path/to/video3.mp4",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
2. GET - Retrieve Specific Content. <code>http://localhost:3000/contents/id</code><br/>
Request: Retrieve Content in Playlist **1**<br/>
Output:
```json
{
    "VideoId": 1,
    "Title": "Video 1",
    "Description": "Description for Video 1",
    "Playlist": 1,
    "Thumbnail": "path/to/video1_thumbnail.jpg",
    "Video": "path/to/video1.mp4",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
3. PUT - Update Contents. <code>http://localhost:3000/contents/id</code><br/>
Request Body:
```json
{
    "VideoId": 30,
    "Title": "Video 6",
    "Description": "Description for Video 6.1",
    "Playlist": 2,
    "Thumbnail": "path/to/video6_thumbnail.jpg",
    "Video": "path/to/video6.mp4",
    "username": "jane_smith",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
Output:
```json
{
    "message": "Content updated successfully"
}
```
4. POST - Create New Contents. <code>http://localhost:3000/contents</code><br/>
Request Body:
```json
{
    "Title": "Video 7",
    "Description": "Description for Video 7",
    "Playlist": 1,
    "Thumbnail": "path/to/video7_thumbnail.jpg",
    "Video": "path/to/video7.mp4",
    "username": "john_doe",
    "dateUploaded": "2024-06-29T00:00:00.000Z"
}
```
5. DELETE - Delete a Content. <code>http://localhost:3000/contents/id</code><br/>
Output:
```json
{
    "message": "Content deleted successfully"
}
```

### **S10262569 | Jovan Tan Hao | Examiner**
    1. GET - Recently did Quiz.
    2. POST - Create Quiz.

### **S10262840 | Daphne Cheng Pei En | User/Member**
    1. GET - Retrieve User's Info for Profile.
    2. POST - Create User's Account/Profile.

### **S10262621 | Tan Han Yan |  Customer Service Staff**
    1. GET - Retrieve customer issues.
    2. PUT - Reply and update customer issue.
    3. DELETE - Delete customer issue.

## Node Packages Used
- Express
- Body-Parser
- MSSQL

## Credits
Content/Media:
- [Logos]
    - Custom made using Canva/Adobe Photoshop.
- [Icons](https://boxicons.com/?query=)
    - Majority icons are used from boxicons.

Coding Help:
- [w3schools](https://www.w3schools.com)
    - Front-End Coding Help.
- [ExpressNode.js](https://expressjs.com)
    - Back-End Coding Help.
