import { NavLink, Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaFileMedical, FaCog, FaSignOutAlt, FaUserMd, FaUsers, FaChartBar, FaUserCheck, FaClipboardList, FaUserCircle, FaWallet, FaStar, FaFilePrescription, FaCalendarCheck } from "react-icons/fa";
import logo from "../../assets/logo2.png";
import { useAuth } from "../../hooks/useAuth";
import { getRoleColors } from "../../utils/roleColors";

const Sidebar = ({ closeSidebar }) => {
  const userAuthContext = useAuth();
  const user = userAuthContext.user;
  const roleColors = getRoleColors(user?.role);

  // Dynamic navigation based on role
  let navItems = [];
  if (user?.role === "doctor") {
    navItems = [
      { name: "Overview", path: "/dashboard", icon: <FaHome /> },
      { name: "Manage Schedule", path: "/dashboard/doctor/schedule", icon: <FaCalendarAlt /> },
      { name: "Appointment Requests", path: "/dashboard/doctor/requests", icon: <FaClipboardList /> },
      { name: "Rx Management", path: "/dashboard/doctor/prescriptions", icon: <FaFilePrescription /> },
      { name: "Profile Management", path: "/dashboard/doctor/profile", icon: <FaUserMd /> },
    ];
  } else if (user?.role === "admin") {
    navItems = [
      { name: "Overview", path: "/dashboard", icon: <FaHome /> },
      { name: "Manage Users", path: "/dashboard/admin/users", icon: <FaUsers /> },
      { name: "Manage Doctors", path: "/dashboard/admin/doctors", icon: <FaUserMd /> },
      { name: "Manage Appointments", path: "/dashboard/admin/appointments", icon: <FaCalendarCheck /> },
      { name: "Payment Management", path: "/dashboard/admin/payments", icon: <FaWallet /> },
    ];
  } else {
    // Default to Patient
    navItems = [
      { name: "Overview", path: "/dashboard", icon: <FaHome /> },
      { name: "My Profile", path: "/dashboard/patient/profile", icon: <FaUserCircle /> },
      { name: "My Appointments", path: "/dashboard/patient/appointments", icon: <FaCalendarAlt /> },
      { name: "Payment History", path: "/dashboard/patient/payments", icon: <FaWallet /> },
      { name: "My Reviews", path: "/dashboard/patient/reviews", icon: <FaStar /> },
    ];
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.03)] w-72">
      {/* Logo Area */}
      <div className="h-20 flex justify-center items-center px-6 border-b border-gray-50 flex-shrink-0">
        <Link to="/" onClick={closeSidebar} className="block">
          <img src={logo} alt="MediCare Connect Logo" className="h-12 w-auto object-contain hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      {/* User Profile Summary */}
      <div className="px-6 py-5 border-b border-gray-50 flex flex-col items-center flex-shrink-0 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-100 border-4 border-white shadow-md overflow-hidden mb-2">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-poppins font-bold text-gray-900 text-base leading-tight">{user?.name || "John Doe"}</h3>
        <p className={`text-xs font-medium mt-1 ${roleColors.text}`}>{user?.designation || "Patient"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5 font-inter">
        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1">Dashboard</p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-teal-50 hover:text-primary"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-50 flex-shrink-0">
        <button
          className="flex w-full items-center justify-center gap-2 px-4 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors"
          onClick={async () => {
            try {
              await userAuthContext.logoutUser();
              localStorage.removeItem("currentUserEmail");
              window.location.href = '/';
            } catch (error) {
              console.error("Logout failed", error);
            }
          }}
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
