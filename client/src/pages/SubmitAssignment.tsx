import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";


interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline?: string;
}

type SubmissionStatus = "Pending" | "Submitted" | "Reviewed";


const SubmitAssignment = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("Pending");

  const [textFile, setTextFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignmentId) return; 

    const fetchData = async () => {
      try {
        const assignmentRes = await api.get(`/assignments/${assignmentId}`);
        setAssignment({
          id: assignmentRes.data._id, 
          title: assignmentRes.data.title,
          description: assignmentRes.data.description,
          deadline: assignmentRes.data.deadline,
        });

        const submissionRes = await api.get(`/submissions/my/${assignmentId}`);
        if (submissionRes.data) {
          setStatus(submissionRes.data.status);
        }
      } catch (err) {
        console.error("Fetch error", err);
        alert("Failed to load assignment. Please try again.");
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!assignmentId) return;
    if (!textFile && !imageFile && !videoFile) {
      alert("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    if (textFile) formData.append("doc", textFile);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      setLoading(true);
      await api.post(`/submissions/${assignmentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Submitted");
      alert("Assignment submitted successfully!");
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Submission error", err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
    return (
      <p className="text-center mt-10 text-slate-500">
        Loading assignment...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {assignment.title}
          </h1>
          <p className="text-slate-500 mt-1">{assignment.description}</p>

          {assignment.deadline && (
            <p className="mt-2 text-sm text-slate-400">
              Deadline: {new Date(assignment.deadline).toLocaleDateString()}
            </p>
          )}
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 space-y-5">
        <p className="text-sm text-slate-500">
          Upload at least one file. Supported formats: PDF, image, video.
        </p>

        <FileInput
          label="Upload Text / PDF"
          accept=".pdf,.doc,.docx,.txt"
          onChange={setTextFile}
          file={textFile}
        />

        <FileInput
          label="Upload Image"
          accept="image/*"
          onChange={setImageFile}
          file={imageFile}
        />

        <FileInput
          label="Upload Video"
          accept="video/*"
          onChange={setVideoFile}
          file={videoFile}
        />

        <button
          onClick={handleSubmit}
          disabled={status !== "Pending" || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition
            ${
              status !== "Pending" || loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600"
            }`}
        >
          {loading ? "Submitting..." : "Submit Assignment"}
        </button>
      </div>
    </div>
  );
};

export default SubmitAssignment;


const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Submitted: "bg-sky-100 text-sky-700",
    Reviewed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const FileInput = ({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) => (
  <div>
    <label className="block font-semibold text-slate-700 mb-2">{label}</label>
    <input
      type="file"
      accept={accept}
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      className="border border-slate-300 rounded px-3 py-2 w-full"
    />
    {file && (
      <p className="mt-1 text-sm text-slate-500">{file.name}</p>
    )}
  </div>
);

