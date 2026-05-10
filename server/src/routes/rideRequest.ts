// src/routes/rideRequest.ts

import { Router } from "express";
import {
  requestSeat,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  createRideRequest,
  getLatestRideRequest,
  listPendingRequests,
} from "../controllers/rideRequestController.js";

const router = Router();

router.post("/", createRideRequest);

router.get("/pending", listPendingRequests);
router.get("/user/:userId", getLatestRideRequest);

router.post("/:rideId/request", requestSeat);

router.patch("/:requestId/accept", acceptRequest);
router.patch("/:requestId/reject", rejectRequest);
router.patch("/:requestId/cancel", cancelRequest);

export default router;
