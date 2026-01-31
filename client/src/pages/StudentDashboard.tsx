import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assignmentApi } from "../api/assignment.api";
import toast from "react-hot-toast";


interface Assignment {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "Submitted" | "Reviewed";
  deadline?: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const toastId = toast.loading("Loading assignments...");

      try {
        const res = await assignmentApi.getStudentAssignments();
        setAssignments(res?.data || []);
        toast.success("Assignments loaded!", { id: toastId });
      } catch (err) {
        console.error("Student dashboard fetch error:", err);
        setAssignments([]);
         toast.error("Failed to load assignments", { id: toastId });
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const total = assignments.length;
  const submitted = assignments.filter((a) => a.status === "Submitted").length;
  const reviewed = assignments.filter((a) => a.status === "Reviewed").length;

  if (loading) return <div className="p-6 text-slate-500">Loading dashboard...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
        <p className="text-slate-500">View and submit your assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Assignments" value={total} />
        <StatCard title="Submitted" value={submitted} />
        <StatCard title="Reviewed" value={reviewed} highlight />
      </div>

      <h2 className="text-lg font-semibold mb-4 text-slate-700">Your Assignments</h2>

      {assignments.length === 0 ? (
        <p className="text-slate-500">No assignments assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">{a.title}</h3>
                <StatusBadge status={a.status} />
              </div>

              <p className="text-sm text-slate-500 mb-4">{a.description}</p>

              {a.deadline && (
                <p className="text-xs text-slate-400 mb-3">Deadline: {new Date(a.deadline).toDateString()}</p>
              )}

              <button
                disabled={a.status !== "Pending"}
                onClick={() => navigate(`/student/submit/${a.id}`)}
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  a.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {a.status === "Pending" ? "Submit Assignment" : "Already Submitted"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

const StatCard = ({ title, value, highlight }: { title: string; value: number; highlight?: boolean }) => (
  <div className={`rounded-xl p-5 bg-white shadow-sm border ${highlight ? "border-yellow-500" : "border-slate-100"}`}>
    <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
    <p className="text-slate-500">{title}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Submitted: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-green-100 text-green-700",
  };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[status] || ""}`}>{status}</span>;
};
