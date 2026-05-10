import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRideRequest } from "../services/rides";

export default function RequestRide() {
  const navigate = useNavigate();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user")!);
      const userId = user.id ?? user._id;

      await createRideRequest({
        userId,
        origin,
        destination,
      });

      navigate("/status");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao solicitar corrida");
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Solicitar Corrida</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Origem</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Destino</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Solicitar
        </button>
      </form>
    </div>
  );
}
