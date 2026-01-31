import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-xs text-slate-500">
        <span>
          Mentneo Internal Assignment System
        </span>

        <span>
          Active Role:{" "}
          <strong className="text-slate-700">
            {user?.role}
          </strong>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
