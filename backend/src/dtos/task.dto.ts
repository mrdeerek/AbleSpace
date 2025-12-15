import { z } from "zod";
import { Priority, Status } from "../models/task.model";

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string(), // ISO date string
  priority: z.nativeEnum(Priority),
  assignedToId: z.string(),
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  assignedToId: z.string().optional(),
});
