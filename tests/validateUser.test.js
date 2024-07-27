const Joi = require("joi");
const validateUser = require('../middlewares/validateUser'); // Adjust the path as needed

describe('validateUser Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {}
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

    it('should call next if validation passes', () => {
        req.body = {
            name: 'John Doe',
            username: 'johndoe',
            password: 'password123',
            email: 'john@example.com',
            role: 'Member'
        };

        validateUser(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', () => {
        req.body = {
            username: 'johndoe',
            password: 'password123',
            email: 'john@example.com'
            // name is missing
        };

        validateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Validation error',
            errors: expect.any(Array)
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if fields are of incorrect type', () => {
        req.body = {
            name: 123, // incorrect type
            username: 'johndoe',
            password: 'password123',
            email: 'john@example.com',
            role: 'Member'
        };

        validateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Validation error',
            errors: expect.any(Array)
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if email is invalid', () => {
        req.body = {
            name: 'John Doe',
            username: 'johndoe',
            password: 'password123',
            email: 'john@example', // invalid email
            role: 'Member'
        };

        validateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Validation error',
            errors: expect.any(Array)
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if role is invalid', () => {
        req.body = {
            name: 'John Doe',
            username: 'johndoe',
            password: 'password123',
            email: 'john@example.com',
            role: 'InvalidRole' // invalid role
        };

        validateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Validation error',
            errors: expect.any(Array)
        }));
        expect(next).not.toHaveBeenCalled();
    });
});
