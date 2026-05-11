// TUIUIUMOB/server/src/routes/rides.ts

import { Router } from "express";
import {
  createRide,
  listRides,
  listMyRides,
  getRideById,
  joinRide,
  closeRide,
  updateRide,
  deleteRide,
} from "../controllers/rideController.js";
import {
  authMiddleware,
  requireAdminOrDriver,
  requireUser,
  requireDriver,
} from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, requireAdminOrDriver, createRide);
router.get("/", listRides);
router.get("/mine", authMiddleware, requireDriver, listMyRides);
router.get("/:id", getRideById);
router.post("/:rideId/join", authMiddleware, requireUser, joinRide);
router.patch("/:id/close", authMiddleware, closeRide);
router.patch("/:id", authMiddleware, updateRide);
router.delete("/:id", authMiddleware, deleteRide);

export default router;
