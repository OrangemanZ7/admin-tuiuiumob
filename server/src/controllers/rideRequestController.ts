// src/controllers/rideRequestController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import { Ride } from "../models/Ride.js";
import { User } from "../models/User.js";
import RideRequest from "../models/RideRequest.js";

export async function requestSeat(req: Request, res: Response) {
  try {
    const { rideId } = req.params;
    const { userId } = req.body;

    if (
      !mongoose.isValidObjectId(rideId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({ error: "IDs inválidos" });
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
      return res.status(400).json({ error: "Sem vagas disponíveis" });
    }

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    if (user.status !== "active") {
      return res.status(400).json({ error: "Usuário não está ativo" });
    }

    const existing = await RideRequest.findOne({
      rideId,
      userId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Já existe uma solicitação pendente" });
    }

    const request = await RideRequest.create({
      rideId,
      userId,
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Erro ao solicitar vaga:", error);
    res.status(500).json({ error: "Erro interno ao solicitar vaga" });
  }
}

export async function acceptRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await RideRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ error: "Solicitação não encontrada" });

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Solicitação não está pendente" });
    }

    const ride = await Ride.findById(request.rideId);
    if (!ride) return res.status(404).json({ error: "Viagem não encontrada" });

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ error: "Sem vagas disponíveis" });
    }

    if (!request.userId) {
      return res.status(400).json({ error: "Solicitação sem userId" });
    }

    ride.passengers.push(new mongoose.Types.ObjectId(request.userId));

    ride.seatsAvailable -= 1;
    await ride.save();

    request.status = "accepted";
    await request.save();

    res.json({ message: "Passageiro adicionado à viagem", ride });
  } catch (error) {
    console.error("Erro ao aceitar solicitação:", error);
    res.status(500).json({ error: "Erro interno ao aceitar solicitação" });
  }
}

export async function rejectRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await RideRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ error: "Solicitação não encontrada" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Solicitação rejeitada" });
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error);
    res.status(500).json({ error: "Erro interno ao rejeitar solicitação" });
  }
}

export async function cancelRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await RideRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ error: "Solicitação não encontrada" });

    request.status = "canceled";
    await request.save();

    res.json({ message: "Solicitação cancelada" });
  } catch (error) {
    console.error("Erro ao cancelar solicitação:", error);
    res.status(500).json({ error: "Erro interno ao cancelar solicitação" });
  }
}

export async function createRideRequest(req: Request, res: Response) {
  try {
    const { userId, origin, destination } = req.body;

    if (!userId || !origin || !destination) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const request = await RideRequest.create({
      userId,
      origin,
      destination,
      status: "pending",
      createdAt: new Date(),
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return res.status(500).json({ error: "Erro interno ao criar solicitação" });
  }
}

export async function getLatestRideRequest(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const request = await RideRequest.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!request) {
      return res.status(404).json({ error: "Nenhuma solicitação encontrada" });
    }

    res.json(request);
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    res.status(500).json({ error: "Erro interno ao buscar solicitação" });
  }
}

export async function listPendingRequests(req: Request, res: Response) {
  try {
    const requests = await RideRequest.find({ status: "pending" })
      .populate("userId", "name email")
      .lean();

    res.json(requests);
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    res.status(500).json({ error: "Erro interno ao listar solicitações" });
  }
}
