import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { assignmentApi } from "../api/assignment.api";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.");
      return;
    }

    try {
      setLoading(true);
      await assignmentApi.create({
        title,
        description,
        deadline: deadline || undefined,
      });

      alert("Assignment created successfully!");
      navigate("/mentor");
    } catch (err) {
      console.error("Create assignment error", err);
      alert("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="MENTOR" />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Create Assignment
          </h1>
          <p className="text-slate-500">
            Define assignment details for students
          </p>
        </div>

        <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Assignment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React File Upload Task"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what the student needs to submit..."
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Deadline (optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition
                ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600"
                }`}
            >
              {loading ? "Creating..." : "Create Assignment"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
