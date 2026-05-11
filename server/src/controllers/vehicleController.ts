// src/controllers/vehicleController.ts

import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Vehicle } from "../models/Vehicle.js";
import { Driver } from "../models/Driver.js";
import { isAdmin } from "../middleware/auth.js";
import { pickAllowedKeys } from "../utils/sanitize.js";

const VEHICLE_PATCH_FIELDS = [
  "vehicleMake",
  "vehicleModel",
  "plate",
  "year",
  "seats",
  "color",
] as const;

export async function createVehicle(req: Request, res: Response) {
  try {
    const {
      driverId: driverIdBody,
      vehicleMake,
      vehicleModel,
      plate,
      year,
      seats,
      color,
    } = req.body;

    if (
      !vehicleMake ||
      !vehicleModel ||
      !plate ||
      year === undefined ||
      seats === undefined ||
      !color
    ) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    let driverId = driverIdBody as string | undefined;
    if (req.auth?.type === "driver") {
      driverId = req.auth.sub;
    } else if (!driverId || !isAdmin(req.auth)) {
      return res.status(400).json({ error: "driverId é obrigatório" });
    }

    if (!mongoose.isValidObjectId(driverId)) {
      return res.status(400).json({ error: "ID de motorista inválido" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }

    const driverOid = new mongoose.Types.ObjectId(driverId);

    const vehicle = await Vehicle.create({
      driverId: driverOid,
      vehicleMake,
      vehicleModel,
      plate,
      year,
      seats,
      color,
    });

    driver.vehicles.push(vehicle._id);
    await driver.save();

    res.status(201).json(vehicle.toObject());
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar veículo" });
  }
}

export async function listVehicles(_req: Request, res: Response) {
  const vehicles = await Vehicle.find().lean();
  res.json(vehicles);
}

export async function getVehicleById(req: Request, res: Response) {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  const allowed =
    isAdmin(req.auth) ||
    (req.auth?.type === "driver" && String(vehicle.driverId) === req.auth.sub);
  if (!allowed) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  res.json(vehicle);
}

export async function listVehiclesByDriver(req: Request, res: Response) {
  const { driverId } = req.params;

  if (!mongoose.isValidObjectId(driverId)) {
    return res.status(400).json({ error: "ID de motorista inválido" });
  }

  const allowed =
    isAdmin(req.auth) ||
    (req.auth?.type === "driver" && req.auth.sub === driverId);
  if (!allowed) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  const driver = await Driver.findById(driverId).populate("vehicles").lean();
  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver.vehicles ?? []);
}

export async function updateVehicle(req: Request, res: Response) {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  const allowed =
    isAdmin(req.auth) ||
    (req.auth?.type === "driver" && String(vehicle.driverId) === req.auth.sub);
  if (!allowed) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  const updates = pickAllowedKeys(req.body as Record<string, unknown>, [
    ...VEHICLE_PATCH_FIELDS,
  ]);
  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ error: "Nenhum campo permitido para atualização" });
  }

  const updated = await Vehicle.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
  }).lean();

  res.json(updated);
}

export async function deleteVehicle(req: Request, res: Response) {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  const allowed =
    isAdmin(req.auth) ||
    (req.auth?.type === "driver" && String(vehicle.driverId) === req.auth.sub);
  if (!allowed) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  await Vehicle.findByIdAndDelete(id);

  await Driver.updateMany(
    { vehicles: vehicle._id },
    { $pull: { vehicles: vehicle._id } },
  );

  res.json({ message: "Veículo removido com sucesso" });
}
