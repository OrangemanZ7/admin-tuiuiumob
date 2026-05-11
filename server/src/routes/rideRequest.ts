// TUIUIUMOB/server/src/routes/rideRequest.ts

import { Router } from "express";
import {
  requestSeat,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  createRideRequest,
  getLatestRideRequestMe,
  getLatestRideRequestByUserId,
  listPendingRequests,
  listRideRequestsByRideQuery,
  getRideRequestById,
} from "../controllers/rideRequestController.js";
import { authMiddleware, requireUser } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, requireUser, createRideRequest);
router.get("/me/latest", authMiddleware, requireUser, getLatestRideRequestMe);
router.get("/pending", authMiddleware, listPendingRequests);
router.get("/user/:userId", authMiddleware, getLatestRideRequestByUserId);
router.get("/", authMiddleware, listRideRequestsByRideQuery);
router.get("/:requestId", authMiddleware, getRideRequestById);

router.post("/:rideId/request", authMiddleware, requireUser, requestSeat);

router.patch("/:requestId/accept", authMiddleware, acceptRequest);
router.patch("/:requestId/reject", authMiddleware, rejectRequest);
router.patch("/:requestId/cancel", authMiddleware, cancelRequest);

export default router;
