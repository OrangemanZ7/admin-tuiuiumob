// driver/src/pages/VehicleRegister.tsx

import { useState } from "react";
import { createVehicle } from "../services/vehicles";
import { useNavigate } from "react-router-dom";

export default function VehicleRegister() {
  const navigate = useNavigate();

  const driver = JSON.parse(localStorage.getItem("driver")!);
  const driverId = driver.id ?? driver._id;

  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("");
  const [seats, setSeats] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await createVehicle({
        driverId,
        vehicleMake,
        vehicleModel,
        plate,
        year: Number(year),
        seats: Number(seats),
        color,
      });

      navigate("/vehicles");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar veículo");
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Veículo</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Marca"
          className="w-full border px-3 py-2 rounded"
          value={vehicleMake}
          onChange={(e) => setVehicleMake(e.target.value)}
        />

        <input
          type="text"
          placeholder="Modelo"
          className="w-full border px-3 py-2 rounded"
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Placa"
          className="w-full border px-3 py-2 rounded"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Ano"
          className="w-full border px-3 py-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Número de assentos"
          className="w-full border px-3 py-2 rounded"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <input
          type="text"
          placeholder="Cor"
          className="w-full border px-3 py-2 rounded"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Cadastrar Veículo
        </button>
      </form>
    </div>
  );
}
