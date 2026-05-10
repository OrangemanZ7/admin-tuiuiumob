import { Request, Response } from "express";
import mongoose from "mongoose";
import { Ride } from "../models/Ride.js";
import { Driver } from "../models/Driver.js";
import { Vehicle } from "../models/Vehicle.js";
import { User } from "../models/User.js";

export async function createRide(req: Request, res: Response) {
  try {
    const {
      driverId,
      vehicleId,
      originCity,
      destinationCity,
      destinationNeighborhood,
      departureTime,
      price,
      seatsAvailable,
    } = req.body;

    if (!mongoose.isValidObjectId(driverId)) {
      return res.status(400).json({ error: "ID de motorista inválido" });
    }

    if (!mongoose.isValidObjectId(vehicleId)) {
      return res.status(400).json({ error: "ID de veículo inválido" });
    }

    const driver = await Driver.findById(driverId).lean();
    if (!driver)
      return res.status(404).json({ error: "Motorista não encontrado" });

    if (driver.status !== "active" || driver.verified !== true) {
      return res
        .status(400)
        .json({ error: "Motorista não está ativo/verificado" });
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle)
      return res.status(404).json({ error: "Veículo não encontrado" });

    if (!driver.vehicles.includes(vehicleId)) {
      return res
        .status(400)
        .json({ error: "Este veículo não pertence ao motorista" });
    }

    const ride = await Ride.create({
      driverId,
      vehicleId,
      passengers: [],
      originCity,
      destinationCity,
      destinationNeighborhood,
      departureTime,
      price,
      seatsAvailable,
      status: "open",
    });

    res.status(201).json(ride);
  } catch (error) {
    console.error("Erro ao criar viagem:", error);
    res.status(500).json({ error: "Erro interno ao criar viagem" });
  }
}

export async function listRides(req: Request, res: Response) {
  const rides = await Ride.find()
    .populate("driverId")
    .populate("vehicleId")
    .populate("passengers")
    .lean();

  res.json(rides);
}

export async function getRideById(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findById(id)
    .populate("driverId")
    .populate("vehicleId")
    .populate("passengers")
    .lean();

  if (!ride) return res.status(404).json({ error: "Viagem não encontrada" });

  res.json(ride);
}

export async function joinRide(req: Request, res: Response) {
  const { rideId } = req.params;
  const { userId } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  const ride = await Ride.findById(rideId);
  if (!ride) return res.status(404).json({ error: "Viagem não encontrada" });

  if (ride.status !== "open") {
    return res.status(400).json({ error: "Viagem não está aberta" });
  }

  if (ride.passengers.includes(userId)) {
    return res.status(400).json({ error: "Usuário já está na viagem" });
  }

  if (ride.seatsAvailable <= 0) {
    return res.status(400).json({ error: "Não há vagas disponíveis" });
  }

  const user = await User.findById(userId).lean();
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  if (user.status !== "active") {
    return res.status(400).json({ error: "Usuário não está ativo" });
  }

  ride.passengers.push(userId);
  ride.seatsAvailable -= 1;

  await ride.save();

  res.json(ride);
}

export async function closeRide(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findByIdAndUpdate(
    id,
    { status: "closed" },
    { returnDocument: "after" },
  ).lean();

  if (!ride) return res.status(404).json({ error: "Viagem não encontrada" });

  res.json(ride);
}
