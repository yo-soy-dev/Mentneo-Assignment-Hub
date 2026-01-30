import Submission from "../models/Submission.js";

export const submitAssignment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assignmentId = req.params.assignmentId;
    const studentId = req.user.id;

    if (!assignmentId) {
      return res.status(400).json({ message: "Missing assignmentId" });
    }

    const docPath = req.files?.doc?.[0]?.path;
    const imagePath = req.files?.image?.[0]?.path;
    const videoPath = req.files?.video?.[0]?.path;

    if (!docPath && !imagePath && !videoPath) {
      return res.status(400).json({ message: "Please upload at least one file" });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId,
      doc: docPath,
      image: imagePath,
      video: videoPath,
      status: "Submitted",
    });

    res.json(submission);
  } catch (err) {
    console.error("Submit assignment error:", err);
    res.status(500).json({ message: "Server error" });
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
