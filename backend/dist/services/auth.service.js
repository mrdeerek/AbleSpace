"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_repository_1 = require("../repositories/user.repository");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const registerUser = async (name, email, password) => {
    const existingUser = await (0, user_repository_1.findUserByEmail)(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hash_1.hashPassword)(password);
    const user = await (0, user_repository_1.createUser)({
        name,
        email,
        password: hashedPassword,
    });
    // ✅ use _id and convert to string
    const token = (0, jwt_1.generateToken)(user._id.toString());
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await (0, user_repository_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await (0, hash_1.comparePassword)(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)(user._id.toString());
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};
exports.loginUser = loginUser;
