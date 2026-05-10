import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ title, children }: any) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header title={title} />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
