
import { redirect } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export function authGuard(allowedRoles?: string[]) {
  const { accessToken, user, logout } = useAuthStore.getState();

  // 1) Not logged in
  if (!accessToken || !user) {
    logout();
    throw redirect("/login")
  }

  return true;
}
