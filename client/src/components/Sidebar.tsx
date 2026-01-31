import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  role: "MENTOR" | "STUDENT";
}

const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-yellow-500">
          Mentneo
        </h1>
        <p className="text-xs text-slate-500">
          Assignment System
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {role === "MENTOR" ? (
          <>
            <NavItem to="/mentor" label="Dashboard" />
            <NavItem to="/mentor/create" label="Create Assignment" />
          </>
        ) : (
          <>
            <NavItem to="/student" label="Dashboard" />
          </>
        )}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


const NavItem = ({
  to,
  label,
}: {
  to: string;
  label: string;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg font-medium transition ${
          isActive
            ? "bg-yellow-500 text-white"
            : "text-slate-600 hover:bg-yellow-50 hover:text-yellow-600"
        }`
      }
    >
      {label}
    </NavLink>
  );
};
