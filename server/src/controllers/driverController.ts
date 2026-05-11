// TUIUIUMOB/server/src/controllers/driverController.ts

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Driver } from "../models/Driver.js";
import { signDriverToken } from "../auth/jwt.js";
import { isAdmin } from "../middleware/auth.js";
import { pickAllowedKeys, stripPassword } from "../utils/sanitize.js";

const DRIVER_SELF_PATCH = ["name", "email", "cnh"] as const;
const DRIVER_ADMIN_PATCH = [
  "name",
  "email",
  "cnh",
  "status",
  "verified",
] as const;

export async function createDriver(req: Request, res: Response) {
  try {
    const { name, email, password, cnh } = req.body;

    if (!name || !email || !password || !cnh) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const exists = await Driver.findOne({ email }).lean();
    if (exists) {
      return res
        .status(400)
        .json({ error: "Email de motorista já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      passwordHash,
      cnh,
      vehicles: [],
      status: "pending",
      verified: false,
    });

    res.status(201).json(stripPassword(driver.toObject()));
  } catch (error) {
    console.error("Erro ao criar motorista:", error);
    res.status(500).json({ error: "Erro interno ao criar motorista" });
  }
}

export async function registerDriver(req: Request, res: Response) {
  try {
    const { name, email, password, cnh } = req.body;

    if (!name || !email || !password || !cnh) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const exists = await Driver.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email já registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      passwordHash,
      cnh,
      vehicles: [],
      status: "pending",
      verified: false,
    });

    res.status(201).json(stripPassword(driver.toObject()));
  } catch (error) {
    console.error("Erro ao registrar motorista:", error);
    res.status(500).json({ error: "Erro interno ao registrar motorista" });
  }
}

export async function loginDriver(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email }).lean();
    if (!driver) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const match = await bcrypt.compare(password, driver.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    if (driver.status !== "active") {
      return res.status(403).json({ error: "Motorista ainda não aprovado" });
    }

    const token = signDriverToken(String(driver._id));

    return res.json({
      token,
      driver: stripPassword(driver),
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno ao fazer login" });
  }
}

export async function listDrivers(_req: Request, res: Response) {
  const drivers = await Driver.find().select("-passwordHash").lean();
  res.json(drivers);
}

export async function getDriverById(req: Request, res: Response) {
  const { id } = req.params;
  const auth = req.auth;

  const allowed = isAdmin(auth) || (auth?.type === "driver" && auth.sub === id);
  if (!allowed) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  const driver = await Driver.findById(id)
    .select("-passwordHash")
    .populate("vehicles")
    .lean();

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver);
}

export async function updateDriver(req: Request, res: Response) {
  const { id } = req.params;
  const auth = req.auth;

  const isSelf = auth?.type === "driver" && auth.sub === id;
  if (!isSelf && !isAdmin(auth)) {
    return res.status(403).json({ error: "Sem permissão" });
  }

  const allowedKeys = isAdmin(auth) ? DRIVER_ADMIN_PATCH : DRIVER_SELF_PATCH;
  const updates = pickAllowedKeys(req.body as Record<string, unknown>, [
    ...allowedKeys,
  ]);

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ error: "Nenhum campo permitido para atualização" });
  }

  const driver = await Driver.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    select: "-passwordHash",
  }).lean();

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver);
}

export async function verifyDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = await Driver.findByIdAndUpdate(
    id,
    { verified: true, status: "active" },
    { returnDocument: "after", select: "-passwordHash" },
  ).lean();

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver);
}

export async function deleteDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = await Driver.findByIdAndDelete(id).lean();
  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json({ message: "Motorista removido com sucesso" });
}
