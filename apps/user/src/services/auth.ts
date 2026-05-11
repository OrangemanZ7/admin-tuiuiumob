// apps/user/src/services/auth.ts

import { api } from "./api";

export async function loginUser(email: string, password: string) {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  return response.data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const response = await api.post("/users/register", {
    name,
    email,
    password,
  });

  return response.data;
}
