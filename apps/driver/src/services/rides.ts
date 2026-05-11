// apps/driver/src/services/rides.ts

import { api } from "./api";

export async function getPendingRequests() {
  const response = await api.get("/ride-requests/pending");
  return response.data;
}

export async function acceptRequest(requestId: string) {
  const response = await api.patch(`/ride-requests/${requestId}/accept`);
  return response.data;
}

export async function getMyRides() {
  const response = await api.get("/rides/mine");
  return response.data;
}
