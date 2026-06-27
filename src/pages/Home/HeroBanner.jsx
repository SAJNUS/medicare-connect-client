import { motion } from "framer-motion";
import { FaPhoneAlt, FaArrowRight, FaUserMd, FaUsers, FaHeadset } from "react-icons/fa";

const HeroBanner = () => {
  return (
    <div className="relative bg-white overflow-hidden pt-10 pb-20">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-[50%] h-[90%] bg-teal-50/70 rounded-bl-[150px] -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="w-full lg:w-[55%] z-10 lg:pr-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[44px] md:text-[56px] font-poppins font-bold text-gray-900 leading-[1.1] mb-4">
              Your Health,<br />Our Priority<br />
              <span className="text-primary mt-2 block">Book Trusted Doctors Instantly</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg font-inter leading-relaxed">
              MediCare Connect brings quality healthcare to you. Book appointments, consult doctors, and manage your health — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-primary hover:bg-primary-focus text-white px-8 py-3.5 rounded-md flex items-center justify-center font-medium transition-colors">
                Find Doctors <FaArrowRight className="ml-2 text-sm" />
              </button>
              <button className="bg-white border border-gray-300 text-gray-800 hover:border-primary hover:text-primary px-8 py-3.5 rounded-md flex items-center justify-center font-medium transition-colors">
                Emergency Help <FaPhoneAlt className="ml-2 text-sm" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Patient" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Patient" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Patient" />
              </div>
              <p className="font-inter text-sm text-gray-700 font-medium"><span className="font-bold text-gray-900">50K+</span> Patients trust us</p>
            </div>
          </motion.div>
          
          {/* Right Content */}
          <motion.div 
            className="w-full lg:w-[45%] relative mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex justify-center lg:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Doctor" 
                className="w-auto h-[600px] object-cover object-top rounded-b-full drop-shadow-2xl z-10"
              />
              {/* Note: In a real project, we would use a proper PNG with transparent background. Here we use an unsplash image with rounded bottom to simulate the cutout look. */}
            </div>
            
            {/* Floating Stat 1 */}
            <motion.div 
              className="absolute top-10 -left-10 md:left-0 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 border border-gray-50 z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-teal-50 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                <FaUserMd className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">500+</p>
                <p className="text-gray-500 text-xs font-medium">Expert Doctors</p>
              </div>
            </motion.div>

            {/* Floating Stat 2 */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 -left-16 md:-left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 border border-gray-50 z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-teal-50 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">50K+</p>
                <p className="text-gray-500 text-xs font-medium">Happy Patients</p>
              </div>
            </motion.div>

            {/* Floating Stat 3 */}
            <motion.div 
              className="absolute bottom-20 -left-10 md:left-4 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 border border-gray-50 z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="bg-teal-50 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                <FaHeadset className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">24/7</p>
                <p className="text-gray-500 text-xs font-medium">Support</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
