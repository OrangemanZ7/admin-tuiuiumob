// src/routes/users.ts

import { Router } from "express";
import {
  createUser,
  registerUser,
  loginUser,
  listUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/create", authMiddleware, requireAdmin, createUser);
router.get("/", authMiddleware, requireAdmin, listUsers);
router.get("/:id", authMiddleware, getUserById);
router.patch("/:id/status", authMiddleware, requireAdmin, updateUserStatus);
router.patch("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, requireAdmin, deleteUser);

export default router;
