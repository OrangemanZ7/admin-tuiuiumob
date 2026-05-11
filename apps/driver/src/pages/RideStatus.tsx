// apps/driver/src/pages/RideStatus.tsx

import { useEffect, useState } from "react";
import { getMyRides } from "../services/rides";

export default function RideStatus() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchStatus() {
    try {
      setLoading(true);
      setError("");

      const rides: Array<{
        status: string;
        originCity?: string;
        destinationCity?: string;
      }> = await getMyRides();

      const open = rides.find((r) => r.status === "open");
      if (open) {
        setSummary(
          `Viagem aberta: ${open.originCity ?? "?"} → ${open.destinationCity ?? "?"}`,
        );
      } else if (rides.length === 0) {
        setSummary("Nenhuma viagem cadastrada.");
      } else {
        setSummary(`Última situação: ${rides[0]?.status ?? "—"}`);
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error || "Erro ao buscar status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Status da Corrida</h1>

      {loading && <p className="text-gray-500">Carregando...</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {summary && (
        <p className="text-lg mb-4">
          <span className="font-medium">{summary}</span>
        </p>
      )}

      <button
        type="button"
        onClick={fetchStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Atualizar Status
      </button>
    </div>
  );
}
