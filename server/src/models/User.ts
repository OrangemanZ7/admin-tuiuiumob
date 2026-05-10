import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  status: "pending" | "active" | "blocked";
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
