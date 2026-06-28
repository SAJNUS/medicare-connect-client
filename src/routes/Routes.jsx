import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import FindDoctors from "../pages/FindDoctors/FindDoctors";
import DoctorDetails from "../pages/DoctorDetails/DoctorDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";

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
      // Placeholders for other sidebar links to prevent 404s for now
      {
        path: "appointments",
        element: <div className="p-8 text-center text-gray-500">Appointments coming soon...</div>,
      },
      {
        path: "records",
        element: <div className="p-8 text-center text-gray-500">Medical Records coming soon...</div>,
      },
      {
        path: "settings",
        element: <div className="p-8 text-center text-gray-500">Settings coming soon...</div>,
      },
    ],
  },
]);
