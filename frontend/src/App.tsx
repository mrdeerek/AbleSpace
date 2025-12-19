import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/layout/DashboardLayout";
import MyTasks from "./pages/MyTasks";
import OverdueTasks from "./pages/OverdueTasks";
import LandingPage from "./pages/LandingPage";
import { ToastProvider } from "./context/ToastContext";

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout />; // Renders Layout which renders Outlet
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Landing Page - Public */}
            <Route path="/" element={<LandingPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<MyTasks />} />
              <Route path="/overdue" element={<OverdueTasks />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
