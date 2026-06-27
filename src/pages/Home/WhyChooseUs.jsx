import { motion } from "framer-motion";
import { FaUserCheck, FaLock, FaFileMedical, FaCalendarCheck, FaHeadset, FaNetworkWired } from "react-icons/fa";

const features = [
  {
    id: 1,
    title: "Verified Doctors",
    description: "All doctors are verified and experienced",
    icon: <FaUserCheck className="text-3xl text-primary" />,
  },
  {
    id: 2,
    title: "Secure Payments",
    description: "Your payments are safe and encrypted",
    icon: <FaLock className="text-3xl text-primary" />,
  },
  {
    id: 3,
    title: "Digital Prescriptions",
    description: "Get digital prescriptions and reports easily",
    icon: <FaFileMedical className="text-3xl text-primary" />,
  },
  {
    id: 4,
    title: "Fast Appointments",
    description: "Book appointments in just a few clicks",
    icon: <FaCalendarCheck className="text-3xl text-primary" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900 mb-3">
            Why Choose MediCare Connect?
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-[12px] xl:text-[14px] font-poppins font-bold text-gray-900 mb-2 leading-tight whitespace-nowrap">
                {feature.title}
              </h3>
              <p className="text-[11px] xl:text-xs text-gray-500 font-inter leading-relaxed max-w-[150px] mx-auto line-clamp-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
