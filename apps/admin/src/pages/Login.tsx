// TUIUIUMOB/apps/admin/src/pages/Login.tsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        token?: string;
        user?: { role?: string; Role?: string };
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Falha no login");
        return;
      }

      const role = data.user?.role ?? data.user?.Role;
      if (role !== "admin") {
        setError("Apenas administradores podem acessar este painel.");
        return;
      }

      if (!data.token) {
        setError("Resposta inválida do servidor.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(from === "/login" ? "/" : from, { replace: true });
    } catch {
      setError("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Painel administrativo
        </h1>
        <p className="text-sm text-slate-500 mb-6">Entre com uma conta admin</p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-2.5 font-medium text-white hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
