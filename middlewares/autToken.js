const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.user = user; // Ensure the user is correctly set
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization token required' });
    }
};

module.exports = authenticateJWT;
