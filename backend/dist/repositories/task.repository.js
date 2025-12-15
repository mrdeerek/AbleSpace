"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskById = exports.updateTaskById = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Create a new task
 */
const createTask = async (data) => {
    return task_model_1.Task.create(data);
};
exports.createTask = createTask;
/**
 * Get all tasks with optional filters
 */
const getTasks = async (filters) => {
    const query = {};
    if (filters.status)
        query.status = filters.status;
    if (filters.priority)
        query.priority = filters.priority;
    if (filters.assignedToId)
        query.assignedToId = new mongoose_1.default.Types.ObjectId(filters.assignedToId);
    if (filters.creatorId)
        query.creatorId = new mongoose_1.default.Types.ObjectId(filters.creatorId);
    if (filters.overdue) {
        query.dueDate = { $lt: new Date() };
        query.status = { $ne: "COMPLETED" };
    }
    return task_model_1.Task.find(query).sort({ dueDate: 1 });
};
exports.getTasks = getTasks;
/**
 * Get task by ID
 */
const getTaskById = async (taskId) => {
    return task_model_1.Task.findById(taskId);
};
exports.getTaskById = getTaskById;
/**
 * Update task
 */
const updateTaskById = async (taskId, data) => {
    return task_model_1.Task.findByIdAndUpdate(taskId, data, {
        new: true,
    });
};
exports.updateTaskById = updateTaskById;
/**
 * Delete task
 */
const deleteTaskById = async (taskId) => {
    return task_model_1.Task.findByIdAndDelete(taskId);
};
exports.deleteTaskById = deleteTaskById;
