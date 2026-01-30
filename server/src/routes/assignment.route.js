import express from "express";
import { createAssignment, getAssignmentById, getAssignments, getStudentAssignments } from "../controllers/assignment.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { mentorOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", auth, mentorOnly, createAssignment);
router.get("/", auth, getAssignments);
router.get("/student", auth, getStudentAssignments);
router.get("/:id", auth, getAssignmentById);


export default router;
