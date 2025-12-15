"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = exports.CreateTaskDto = void 0;
const zod_1 = require("zod");
const task_model_1 = require("../models/task.model");
exports.CreateTaskDto = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1),
    dueDate: zod_1.z.string(), // ISO date string
    priority: zod_1.z.nativeEnum(task_model_1.Priority),
    assignedToId: zod_1.z.string(),
});
exports.UpdateTaskDto = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().min(1).optional(),
    dueDate: zod_1.z.string().optional(),
    priority: zod_1.z.nativeEnum(task_model_1.Priority).optional(),
    status: zod_1.z.nativeEnum(task_model_1.Status).optional(),
    assignedToId: zod_1.z.string().optional(),
});
