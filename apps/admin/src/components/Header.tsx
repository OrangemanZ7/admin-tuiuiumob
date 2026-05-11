import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

function readUserName(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const u = JSON.parse(raw) as { name?: string; email?: string };
    return u.name || u.email || "";
  } catch {
    return "";
  }
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const displayName = readUserName();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        {displayName && <span className="hidden sm:inline">{displayName}</span>}
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
