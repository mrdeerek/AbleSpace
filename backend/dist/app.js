"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
// Health check
app.get("/health", (_, res) => {
    res.status(200).json({ status: "OK" });
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
app.use("/api/auth", auth_routes_1.default);
const test_routes_1 = __importDefault(require("./routes/test.routes"));
app.use("/api/test", test_routes_1.default);
const task_routes_1 = __importDefault(require("./routes/task.routes"));
app.use("/api/tasks", task_routes_1.default);
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use("/api/users", user_routes_1.default);
exports.default = app;
