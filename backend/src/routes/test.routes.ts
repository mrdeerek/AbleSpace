import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized" });
});

export default router;
