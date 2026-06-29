import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import FindDoctors from "../pages/FindDoctors/FindDoctors";
import DoctorDetails from "../pages/DoctorDetails/DoctorDetails";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";
import NotFound from "../pages/NotFound/NotFound";
import RoleRoute from "./RoleRoute";

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
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
    element: (
      <RoleRoute allowedRoles={['patient', 'doctor', 'admin']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      // Patient Routes
      {
        path: "patient/profile",
        element: <RoleRoute allowedRoles={['patient', 'admin']}><MyProfile /></RoleRoute>,
      },
      {
        path: "patient/appointments",
        element: <RoleRoute allowedRoles={['patient', 'admin']}><MyAppointments /></RoleRoute>,
      },
      {
        path: "patient/payments",
        element: <RoleRoute allowedRoles={['patient', 'admin']}><PaymentHistory /></RoleRoute>,
      },
      {
        path: "patient/reviews",
        element: <RoleRoute allowedRoles={['patient', 'admin']}><MyReviews /></RoleRoute>,
      },
      // Doctor Routes
      {
        path: "doctor/schedule",
        element: <RoleRoute allowedRoles={['doctor', 'admin']}><ManageSchedule /></RoleRoute>,
      },
      {
        path: "doctor/requests",
        element: <RoleRoute allowedRoles={['doctor', 'admin']}><AppointmentRequests /></RoleRoute>,
      },
      {
        path: "doctor/prescriptions",
        element: <RoleRoute allowedRoles={['doctor', 'admin']}><PrescriptionManagement /></RoleRoute>,
      },
      {
        path: "doctor/profile",
        element: <RoleRoute allowedRoles={['doctor', 'admin']}><ProfileManagement /></RoleRoute>,
      },
      // Admin Routes
      {
        path: "admin/users",
        element: <RoleRoute allowedRoles={['admin']}><ManageUsers /></RoleRoute>,
      },
      {
        path: "admin/doctors",
        element: <RoleRoute allowedRoles={['admin']}><ManageDoctors /></RoleRoute>,
      },
      {
        path: "admin/appointments",
        element: <RoleRoute allowedRoles={['admin']}><ManageAppointments /></RoleRoute>,
      },
      {
        path: "admin/payments",
        element: <RoleRoute allowedRoles={['admin']}><PaymentManagement /></RoleRoute>,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);
