// apps/driver/src/services/auth.ts

import { api } from "./api";

export async function loginDriver(email: string, password: string) {
  const response = await api.post("/drivers/login", { email, password });
  return response.data;
}

export async function registerDriver(
  name: string,
  email: string,
  password: string,
  cnh: string,
) {
  const response = await api.post("/drivers/register", {
    name,
    email,
    password,
    cnh,
  });

  return response.data;
}
