import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/hooks/useAuth.ts";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
