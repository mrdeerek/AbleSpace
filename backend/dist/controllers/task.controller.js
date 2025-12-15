"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const task_dto_1 = require("../dtos/task.dto");
const handleError = (res, error) => {
    if (error.message === "Task not found" || error.message === "User not found") {
        return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Not authorized") || error.message.includes("Only creator")) {
        return res.status(403).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
};
/**
 * Create Task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
    try {
        const userId = req.userId;
        const data = task_dto_1.CreateTaskDto.parse(req.body);
        const task = await (0, task_service_1.createTaskService)(userId, data);
        res.status(201).json(task);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.createTask = createTask;
/**
 * Get Tasks (filters + dashboard)
 * GET /api/tasks
 */
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, priority, type, overdue } = req.query;
        const tasks = await (0, task_service_1.getTasksService)({
            userId,
            status: status,
            priority: priority,
            type: type,
            overdue: overdue === "true",
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.getTasks = getTasks;
/**
 * Update Task
 * PATCH /api/tasks/:id
 */
const updateTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;
        const updates = task_dto_1.UpdateTaskDto.parse(req.body);
        const updatedTask = await (0, task_service_1.updateTaskService)(taskId, userId, updates);
        res.status(200).json(updatedTask);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.updateTask = updateTask;
/**
 * Delete Task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;
        const result = await (0, task_service_1.deleteTaskService)(taskId, userId);
        res.status(200).json(result);
    }
    catch (error) {
        handleError(res, error);
    }
};
exports.deleteTask = deleteTask;
