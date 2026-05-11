// src/controllers/userController.ts

import type { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { signUserToken } from "../auth/jwt.js";
import type { UserRole } from "../models/User.js";
import { isAdmin } from "../middleware/auth.js";
import { pickAllowedKeys, stripPassword } from "../utils/sanitize.js";

const USER_PATCH_FIELDS = ["name", "email"] as const;
const USER_STATUS_VALUES = ["pending", "active", "blocked"] as const;

function resolveUserRole(role: unknown): UserRole {
  return role === "admin" ? "admin" : "user";
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, role: roleBody } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = roleBody === "admin" ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      passwordHash,
      status: "active",
      role,
    });

    res.status(201).json(stripPassword(user.toObject()));
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
      role: "user",
    });

    const plain = user.toObject();
    res.status(201).json(stripPassword(plain));
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

    const role = resolveUserRole(user.role);
    const token = signUserToken(String(user._id), role);

    return res.json({
      token,
      user: stripPassword(user),
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro interno ao fazer login" });
  }
}

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().select("-passwordHash").lean();
  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const auth = req.auth;

  if (!isAdmin(auth) && !(auth?.type === "user" && auth.sub === id)) {
    return res.status(403).json({ error: "Sem permissão para ver este usuário" });
  }

  const user = await User.findById(id).select("-passwordHash").lean();
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const auth = req.auth;

  if (!isAdmin(auth) && !(auth?.type === "user" && auth.sub === id)) {
    return res.status(403).json({ error: "Sem permissão para atualizar este usuário" });
  }

  const updates = pickAllowedKeys(req.body as Record<string, unknown>, [
    ...USER_PATCH_FIELDS,
  ]);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nenhum campo permitido para atualização" });
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    select: "-passwordHash",
  }).lean();

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(user);
}

export async function updateUserStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  if (!USER_STATUS_VALUES.includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", select: "-passwordHash" },
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
