// TUIUIUMOB/server/src/controllers/rideRequestController.ts

import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Ride } from "../models/Ride.js";
import { User } from "../models/User.js";
import RideRequest from "../models/RideRequest.js";
import { isAdmin } from "../middleware/auth.js";

async function loadRideForRequest(request: {
  rideId?: mongoose.Types.ObjectId | null;
}) {
  if (!request.rideId) return null;
  return Ride.findById(request.rideId).lean();
}

function requestUserIdString(
  userId: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId } | unknown,
): string {
  if (userId && typeof userId === "object" && "_id" in (userId as object)) {
    return String((userId as { _id: mongoose.Types.ObjectId })._id);
  }
  return String(userId);
}

export async function requestSeat(req: Request, res: Response) {
  try {
    const { rideId } = req.params;

    if (req.auth?.type !== "user") {
      return res.status(403).json({ error: "Apenas passageiros autenticados" });
    }

    const userId = req.auth.sub;

    if (
      !mongoose.isValidObjectId(rideId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({ error: "IDs inválidos" });
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
      return res.status(400).json({ error: "Sem vagas disponíveis" });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

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
    if (!request) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Solicitação não está pendente" });
    }

    const ride = await Ride.findById(request.rideId);
    if (!ride) {
      return res.status(404).json({ error: "Viagem não encontrada" });
    }

    const driverOwns =
      req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
    if (!driverOwns && !isAdmin(req.auth)) {
      return res
        .status(403)
        .json({
          error: "Somente o motorista da viagem pode aceitar solicitações",
        });
    }

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
    if (!request) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    const ride = await loadRideForRequest(request);
    if (!ride) {
      if (!isAdmin(req.auth)) {
        return res.status(403).json({ error: "Sem permissão" });
      }
    } else {
      const driverOwns =
        req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
      if (!driverOwns && !isAdmin(req.auth)) {
        return res.status(403).json({
          error: "Somente o motorista da viagem pode rejeitar solicitações",
        });
      }
    }

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
    if (!request) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Só é possível cancelar solicitações pendentes" });
    }

    const ownerId = String(request.userId);
    if (req.auth?.type !== "user" || req.auth.sub !== ownerId) {
      return res
        .status(403)
        .json({ error: "Somente o passageiro solicitante pode cancelar" });
    }

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
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const userId = req.auth?.sub;
    if (req.auth?.type !== "user" || !userId) {
      return res
        .status(403)
        .json({ error: "Autenticação de passageiro necessária" });
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

export async function getLatestRideRequestMe(req: Request, res: Response) {
  try {
    const userId = req.auth?.sub;
    if (req.auth?.type !== "user" || !userId) {
      return res.status(403).json({ error: "Apenas passageiros" });
    }

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

export async function getLatestRideRequestByUserId(
  req: Request,
  res: Response,
) {
  try {
    const { userId } = req.params;

    if (
      !isAdmin(req.auth) &&
      !(req.auth?.type === "user" && req.auth.sub === userId)
    ) {
      return res.status(403).json({ error: "Sem permissão" });
    }

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
    if (!req.auth) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (isAdmin(req.auth)) {
      const { rideId } = req.query;
      const filter: Record<string, unknown> = { status: "pending" };
      if (rideId) {
        filter.rideId = rideId;
      }
      const requests = await RideRequest.find(filter)
        .populate("userId", "name email")
        .populate("rideId")
        .lean();
      return res.json(requests);
    }

    if (req.auth.type === "driver") {
      const rides = await Ride.find({ driverId: req.auth.sub })
        .select("_id")
        .lean();
      const rideIds = rides.map((r) => r._id);
      const { rideId } = req.query;
      const filter: Record<string, unknown> = {
        status: "pending",
        rideId: { $in: rideIds },
      };
      if (rideId) {
        if (!rideIds.some((id) => String(id) === rideId)) {
          return res
            .status(403)
            .json({ error: "Viagem não pertence a este motorista" });
        }
        filter.rideId = rideId;
      }
      const requests = await RideRequest.find(filter)
        .populate("userId", "name email")
        .populate("rideId")
        .lean();
      return res.json(requests);
    }

    return res.status(403).json({ error: "Sem permissão" });
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    res.status(500).json({ error: "Erro interno ao listar solicitações" });
  }
}

/** GET /ride-requests?rideId=…&status=… — motorista dono da viagem ou admin */
export async function listRideRequestsByRideQuery(req: Request, res: Response) {
  try {
    const rideId = req.query.rideId as string | undefined;
    if (!rideId || !mongoose.isValidObjectId(rideId)) {
      return res
        .status(400)
        .json({ error: "Query rideId inválida ou ausente" });
    }

    const ride = await Ride.findById(rideId).lean();
    if (!ride) {
      return res.status(404).json({ error: "Viagem não encontrada" });
    }

    const driverOwns =
      req.auth?.type === "driver" && String(ride.driverId) === req.auth.sub;
    if (!driverOwns && !isAdmin(req.auth)) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    const filter: Record<string, unknown> = { rideId };
    const status = req.query.status as string | undefined;
    if (status) {
      filter.status = status;
    }

    const requests = await RideRequest.find(filter)
      .populate("userId", "name email")
      .populate("rideId")
      .lean();

    res.json(requests);
  } catch (error) {
    console.error("Erro ao listar solicitações da viagem:", error);
    res.status(500).json({ error: "Erro interno ao listar solicitações" });
  }
}

export async function getRideRequestById(req: Request, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await RideRequest.findById(requestId)
      .populate("userId", "-passwordHash")
      .populate("rideId")
      .lean();

    if (!request) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    const uid = requestUserIdString(request.userId);
    const ride = request.rideId as {
      driverId?: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId };
    } | null;

    const driverIdRaw = ride?.driverId;
    const driverIdStr =
      driverIdRaw && typeof driverIdRaw === "object" && "_id" in driverIdRaw
        ? String((driverIdRaw as { _id: mongoose.Types.ObjectId })._id)
        : String(driverIdRaw ?? "");

    const userOwns = req.auth?.type === "user" && req.auth.sub === uid;
    const driverOwns =
      !!ride && req.auth?.type === "driver" && driverIdStr === req.auth.sub;

    if (!isAdmin(req.auth) && !userOwns && !driverOwns) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    res.json(request);
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    res.status(500).json({ error: "Erro interno ao buscar solicitação" });
  }
}
