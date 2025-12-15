"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const getUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        // Return minimal info for security
        const sanitizedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email
        }));
        res.status(200).json(sanitizedUsers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;
        const updatedUser = await (0, user_service_1.updateUserService)(userId, { name, email });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
