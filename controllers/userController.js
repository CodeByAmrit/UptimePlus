const User = require('../models/user');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });

        // in newUser remove password 

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating User", error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        users.map(async (user) => { delete user.password; });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Get a single monitor by ID
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: `user not found with id ${id}` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating User", error: error.message });
    }
};

// Delete a monitor
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// check user by email
exports.checkUserByEmail = async (req, res) => {
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "email not found" });
        }
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Error checking email", error: error.message });
    }
};

exports.updateUserPassword = async (id, new_password) => {
    try {
        const updatedUser = await User.updatePassword(id, new_password);
        if (!updatedUser) {
            return { message: "User not found" };
        }
        return updatedUser;
    } catch (error) {
        console.log(error);
    }
};

exports.login = async (req, res) => {
    try {
        const updatedUser = await User.login(req, res);
        
    } catch (error) {
        console.log(error);
    }
};

exports.logout = async (req, res) => {
    try {
        const updatedUser = await User.logout(req, res);
        
    } catch (error) {
        console.log(error);
    }
};
