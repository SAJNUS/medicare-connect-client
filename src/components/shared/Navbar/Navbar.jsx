import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HiMenu, HiX, HiOutlineUser, HiOutlineCalendar, HiOutlineStar, HiOutlineClock, HiOutlineUsers, HiOutlineLogout } from "react-icons/hi";
import logo from "../../../assets/logo2.png";
import { useAuth } from "../../../hooks/useAuth";
import { getRoleColors } from "../../../utils/roleColors";
import UserAvatar from "../../UserAvatar";

const Navbar = () => {
  const { user, loading, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const roleColors = getRoleColors(user?.role);

  const handleHomeClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/doctors" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={handleHomeClick} className="-ml-4 inline-block">
              <img className="h-20 md:h-[85px] w-auto object-contain object-left" src={logo} alt="MediCare Connect Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center flex-grow justify-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={link.path === "/" ? handleHomeClick : undefined}
                className={({ isActive }) =>
                  `text-[15px] font-medium transition-colors duration-300 ${isActive ? "text-primary font-semibold" : "text-gray-700 hover:text-primary"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex space-x-2">
                <div className="skeleton w-24 h-10 rounded-md bg-gray-200"></div>
                <div className="skeleton w-24 h-10 rounded-md bg-gray-200"></div>
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  role="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`btn btn-ghost btn-circle avatar border-2 transition-colors ${roleColors.ringBorder} ${roleColors.ringHover}`}
                >
                  <div className="w-10 h-10 rounded-full">
                    <UserAvatar user={user} className="object-cover w-full h-full" />
                  </div>
                </div>
                {isProfileDropdownOpen && (
                  <ul className="menu menu-sm absolute right-0 mt-3 z-[100] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white border border-slate-200 rounded-[32px] w-[90vw] md:w-[325px] max-w-[90vw] translate-y-2 animate-dropdown-in">
                    <li className="pointer-events-none mb-3 px-1 pt-4 pb-2">
                      <div className="flex flex-col items-center justify-center gap-3 bg-transparent hover:bg-transparent cursor-default opacity-100 w-full">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-sm border-2 border-gray-100">
                          <UserAvatar user={user} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-0.5 text-center">
                          <span className="text-[17px] font-bold text-gray-900 whitespace-nowrap leading-tight">{user.name || "User"}</span>
                          <span className="text-[13px] font-medium text-gray-500 whitespace-nowrap mb-1.5">{user.email}</span>
                          <span className={`text-[12px] font-semibold px-5 py-1 rounded-full capitalize ${roleColors.badgeBg} ${roleColors.badgeText}`}>{user.role || "Patient"}</span>
                        </div>
                      </div>
                    </li>

                    <div className="h-px bg-gray-100 w-full mb-2"></div>

                    <li><Link to={`/dashboard/${user.role || 'patient'}/profile`} onClick={() => setIsProfileDropdownOpen(false)} className={`py-3 px-3 text-[15px] text-gray-700 font-medium flex items-center gap-4 rounded-xl transition-colors ${roleColors.menuHover}`}><HiOutlineUser className="text-[#0b6e66] text-xl" /> My Profile</Link></li>

                    {user.role === 'patient' && (
                      <>
                        <li><Link to="/dashboard/patient/appointments" onClick={() => setIsProfileDropdownOpen(false)} className={`py-3 px-3 text-[15px] text-gray-700 font-medium flex items-center gap-4 rounded-xl transition-colors ${roleColors.menuHover}`}><HiOutlineCalendar className="text-[#0b6e66] text-xl" /> My Appointments</Link></li>
                        <li><Link to="/dashboard/patient/reviews" onClick={() => setIsProfileDropdownOpen(false)} className={`py-3 px-3 text-[15px] text-gray-700 font-medium flex items-center gap-4 rounded-xl transition-colors ${roleColors.menuHover}`}><HiOutlineStar className="text-[#0b6e66] text-xl" /> My Reviews</Link></li>
                      </>
                    )}
                    {user.role === 'doctor' && (
                      <li><Link to="/dashboard/doctor/schedule" onClick={() => setIsProfileDropdownOpen(false)} className={`py-3 px-3 text-[15px] text-gray-700 font-medium flex items-center gap-4 rounded-xl transition-colors ${roleColors.menuHover}`}><HiOutlineClock className="text-[#0b6e66] text-xl" /> Manage Schedule</Link></li>
                    )}
                    {user.role === 'admin' && (
                      <li><Link to="/dashboard/admin/users" onClick={() => setIsProfileDropdownOpen(false)} className={`py-3 px-3 text-[15px] text-gray-700 font-medium flex items-center gap-4 rounded-xl transition-colors ${roleColors.menuHover}`}><HiOutlineUsers className="text-[#0b6e66] text-xl" /> Manage Users</Link></li>
                    )}

                    <div className="h-px bg-gray-100 w-full my-2"></div>

                    <li>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logoutUser();
                          localStorage.removeItem("currentUserEmail");
                          navigate('/login');
                        }}
                        className="py-3 px-3 text-[15px] text-red-500 hover:text-red-600 hover:bg-red-50 font-medium flex items-center gap-4 rounded-xl active:bg-red-100 focus:bg-red-50"
                      >
                        <HiOutlineLogout className="text-xl" /> Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-primary rounded-md px-6 py-2 min-h-0 h-10 font-inter font-medium text-[15px]">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-md px-6 py-2 min-h-0 h-10 font-inter font-medium text-[15px]">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-primary p-2">
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  setIsOpen(false);
                  if (link.path === "/") handleHomeClick();
                }}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-medium ${isActive ? "text-primary bg-teal-50" : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col px-2">
              {loading ? (
                <div className="flex flex-col space-y-2 mt-4">
                  <div className="skeleton h-12 w-full rounded-md bg-gray-200"></div>
                  <div className="skeleton h-12 w-full rounded-md bg-gray-200"></div>
                </div>
              ) : user ? (
                <div className="border-t border-gray-100 pt-4 pb-2">
                  <div className="flex flex-col items-center justify-center gap-3 px-4 mb-6 mt-2 text-center">
                    <div className="flex-shrink-0">
                      <UserAvatar user={user} className={`w-20 h-20 rounded-full border-2 object-cover shadow-sm ${roleColors.ringBorder}`} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 items-center">
                      <span className="text-[17px] font-bold text-gray-900 break-words leading-tight">{user.name || "User"}</span>
                      <span className="text-[13px] font-medium text-gray-500 break-all mb-1">{user.email}</span>
                      <div className="mt-1">
                        <span className={`text-[12px] font-bold uppercase tracking-wider inline-block px-3 py-1 rounded-full ${roleColors.badgeBg} ${roleColors.text}`}>{user.role || "Patient"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Link to={`/dashboard/${user.role || 'patient'}/profile`} onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-[#0b6e66] rounded-lg font-medium text-[15px] flex items-center gap-3"><HiOutlineUser className="text-gray-400 text-lg" /> My Profile</Link>

                    {user.role === 'patient' && (
                      <>
                        <Link to="/dashboard/patient/appointments" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-[#0b6e66] rounded-lg font-medium text-[15px] flex items-center gap-3"><HiOutlineCalendar className="text-gray-400 text-lg" /> My Appointments</Link>
                        <Link to="/dashboard/patient/reviews" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-[#0b6e66] rounded-lg font-medium text-[15px] flex items-center gap-3"><HiOutlineStar className="text-gray-400 text-lg" /> My Reviews</Link>
                      </>
                    )}
                    {user.role === 'doctor' && (
                      <Link to="/dashboard/doctor/schedule" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-[#0b6e66] rounded-lg font-medium text-[15px] flex items-center gap-3"><HiOutlineClock className="text-gray-400 text-lg" /> Manage Schedule</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/dashboard/admin/users" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-[#0b6e66] rounded-lg font-medium text-[15px] flex items-center gap-3"><HiOutlineUsers className="text-gray-400 text-lg" /> Manage Users</Link>
                    )}

                    <div className="divider my-1"></div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logoutUser();
                        localStorage.removeItem("currentUserEmail");
                        navigate('/login');
                      }}
                      className="px-4 py-2.5 text-left text-red-500 hover:bg-red-50 rounded-lg font-medium text-[15px] transition-colors flex items-center gap-3"
                    >
                      <HiOutlineLogout className="text-lg" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-primary active:bg-primary active:text-white active:border-primary focus:bg-primary focus:text-white focus:border-primary w-full rounded-md h-12 font-inter font-medium text-[15px] mb-2">
                      Login
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <button className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus active:bg-primary-focus active:border-primary-focus focus:outline-none w-full rounded-md h-12 font-inter font-medium text-[15px]">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
