// TUIUIUMOB/apps/admin/src/layout/Layout.tsx

import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
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
