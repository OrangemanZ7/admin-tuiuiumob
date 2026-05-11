// TUIUIUMOB/apps/driver/src/pages/RideRequests.tsx

import { useEffect, useState } from "react";
import { getPendingRequests, acceptRequest } from "../services/rides";

export default function RideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getPendingRequests();
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAccept(id: string) {
    await acceptRequest(id);
    load(); // recarrega lista
  }

  if (loading) return <p className="p-4">Carregando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Solicitações Pendentes</h1>

      {requests.length === 0 && <p>Nenhuma solicitação no momento.</p>}

      {requests.map((req: any) => (
        <div key={req._id} className="border p-3 rounded mb-3">
          <p>
            <strong>Passageiro:</strong> {req.userId?.name}
          </p>
          <p>
            <strong>Origem:</strong> {req.origin}
          </p>
          <p>
            <strong>Destino:</strong> {req.destination}
          </p>

          <button
            onClick={() => handleAccept(req._id)}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Aceitar Corrida
          </button>
        </div>
      ))}
    </div>
  );
}
