// TUIUIUMOB/apps/admin/src/pages/Requests/RequestsPage.tsx

import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import {
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
  type AdminRideRequest,
} from "../../api/ridesRequests";
import { labelRef } from "../../utils/entityLabel";

function rideSummary(ride: unknown): string {
  if (ride && typeof ride === "object") {
    const o = ride as Record<string, unknown>;
    if (
      typeof o.originCity === "string" &&
      typeof o.destinationCity === "string"
    ) {
      return `${o.originCity} → ${o.destinationCity}`;
    }
  }
  return "—";
}

function hasRideId(req: AdminRideRequest): boolean {
  return Boolean(req.rideId);
}

export default function RequestsPage() {
  const [rows, setRows] = useState<AdminRideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await fetchPendingRequests());
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onAccept(id: string) {
    setError("");
    try {
      await acceptRequest(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao aceitar");
    }
  }

  async function onReject(id: string) {
    if (!confirm("Rejeitar esta solicitação?")) return;
    setError("");
    try {
      await rejectRequest(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao rejeitar");
    }
  }

  return (
    <Layout title="Solicitações pendentes">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <p className="mb-4 text-sm text-slate-600">
        Inclui pedidos de carona (origem/destino) e solicitações de vaga em
        viagens. Aceitar vaga só aplica quando há viagem vinculada.
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Passageiro</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Origem / destino</th>
              <th className="px-4 py-3 font-medium">Viagem</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-44">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhuma solicitação pendente
                </td>
              </tr>
            ) : (
              rows.map((req) => {
                const u = req.userId;
                const email =
                  u && typeof u === "object" && "email" in u
                    ? String((u as { email?: string }).email ?? "")
                    : "";
                const seat = hasRideId(req);
                return (
                  <tr
                    key={req._id}
                    className="border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {labelRef(u)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{email || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {req.origin && req.destination ? (
                        <>
                          {req.origin} → {req.destination}
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {seat ? (
                        <span className="text-xs">
                          {rideSummary(req.rideId)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sem viagem</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{req.status}</td>
                    <td className="px-4 py-3 space-x-2">
                      {seat && req.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => void onAccept(req._id)}
                          className="text-sm font-medium text-emerald-700 hover:underline"
                        >
                          Aceitar
                        </button>
                      )}
                      {req.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => void onReject(req._id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Rejeitar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
