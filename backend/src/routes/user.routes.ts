import { Router } from "express";
import { getUsers, updateUser } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getUsers);
router.put("/profile", authMiddleware, updateUser);

export default router;
