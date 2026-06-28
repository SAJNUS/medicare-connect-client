import { motion } from "framer-motion";

const AdminDashboard = () => {
  return (
    <div className="space-y-8 pb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-1">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Manage users, doctors, and system settings here.
          </p>
        </div>
      </motion.div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Admin features coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
