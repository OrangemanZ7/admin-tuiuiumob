// TUIUIUMOB/apps/driver/src/pages/VehicleList.tsx

import { useEffect, useState } from "react";
import { getDriverVehicles } from "../services/vehicles";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const driver = JSON.parse(localStorage.getItem("driver")!);
  const driverId = driver.id ?? driver._id;

  async function load() {
    setLoading(true);
    const data = await getDriverVehicles(driverId);
    setVehicles(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="p-4">Carregando...</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meus Veículos</h1>

      {vehicles.length === 0 && (
        <p className="text-gray-600">Nenhum veículo cadastrado.</p>
      )}

      {vehicles.map((v: any) => (
        <div key={v._id} className="border p-4 rounded mb-3 shadow-sm">
          <p>
            <strong>Marca:</strong> {v.vehicleMake}
          </p>
          <p>
            <strong>Modelo:</strong> {v.vehicleModel}
          </p>
          <p>
            <strong>Placa:</strong> {v.plate}
          </p>
          <p>
            <strong>Cor:</strong> {v.color}
          </p>
          <p>
            <strong>Ano:</strong> {v.year}
          </p>
          <p>
            <strong>Assentos:</strong> {v.seats}
          </p>
        </div>
      ))}
    </div>
  );
}
