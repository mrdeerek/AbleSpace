"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("../services/task.service");
const TaskRepository = __importStar(require("../repositories/task.repository"));
const server_1 = require("../server");
// Mock socket.io imports from server.ts
jest.mock("../server", () => ({
    io: {
        emit: jest.fn(),
        to: jest.fn().mockReturnThis(),
    },
}));
// Mock Mongoose
jest.mock("mongoose", () => {
    const actual = jest.requireActual("mongoose");
    return {
        ...actual,
        Types: {
            ObjectId: class {
                constructor(s) { this.id = s || "valid-id"; }
                toString() { return this.id; }
            }
        }
    };
});
describe("TaskService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createTaskService", () => {
        it("should create a task and emit socket events", async () => {
            const mockTask = {
                _id: "task123",
                title: "Test Task",
                assignedToId: "user456",
                creatorId: "user123",
            };
            const createTaskSpy = jest.spyOn(TaskRepository, "createTask").mockResolvedValue(mockTask);
            const result = await (0, task_service_1.createTaskService)("user123", {
                title: "Test Task",
                description: "Desc",
                dueDate: "2023-01-01",
                priority: "HIGH",
                assignedToId: "user456",
            });
            expect(createTaskSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockTask);
            expect(server_1.io.emit).toHaveBeenCalledWith("task:created", mockTask);
            expect(server_1.io.to).toHaveBeenCalledWith("user456");
        });
        it("should throw error if repository fails", async () => {
            jest.spyOn(TaskRepository, "createTask").mockRejectedValue(new Error("DB Error"));
            await expect((0, task_service_1.createTaskService)("user123", {
                title: "Fail Task",
                description: "Desc",
                dueDate: "2023-01-01",
                priority: "LOW",
                assignedToId: "user456",
            })).rejects.toThrow("DB Error");
        });
    });
    describe("updateTaskService", () => {
        it("should allow creator to update task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };
            const updatedMockTask = { ...mockTask, status: "COMPLETED" };
            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask);
            jest.spyOn(TaskRepository, "updateTaskById").mockResolvedValue(updatedMockTask);
            const result = await (0, task_service_1.updateTaskService)("task1", "user1", { status: "COMPLETED" });
            expect(result).toEqual(updatedMockTask);
            expect(server_1.io.emit).toHaveBeenCalledWith("task:updated", {
                taskId: "task1",
                updates: { status: "COMPLETED" }
            });
        });
        it("should allow assignee to update task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };
            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask);
            jest.spyOn(TaskRepository, "updateTaskById").mockResolvedValue({});
            await expect((0, task_service_1.updateTaskService)("task1", "user2", { status: "IN_PROGRESS" }))
                .resolves.not.toThrow();
        });
        it("should prevent unauthorized user from updating task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };
            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask);
            await expect((0, task_service_1.updateTaskService)("task1", "randomUser", { status: "COMPLETED" }))
                .rejects.toThrow("Not authorized to update this task");
        });
    });
});
