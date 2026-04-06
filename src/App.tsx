import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import CommunityComplaints from "./pages/CommunityComplaints";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";
import VisitorManagement from "./pages/VisitorManagement";
import AddVisitor from "./pages/AddVisitor";
import ResidentDashboard from "./pages/ResidentDashboard";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import StaffPerformance from "./pages/StaffPerformance";
import EmergencyAlerts from "./pages/EmergencyAlerts";
import Reports from "./pages/Reports";
import SystemInfo from "./pages/SystemInfo";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityComplaints /></ProtectedRoute>} />
            <Route path="/notices" element={<ProtectedRoute><NoticeBoard /></ProtectedRoute>} />
            <Route path="/notices/post" element={<ProtectedRoute><PostNotice /></ProtectedRoute>} />
            <Route path="/visitors" element={<ProtectedRoute><VisitorManagement /></ProtectedRoute>} />
            <Route path="/visitors/add" element={<ProtectedRoute><AddVisitor /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><PredictiveMaintenance /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><StaffPerformance /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><EmergencyAlerts /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/system-info" element={<ProtectedRoute><SystemInfo /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
