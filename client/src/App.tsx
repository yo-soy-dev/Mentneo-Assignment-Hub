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
import AppLayout from "./components/AppLayout";

import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />

      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute role="mentor">
                <AppLayout>
                <MentorDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/create"
            element={
              <ProtectedRoute role="mentor">
                <AppLayout>
                <CreateAssignment />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/submissions/:assignmentId"
            element={
              <ProtectedRoute role="mentor">
                <AppLayout>
                <AssignmentSubmissions />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/review/:submissionId"
            element={
              <ProtectedRoute role="mentor">
                <AppLayout>
                <ReviewSubmission />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                 <AppLayout>
                <StudentDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit/:assignmentId"
            element={
              <ProtectedRoute role="student">
                <AppLayout>
                <SubmitAssignment />
                </AppLayout>
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