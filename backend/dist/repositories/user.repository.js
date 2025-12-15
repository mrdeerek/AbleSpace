"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = exports.updateUserById = exports.findUserById = exports.findAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const findAllUsers = async () => {
    return await user_model_1.User.find();
};
exports.findAllUsers = findAllUsers;
const findUserById = async (id) => {
    return await user_model_1.User.findById(id);
};
exports.findUserById = findUserById;
const updateUserById = async (id, updates) => {
    return await user_model_1.User.findByIdAndUpdate(id, updates, { new: true });
};
exports.updateUserById = updateUserById;
const createUser = async (data) => {
    return await user_model_1.User.create(data);
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return await user_model_1.User.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
