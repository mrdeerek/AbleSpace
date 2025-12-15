"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskService = exports.updateTaskService = exports.getTasksService = exports.createTaskService = void 0;
const server_1 = require("../server");
const mongoose_1 = __importDefault(require("mongoose"));
const task_repository_1 = require("../repositories/task.repository");
const task_model_1 = require("../models/task.model");
const audit_log_model_1 = require("../models/audit-log.model");
/**
 * Creates a new task in the database.
 *
 * This service function:
 * 1. Persists the task data via the repository.
 * 2. Emits a 'task:created' socket event to all connected clients.
 * 3. Sends a targeted 'task:assigned' notification to the assignee.
 *
 * @param userId - The ID of the authenticated user creating the task.
 * @param data - The task data including title, description, priority, etc.
 * @returns The created task document.
 */
const createTaskService = async (userId, data) => {
    const task = await (0, task_repository_1.createTask)({
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        creatorId: new mongoose_1.default.Types.ObjectId(userId),
        assignedToId: new mongoose_1.default.Types.ObjectId(data.assignedToId),
        status: task_model_1.Status.TODO,
    });
    // 🔴 REAL-TIME: broadcast task creation
    server_1.io.emit("task:created", task);
    // 🔔 REAL-TIME: notify assigned user (personal room)
    server_1.io.to(data.assignedToId).emit("task:assigned", {
        message: "You have been assigned a new task",
        task,
    });
    return task;
};
exports.createTaskService = createTaskService;
/**
 * Get tasks for dashboard & lists
 */
const getTasksService = async (params) => {
    const filters = {
        status: params.status,
        priority: params.priority,
        overdue: params.overdue,
    };
    if (params.type === "assigned") {
        filters.assignedToId = params.userId;
    }
    if (params.type === "created") {
        filters.creatorId = params.userId;
    }
    return (0, task_repository_1.getTasks)(filters);
};
exports.getTasksService = getTasksService;
/**
 * Updates an existing task by ID.
 *
 * Authorization Check:
 * - Only the **Task Creator** OR the **Assigned User** can update the task.
 *
 * Side Effects:
 * - Emits a 'task:updated' socket event to notify other users.
 *
 * @param taskId - The unique ID of the task to update.
 * @param userId - The ID of the user requesting the update (for auth check).
 * @param updates - Partial task object containing fields to update.
 * @returns The updated task document.
 * @throws Error if task not found or user is not authorized.
 */
const updateTaskService = async (taskId, userId, updates) => {
    const task = await (0, task_repository_1.getTaskById)(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    // Only creator or assignee can update
    if (task.creatorId.toString() !== userId &&
        task.assignedToId.toString() !== userId) {
        throw new Error("Not authorized to update this task");
    }
    const updatedTask = await (0, task_repository_1.updateTaskById)(taskId, updates);
    // 📜 Log to Audit Trail
    if (updates.status) {
        audit_log_model_1.AuditLog.create({
            taskId: new mongoose_1.default.Types.ObjectId(taskId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            action: "UPDATE_STATUS",
            details: `Status changed to ${updates.status}`,
        }).catch(console.error); // Fire and forget logging
    }
    // 🔔 REAL-TIME: If assignee changed, notify the new assignee
    if (updates.assignedToId && updates.assignedToId !== task.assignedToId.toString()) {
        server_1.io.to(updates.assignedToId).emit("task:assigned", {
            message: `You have been assigned to task: ${updatedTask ? updatedTask.title : task.title}`,
            task: updatedTask,
        });
    }
    // 🔴 REAL-TIME: broadcast task update
    server_1.io.emit("task:updated", {
        taskId,
        updates,
    });
    return updatedTask;
};
exports.updateTaskService = updateTaskService;
/**
 * Delete task (only creator)
 */
const deleteTaskService = async (taskId, userId) => {
    const task = await (0, task_repository_1.getTaskById)(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    if (task.creatorId.toString() !== userId) {
        throw new Error("Only creator can delete task");
    }
    await (0, task_repository_1.deleteTaskById)(taskId);
    // 🔴 REAL-TIME: broadcast task deletion
    server_1.io.emit("task:deleted", { taskId });
    return { success: true };
};
exports.deleteTaskService = deleteTaskService;
