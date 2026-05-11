// TUIUIUMOB/apps/admin/src/pages/Users/UsersPage.tsx

import { useCallback, useEffect, useState } from "react";
import { Layout } from "../../layout/Layout";
import {
  fetchUsers,
  createUser,
  updateUserStatus,
  deleteUser,
  type AdminUser,
} from "../../api/users";

export default function UsersPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await fetchUsers());
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao carregar usuários");
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
      await createUser(form);
      setModal(false);
      setForm({ name: "", email: "", password: "", role: "user" });
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao criar usuário");
    }
  }

  async function onStatus(id: string, status: AdminUser["status"]) {
    setError("");
    try {
      await updateUserStatus(id, status);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao atualizar status");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este usuário?")) return;
    setError("");
    try {
      await deleteUser(id);
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Erro ao remover");
    }
  }

  return (
    <Layout title="Usuários">
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
          Novo usuário
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Papel</th>
              <th className="px-4 py-3 font-medium w-56">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Nenhum usuário
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-slate-100 hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.status}
                      onChange={(e) =>
                        void onStatus(
                          u._id,
                          e.target.value as AdminUser["status"],
                        )
                      }
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                    >
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="blocked">blocked</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {u.role ?? "user"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void onDelete(u._id)}
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
              Criar usuário (admin)
            </h3>
            <form onSubmit={onCreate} className="space-y-3">
              <input
                required
                placeholder="Nome"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
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
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value as "user" | "admin",
                  }))
                }
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
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
