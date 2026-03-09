import { api } from "@/api/axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../../types/auth.types.ts";

export async function loginUser(payload: LoginPayload) {
  const res = await api.post<AuthResponse>("/auth/local", payload);
  return res.data;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await api.post<AuthResponse>("/auth/local/register", payload);
  return res.data;
}
