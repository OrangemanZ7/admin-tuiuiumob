// TUIUIUMOB/apps/admin/src/api/vehicles.ts

import { api } from "./api";

export type AdminVehicle = {
  _id: string;
  driverId: string;
  vehicleMake: string;
  vehicleModel: string;
  plate: string;
  year: number;
  seats: number;
  color: string;
  createdAt?: string;
};

export async function fetchVehicles(): Promise<AdminVehicle[]> {
  const { data } = await api.get<AdminVehicle[]>("/vehicles");
  return data;
}

export async function fetchVehiclesByDriver(
  driverId: string,
): Promise<AdminVehicle[]> {
  const { data } = await api.get<AdminVehicle[]>(
    `/vehicles/driver/${driverId}`,
  );
  return data;
}

export async function createVehicle(payload: {
  driverId: string;
  vehicleMake: string;
  vehicleModel: string;
  plate: string;
  year: number;
  seats: number;
  color: string;
}): Promise<AdminVehicle> {
  const { data } = await api.post<AdminVehicle>("/vehicles/create", payload);
  return data;
}

export async function updateVehicle(
  id: string,
  body: Partial<
    Pick<
      AdminVehicle,
      "vehicleMake" | "vehicleModel" | "plate" | "year" | "seats" | "color"
    >
  >,
): Promise<AdminVehicle> {
  const { data } = await api.patch<AdminVehicle>(`/vehicles/${id}`, body);
  return data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}
