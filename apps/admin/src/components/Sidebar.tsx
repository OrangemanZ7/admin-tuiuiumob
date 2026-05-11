// apps/admin/src/components/Sidebar.tsx

import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Painel Admin</h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Usuários
        </NavLink>

        <NavLink
          to="/drivers"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Motoristas
        </NavLink>

        <NavLink
          to="/vehicles"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Veículos
        </NavLink>

        <NavLink
          to="/rides"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Viagens
        </NavLink>

        <NavLink
          to="/requests"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Solicitações
        </NavLink>
      </nav>
    </aside>
  );
}
