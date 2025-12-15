import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

import authRoutes from "./routes/auth.routes";

app.use("/api/auth", authRoutes);

import testRoutes from "./routes/test.routes";

app.use("/api/test", testRoutes);

import taskRoutes from "./routes/task.routes";
app.use("/api/tasks", taskRoutes);

import userRoutes from "./routes/user.routes";
app.use("/api/users", userRoutes);

export default app;
