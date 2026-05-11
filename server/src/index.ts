// TUIUIUMOB/server/src/index.ts

import express from "express";
import cors from "cors";
import { connectMongo } from "./db/mongo.js";

import usersRouter from "./routes/users.js";
import driversRouter from "./routes/drivers.js";
import vehiclesRouter from "./routes/vehicles.js";
import ridesRouter from "./routes/rides.js";
import rideRequestsRouter from "./routes/rideRequest.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/drivers", driversRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/rides", ridesRouter);
app.use("/ride-requests", rideRequestsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API rodando" });
});

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

start();
