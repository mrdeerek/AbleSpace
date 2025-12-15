"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create task
router.post("/", auth_middleware_1.authMiddleware, task_controller_1.createTask);
// Get tasks (filters, dashboard)
router.get("/", auth_middleware_1.authMiddleware, task_controller_1.getTasks);
// Update task
router.patch("/:id", auth_middleware_1.authMiddleware, task_controller_1.updateTask);
// Delete task
router.delete("/:id", auth_middleware_1.authMiddleware, task_controller_1.deleteTask);
exports.default = router;
