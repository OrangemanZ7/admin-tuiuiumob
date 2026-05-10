// src/models/RideRequest.ts

import { Schema, model, type Document, Types } from "mongoose";

const RideRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: false },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
  origin: String,
  destination: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "canceled"],
    default: "pending",
  },
  createdAt: Date,
});

export default model("RideRequest", RideRequestSchema);
