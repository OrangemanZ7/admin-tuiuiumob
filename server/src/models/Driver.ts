// server/src/models/Driver.ts

import { Schema, model, type Document, Types } from "mongoose";

export interface IDriver extends Document {
  name: string;
  email: string;
  passwordHash: string;
  cnh: string;
  vehicles: Types.ObjectId[]; // ← lista de veículos
  verified: boolean;
  status: "pending" | "active" | "blocked";
  createdAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    cnh: { type: String, required: true },
    vehicles: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }], // ← aqui
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Driver = model<IDriver>("Driver", driverSchema);
