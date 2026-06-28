import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const AppointmentRequests = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Appointment Requests</h1>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]"
      >
        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl mb-4">
          <FaClipboardList />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Pending Requests</h2>
        <p className="text-gray-500 max-w-md">
          Review, approve, or reschedule incoming appointment requests from patients. (Coming Soon)
        </p>
      </motion.div>
    </div>
  );
};

export default AppointmentRequests;
