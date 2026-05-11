// TUIUIUMOB/apps/admin/src/pages/Dashboard/index.tsx

import { useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import { fetchUsers } from "../../api/users";
import { fetchDrivers } from "../../api/drivers";
import { fetchRides } from "../../api/rides";
import { fetchPendingRequests } from "../../api/ridesRequests";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    drivers: 0,
    rides: 0,
    requests: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      setError("");
      try {
        const [users, drivers, rides, pending] = await Promise.all([
          fetchUsers(),
          fetchDrivers(),
          fetchRides(),
          fetchPendingRequests(),
        ]);
        setStats({
          users: users.filter((u) => u.status === "active").length,
          drivers: drivers.filter((d) => d.status === "active").length,
          rides: rides.filter((r) => r.status === "open").length,
          requests: pending.length,
        });
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { error?: string } } };
        setError(
          ax.response?.data?.error ?? "Não foi possível carregar métricas",
        );
      }
    })();
  }, []);

  const cards = [
    {
      label: "Usuários ativos",
      value: stats.users,
      tone: "bg-sky-50 border-sky-200",
    },
    {
      label: "Motoristas ativos",
      value: stats.drivers,
      tone: "bg-emerald-50 border-emerald-200",
    },
    {
      label: "Viagens abertas",
      value: stats.rides,
      tone: "bg-amber-50 border-amber-200",
    },
    {
      label: "Solicitações pendentes",
      value: stats.requests,
      tone: "bg-violet-50 border-violet-200",
    },
  ];

  return (
    <Layout title="Dashboard">
      {error && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border p-6 shadow-sm ${c.tone}`}
          >
            <p className="text-sm font-medium text-slate-600">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
