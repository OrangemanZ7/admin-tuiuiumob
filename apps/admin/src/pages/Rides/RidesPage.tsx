import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import {
  fetchRides,
  createRide,
  closeRide,
  deleteRide,
  updateRide,
  type AdminRide,
  type RideStatus,
} from "../../api/rides";
import { fetchDrivers, type AdminDriver } from "../../api/drivers";
import { fetchVehiclesByDriver, type AdminVehicle } from "../../api/vehicles";
import { labelRef } from "../../utils/entityLabel";

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function RidesPage() {
  const [rows, setRows] = useState<AdminRide[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    driverId: "",
    vehicleId: "",
    originCity: "",
    destinationCity: "",
    destinationNeighborhood: "",
    departureTime: "",
    price: 0,
    seatsAvailable: 4,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [r, d] = await Promise.all([fetchRides(), fetchDrivers()]);
      setRows(r);
      setDrivers(d);
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao carregar viagens");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!form.driverId) {
      setVehicles([]);
      setForm((f) => ({ ...f, vehicleId: "" }));
      return;
    }
    void (async () => {
      try {
        const v = await fetchVehiclesByDriver(form.driverId);
        setVehicles(v);
        setForm((f) => ({
          ...f,
          vehicleId: v.some((x) => x._id === f.vehicleId) ? f.vehicleId : "",
        }));
      } catch {
        setVehicles([]);
      }
    })();
  }, [form.driverId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createRide({
        ...form,
        price: Number(form.price),
        seatsAvailable: Number(form.seatsAvailable),
        departureTime: new Date(form.departureTime).toISOString(),
      });
      setModal(false);
      setForm({
        driverId: "",
        vehicleId: "",
        originCity: "",
        destinationCity: "",
        destinationNeighborhood: "",
        departureTime: "",
        price: 0,
        seatsAvailable: 4,
      });
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao criar viagem");
    }
  }

  async function onClose(id: string) {
    setError("");
    try {
      await closeRide(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao encerrar");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir esta viagem?")) return;
    setError("");
    try {
      await deleteRide(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao excluir");
    }
  }

  async function onStatusChange(id: string, status: RideStatus) {
    setError("");
    try {
      await updateRide(id, { status });
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao atualizar status");
    }
  }

  return (
    <Layout title="Viagens">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setModal(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Nova viagem
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Origem → Destino</th>
              <th className="px-4 py-3 font-medium">Saída</th>
              <th className="px-4 py-3 font-medium">Motorista</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Vagas</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-56">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Nenhuma viagem
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-800">
                    <div className="font-medium">
                      {r.originCity} → {r.destinationCity}
                    </div>
                    <div className="text-xs text-slate-500">
                      {r.destinationNeighborhood}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(r.departureTime)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {labelRef(r.driverId)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">R$ {r.price}</td>
                  <td className="px-4 py-3 text-slate-600">{r.seatsAvailable}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        void onStatusChange(r._id, e.target.value as RideStatus)
                      }
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                    >
                      <option value="open">open</option>
                      <option value="closed">closed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    {r.status === "open" && (
                      <button
                        type="button"
                        onClick={() => void onClose(r._id)}
                        className="text-sm font-medium text-amber-800 hover:underline"
                      >
                        Encerrar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void onDelete(r._id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Nova viagem (admin)
            </h3>
            <form onSubmit={onCreate} className="space-y-3">
              <select
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.driverId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, driverId: e.target.value, vehicleId: "" }))
                }
              >
                <option value="">Motorista…</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.email}
                  </option>
                ))}
              </select>
              <select
                required
                disabled={!form.driverId || vehicles.length === 0}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                value={form.vehicleId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vehicleId: e.target.value }))
                }
              >
                <option value="">Veículo…</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.plate} — {v.vehicleMake} {v.vehicleModel}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Cidade origem"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.originCity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, originCity: e.target.value }))
                }
              />
              <input
                required
                placeholder="Cidade destino"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.destinationCity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destinationCity: e.target.value }))
                }
              />
              <input
                required
                placeholder="Bairro / referência destino"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.destinationNeighborhood}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    destinationNeighborhood: e.target.value,
                  }))
                }
              />
              <input
                required
                type="datetime-local"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.departureTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, departureTime: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Preço"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: Number(e.target.value) }))
                  }
                />
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="Vagas"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.seatsAvailable}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      seatsAvailable: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
