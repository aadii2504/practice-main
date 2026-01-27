import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { RegistrationPage } from "./pages/RegistrationPage";
import { Footer } from "./components/Footer";
import { DashboardPage } from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import { Profile } from "./pages/Profile";
import NotificationsList from "./components/NotificationsList";
import ModulePage from "./components/dashboard/ModulePage";
import NotEnrolledPage from "./components/dashboard/NotEnrolledPage";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import CoursesAdmin from "./pages/admin/CoursesAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import LoginPage from "./pages/LoginPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AssessmentForm from "./pages/admin/AssessmentForm";

import EnrolledCourses from "./pages/EnrolledCourses";
import "react-toastify/dist/ReactToastify.css";
import Analytics from "./pages/admin/Analytics";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationsList />} />

          <Route path="/enrolled-courses" element={<EnrolledCourses />} />

          {/* Course module routes */}
          <Route
            path="/course/:courseId/module/:moduleId"
            element={<ModulePage />}
          />
          <Route
            path="/not-enrolled/:courseId/module/:moduleId"
            element={<NotEnrolledPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Admin area (requires admin role) */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedAdminRoute>
                <AdminProfile />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <ProtectedAdminRoute>
                <CoursesAdmin />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedAdminRoute>
                <Analytics />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <UsersAdmin />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
