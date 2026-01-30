import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import MentorDashboard from "./pages/MentorDashboard";
import CreateAssignment from "./pages/CreateAssignment";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import ReviewSubmission from "./pages/ReviewSubmission";

import StudentDashboard from "./pages/StudentDashboard";
import SubmitAssignment from "./pages/SubmitAssignment";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute role="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/create"
            element={
              <ProtectedRoute role="mentor">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/submissions/:assignmentId"
            element={
              <ProtectedRoute role="mentor">
                <AssignmentSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/review/:submissionId"
            element={
              <ProtectedRoute role="mentor">
                <ReviewSubmission />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit/:assignmentId"
            element={
              <ProtectedRoute role="student">
                <SubmitAssignment />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
