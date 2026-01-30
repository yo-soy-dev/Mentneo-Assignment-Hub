import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const assignmentId = req.params.assignmentId;

    if (!studentId) return res.status(401).json({ message: "Unauthorized" });
    if (!assignmentId) return res.status(400).json({ message: "Missing assignmentId" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    console.log("Files received:", JSON.stringify(req.files, null, 2));

    const doc = req.files?.doc?.[0]?.path || null;
    const image = req.files?.image?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    if (!doc && !image && !video) {
      return res.status(400).json({ message: "Please upload at least one file" });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId,
      doc,
      image,
      video,
      status: "Submitted",
    });

    return res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (err) {
    console.error("Submit assignment error:", err);

    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error" });
    }
  }
};


export const reviewSubmission = async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) return res.status(404).json({ message: "Not found" });
  if (submission.status !== "Submitted")
    return res.status(400).json({ message: "Already reviewed" });

  submission.status = "Reviewed";
  await submission.save();

  res.json({ message: "Reviewed" });
};

export const getSubmissions = async (req, res) => {
  const data = await Submission.find()
    .populate("studentId", "name email")
    .populate("assignmentId", "title");
  res.json(data);
};

export const getMySubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.assignmentId;

    const submission = await Submission.findOne({ studentId, assignmentId });

    if (!submission) return res.status(404).json({ message: "No submission found" });

    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("assignmentId", "title description");

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    res.json({
      id: submission._id.toString(),
      studentName: submission.studentId.name,
      assignmentTitle: submission.assignmentId.title,
      status: submission.status,
      textFileUrl: submission.doc,
      imageFileUrl: submission.image,
      videoFileUrl: submission.video,
    });
  } catch (err) {
    console.error("Get submission by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    if (!assignmentId) return res.status(400).json({ message: "assignmentId required" });

    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "name email")
      .populate("assignmentId", "title");

    const formatted = submissions.map((s) => ({
      id: s._id.toString(),
      studentName: s.studentId.name,
      status: s.status,
      submittedAt: s.createdAt, 
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Get submissions by assignment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
