import { motion } from "framer-motion";
import { FaUserMd } from "react-icons/fa";

const ProfileManagement = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]"
      >
        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mb-4">
          <FaUserMd />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Public Profile</h2>
        <p className="text-gray-500 max-w-md">
          Update your bio, qualifications, clinic location, and consultation fees. (Coming Soon)
        </p>
      </motion.div>
    </div>
  );
};

export default ProfileManagement;
