import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import footerLogo from "../../../assets/footer-logo.png";
import { useModal } from "../../../context/ModalContext";
import { useState } from "react";
import HealthTipsModal from "../Modals/HealthTipsModal";

const Footer = () => {
  const { pathname } = useLocation();
  const { openModal } = useModal();
  const [isHealthTipsOpen, setIsHealthTipsOpen] = useState(false);

  const handleHomeClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#073A36] text-white pt-16 pb-8 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" onClick={handleHomeClick} className="mb-6 inline-block -ml-4">
              <img src={footerLogo} alt="MediCare Connect Logo" className="h-20 md:h-[85px] w-auto object-contain object-left" />
            </Link>
            <p className="text-gray-300 text-sm mb-6 max-w-sm leading-relaxed">
              Your trusted healthcare partner. Connecting patients with the best healthcare.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-[#073A36] flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-[#073A36] flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaXTwitter size={14} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-[#073A36] flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaLinkedinIn size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-[#073A36] flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaInstagram size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-poppins font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" onClick={handleHomeClick} className="text-gray-300 text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/doctors" className="text-gray-300 text-sm hover:text-white transition-colors">Find Doctors</Link></li>
              <li><Link to="/about" className="text-gray-300 text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 text-sm hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* For Patients */}
          <div>
            <h3 className="text-base font-poppins font-semibold mb-5">For Patients</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openModal()}
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  New Appointment
                </button>
              </li>
              <li><Link to="/doctors" className="text-gray-300 text-sm hover:text-white transition-colors">Find Doctors</Link></li>
              <li>
                <button 
                  onClick={() => setIsHealthTipsOpen(true)}
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Health Tips
                </button>
              </li>
              <li><Link to="/dashboard" className="text-gray-300 text-sm hover:text-white transition-colors">Patient Dashboard</Link></li>
              <li><Link to="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* For Doctors & Contact Us combined visually or separate? The design has 5 columns */}
          <div>
            <h3 className="text-base font-poppins font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start">
                <FaPhoneAlt className="mt-1 mr-3 text-white" />
                +880 1234-567890
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-white" />
                support@medicare.com
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-white" />
                123, Health Street,<br />Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#105953] pt-6 flex flex-col md:flex-row justify-between items-center text-gray-300 text-[13px]">
          <p>&copy; {new Date().getFullYear()} MediCare Connect. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="hover:text-white">Privacy Policy</Link>
            <Link to="#" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <HealthTipsModal 
        isOpen={isHealthTipsOpen} 
        onClose={() => setIsHealthTipsOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
