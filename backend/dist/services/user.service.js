"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserService = exports.getAllUsers = void 0;
const user_repository_1 = require("../repositories/user.repository");
const getAllUsers = async () => {
    return await (0, user_repository_1.findAllUsers)();
};
exports.getAllUsers = getAllUsers;
const updateUserService = async (userId, data) => {
    return await (0, user_repository_1.updateUserById)(userId, data);
};
exports.updateUserService = updateUserService;
