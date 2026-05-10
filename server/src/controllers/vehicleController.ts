// src/controllers/vehicleController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import { Vehicle } from "../models/Vehicle.js";
import { Driver } from "../models/Driver.js";

export async function createVehicle(req: Request, res: Response) {
  try {
    const { driverId, vehicleMake, vehicleModel, plate, year, seats, color } =
      req.body;

    if (
      !driverId ||
      !vehicleMake ||
      !vehicleModel ||
      !plate ||
      !year ||
      !seats ||
      !color
    ) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }

    const vehicle = await Vehicle.create({
      driverId,
      vehicleMake,
      vehicleModel,
      plate,
      year,
      seats,
      color,
    });

    driver.vehicles.push(vehicle._id);
    await driver.save();

    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar veículo" });
  }
}

export async function listVehicles(req: Request, res: Response) {
  const vehicles = await Vehicle.find().lean();
  res.json(vehicles);
}

export async function getVehicleById(req: Request, res: Response) {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  res.json(vehicle);
}

export async function listVehiclesByDriver(req: Request, res: Response) {
  const { driverId } = req.params;

  if (!mongoose.isValidObjectId(driverId)) {
    return res.status(400).json({ error: "ID de motorista inválido" });
  }

  const driver = await Driver.findById(driverId).populate("vehicles").lean();
  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver.vehicles ?? []);
}

export async function updateVehicle(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
  }).lean();

  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  res.json(vehicle);
}

export async function deleteVehicle(req: Request, res: Response) {
  const { id } = req.params;

  const vehicle = await Vehicle.findByIdAndDelete(id).lean();
  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  // remover o vehicleId de todos os drivers que o tenham
  await Driver.updateMany(
    { vehicles: vehicle._id },
    { $pull: { vehicles: vehicle._id } },
  );

  res.json({ message: "Veículo removido com sucesso" });
}
