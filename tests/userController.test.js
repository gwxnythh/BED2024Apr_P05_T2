const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, searchUsers, registerUser, loginUser, getUserInfo } = require('../controllers/usersController');
const User = require('../models/user');
const { password, user } = require('../dbConfig');
const { query } = require('mssql');

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    const req = {
        params: {},
        query: {},
        user: {},
        body: {},
        poolPromise: {}
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    
    // Clear mock implementations before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user and return status 201', async () => {
            const newUser = {
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            };
            req.body = newUser;

            // Add the default role 'member'
            const createdUser = {
                ...newUser,
                role: 'member'
            };

            // Mock the User.createUser method
            User.createUser = jest.fn().mockResolvedValue(createdUser);

            await createUser(req, res);

            expect(User.createUser).toHaveBeenCalledWith(req.poolPromise, newUser);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdUser);
        });

        it('should return status 500 if an error occurs', async () => {
            req.body = {
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            };

            // Mock the User.createUser method to throw an error
            User.createUser = jest.fn().mockRejectedValue(new Error('Error creating user'));

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error creating user');
        });
    });

    describe('getAllUsers', () => {
        it('should retrieve all users and return them', async () => {
            const users = [{ id: 1, username: 'testuser' }];
            User.getAllUsers.mockResolvedValue(users);

            await getAllUsers(req, res);

            expect(User.getAllUsers).toHaveBeenCalledWith(req.poolPromise);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should return status 500 if an error occurs', async () => {
            User.getAllUsers.mockRejectedValue(new Error('Error retrieving users'));

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error retrieving users');
        });
    });

    describe('getUserById', () => {
        it('should retrieve a user by ID and return it', async () => {
            const user = {
                userId: 7,
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                role: 'member'
            };
            req.params.id = '7';
    
            // Mock the User.getUserById method
            User.getUserById = jest.fn().mockResolvedValue(user);
    
            await getUserById(req, res);
    
            // Check if User.getUserById was called with the correct arguments
            expect(User.getUserById).toHaveBeenCalledWith(req.poolPromise, 7);
            // Check if res.json was called with the correct user object
            expect(res.json).toHaveBeenCalledWith(user);
        });
    
        it('should return status 404 if user not found', async () => {
            req.params.id = '1';
            User.getUserById = jest.fn().mockResolvedValue(null);
    
            await getUserById(req, res);
    
            // Check if User.getUserById was called with the correct arguments
            expect(User.getUserById).toHaveBeenCalledWith(req.poolPromise, 1);
            // Check if res.status was called with 404
            expect(res.status).toHaveBeenCalledWith(404);
            // Check if res.send was called with 'User not found'
            expect(res.send).toHaveBeenCalledWith('User not found');
        });
    
        it('should return status 500 if an error occurs', async () => {
            req.params.id = '1';
            User.getUserById = jest.fn().mockRejectedValue(new Error('Error retrieving user'));
    
            await getUserById(req, res);
    
            // Check if User.getUserById was called with the correct arguments
            expect(User.getUserById).toHaveBeenCalledWith(req.poolPromise, 1);
            // Check if res.status was called with 500
            expect(res.status).toHaveBeenCalledWith(500);
            // Check if res.send was called with 'Error retrieving user'
            expect(res.send).toHaveBeenCalledWith('Error retrieving user');
        });
    });

    describe('updateUser', () => {
        it('should update a user and return the updated user', async () => {
            const updatedUser = { id: 1, username: 'updateduser' };
            req.body = updatedUser;

            User.updateUser.mockResolvedValue(updatedUser);

            await updateUser(req, res);

            expect(User.updateUser).toHaveBeenCalledWith(req.poolPromise, 1, updatedUser);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return status 404 if user not found', async () => {
            req.body = { id: 1, username: 'updateduser' };
            User.updateUser.mockResolvedValue(null);

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found');
        });

        it('should return status 500 if an error occurs', async () => {
            req.body = { id: 1, username: 'updateduser' };
            User.updateUser.mockRejectedValue(new Error('Error updating user'));

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error updating user');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and return status 204', async () => {
            req.params.id = '1';
            User.deleteUser.mockResolvedValue(true);

            await deleteUser(req, res);

            expect(User.deleteUser).toHaveBeenCalledWith(req.poolPromise, 1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith('User deleted');
        });

        it('should return status 404 if user not found', async () => {
            req.params.id = '1';
            User.deleteUser.mockResolvedValue(false);

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found');
        });

        it('should return status 500 if an error occurs', async () => {
            req.params.id = '1';
            User.deleteUser.mockRejectedValue(new Error('Error deleting user'));

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error deleting user');
        });
    });

    describe('searchUsers', () => {
        it('should search users and return them', async () => {
            const users = [{ id: 1, username: 'testuser' }];
            req.query.searchTerm = 'test';
    
            // Mock the User.searchUsers method
            User.searchUsers = jest.fn().mockResolvedValue(users);
    
            await searchUsers(req, res);
    
            // Check if User.searchUsers was called with the correct arguments
            expect(User.searchUsers).toHaveBeenCalledWith(req.poolPromise, 'test');
            // Check if res.json was called with the correct user object
            expect(res.json).toHaveBeenCalledWith(users);
        });
    
        it('should return status 500 if an error occurs', async () => {
            req.query.searchTerm = 'test';
            User.searchUsers = jest.fn().mockRejectedValue(new Error('Error searching users'));
    
            await searchUsers(req, res);
    
            // Check if res.status was called with 500
            expect(res.status).toHaveBeenCalledWith(500);
            // Check if res.json was called with the correct error message
            expect(res.json).toHaveBeenCalledWith({ message: 'Error searching users' });
        });
    });

    describe('registerUser', () => {
        it('should register a new user and return status 201', async () => {
            const newUser = { username: 'testuser', password: 'password', role: 'user', name: 'Test User', email: 'test@example.com' };
            req.body = newUser;

            User.getUserByUsername.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue()
            }));

            await registerUser(req, res);

            expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
        });

        it('should return status 400 if username already exists', async () => {
            req.body = { username: 'testuser', password: 'password' };
            User.getUserByUsername.mockResolvedValue(true);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
        });

        it('should return status 500 if an error occurs', async () => {
            req.body = { username: 'testuser', password: 'password' };
            User.getUserByUsername.mockRejectedValue(new Error('Error'));

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('loginUser', () => {
        it('should log in a user and return a token', async () => {
            req.body = { username: 'testuser', password: 'password' };
            const user = { user_id: 1, username: 'testuser', password: 'hashedpassword', role: 'user' };

            User.getUserByUsername.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await loginUser(req, res);

            expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith({ username: 'testuser', role: 'user' }, process.env.JWT_SECRET);
            expect(res.json).toHaveBeenCalledWith({ token: 'token', username: 'testuser', role: 'user' });
        });

        it('should return status 404 if user not found', async () => {
            req.body = { username: 'testuser', password: 'password' };
            User.getUserByUsername.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return status 401 if password is incorrect', async () => {
            req.body = { username: 'testuser', password: 'password' };
            const user = { user_id: 1, username: 'testuser', password: 'hashedpassword', role: 'user' };

            User.getUserByUsername.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return status 500 if an error occurs', async () => {
            req.body = { username: 'testuser', password: 'password' };
            User.getUserByUsername.mockRejectedValue(new Error('Error'));

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getUserInfo', () => {
        it('should return user info', async () => {
            req.user.username = 'testuser';
            const user = { username: 'testuser', name: 'Test User', email: 'test@example.com', role: 'user' };

            User.getUserByUsername.mockResolvedValue(user);

            await getUserInfo(req, res);

            expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return status 404 if user not found', async () => {
            req.user.username = 'testuser';
            User.getUserByUsername.mockResolvedValue(null);

            await getUserInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return status 500 if an error occurs', async () => {
            req.user.username = 'testuser';
            User.getUserByUsername.mockRejectedValue(new Error('Error'));

            await getUserInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Error' });
        });
    });
});
