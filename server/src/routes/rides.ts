import { Router } from "express";
import {
  createRide,
  listRides,
  getRideById,
  joinRide,
  closeRide,
} from "../controllers/rideController.js";

const router = Router();

router.post("/", createRide);
router.get("/", listRides);
router.get("/:id", getRideById);
router.post("/:rideId/join", joinRide);
router.patch("/:id/close", closeRide);

export default router;
