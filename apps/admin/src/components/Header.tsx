// apps/admin/src/components/Header.tsx

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center px-6">
      <h2 className="text-xl font-semibold">{title}</h2>
    </header>
  );
}
