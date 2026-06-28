import { motion } from "framer-motion";
import { FaCalendarCheck, FaFilePrescription, FaUserMd } from "react-icons/fa";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Upcoming Appointments",
      value: "2",
      icon: <FaCalendarCheck className="text-primary" />,
      bg: "bg-teal-50",
    },
    {
      title: "New Prescriptions",
      value: "1",
      icon: <FaFilePrescription className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Consulted Doctors",
      value: "4",
      icon: <FaUserMd className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-1">
            Welcome back, John!
          </h2>
          <p className="text-gray-500">
            Here's what's happening with your health profile today.
          </p>
        </div>
        <button className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-xl px-6">
          Book New Appointment
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 leading-tight">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]"
      >
        <h3 className="text-lg font-poppins font-bold text-gray-900 mb-4">Recent Activity</h3>

        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <FaCalendarCheck className="text-gray-300 text-2xl" />
          </div>
          <p className="text-gray-500 font-medium">No recent activity yet.</p>
          <p className="text-sm text-gray-400 mt-1">Book an appointment to get started.</p>
        </div>
      </motion.div>

    </div>
  );
};

export default DashboardOverview;
