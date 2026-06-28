import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import FindDoctors from "../pages/FindDoctors/FindDoctors";
import DoctorDetails from "../pages/DoctorDetails/DoctorDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";
import NotFound from "../pages/NotFound/NotFound";

// Patient Pages
import MyProfile from "../pages/Dashboard/Patient/MyProfile";
import MyAppointments from "../pages/Dashboard/Patient/MyAppointments";
import PaymentHistory from "../pages/Dashboard/Patient/PaymentHistory";
import MyReviews from "../pages/Dashboard/Patient/MyReviews";

// Doctor Pages
import ManageSchedule from "../pages/Dashboard/Doctor/ManageSchedule";
import AppointmentRequests from "../pages/Dashboard/Doctor/AppointmentRequests";
import PrescriptionManagement from "../pages/Dashboard/Doctor/PrescriptionManagement";
import ProfileManagement from "../pages/Dashboard/Doctor/ProfileManagement";

// Admin Pages
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageDoctors from "../pages/Dashboard/Admin/ManageDoctors";
import ManageAppointments from "../pages/Dashboard/Admin/ManageAppointments";
import PaymentManagement from "../pages/Dashboard/Admin/PaymentManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/doctors",
        element: <FindDoctors />,
      },
      {
        path: "/doctors/:id",
        element: <DoctorDetails />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      // Patient Routes
      {
        path: "patient/profile",
        element: <MyProfile />,
      },
      {
        path: "patient/appointments",
        element: <MyAppointments />,
      },
      {
        path: "patient/payments",
        element: <PaymentHistory />,
      },
      {
        path: "patient/reviews",
        element: <MyReviews />,
      },
      // Doctor Routes
      {
        path: "doctor/schedule",
        element: <ManageSchedule />,
      },
      {
        path: "doctor/requests",
        element: <AppointmentRequests />,
      },
      {
        path: "doctor/prescriptions",
        element: <PrescriptionManagement />,
      },
      {
        path: "doctor/profile",
        element: <ProfileManagement />,
      },
      // Admin Routes
      {
        path: "admin/users",
        element: <ManageUsers />,
      },
      {
        path: "admin/doctors",
        element: <ManageDoctors />,
      },
      {
        path: "admin/appointments",
        element: <ManageAppointments />,
      },
      {
        path: "admin/payments",
        element: <PaymentManagement />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);
