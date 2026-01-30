
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import assignmentRoutes from "./src/routes/assignment.route.js";
import submissionRoutes from "./src/routes/submission.route.js";

dotenv.config();
connectDB();

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "https://mentneo-assignment-hub-client.vercel.app", 
    credentials: true,             
  })
);

// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.listen(5000, () => console.log("Server running on 5000"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});
