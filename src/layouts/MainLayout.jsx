import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar/Navbar";
import Footer from "../components/shared/Footer/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-inter bg-base-100">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
