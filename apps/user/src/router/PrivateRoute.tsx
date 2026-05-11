// apps/user/src/router/PrivateRoute.tsx

import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
}
