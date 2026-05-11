// apps/driver/src/router/PrivateRoute.tsx

import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const driver = localStorage.getItem("driver");
  const token = localStorage.getItem("token");

  if (!driver || !token) return <Navigate to="/login" replace />;

  return children;
}
