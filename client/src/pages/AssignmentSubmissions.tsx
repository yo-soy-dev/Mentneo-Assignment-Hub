import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";


interface Submission {
    id: string;
    studentName: string;
    status: "Submitted" | "Reviewed";
    submittedAt: string;
}

interface Assignment {
    id: string;
    title: string;
    description: string;
}


const AssignmentSubmissions = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId) {
            console.warn("No assignmentId provided in route!");
            return; 
        }

        const fetchData = async () => {
            try {
                const assignmentRes = await api.get(`/assignments/${assignmentId}`);
                const submissionsRes = await api.get(`/submissions/assignment/${assignmentId}`);

                setAssignment(assignmentRes.data);
                setSubmissions(submissionsRes.data);
            } catch (err) {
                console.error("Fetch submissions error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [assignmentId]);


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-500">
                Loading submissions...
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="text-center mt-20 text-red-500">
                Assignment not found
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="MENTOR" />

            <div className="flex-1 p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {assignment.title}
                    </h1>
                    <p className="text-slate-500">
                        {assignment.description}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {submissions.length === 0 ? (
                        <p className="p-6 text-slate-500">
                            No submissions received yet.
                        </p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-semibold">
                                        Student
                                    </th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold">
                                        Submitted At
                                    </th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-left text-sm font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {submissions.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="px-5 py-4">
                                            {s.studentName}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {new Date(s.submittedAt).toLocaleString()}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={s.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(`/mentor/review/${s.id}`)
                                                }
                                                className={`px-4 py-1 rounded-md text-sm font-medium
                          ${s.status === "Reviewed"
                                                        ? "bg-slate-200 text-slate-500"
                                                        : "bg-sky-500 text-white hover:bg-sky-600"
                                                    }`}
                                            >
                                                {s.status === "Reviewed"
                                                    ? "View"
                                                    : "Review"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-sm text-slate-500 hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AssignmentSubmissions;

/* ---------- UI ---------- */

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Submitted: "bg-sky-100 text-sky-700",
        Reviewed: "bg-green-100 text-green-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}
        >
            {status}
        </span>
    );
};

