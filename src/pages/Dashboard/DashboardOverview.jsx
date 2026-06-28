import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../../hooks/useAuth";

const DashboardOverview = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  // Fallback to patient if no role is defined or user is null
  const role = user?.role || "patient";

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "doctor" && <DoctorDashboard />}
      {role === "patient" && <PatientDashboard />}
    </>
  );
};

export default DashboardOverview;
