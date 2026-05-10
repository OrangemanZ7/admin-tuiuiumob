// driver/src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem("driver")!);
    setDriver(d);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Olá, {driver?.name}</h1>

      <div className="mt-6 space-y-4">
        <button
          onClick={() => navigate("/requests")}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Solicitações Pendentes
        </button>

        <button
          onClick={() => navigate("/ride")}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Corrida em Andamento
        </button>
      </div>
    </div>
  );
}
