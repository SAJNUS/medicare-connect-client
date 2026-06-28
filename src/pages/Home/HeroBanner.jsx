import { motion } from "framer-motion";
import { FaPhoneAlt, FaArrowRight, FaUserMd, FaUsers, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../assets/banner.png";

const HeroBanner = () => {
  const navigate = useNavigate();

  const scrollToEmergency = () => {
    const element = document.getElementById("emergency-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative bg-white overflow-hidden flex flex-col justify-center min-h-[calc(100vh-96px)] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* Light Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-teal-900/10 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-[44px] lg:text-[50px] xl:text-[56px] font-poppins font-bold text-gray-900 leading-[1.2] mb-5 tracking-tight">
              <span className="md:whitespace-nowrap">Your Health, Our Priority</span><br />
              <span className="text-primary mt-2 block text-2xl sm:text-[30px] md:text-[36px]">Book Trusted Doctors Instantly</span>
            </h1>
            <p className="text-[17px] text-gray-700 mb-10 max-w-lg font-inter leading-relaxed font-medium">
              MediCare Connect brings quality healthcare to you. Book appointments, consult doctors, and manage your health — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate("/doctors")}
                className="bg-primary hover:bg-primary-focus text-white px-8 py-3.5 rounded-lg flex items-center justify-center font-medium transition-all shadow-lg shadow-primary/30"
              >
                Find Doctors <FaArrowRight className="ml-2 text-sm" />
              </button>
              <button
                onClick={scrollToEmergency}
                className="bg-white border-2 border-gray-200 text-gray-800 hover:border-primary hover:text-primary px-8 py-3.5 rounded-lg flex items-center justify-center font-medium transition-all shadow-sm"
              >
                Emergency Help <FaPhoneAlt className="ml-2 text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Patient" />
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Patient" />
                <img className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Patient" />
              </div>
              <p className="font-inter text-sm text-gray-700"><span className="font-bold text-gray-900">50K+</span> Patients trust us</p>
            </div>
          </motion.div>

          {/* Right Content - Floating Stats Only */}
          <motion.div
            className="w-full lg:w-1/2 mt-16 lg:mt-0 min-h-[400px] lg:min-h-[500px] hidden md:flex flex-col justify-center items-end gap-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Floating Stat 1 */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4 w-[240px]"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-teal-50/80 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
                <FaUserMd className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[18px] leading-tight">500+</p>
                <p className="text-gray-500 text-[13px] font-medium">Expert Doctors</p>
              </div>
            </motion.div>

            {/* Floating Stat 2 */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4 w-[240px]"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-teal-50/80 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[18px] leading-tight">50K+</p>
                <p className="text-gray-500 text-[13px] font-medium">Happy Patients</p>
              </div>
            </motion.div>

            {/* Floating Stat 3 */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4 w-[240px]"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="bg-teal-50/80 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
                <FaHeadset className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[18px] leading-tight">24/7</p>
                <p className="text-gray-500 text-[13px] font-medium">Support</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
