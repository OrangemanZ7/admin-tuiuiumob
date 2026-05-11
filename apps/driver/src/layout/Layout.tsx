// TUIUIUMOB/apps/driver/src/layout/Layout.tsx

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Sidebar />
      </main>
    </div>
  );
};

export default Header;
