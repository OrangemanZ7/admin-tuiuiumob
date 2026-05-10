// src/routes/drivers.ts

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

const router = Router();

router.post("/create", createDriver);
router.post("/register", registerDriver);
router.post("/login", loginDriver);

router.get("/", listDrivers);
router.get("/:id", getDriverById);
router.patch("/:id", updateDriver);
router.patch("/:id/verify", verifyDriver);
router.delete("/:id", deleteDriver);

export default router;
