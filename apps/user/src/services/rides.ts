import { api } from "./api";

export async function createRideRequest(data: {
  userId: string;
  origin: string;
  destination: string;
}) {
  const response = await api.post("/ride-requests", data);
  return response.data;
}

export async function getLatestRideRequest(userId: string) {
  const response = await api.get(`/ride-requests/user/${userId}`);
  return response.data;
}
