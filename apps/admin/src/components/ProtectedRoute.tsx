import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
