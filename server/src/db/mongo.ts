import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/tuiuiumob";

export async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB em 27017 (db: tuiuiumob)");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}
