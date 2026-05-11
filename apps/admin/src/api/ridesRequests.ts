import { api } from "./api";

export type RideRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "canceled";

export type AdminRideRequest = {
  _id: string;
  userId?: unknown;
  rideId?: unknown;
  origin?: string;
  destination?: string;
  status: RideRequestStatus;
  createdAt?: string;
};

export async function fetchPendingRequests(
  rideId?: string,
): Promise<AdminRideRequest[]> {
  const { data } = await api.get<AdminRideRequest[]>("/ride-requests/pending", {
    params: rideId ? { rideId } : {},
  });
  return data;
}

export async function fetchRequestsByRide(
  rideId: string,
  status?: string,
): Promise<AdminRideRequest[]> {
  const { data } = await api.get<AdminRideRequest[]>("/ride-requests", {
    params: { rideId, ...(status ? { status } : {}) },
  });
  return data;
}

export async function fetchRideRequest(
  requestId: string,
): Promise<AdminRideRequest> {
  const { data } = await api.get<AdminRideRequest>(
    `/ride-requests/${requestId}`,
  );
  return data;
}

export async function acceptRequest(requestId: string): Promise<unknown> {
  const { data } = await api.patch(`/ride-requests/${requestId}/accept`);
  return data;
}

export async function rejectRequest(requestId: string): Promise<unknown> {
  const { data } = await api.patch(`/ride-requests/${requestId}/reject`);
  return data;
}
