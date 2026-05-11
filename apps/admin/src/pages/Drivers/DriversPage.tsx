import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import {
  fetchDrivers,
  createDriver,
  verifyDriver,
  deleteDriver,
  type AdminDriver,
} from "../../api/drivers";

export default function DriversPage() {
  const [rows, setRows] = useState<AdminDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cnh: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await fetchDrivers());
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao carregar motoristas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createDriver(form);
      setModal(false);
      setForm({ name: "", email: "", password: "", cnh: "" });
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao criar motorista");
    }
  }

  async function onVerify(id: string) {
    setError("");
    try {
      await verifyDriver(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao verificar");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este motorista?")) return;
    setError("");
    try {
      await deleteDriver(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao remover");
    }
  }

  return (
    <Layout title="Motoristas">
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
          Novo motorista
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">CNH</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Verificado</th>
              <th className="px-4 py-3 font-medium">Veículos</th>
              <th className="px-4 py-3 font-medium w-48">Ações</th>
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
                  Nenhum motorista
                </td>
              </tr>
            ) : (
              rows.map((d) => (
                <tr key={d._id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{d.name}</td>
                  <td className="px-4 py-3 text-slate-600">{d.email}</td>
                  <td className="px-4 py-3 text-slate-600">{d.cnh}</td>
                  <td className="px-4 py-3 text-slate-600">{d.status}</td>
                  <td className="px-4 py-3">{d.verified ? "Sim" : "Não"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {Array.isArray(d.vehicles) ? d.vehicles.length : 0}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {!d.verified && (
                      <button
                        type="button"
                        onClick={() => void onVerify(d._id)}
                        className="text-sm font-medium text-emerald-700 hover:underline"
                      >
                        Verificar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void onDelete(d._id)}
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
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Cadastrar motorista
            </h3>
            <form onSubmit={onCreate} className="space-y-3">
              <input
                required
                placeholder="Nome"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <input
                required
                type="password"
                placeholder="Senha"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
              <input
                required
                placeholder="CNH"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.cnh}
                onChange={(e) => setForm((f) => ({ ...f, cnh: e.target.value }))}
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
