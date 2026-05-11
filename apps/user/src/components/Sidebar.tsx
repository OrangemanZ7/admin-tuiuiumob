// TUIUIUMOB/apps/user/src/components/Sidebar.jsx

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
