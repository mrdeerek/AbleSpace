"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const setupSocket = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error("Unauthorized"));
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        console.log("🔌 User connected:", userId);
        // Join personal room
        socket.join(userId);
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", userId);
        });
    });
};
exports.setupSocket = setupSocket;
