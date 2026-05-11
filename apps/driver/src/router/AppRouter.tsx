// TUIUIUMOB/apps/driver/src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import DriverRegister from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import RideRequests from "../pages/RideRequests";
import VehicleRegister from "../pages/VehicleRegister";
import VehicleList from "../pages/VehicleList";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<DriverRegister />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <RideRequests />
            </PrivateRoute>
          }
        />

        <Route
          path="/vehicle/register"
          element={
            <PrivateRoute>
              <VehicleRegister />
            </PrivateRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <VehicleList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
