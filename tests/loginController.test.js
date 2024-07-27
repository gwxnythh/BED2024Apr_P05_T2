const jwt = require('jsonwebtoken');
const { login } = require('../controllers/loginController'); // Adjust the path as needed
const User = require('../models/user');

jest.mock('jsonwebtoken');
jest.mock('../models/user');

describe('login Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            poolPromise: {} // Mock the poolPromise if necessary
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return token and user info if login is successful', async () => {
        const user = {
            username: 'testuser',
            password: 'password123',
            role: 'Member'
        };
        const token = 'testtoken';

        req.body = {
            username: 'testuser',
            password: 'password123'
        };

        User.getUserByUsername.mockResolvedValue(user);
        jwt.sign.mockReturnValue(token);

        await login(req, res);

        expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
        expect(jwt.sign).toHaveBeenCalledWith({ username: user.username, role: user.role }, process.env.JWT_SECRET);
        expect(res.json).toHaveBeenCalledWith({ username: user.username, role: user.role, token });
    });

    it('should return 401 if username or password is incorrect', async () => {
        req.body = {
            username: 'testuser',
            password: 'wrongpassword'
        };

        User.getUserByUsername.mockResolvedValue({
            username: 'testuser',
            password: 'password123'
        });

        await login(req, res);

        expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    });

    it('should return 400 if username or password is missing or invalid', async () => {
        req.body = {
            username: '',
            password: 'password123'
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    });

    it('should return 500 if an internal server error occurs', async () => {
        req.body = {
            username: 'testuser',
            password: 'password123'
        };

        User.getUserByUsername.mockRejectedValue(new Error('Database error'));

        await login(req, res);

        expect(User.getUserByUsername).toHaveBeenCalledWith(req.poolPromise, 'testuser');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Database error' });
    });
});
