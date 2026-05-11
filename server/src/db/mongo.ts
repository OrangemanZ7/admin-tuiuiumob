// src/db/mongo.ts

import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/tuiuiumob";

if (MONGO_URI === "mongodb://localhost:27017/tuiuiumob") {
  console.warn(
    "⚠️  Usando URI padrão do MongoDB. Considere definir a variável MONGO_URI no arquivo server/.env.",
  );
}

export async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB em 27017 (db: tuiuiumob)");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}
