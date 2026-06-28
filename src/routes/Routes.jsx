import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import FindDoctors from "../pages/FindDoctors/FindDoctors";
import DoctorDetails from "../pages/DoctorDetails/DoctorDetails";

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
    ],
  },
]);
