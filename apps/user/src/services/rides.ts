// TUIUIUMOB/apps/user/src/services/rides.ts

import { api } from "./api";

export async function createRideRequest(data: {
  origin: string;
  destination: string;
}) {
  const response = await api.post("/ride-requests", data);
  return response.data;
}

export async function getLatestRideRequestMe() {
  const response = await api.get("/ride-requests/me/latest");
  return response.data;
}
