import { NavLink, Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaFileMedical, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo2.png";

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    { name: "Overview", path: "/dashboard", icon: <FaHome /> },
    { name: "Appointments", path: "/dashboard/appointments", icon: <FaCalendarAlt /> },
    { name: "Medical Records", path: "/dashboard/records", icon: <FaFileMedical /> },
    { name: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.03)] w-72">
      {/* Logo Area */}
      <div className="h-24 flex justify-center items-center px-6 border-b border-gray-50 flex-shrink-0">
        <Link to="/" onClick={closeSidebar} className="block">
          <img src={logo} alt="MediCare Connect Logo" className="h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      {/* User Profile Summary */}
      <div className="px-6 py-8 border-b border-gray-50 flex flex-col items-center flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-teal-100 border-4 border-white shadow-md overflow-hidden mb-3">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="User Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-poppins font-bold text-gray-900 text-lg">John Doe</h3>
        <p className="text-sm font-medium text-primary">Patient</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 font-inter">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Dashboard</p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive 
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
          onClick={() => {
            // Placeholder logout logic
            alert("Logging out...");
            closeSidebar && closeSidebar();
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
