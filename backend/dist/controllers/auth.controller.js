"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_dto_1 = require("../dtos/auth.dto");
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const data = auth_dto_1.RegisterDto.parse(req.body);
        const result = await (0, auth_service_1.registerUser)(data.name, data.email, data.password);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const data = auth_dto_1.LoginDto.parse(req.body);
        const result = await (0, auth_service_1.loginUser)(data.email, data.password);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.login = login;
