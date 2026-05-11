// TUIUIUMOB/apps/admin/src/pages/Vehicles/VehiclesPage.tsx

import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import {
  fetchVehicles,
  createVehicle,
  deleteVehicle,
  type AdminVehicle,
} from "../../api/vehicles";
import { fetchDrivers, type AdminDriver } from "../../api/drivers";

export default function VehiclesPage() {
  const [rows, setRows] = useState<AdminVehicle[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    driverId: "",
    vehicleMake: "",
    vehicleModel: "",
    plate: "",
    year: new Date().getFullYear(),
    seats: 4,
    color: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [v, d] = await Promise.all([fetchVehicles(), fetchDrivers()]);
      setRows(v);
      setDrivers(d);
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function driverLabel(id: string) {
    const d = drivers.find((x) => x._id === id);
    return d ? `${d.name} (${d.email})` : id;
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createVehicle({
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
      });
      setModal(false);
      setForm({
        driverId: "",
        vehicleMake: "",
        vehicleModel: "",
        plate: "",
        year: new Date().getFullYear(),
        seats: 4,
        color: "",
      });
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao cadastrar veículo");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este veículo?")) return;
    setError("");
    try {
      await deleteVehicle(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao remover");
    }
  }

  return (
    <Layout title="Veículos">
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
          Novo veículo
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Placa</th>
              <th className="px-4 py-3 font-medium">Marca / modelo</th>
              <th className="px-4 py-3 font-medium">Ano</th>
              <th className="px-4 py-3 font-medium">Lugares</th>
              <th className="px-4 py-3 font-medium">Cor</th>
              <th className="px-4 py-3 font-medium">Motorista</th>
              <th className="px-4 py-3 font-medium w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum veículo
                </td>
              </tr>
            ) : (
              rows.map((v) => (
                <tr
                  key={v._id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 font-mono font-medium">{v.plate}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {v.vehicleMake} {v.vehicleModel}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{v.year}</td>
                  <td className="px-4 py-3 text-slate-600">{v.seats}</td>
                  <td className="px-4 py-3 text-slate-600">{v.color}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {driverLabel(String(v.driverId))}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void onDelete(v._id)}
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
              Cadastrar veículo
            </h3>
            <form onSubmit={onCreate} className="space-y-3">
              <select
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.driverId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, driverId: e.target.value }))
                }
              >
                <option value="">Motorista…</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.email}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Marca"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.vehicleMake}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vehicleMake: e.target.value }))
                }
              />
              <input
                required
                placeholder="Modelo"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.vehicleModel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vehicleModel: e.target.value }))
                }
              />
              <input
                required
                placeholder="Placa"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.plate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, plate: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="number"
                  placeholder="Ano"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.year}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: Number(e.target.value) }))
                  }
                />
                <input
                  required
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Lugares"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.seats}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seats: Number(e.target.value) }))
                  }
                />
              </div>
              <input
                required
                placeholder="Cor"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
              />
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
