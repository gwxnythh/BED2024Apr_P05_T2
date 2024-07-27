const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const createUser = async (req, res) => {
    const newUser = req.body;

    try {
        const createdUser = await User.createUser(req.poolPromise, newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers(req.poolPromise);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users");
    }
};

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await User.getUserById(req.poolPromise, userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user");
    }
};

const updateUser = async (req, res) => {
    const userId = parseInt(req.body.id);
    const newUser = req.body;
    try {
        const updatedUser = await User.updateUser(req.poolPromise, userId, newUser);
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const success = await User.deleteUser(req.poolPromise, userId);
        if (!success) {
            return res.status(404).send("User not found");
        }
        res.status(204).send("User deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting user");
    }
};

async function searchUsers(req, res) {
    const searchTerm = req.query.searchTerm; // Extract search term from query params

    try {
        const users = await User.searchUsers(req.poolPromise, searchTerm);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching users" });
    }
}

async function registerUser(req, res) {
    console.log('registeruser', req.body);
    const { username, password, role, name, email } = req.body;

    try {
        // Validate user data (you can implement your own validation logic here)
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check for existing username
        const existingUser = await User.getUserByUsername(req.poolPromise, username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User(username, name, email, hashedPassword, role);

        // Save user to database
        await newUser.save(req.poolPromise);

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.getUserByUsername(req.poolPromise, username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokenPayload = {
            username: user.username, // Ensure 'username' is included
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        res.json({ token, username: user.username, role: user.role });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getUserInfo = async (req, res) => {
    const { username } = req.user; // Correctly access the username from the authenticated user
    const pool = req.poolPromise;
    console.log(`Received request to fetch profile for username: ${username}`);

    try {
        const user = await User.getUserByUsername(pool, username);

        if (!user) {
            console.log(`User ${username} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);
        res.json(user);
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    searchUsers,
    getUserById,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    getUserInfo

};