import { motion } from "framer-motion";
import { FaPhoneAlt, FaArrowRight } from "react-icons/fa";

const EmergencyCTA = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b6e66] rounded-3xl overflow-hidden relative shadow-xl">
          <div className="flex flex-col lg:flex-row items-center">

            {/* Left Image Side */}
            <div className="w-full lg:w-1/3 p-8 lg:p-0 flex justify-center lg:justify-start relative z-10">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Ambulance"
                className="w-full max-w-sm rounded-xl object-cover h-48 lg:h-full lg:rounded-none mix-blend-luminosity opacity-80"
              />
              <div className="absolute inset-0 bg-[#0b6e66]/40 lg:hidden"></div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col justify-center items-start z-10 relative">
              <div className="text-left mb-8 w-full">
                <motion.h2
                  className="text-xl md:text-2xl lg:text-[26px] font-poppins font-bold text-white mb-3 leading-tight whitespace-nowrap"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Need Immediate Medical Assistance?
                </motion.h2>
                <motion.p
                  className="text-teal-50 font-inter text-sm max-w-md mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Our emergency support is available 24/7 for you and your family.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="border border-teal-400/50 hover:bg-teal-600/30 transition-colors rounded-xl py-3 px-6 flex items-center w-full sm:w-auto cursor-pointer">
                  <div className="bg-teal-500/30 p-2 rounded-full mr-3 text-white">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-teal-100 text-[10px] font-medium tracking-wide">Emergency Hotline</p>
                    <p className="text-white font-bold text-base">+880 1234-567890</p>
                  </div>
                </div>

                <button className="bg-white hover:bg-gray-50 text-[#0b6e66] w-full sm:w-auto rounded-xl px-6 py-4 font-bold text-sm flex items-center justify-center transition-colors">
                  Book Appointment <FaArrowRight className="ml-2" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M45.7,-76.3C58.9,-69.3,69.1,-56,76.5,-42.2C83.9,-28.3,88.4,-14.2,87.6,-0.5C86.8,13.3,80.7,26.5,73,38.8C65.2,51,55.9,62.3,43.7,70.5C31.5,78.7,15.7,83.9,0.5,83.1C-14.8,82.3,-29.5,75.4,-42.1,66.8C-54.7,58.2,-65.2,47.9,-72.7,35.7C-80.2,23.5,-84.7,9.5,-83.4,-3.9C-82.1,-17.3,-74.9,-30.1,-65.8,-41C-56.7,-51.9,-45.6,-60.9,-33.4,-68.4C-21.2,-75.8,-10.6,-81.8,2.7,-86.3C16,-90.7,32.5,-83.4,45.7,-76.3Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyCTA;
