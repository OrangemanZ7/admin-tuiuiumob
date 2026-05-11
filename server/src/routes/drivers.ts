// TUIUIUMOB/server/src/routes/drivers.ts

import { Router } from "express";
import {
  createDriver,
  registerDriver,
  loginDriver,
  listDrivers,
  getDriverById,
  updateDriver,
  verifyDriver,
  deleteDriver,
} from "../controllers/driverController.js";
import { authMiddleware, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);

router.post("/create", authMiddleware, requireAdmin, createDriver);
router.get("/", authMiddleware, requireAdmin, listDrivers);
router.get("/:id", authMiddleware, getDriverById);
router.patch("/:id/verify", authMiddleware, requireAdmin, verifyDriver);
router.patch("/:id", authMiddleware, updateDriver);
router.delete("/:id", authMiddleware, requireAdmin, deleteDriver);

export default router;
