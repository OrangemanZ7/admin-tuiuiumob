import { api } from "./api";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "blocked";
  role?: "user" | "admin";
  createdAt?: string;
};

export async function fetchUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/users");
  return data;
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}): Promise<unknown> {
  const { data } = await api.post("/users/create", payload);
  return data;
}

export async function updateUserStatus(
  id: string,
  status: AdminUser["status"],
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/users/${id}/status`, {
    status,
  });
  return data;
}

export async function updateUser(
  id: string,
  body: Partial<Pick<AdminUser, "name" | "email">>,
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/users/${id}`, body);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
