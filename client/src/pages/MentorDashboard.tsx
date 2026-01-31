import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { assignmentApi } from "../api/assignment.api";
import { submissionApi } from "../api/submission.api";
import toast from "react-hot-toast";


interface Assignment {
  id: string;
  title: string;
  description: string;
}

interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  status: "Pending" | "Submitted" | "Reviewed";
}

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const toastId = toast.loading("Loading dashboard...");
      try {
        const assignmentRes = await assignmentApi.getAll();
        const submissionRes = await submissionApi.getAll();

        const assignments: Assignment[] = (assignmentRes?.data || []).map((a: any) => ({
          id: a._id,
          title: a.title,
          description: a.description,
        }));

        const submissions: Submission[] = (submissionRes?.data || []).map((s: any) => ({
          id: s._id,
          studentName: s.studentId?.name || "Unknown",
          assignmentTitle: s.assignmentId?.title || "Unknown",
          status: s.status,
        }));

        setAssignments(assignments);
        setSubmissions(submissions);

         toast.success("Dashboard loaded!", { id: toastId });
      } catch (err) {
        console.error("Mentor dashboard fetch error:", err);
        setAssignments([]);
        setSubmissions([]);
        toast.error("Failed to load dashboard.", { id: toastId });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const visibleSubmissions = submissions.filter((s) => s.status !== "Pending");
  const pendingReviews = visibleSubmissions.filter((s) => s.status === "Submitted").length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-yellow-500 font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="MENTOR" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mentor Dashboard</h1>
            <p className="text-slate-500">Create assignments and review student submissions</p>
          </div>
          <button
            onClick={() => navigate("/mentor/create")}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            + Create Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Assignments" value={assignments.length} />
          <StatCard title="Total Submissions" value={visibleSubmissions.length} />
          <StatCard title="Pending Reviews" value={pendingReviews} highlight />
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Recent Assignments</h2>
          {assignments.length === 0 ? (
            <EmptyState text="No assignments created yet." />
          ) : (
            <div className="space-y-4">
              {assignments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">{a.title}</h3>
                    <p className="text-slate-500 text-sm">{a.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/mentor/submissions/${a.id}`)}
                    className="text-yellow-500 font-medium hover:underline"
                  >
                    View Submissions →
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
          {visibleSubmissions.length === 0 ? (
            <EmptyState text="No submissions received yet." />
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold">Assignment</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSubmissions.slice(0, 5).map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-5 py-4">{s.studentName}</td>
                      <td className="px-5 py-4">{s.assignmentTitle}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          disabled={s.status === "Reviewed"}
                          onClick={() => navigate(`/mentor/review/${s.id}`)}
                          className={`px-4 py-1 rounded-md text-sm font-medium ${
                            s.status === "Reviewed"
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MentorDashboard;

const StatCard = ({ title, value, highlight }: { title: string; value: number; highlight?: boolean }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm ${highlight ? "border-l-4 border-yellow-500" : ""}`}>
    <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
    <p className="text-slate-500">{title}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Submitted: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-green-100 text-green-700",
  };
  return <span className={`${base} ${styles[status] || ""}`}>{status}</span>;
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="bg-white p-6 rounded-xl text-slate-500 text-sm">{text}</div>
);
