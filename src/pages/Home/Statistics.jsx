import { motion } from "framer-motion";
import { FaUserMd, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";

const stats = [
  { id: 1, value: "500+", label: "Total Doctors", icon: <FaUserMd className="text-2xl text-blue-500" />, bg: "bg-blue-50" },
  { id: 2, value: "50K+", label: "Total Patients", icon: <FaUsers className="text-2xl text-teal-500" />, bg: "bg-teal-50" },
  { id: 3, value: "25K+", label: "Total Appointments", icon: <FaCalendarAlt className="text-2xl text-blue-500" />, bg: "bg-blue-50" },
  { id: 4, value: "10K+", label: "Total Reviews", icon: <FaStar className="text-2xl text-yellow-500" />, bg: "bg-yellow-50" },
];

const Statistics = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-1 leading-none">
                  {stat.value}
                </h3>
                <p className="text-gray-500 font-inter text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
