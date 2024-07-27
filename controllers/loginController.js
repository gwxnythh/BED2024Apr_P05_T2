const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const pool = req.poolPromise;
        const user = await User.getUserByUsername(pool, username);

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Include 'username' in the token payload
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);

        res.json({ username: user.username, role: user.role, token });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    login
};
