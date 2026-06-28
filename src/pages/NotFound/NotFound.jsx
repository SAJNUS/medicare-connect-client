import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 Not Found - MediCare Connect";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.2
          }}
          className="w-24 h-24 bg-teal-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FaExclamationTriangle className="text-4xl" />
        </motion.div>

        <h1 className="text-7xl font-poppins font-black text-gray-900 tracking-tighter mb-4">
          4<span className="text-primary">0</span>4
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed px-2">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-xl px-8 py-3.5 shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-fit font-semibold transition-all hover:scale-105"
        >
          <FaHome className="text-lg" />
          Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
