import { Schema, model, type Document, Types } from "mongoose";

export interface IRide extends Document {
  driverId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  passengers: Types.ObjectId[];
  originCity: string;
  destinationCity: string;
  destinationNeighborhood: string;
  departureTime: Date;
  price: number;
  seatsAvailable: number;
  status: "open" | "closed" | "cancelled";
  createdAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    passengers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    originCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    destinationNeighborhood: { type: String, required: true },
    departureTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true },
);

export const Ride = model<IRide>("Ride", rideSchema);
