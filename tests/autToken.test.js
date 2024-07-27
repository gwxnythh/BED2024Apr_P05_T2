const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autToken'); // Adjust the path as needed

jest.mock('jsonwebtoken');

describe('authenticateJWT Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next if token is valid', () => {
        const token = 'validToken';
        const decoded = { userId: 1, username: 'testuser' };

        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        authenticateJWT(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
        req.header.mockReturnValue(null);

        authenticateJWT(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authorization token required' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
        const token = 'invalidToken';
        
        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        authenticateJWT(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });
});

