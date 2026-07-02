import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaMapMarkerAlt, FaStethoscope, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
import { formatToDDMMYYYY } from "../../../utils/dateUtils";
import AppointmentForm from "../../appointments/AppointmentForm";

const BookAppointmentModal = ({ isOpen, onClose, onSubmit, config = {} }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mode = "book", initialData = {}, lockedFields = [] } = config;

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

  const handleSubmit = async (formData, selectedDoctor) => {
    if (!formData.specialty || !formData.doctorId || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        patientEmail: user?.email,
        patientName: user?.name || "Patient",
        patientImage: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        doctorEmail: selectedDoctor?.email,
        doctorId: selectedDoctor?._id || selectedDoctor?.id,
        doctorName: selectedDoctor?.name || "Unknown Doctor",
        specialty: selectedDoctor?.specialty || formData.specialty,
        doctorImage: selectedDoctor?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        date: formatToDDMMYYYY(formData.date),
        time: formData.time,
        type: formData.type,
        symptoms: formData.symptoms.length > 0 ? formData.symptoms : (formData.customSymptom ? [formData.customSymptom] : []),
        fee: selectedDoctor?.feeAmount || 500,
        aptId: `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
      };

      const response = await axiosInstance.post('/appointments', payload);

      if (response.data.success) {
        toast.success("Appointment booked successfully!");

        if (onSubmit && selectedDoctor) {
          // Pass the new fully-formed appointment back to parent to update local state immediately
          onSubmit({
            id: response.data.data.insertedId || Date.now(),
            aptId: payload.aptId,
            doctorName: payload.doctorName,
            specialty: payload.specialty,
            date: payload.date,
            time: payload.time,
            type: payload.type,
            status: "Upcoming",
            rawStatus: "pending",
            image: payload.doctorImage,
            fee: payload.fee,
            paymentStatus: "unpaid",
            patientEmail: payload.patientEmail,
            doctorEmail: payload.doctorEmail,
            patientName: payload.patientName
          });
        }

        // Close
        onClose();

        // Navigate only for New Appointment mode
        if (mode === "book" || mode === "new" || !mode) {
          window.location.href = '/dashboard/patient/appointments';
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold font-poppins text-gray-900">
                  {mode === "doctor" ? "Book Appointment" : "New Appointment"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === "doctor" 
                    ? "Schedule a consultation with this specialist." 
                    : "Schedule a consultation with any specialist in our network."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto overscroll-contain custom-scrollbar">
              <AppointmentForm 
                mode={mode}
                initialData={initialData}
                lockedFields={lockedFields}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookAppointmentModal;
