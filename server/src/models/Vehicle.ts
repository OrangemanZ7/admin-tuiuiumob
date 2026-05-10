// server/src/models/Vehicle.ts

import { Schema, model, type Document } from "mongoose";

export interface IVehicle extends Document {
  driverId: Schema.Types.ObjectId;
  vehicleMake: string;
  vehicleModel: string;
  plate: string;
  year: number;
  seats: number;
  color: string;
  createdAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    plate: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    seats: { type: Number, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

export const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);
