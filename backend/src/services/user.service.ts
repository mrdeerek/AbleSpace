import { findAllUsers, updateUserById } from "../repositories/user.repository";

export const getAllUsers = async () => {
    return await findAllUsers();
};

export const updateUserService = async (userId: string, data: { name?: string; email?: string }) => {
    return await updateUserById(userId, data);
};
