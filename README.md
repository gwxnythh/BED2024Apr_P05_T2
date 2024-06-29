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
#### ***S10262576 | Ggwendolynn Lee Rasni | Instructor*** 
Comments Function(s):
1. GET - Retrieve All Comments. <code>http://localhost:3000/comments</code>
```json
Output:
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
2. POST - Create a Comment(User). <code>http://localhost:3000/comments</code>
```json
Request Body:
{
    "content": "Thanks for teaching!",
    "videoId": 2,
    "username": "jane_smith",
    "datePosted": "2024-06-29T00:00:00.000Z"
}
```
3. DELETE - Delete a Comment. <code>http://localhost:3000/comments/:id</code>
```json
Output:
{
    "message": "Comment deleted successfully"
}
```

Playlists Function(s):
1. GET - Retrieve Playlists' Content.
2. PUT - Update Playlists.
3. POST - Create New Playlists.
4. DELETE - Delete a Playlist.
    
Contents Function(s):
1. GET - Retrieve All the Contents.
2. PUT - Update Contents.
3. POST - Create New Contents.
4. DELETE - Delete a Content.

#### ***S10262569 | Jovan Tan Hao | Examiner***
    1. GET - Recently did Quiz.
    2. POST - Create Quiz.

#### ***S10262840 | Daphne Cheng Pei En | User/Member***
    1. GET - Retrieve User's Info for Profile.
    2. POST - Create User's Account/Profile.

#### ***S10262621 | Tan Han Yan |  Customer Service Staff***
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
