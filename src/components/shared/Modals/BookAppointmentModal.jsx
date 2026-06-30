import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaMapMarkerAlt, FaStethoscope, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";

const specialties = ["Cardiologist", "Neurologist", "Dermatologist", "Orthopedic", "Pediatrician"];

const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];

const symptomMap = {
  "Cardiologist": ["Chest Pain", "Shortness of Breath", "High Blood Pressure", "Palpitations", "Dizziness"],
  "Neurologist": ["Headaches", "Seizures", "Numbness", "Memory Loss", "Muscle Weakness"],
  "Dermatologist": ["Rash", "Itching", "Acne", "Moles", "Skin Discoloration"],
  "Orthopedic": ["Joint Pain", "Back Pain", "Fracture", "Swelling", "Stiffness"],
  "Pediatrician": ["Fever", "Cough", "Vomiting", "Vaccination", "Growth Check"],
};

const BookAppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    specialty: "",
    doctorId: "",
    type: "In-Person Consult",
    date: "",
    time: "",
    symptoms: [],
    customSymptom: ""
  });
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctors');
        if (response.data.success) {
          // Keep frontend structure intact
          setDoctors(response.data.data.map(doc => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.specialization || doc.specialty || "General",
            email: doc.email,
            image: doc.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          })));
        }
      } catch (err) {
        console.error("Error fetching doctors for modal:", err);
      }
    };
    if (isOpen) fetchDoctors();
  }, [isOpen]);

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

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "specialty") {
      setFormData(prev => ({
        ...prev,
        specialty: String(value),
        doctorId: "",
        symptoms: [],
        customSymptom: ""
      }));
      setIsOtherSelected(false);
    } else {
      setFormData(prev => ({ ...prev, [name]: String(value) }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => {
      const current = prev.symptoms;
      if (current.includes(symptom)) {
        return { ...prev, symptoms: current.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...current, symptom] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialty || !formData.doctorId || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDoctor = doctors.find(d => String(d.id) === String(formData.doctorId));

      const payload = {
        patientEmail: user?.email,
        patientName: user?.name || "Patient",
        patientImage: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        doctorEmail: selectedDoctor?.email,
        doctorName: selectedDoctor?.name || "Unknown Doctor",
        specialty: selectedDoctor?.specialty || formData.specialty,
        doctorImage: selectedDoctor?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        date: formData.date,
        time: formData.time,
        type: formData.type,
        symptoms: formData.symptoms.length > 0 ? formData.symptoms : (formData.customSymptom ? [formData.customSymptom] : []),
        fee: selectedDoctor?.fee || 1000,
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
            image: payload.doctorImage
          });
        }

        // Reset and close
        setFormData({
          specialty: "",
          doctorId: "",
          type: "In-Person Consult",
          date: "",
          time: "",
          symptoms: [],
          customSymptom: ""
        });
        setIsOtherSelected(false);
        onClose();
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(d => d.specialty === formData.specialty);
  const availableSymptoms = formData.specialty ? (symptomMap[formData.specialty] || ["General Symptoms"]) : [];
  const dynamicSpecialties = Array.from(new Set(doctors.map(d => d.specialty)));

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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold font-poppins text-gray-900">Book Appointment</h2>
                <p className="text-sm text-gray-500 mt-1">Schedule a new consultation with our experts.</p>
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
              <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Specialty Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaStethoscope className="text-teal-500" /> Select Specialty *
                    </label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900"
                    >
                      <option value="" disabled hidden>Choose specialty...</option>
                      {dynamicSpecialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUserMd className="text-teal-500" /> Select Doctor *
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                      disabled={!formData.specialty}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled hidden>
                        {!formData.specialty ? "Select specialty first" : "Choose a doctor..."}
                      </option>
                      {filteredDoctors.map(doc => (
                        <option key={doc.id} value={String(doc.id)}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Consultation Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => handleTypeSelect("In-Person Consult")}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${formData.type === "In-Person Consult"
                        ? "border-primary bg-teal-50/50 shadow-sm"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.type === "In-Person Consult" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <p className={`font-bold transition-colors ${formData.type === "In-Person Consult" ? "text-gray-900" : "text-gray-700"}`}>In-Person</p>
                        <p className="text-xs text-gray-500">Visit the clinic</p>
                      </div>
                    </div>

                    <div
                      onClick={() => handleTypeSelect("Video Consult")}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${formData.type === "Video Consult"
                        ? "border-primary bg-teal-50/50 shadow-sm"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.type === "Video Consult" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                        <FaVideo />
                      </div>
                      <div>
                        <p className={`font-bold transition-colors ${formData.type === "Video Consult" ? "text-gray-900" : "text-gray-700"}`}>Video Consult</p>
                        <p className="text-xs text-gray-500">Online consultation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" /> Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaClock className="text-orange-500" /> Time Slot *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900"
                    >
                      <option value="" disabled hidden>Choose a time slot...</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dynamic Symptoms Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Symptoms or Reason for Visit (Optional)</label>

                  {!formData.specialty ? (
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-500">
                      Select a specialty first to see common symptoms.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {availableSymptoms.map(symptom => {
                          const isSelected = formData.symptoms.includes(symptom);
                          return (
                            <button
                              key={symptom}
                              type="button"
                              onClick={() => toggleSymptom(symptom)}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${isSelected
                                ? "bg-teal-50 border-primary text-primary"
                                : "bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50"
                                }`}
                            >
                              {isSelected && <FaCheck className="text-xs" />}
                              {symptom}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setIsOtherSelected(!isOtherSelected)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isOtherSelected
                            ? "bg-teal-50 border-primary text-primary"
                            : "bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50"
                            }`}
                        >
                          Other
                        </button>
                      </div>

                      {/* Custom Input for 'Other' */}
                      <AnimatePresence>
                        {isOtherSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-2"
                          >
                            <input
                              type="text"
                              name="customSymptom"
                              value={formData.customSymptom}
                              onChange={handleInputChange}
                              placeholder="Type your specific reason or symptoms..."
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none text-sm"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 sm:p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 sm:justify-end shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full sm:w-auto text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="appointment-form"
                disabled={isSubmitting || !formData.specialty || !formData.doctorId || !formData.date || !formData.time}
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-[#095c55] transition-colors shadow-lg shadow-primary/30 w-full sm:w-auto text-center flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookAppointmentModal;
