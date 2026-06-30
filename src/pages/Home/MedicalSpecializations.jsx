import { FaHeartbeat, FaBrain, FaBaby, FaBone, FaUserMd, FaVenus, FaTooth, FaHeadSideVirus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const specializations = [
  { id: 1, title: "Cardiology", icon: <FaHeartbeat className="text-3xl" /> },
  { id: 2, title: "Neurology", icon: <FaBrain className="text-3xl" /> },
  { id: 3, title: "Pediatrics", icon: <FaBaby className="text-3xl" /> },
  { id: 4, title: "Orthopedics", icon: <FaBone className="text-3xl" /> },
  { id: 5, title: "Dermatology", icon: <FaUserMd className="text-3xl" /> }, // Substitute icon
  { id: 6, title: "Gynecology", icon: <FaVenus className="text-3xl" /> },
  { id: 7, title: "Dentistry", icon: <FaTooth className="text-3xl" /> },
  { id: 8, title: "Psychiatry", icon: <FaHeadSideVirus className="text-3xl" /> },
];

const MedicalSpecializations = () => {
  const navigate = useNavigate();
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900 mb-3">
            Medical Specializations
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
          {specializations.map((spec, index) => (
            <motion.div
              key={spec.id}
              onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec.title)}&sortBy=experience_desc`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="text-primary opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300 mb-4 bg-teal-50 p-4 rounded-full">
                {spec.icon}
              </div>
              <h3 className="text-[13px] md:text-sm font-poppins font-medium text-gray-800 text-center">
                {spec.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalSpecializations;
