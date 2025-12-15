import { createTaskService, updateTaskService, deleteTaskService } from "../services/task.service";
import * as TaskRepository from "../repositories/task.repository";
import { io } from "../server";

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
                private id: string;
                constructor(s?: string) { this.id = s || "valid-id"; }
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

            const createTaskSpy = jest.spyOn(TaskRepository, "createTask").mockResolvedValue(mockTask as any);

            const result = await createTaskService("user123", {
                title: "Test Task",
                description: "Desc",
                dueDate: "2023-01-01",
                priority: "HIGH",
                assignedToId: "user456",
            });

            expect(createTaskSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockTask);
            expect(io.emit).toHaveBeenCalledWith("task:created", mockTask);
            expect(io.to).toHaveBeenCalledWith("user456");
        });

        it("should throw error if repository fails", async () => {
            jest.spyOn(TaskRepository, "createTask").mockRejectedValue(new Error("DB Error"));

            await expect(
                createTaskService("user123", {
                    title: "Fail Task",
                    description: "Desc",
                    dueDate: "2023-01-01",
                    priority: "LOW",
                    assignedToId: "user456",
                })
            ).rejects.toThrow("DB Error");
        });
    });

    describe("updateTaskService", () => {
        it("should allow creator to update task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };
            const updatedMockTask = { ...mockTask, status: "COMPLETED" };

            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask as any);
            jest.spyOn(TaskRepository, "updateTaskById").mockResolvedValue(updatedMockTask as any);

            const result = await updateTaskService("task1", "user1", { status: "COMPLETED" });

            expect(result).toEqual(updatedMockTask);
            expect(io.emit).toHaveBeenCalledWith("task:updated", {
                taskId: "task1",
                updates: { status: "COMPLETED" }
            });
        });

        it("should allow assignee to update task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };

            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask as any);
            jest.spyOn(TaskRepository, "updateTaskById").mockResolvedValue({} as any);

            await expect(updateTaskService("task1", "user2", { status: "IN_PROGRESS" }))
                .resolves.not.toThrow();
        });

        it("should prevent unauthorized user from updating task", async () => {
            const mockTask = { _id: "task1", creatorId: "user1", assignedToId: "user2" };

            jest.spyOn(TaskRepository, "getTaskById").mockResolvedValue(mockTask as any);

            await expect(updateTaskService("task1", "randomUser", { status: "COMPLETED" }))
                .rejects.toThrow("Not authorized to update this task");
        });
    });
});
