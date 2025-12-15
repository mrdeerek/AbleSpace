import { io } from "../server";
import mongoose from "mongoose";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../repositories/task.repository";
import { Status } from "../models/task.model";
import { AuditLog } from "../models/audit-log.model";

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
export const createTaskService = async (
  userId: string,
  data: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    assignedToId: string;
  }
) => {
  const task = await createTask({
    title: data.title,
    description: data.description,
    dueDate: new Date(data.dueDate),
    priority: data.priority as any,
    creatorId: new mongoose.Types.ObjectId(userId),
    assignedToId: new mongoose.Types.ObjectId(data.assignedToId),
    status: Status.TODO,
  });

  // 🔴 REAL-TIME: broadcast task creation
  io.emit("task:created", task);

  // 🔔 REAL-TIME: notify assigned user (personal room)
  io.to(data.assignedToId).emit("task:assigned", {
    message: "You have been assigned a new task",
    task,
  });

  return task;
};

/**
 * Get tasks for dashboard & lists
 */
export const getTasksService = async (params: {
  userId: string;
  status?: string;
  priority?: string;
  type?: "assigned" | "created" | "all";
  overdue?: boolean;
}) => {
  const filters: any = {
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

  return getTasks(filters);
};

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
export const updateTaskService = async (
  taskId: string,
  userId: string,
  updates: any
) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  // Only creator or assignee can update
  if (
    task.creatorId.toString() !== userId &&
    task.assignedToId.toString() !== userId
  ) {
    throw new Error("Not authorized to update this task");
  }

  const updatedTask = await updateTaskById(taskId, updates);

  // 📜 Log to Audit Trail
  if (updates.status) {
    AuditLog.create({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
      action: "UPDATE_STATUS",
      details: `Status changed to ${updates.status}`,
    }).catch(console.error); // Fire and forget logging
  }

  // 🔔 REAL-TIME: If assignee changed, notify the new assignee
  if (updates.assignedToId && updates.assignedToId !== task.assignedToId.toString()) {
    io.to(updates.assignedToId).emit("task:assigned", {
      message: `You have been assigned to task: ${updatedTask ? updatedTask.title : task.title}`,
      task: updatedTask,
    });
  }

  // 🔴 REAL-TIME: broadcast task update
  io.emit("task:updated", {
    taskId,
    updates,
  });

  return updatedTask;
};

/**
 * Delete task (only creator)
 */
export const deleteTaskService = async (
  taskId: string,
  userId: string
) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  if (task.creatorId.toString() !== userId) {
    throw new Error("Only creator can delete task");
  }

  await deleteTaskById(taskId);

  // 🔴 REAL-TIME: broadcast task deletion
  io.emit("task:deleted", { taskId });

  return { success: true };
};
