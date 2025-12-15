import { Task, ITask } from "../models/task.model";
import mongoose from "mongoose";

/**
 * Create a new task
 */
export const createTask = async (data: Partial<ITask>) => {
  return Task.create(data);
};

/**
 * Get all tasks with optional filters
 */
export const getTasks = async (filters: {
  status?: string;
  priority?: string;
  assignedToId?: string;
  creatorId?: string;
  overdue?: boolean;
}) => {
  const query: any = {};

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignedToId)
    query.assignedToId = new mongoose.Types.ObjectId(filters.assignedToId);
  if (filters.creatorId)
    query.creatorId = new mongoose.Types.ObjectId(filters.creatorId);

  if (filters.overdue) {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: "COMPLETED" };
  }

  return Task.find(query).sort({ dueDate: 1 });
};

/**
 * Get task by ID
 */
export const getTaskById = async (taskId: string) => {
  return Task.findById(taskId);
};

/**
 * Update task
 */
export const updateTaskById = async (
  taskId: string,
  data: Partial<ITask>
) => {
  return Task.findByIdAndUpdate(taskId, data, {
    new: true,
  });
};

/**
 * Delete task
 */
export const deleteTaskById = async (taskId: string) => {
  return Task.findByIdAndDelete(taskId);
};
