import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

const handleError = (res: Response, error: any) => {
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
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const data = CreateTaskDto.parse(req.body);

    const task = await createTaskService(userId, data);

    res.status(201).json(task);
  } catch (error: any) {
    handleError(res, error);
  }
};

/**
 * Get Tasks (filters + dashboard)
 * GET /api/tasks
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { status, priority, type, overdue } = req.query;

    const tasks = await getTasksService({
      userId,
      status: status as string,
      priority: priority as string,
      type: type as any,
      overdue: overdue === "true",
    });

    res.status(200).json(tasks);
  } catch (error: any) {
    handleError(res, error);
  }
};

/**
 * Update Task
 * PATCH /api/tasks/:id
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;
    const updates = UpdateTaskDto.parse(req.body);

    const updatedTask = await updateTaskService(taskId, userId, updates);

    res.status(200).json(updatedTask);
  } catch (error: any) {
    handleError(res, error);
  }
};

/**
 * Delete Task
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;

    const result = await deleteTaskService(taskId, userId);

    res.status(200).json(result);
  } catch (error: any) {
    handleError(res, error);
  }
};
