import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doc: String,
  image: String,
  video: String,
  status: { type: String, enum: ["Submitted", "Reviewed"], default: "Submitted" },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
