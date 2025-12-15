import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Create task
router.post("/", authMiddleware, createTask);

// Get tasks (filters, dashboard)
router.get("/", authMiddleware, getTasks);

// Update task
router.patch("/:id", authMiddleware, updateTask);

// Delete task
router.delete("/:id", authMiddleware, deleteTask);

export default router;
