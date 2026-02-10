import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ResidentDashboard from "./ResidentDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "staff") return <StaffDashboard />;
  return <ResidentDashboard />;
}
