console.log("🔥 SERVER FILE LOADED");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import assignmentRoutes from "./routes/assignment.route.js";
import submissionRoutes from "./routes/submission.route.js";

dotenv.config();
connectDB();

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,             
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.listen(5000, () => console.log("Server running on 5000"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});
