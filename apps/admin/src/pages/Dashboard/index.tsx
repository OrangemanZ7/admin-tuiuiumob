import { Layout } from "../../components/Layout";

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow p-6 rounded">Usuários ativos</div>
        <div className="bg-white shadow p-6 rounded">Motoristas ativos</div>
        <div className="bg-white shadow p-6 rounded">Viagens abertas</div>
        <div className="bg-white shadow p-6 rounded">
          Solicitações pendentes
        </div>
      </div>
    </Layout>
  );
}
