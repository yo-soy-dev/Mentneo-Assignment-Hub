import express from "express";
import {
  submitAssignment,
  reviewSubmission,
  getSubmissions,
  getMySubmission,
  getSubmissionById,
  getSubmissionsByAssignment
} from "../controllers/submission.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import { mentorOnly, studentOnly } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/:assignmentId",
  auth,
  studentOnly,
  upload.fields([
    { name: "doc", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  submitAssignment
);

router.get("/", auth, mentorOnly, getSubmissions);
router.patch("/:id/review", auth, mentorOnly, reviewSubmission);
router.get("/my/:assignmentId", auth, studentOnly, getMySubmission);
router.get("/:id", auth, mentorOnly, getSubmissionById);
router.get("/assignment/:assignmentId", auth, mentorOnly, getSubmissionsByAssignment);


export default router;
