// src/controllers/driverController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Driver } from "../models/Driver.js";

export async function createDriver(req: Request, res: Response) {
  try {
    const { name, email, password, cnh } = req.body;

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
      vehicles: [], // ← agora sempre começa vazio
      status: "pending",
      verified: false,
    });

    res.status(201).json(driver);
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
      vehicles: [], // ← sempre começa vazio
      status: "pending",
    });

    res.status(201).json({
      id: driver._id,
      name: driver.name,
      email: driver.email,
      status: driver.status,
    });
  } catch (error) {
    console.error("Erro ao registrar motorista:", error);
    res.status(500).json({ error: "Erro interno ao registrar motorista" });
  }
}

export async function loginDriver(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const match = await bcrypt.compare(password, driver.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    // opcional: bloquear motorista não verificado
    if (driver.status !== "active") {
      return res.status(403).json({ error: "Motorista ainda não aprovado" });
    }

    return res.json({
      id: driver._id,
      name: driver.name,
      email: driver.email,
      status: driver.status,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno ao fazer login" });
  }
}

export async function listDrivers(req: Request, res: Response) {
  const drivers = await Driver.find().lean();
  res.json(drivers);
}

export async function getDriverById(req: Request, res: Response) {
  const { id } = req.params;

  const driver = await Driver.findById(id)
    .populate("vehicles") // ← agora popula os veículos
    .lean();

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  res.json(driver);
}

export async function updateDriver(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  const driver = await Driver.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
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
    { returnDocument: "after" },
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
