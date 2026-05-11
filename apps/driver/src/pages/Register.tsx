// TUIUIUMOB/apps/driver/src/pages/Register.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDriver } from "../services/auth";

export default function DriverRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnh, setCnh] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await registerDriver(name, email, password, cnh);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao registrar motorista");
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Motorista</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="CNH"
          className="w-full border px-3 py-2 rounded"
          value={cnh}
          onChange={(e) => setCnh(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
