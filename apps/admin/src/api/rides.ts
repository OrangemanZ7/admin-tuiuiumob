// TUIUIUMOB/apps/admin/src/api/rides.ts

import { api } from "./api";

export type RideStatus = "open" | "closed" | "cancelled";

export type AdminRide = {
  _id: string;
  driverId: unknown;
  vehicleId: unknown;
  passengers: unknown[];
  originCity: string;
  destinationCity: string;
  destinationNeighborhood: string;
  departureTime: string;
  price: number;
  seatsAvailable: number;
  status: RideStatus;
  createdAt?: string;
};

export type CreateRidePayload = {
  driverId: string;
  vehicleId: string;
  originCity: string;
  destinationCity: string;
  destinationNeighborhood: string;
  departureTime: string;
  price: number;
  seatsAvailable: number;
};

export async function fetchRides(): Promise<AdminRide[]> {
  const { data } = await api.get<AdminRide[]>("/rides");
  return data;
}

export async function createRide(
  payload: CreateRidePayload,
): Promise<AdminRide> {
  const { data } = await api.post<AdminRide>("/rides", payload);
  return data;
}

export async function updateRide(
  id: string,
  body: Partial<
    Pick<
      AdminRide,
      | "originCity"
      | "destinationCity"
      | "destinationNeighborhood"
      | "departureTime"
      | "price"
      | "seatsAvailable"
      | "status"
    >
  >,
): Promise<AdminRide> {
  const { data } = await api.patch<AdminRide>(`/rides/${id}`, body);
  return data;
}

export async function closeRide(id: string): Promise<AdminRide> {
  const { data } = await api.patch<AdminRide>(`/rides/${id}/close`);
  return data;
}

export async function deleteRide(id: string): Promise<void> {
  await api.delete(`/rides/${id}`);
}
