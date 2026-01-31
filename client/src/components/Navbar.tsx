import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ✅ FIX: normalize role
  const role = user?.role?.toUpperCase();
  const isMentor = role === "MENTOR";

  const pageTitle = (() => {
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("create")) return "Create Assignment";
    if (location.pathname.includes("submissions")) return "Submissions";
    if (location.pathname.includes("review")) return "Review Submission";
    if (location.pathname.includes("submit")) return "Submit Assignment";
    return "";
  })();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="h-14 px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div
            onClick={() =>
              navigate(
                isMentor ? "/mentor/dashboard" : "/student/dashboard"
              )
            }
            className="font-extrabold text-slate-800 text-lg cursor-pointer"
          >
            Mentneo<span className="text-yellow-500">.</span>
          </div>

          <span className="text-slate-400">/</span>

          <span className="text-sm font-medium text-slate-600">
            {pageTitle}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                isMentor
                  ? "bg-purple-100 text-purple-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {isMentor ? "Mentor Mode" : "Student Mode"}
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm font-medium text-slate-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
