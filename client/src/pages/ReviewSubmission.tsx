import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";


interface Submission {
  id: string;
  status: "Submitted" | "Reviewed";
  studentName: string;
  assignmentTitle: string;
  textFileUrl?: string;
  imageFileUrl?: string;
  videoFileUrl?: string;
}


const ReviewSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/submissions/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error("Fetch submission error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const markReviewed = async () => {
    try {
      setReviewing(true);
      await api.patch(`/submissions/${id}/review`);
      setSubmission((prev) =>
        prev ? { ...prev, status: "Reviewed" } : prev
      );
    } catch (err) {
      console.error("Review error", err);
      alert("Failed to mark as reviewed");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-slate-500">
        Loading submission...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center mt-20 text-red-500">
        Submission not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {submission.assignmentTitle}
          </h1>
          <p className="text-slate-500 mt-1">
            Submitted by <span className="font-medium">{submission.studentName}</span>
          </p>
        </div>

        <StatusBadge status={submission.status} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-700">
          Submitted Files
        </h2>

        <FilePreview
          label="Text / PDF"
          url={submission.textFileUrl}
        />

        <FilePreview
          label="Image"
          url={submission.imageFileUrl}
          isImage
        />

        <FilePreview
          label="Video"
          url={submission.videoFileUrl}
          isVideo
        />

        <div className="pt-4">
          <button
            onClick={markReviewed}
            disabled={submission.status === "Reviewed" || reviewing}
            className={`w-full py-3 rounded-lg font-semibold text-white transition
              ${
                submission.status === "Reviewed"
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
          >
            {reviewing
              ? "Reviewing..."
              : submission.status === "Reviewed"
              ? "Already Reviewed"
              : "Mark as Reviewed"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-2 text-sm text-slate-500 hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;


const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Submitted: "bg-sky-100 text-sky-700",
    Reviewed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
};

const FilePreview = ({
  label,
  url,
  isImage,
  isVideo,
}: {
  label: string;
  url?: string;
  isImage?: boolean;
  isVideo?: boolean;
}) => {
  if (!url) {
    return (
      <p className="text-sm text-slate-400">
        {label}: Not uploaded
      </p>
    );
  }

  return (
    <div>
      <p className="font-medium text-slate-700 mb-2">{label}</p>

      {isImage && (
        <img
          src={url}
          alt={label}
          className="max-w-xs rounded-lg border"
        />
      )}

      {isVideo && (
        <video
          src={url}
          controls
          className="max-w-xs rounded-lg border"
        />
      )}

      {!isImage && !isVideo && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 font-medium hover:underline"
        >
          View / Download File
        </a>
      )}
    </div>
  );
};
