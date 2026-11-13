import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export function RequireAdmin() {
  const { user } = useAuth();
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
