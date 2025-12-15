import { Request, Response } from "express";
import { getAllUsers, updateUserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware"; // Assuming this exists from task controller

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        // Return minimal info for security
        const sanitizedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email
        }));
        res.status(200).json(sanitizedUsers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const { name, email } = req.body;

        const updatedUser = await updateUserService(userId, { name, email });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
