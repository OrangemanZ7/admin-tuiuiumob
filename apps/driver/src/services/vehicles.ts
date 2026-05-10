// driver/src/services/vehicles.ts

import { api } from "./api";

export async function createVehicle(data: {
  driverId: any;
  vehicleMake: string;
  vehicleModel: string;
  plate: string;
  year: number;
  seats: number;
  color: string;
}) {
  const response = await api.post("/vehicles/create", data);
  return response.data;
}

export async function getDriverVehicles(driverId: string) {
  const response = await api.get(`/vehicles/driver/${driverId}`);
  return response.data;
}
