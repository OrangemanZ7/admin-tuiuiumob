// TUIUIUMOB/server/src/routes/vehicles.ts
import { Router } from "express";
import {
  createVehicle,
  listVehicles,
  getVehicleById,
  listVehiclesByDriver,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import {
  authMiddleware,
  requireAdmin,
  requireAdminOrDriver,
} from "../middleware/auth.js";

const router = Router();

router.post("/create", authMiddleware, requireAdminOrDriver, createVehicle);
router.get("/", authMiddleware, requireAdmin, listVehicles);
router.get("/driver/:driverId", authMiddleware, listVehiclesByDriver);
router.get("/:id", authMiddleware, getVehicleById);
router.patch("/:id", authMiddleware, updateVehicle);
router.delete("/:id", authMiddleware, deleteVehicle);

export default router;
