import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaBell } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on mobile when route changes and scroll to top
  useEffect(() => {
    closeSidebar();
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 font-inter overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Fixed for Desktop, absolute/sliding for Mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        
        {/* Dashboard Header */}
        <header className="h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-primary hover:bg-teal-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <HiMenuAlt2 className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-poppins font-semibold text-gray-800 hidden sm:block">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* DEV TOOL: Role Switcher */}
            <div className="hidden md:flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-lg mr-2">
              <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide">Dev Tool:</span>
              <select 
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary font-bold cursor-pointer shadow-sm"
                defaultValue={user?.role || "patient"}
                onChange={async (e) => {
                  try {
                    await axiosInstance.patch(`/users/${user?.email}/role`, { role: e.target.value });
                    window.location.reload();
                  } catch (error) {
                    console.error("Error updating role:", error);
                  }
                }}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* Mobile Header Profile Snippet */}
            <div className="flex items-center gap-3 lg:hidden pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-teal-100 overflow-hidden border border-gray-200">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Outlet */}
        <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
