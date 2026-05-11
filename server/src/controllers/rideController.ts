import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Ride } from "../models/Ride.js";
import { Driver } from "../models/Driver.js";
import { Vehicle } from "../models/Vehicle.js";
import { User } from "../models/User.js";
import { isAdmin } from "../middleware/auth.js";
import { pickAllowedKeys } from "../utils/sanitize.js";

const RIDE_PATCH_FIELDS = [
  "originCity",
  "destinationCity",
  "destinationNeighborhood",
  "departureTime",
  "price",
  "seatsAvailable",
  "status",
] as const;

const RIDE_STATUSES = ["open", "closed", "cancelled"] as const;

function driverOwnsVehicle(
  driver: { vehicles: mongoose.Types.ObjectId[] },
  vehicleId: string,
): boolean {
  return driver.vehicles.some((v) => String(v) === String(vehicleId));
}

export async function createRide(req: Request, res: Response) {
  try {
    const {
      driverId: driverIdBody,
      vehicleId,
      originCity,
      destinationCity,
      destinationNeighborhood,
      departureTime,
      price,
      seatsAvailable,
    } = req.body;

    let driverId = driverIdBody as string | undefined;
    if (req.auth?.type === "driver") {
      driverId = req.auth.sub;
    } else if (!driverId && !isAdmin(req.auth)) {
      return res.status(400).json({ error: "driverId é obrigatório" });
    }

    if (!driverId || !mongoose.isValidObjectId(driverId)) {
      return res.status(400).json({ error: "ID de motorista inválido" });
    }

    if (!mongoose.isValidObjectId(vehicleId)) {
      return res.status(400).json({ error: "ID de veículo inválido" });
    }

    if (req.auth?.type === "driver" && driverId !== req.auth.sub) {
      return res.status(403).json({ error: "Não pode criar viagem para outro motorista" });
    }

    const driver = await Driver.findById(driverId).lean();
    if (!driver) {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }

    if (driver.status !== "active" || driver.verified !== true) {
      return res
        .status(400)
        .json({ error: "Motorista não está ativo/verificado" });
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    if (!driverOwnsVehicle(driver as { vehicles: mongoose.Types.ObjectId[] }, vehicleId)) {
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

export async function listRides(_req: Request, res: Response) {
  const rides = await Ride.find()
    .populate("driverId", "-passwordHash")
    .populate("vehicleId")
    .populate("passengers", "-passwordHash")
    .lean();

  res.json(rides);
}

/** Authenticated driver: rides where driverId === JWT sub */
export async function listMyRides(req: Request, res: Response) {
  if (req.auth?.type !== "driver") {
    return res.status(403).json({ error: "Apenas motoristas" });
  }

  const rides = await Ride.find({ driverId: req.auth.sub })
    .populate("vehicleId")
    .populate("passengers", "-passwordHash")
    .lean();

  res.json(rides);
}

export async function getRideById(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findById(id)
    .populate("driverId", "-passwordHash")
    .populate("vehicleId")
    .populate("passengers", "-passwordHash")
    .lean();

  if (!ride) {
    return res.status(404).json({ error: "Viagem não encontrada" });
  }

  res.json(ride);
}

export async function joinRide(req: Request, res: Response) {
  const { rideId } = req.params;

  if (req.auth?.type !== "user") {
    return res.status(403).json({ error: "Apenas passageiros autenticados" });
  }

  const userId = req.auth.sub;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(404).json({ error: "Viagem não encontrada" });
  }

  if (ride.status !== "open") {
    return res.status(400).json({ error: "Viagem não está aberta" });
  }

  if (ride.passengers.some((p) => String(p) === userId)) {
    return res.status(400).json({ error: "Usuário já está na viagem" });
  }

  if (ride.seatsAvailable <= 0) {
    return res.status(400).json({ error: "Não há vagas disponíveis" });
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if (user.status !== "active") {
    return res.status(400).json({ error: "Usuário não está ativo" });
  }

  ride.passengers.push(new mongoose.Types.ObjectId(userId));
  ride.seatsAvailable -= 1;

  await ride.save();

  res.json(ride);
}

export async function closeRide(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findById(id).lean();
  if (!ride) {
    return res.status(404).json({ error: "Viagem não encontrada" });
  }

  const owns =
    req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
  if (!owns && !isAdmin(req.auth)) {
    return res.status(403).json({ error: "Somente o motorista da viagem pode encerrar" });
  }

  const updated = await Ride.findByIdAndUpdate(
    id,
    { status: "closed" },
    { returnDocument: "after" },
  ).lean();

  res.json(updated);
}

export async function updateRide(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findById(id);
  if (!ride) {
    return res.status(404).json({ error: "Viagem não encontrada" });
  }

  const owns =
    req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
  if (!owns && !isAdmin(req.auth)) {
    return res.status(403).json({ error: "Sem permissão para editar esta viagem" });
  }

  const updates = pickAllowedKeys(req.body as Record<string, unknown>, [
    ...RIDE_PATCH_FIELDS,
  ]);

  if (updates.status !== undefined) {
    const s = updates.status as string;
    if (!RIDE_STATUSES.includes(s as (typeof RIDE_STATUSES)[number])) {
      return res.status(400).json({ error: "Status de viagem inválido" });
    }
  }

  if (updates.seatsAvailable !== undefined) {
    const n = Number(updates.seatsAvailable);
    if (Number.isNaN(n) || n < ride.passengers.length) {
      return res
        .status(400)
        .json({
          error: `Assentos disponíveis deve ser >= ${ride.passengers.length} (passageiros atuais)`,
        });
    }
  }

  if (updates.departureTime !== undefined) {
    updates.departureTime = new Date(updates.departureTime as string | Date);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nenhum campo permitido para atualização" });
  }

  Object.assign(ride, updates);
  await ride.save();

  const populated = await Ride.findById(ride._id)
    .populate("driverId", "-passwordHash")
    .populate("vehicleId")
    .populate("passengers", "-passwordHash")
    .lean();

  res.json(populated);
}

export async function deleteRide(req: Request, res: Response) {
  const { id } = req.params;

  const ride = await Ride.findById(id).lean();
  if (!ride) {
    return res.status(404).json({ error: "Viagem não encontrada" });
  }

  const owns =
    req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
  if (!owns && !isAdmin(req.auth)) {
    return res.status(403).json({ error: "Sem permissão para excluir esta viagem" });
  }

  await Ride.findByIdAndDelete(id);
  res.json({ message: "Viagem removida" });
}
