import { Router } from "express";
import {
  createVehicle,
  listVehicles,
  getVehicleById,
  listVehiclesByDriver,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = Router();

router.post("/create", createVehicle);
router.get("/", listVehicles);
router.get("/:id", getVehicleById);
router.get("/driver/:driverId", listVehiclesByDriver);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
