import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FaTimes, FaAppleAlt, FaBed, FaRunning, FaSyringe, FaStethoscope, FaBrain, FaHeartbeat, FaHandsWash } from "react-icons/fa";
import { FaGlassWater, FaSpa } from "react-icons/fa6";

const healthTips = [
  {
    id: 1,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily to keep your body functioning optimally.",
    icon: <FaGlassWater className="text-blue-500" />,
    bg: "bg-blue-50 border-blue-100",
  },
  {
    id: 2,
    title: "Regular Exercise",
    description: "Aim for at least 30 minutes of moderate physical activity every day.",
    icon: <FaRunning className="text-green-500" />,
    bg: "bg-green-50 border-green-100",
  },
  {
    id: 3,
    title: "Healthy Diet",
    description: "Eat a balanced diet rich in fruits, vegetables, lean proteins, and whole grains.",
    icon: <FaAppleAlt className="text-red-500" />,
    bg: "bg-red-50 border-red-100",
  },
  {
    id: 4,
    title: "Adequate Sleep",
    description: "Ensure 7-9 hours of quality sleep each night for physical and mental recovery.",
    icon: <FaBed className="text-indigo-500" />,
    bg: "bg-indigo-50 border-indigo-100",
  },
  {
    id: 5,
    title: "Stress Management",
    description: "Practice mindfulness, meditation, or yoga to keep your stress levels in check.",
    icon: <FaSpa className="text-teal-500" />,
    bg: "bg-teal-50 border-teal-100",
  },
  {
    id: 6,
    title: "Vaccination",
    description: "Keep your vaccines up-to-date to build immunity against preventable diseases.",
    icon: <FaSyringe className="text-orange-500" />,
    bg: "bg-orange-50 border-orange-100",
  },
  {
    id: 7,
    title: "Routine Checkups",
    description: "Visit your doctor regularly for preventive screenings and health assessments.",
    icon: <FaStethoscope className="text-cyan-500" />,
    bg: "bg-cyan-50 border-cyan-100",
  },
  {
    id: 8,
    title: "Hand Hygiene",
    description: "Wash your hands frequently with soap and water to prevent the spread of germs.",
    icon: <FaHandsWash className="text-sky-500" />,
    bg: "bg-sky-50 border-sky-100",
  },
  {
    id: 9,
    title: "Mental Health Care",
    description: "Seek professional support without hesitation when feeling overwhelmed or depressed.",
    icon: <FaBrain className="text-purple-500" />,
    bg: "bg-purple-50 border-purple-100",
  },
];

const HealthTipsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-inter">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-primary text-xl">
                  <FaHeartbeat />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-gray-900">Essential Health Tips</h2>
                  <p className="text-sm text-gray-500 mt-1">Simple habits for a healthier, happier life.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto overscroll-contain custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthTips.map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border ${tip.bg} hover:shadow-md transition-shadow flex flex-col items-start gap-4`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">{tip.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HealthTipsModal;
