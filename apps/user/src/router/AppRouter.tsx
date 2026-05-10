// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import RequestRide from "../pages/RequestRide";
import RideStatus from "../pages/RideStatus";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Register from "../pages/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/request"
          element={
            <PrivateRoute>
              <RequestRide />
            </PrivateRoute>
          }
        />
        <Route
          path="/status"
          element={
            <PrivateRoute>
              <RideStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
