// src/routes/users.ts

import { Router } from "express";
import {
  createUser,
  registerUser,
  loginUser,
  listUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/create", createUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", listUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

export default router;
