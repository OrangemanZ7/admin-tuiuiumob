// apps/user/src/pages/RideStatus.tsx

import { useEffect, useState } from "react";
import { getLatestRideRequest } from "../services/rides";

export default function RideStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchStatus() {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user")!);
      const userId = user.id ?? user._id;

      const request = await getLatestRideRequest(userId);

      setStatus(request.status);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus(); // Carrega apenas uma vez ao entrar na página
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Status da Corrida</h1>

      {loading && <p className="text-gray-500">Carregando...</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {status && (
        <p className="text-lg mb-4">
          Status atual: <span className="font-bold capitalize">{status}</span>
        </p>
      )}

      <button
        onClick={fetchStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Atualizar Status
      </button>
    </div>
  );
}
