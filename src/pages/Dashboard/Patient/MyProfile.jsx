import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const MyProfile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]"
      >
        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mb-4">
          <FaUserCircle />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Details</h2>
        <p className="text-gray-500 max-w-md">
          Manage your personal information, contact details, and account security settings here. (Coming Soon)
        </p>
      </motion.div>
    </div>
  );
};

export default MyProfile;
