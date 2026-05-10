// src/controllers/userController.ts

import { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      status: "active", // ADMIN cria usuário já ativo
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email já registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      status: "pending",
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Retornar apenas dados seguros
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro interno ao fazer login" });
  }
}

export async function listUsers(req: Request, res: Response) {
  const users = await User.find().lean();
  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await User.findById(id).lean();
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}

export async function updateUserStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "active", "blocked"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after" },
  ).lean();

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id).lean();
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json({ message: "Usuário removido com sucesso" });
}
