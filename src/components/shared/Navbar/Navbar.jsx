import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../../assets/logo2.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

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
            <Link to="/" className="-ml-4 inline-block">
              <img className="h-20 md:h-[85px] w-auto object-contain object-left" src={logo} alt="MediCare Connect Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center flex-grow justify-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
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
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-medium ${isActive ? "text-primary bg-teal-50" : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-3 px-4">
              <button className="btn btn-outline border-primary text-primary w-full rounded-md h-12">
                Login
              </button>
              <button className="btn btn-primary bg-primary text-white w-full rounded-md h-12">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
