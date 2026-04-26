import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

// Pages
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import UserManagement from "../pages/UserManagement";
import ProjectManagement from "../pages/ProjectManagement";
import TaskManagement from "../pages/TaskManagement";
import AttendanceManagement from "../pages/AttendanceManagement";
import LoginPage from "../pages/LoginPage";

// ================= GUARD =================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// ================= ROUTER =================
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "users", element: <UserManagement /> },
      { path: "projects", element: <ProjectManagement /> },
      { path: "tasks", element: <TaskManagement /> },
      { path: "attendance", element: <AttendanceManagement /> },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);