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
  {
    id: 5,
    title: "24/7 Support",
    description: "We are here to help you anytime",
    icon: <FaHeadset className="text-3xl text-primary" />,
  },
  {
    id: 6,
    title: "Trusted Network",
    description: "A trusted healthcare network you can rely on",
    icon: <FaNetworkWired className="text-3xl text-primary" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900 mb-3">
            Why Choose MediCare Connect?
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
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
              <h3 className="text-sm font-poppins font-bold text-gray-900 mb-2 leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 font-inter leading-relaxed">
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
