import { api } from "./api";

export type AdminDriver = {
  _id: string;
  name: string;
  email: string;
  cnh: string;
  status: "pending" | "active" | "blocked";
  verified: boolean;
  vehicles?: unknown[];
  createdAt?: string;
};

export async function fetchDrivers(): Promise<AdminDriver[]> {
  const { data } = await api.get<AdminDriver[]>("/drivers");
  return data;
}

export async function createDriver(payload: {
  name: string;
  email: string;
  password: string;
  cnh: string;
}): Promise<unknown> {
  const { data } = await api.post("/drivers/create", payload);
  return data;
}

export async function updateDriver(
  id: string,
  body: Partial<
    Pick<AdminDriver, "name" | "email" | "cnh" | "status" | "verified">
  >,
): Promise<AdminDriver> {
  const { data } = await api.patch<AdminDriver>(`/drivers/${id}`, body);
  return data;
}

export async function verifyDriver(id: string): Promise<AdminDriver> {
  const { data } = await api.patch<AdminDriver>(`/drivers/${id}/verify`);
  return data;
}

export async function deleteDriver(id: string): Promise<void> {
  await api.delete(`/drivers/${id}`);
}
