export type UserRole = "user" | "admin";

export type AuthPayload = {
  sub: string;
  type: "user" | "driver";
  role?: UserRole;
};
