// TUIUIUMOB/apps/admin/src/components/Sidebar.tsx

import { NavLink } from "react-router-dom";

const linkClass =
  "block rounded px-3 py-2 transition hover:bg-gray-700 text-gray-200";

function navClass({ isActive }: { isActive: boolean }) {
  return [linkClass, isActive ? "bg-gray-800 text-white font-medium" : ""].join(
    " ",
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Painel Admin</h1>

      <nav className="flex flex-col gap-1">
        <NavLink to="/" end className={navClass}>
          Dashboard
        </NavLink>
        <NavLink to="/users" className={navClass}>
          Usuários
        </NavLink>
        <NavLink to="/drivers" className={navClass}>
          Motoristas
        </NavLink>
        <NavLink to="/vehicles" className={navClass}>
          Veículos
        </NavLink>
        <NavLink to="/rides" className={navClass}>
          Viagens
        </NavLink>
        <NavLink to="/requests" className={navClass}>
          Solicitações
        </NavLink>
      </nav>
    </aside>
  );
}
