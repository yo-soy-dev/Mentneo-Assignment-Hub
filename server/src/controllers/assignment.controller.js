import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

export const createAssignment = async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.json(assignment);
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const assignments = await Assignment.find();
    const submissions = await Submission.find({ studentId });
    const submissionsMap = new Map(
      submissions.map((s) => [s.assignmentId.toString(), s.status])
    );

    const assignmentsWithStatus = assignments.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      description: a.description,
      deadline: a.deadline,
      status: submissionsMap.get(a._id.toString()) || "Pending",
    }));

    res.json(assignmentsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
