import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaMapMarkerAlt, FaStethoscope, FaCheck, FaWallet } from "react-icons/fa";
import { formatToDDMMYYYY, generateAvailableTimeSlots } from "../../utils/dateUtils";
import axiosInstance from "../../api/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const specialties = ["Cardiologist", "Neurologist", "Dermatologist", "Orthopedic", "Pediatrician"];

const symptomMap = {
  "Cardiologist": ["Chest Pain", "Shortness of Breath", "High Blood Pressure", "Palpitations", "Dizziness"],
  "Neurologist": ["Headaches", "Seizures", "Numbness", "Memory Loss", "Muscle Weakness"],
  "Dermatologist": ["Rash", "Itching", "Acne", "Moles", "Skin Discoloration"],
  "Orthopedic": ["Joint Pain", "Back Pain", "Fracture", "Swelling", "Stiffness"],
  "Pediatrician": ["Fever", "Cough", "Vomiting", "Vaccination", "Growth Check"],
};

const AppointmentForm = ({ 
  mode = "book", 
  initialData = {}, 
  lockedFields = [], 
  onSubmit, 
  isSubmitting, 
  onCancel 
}) => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    specialty: initialData.specialty || "",
    doctorId: initialData.doctorId || "",
    type: initialData.type || "In-Person Consult",
    date: initialData.date || "",
    time: initialData.time || "",
    symptoms: initialData.symptoms || [],
    customSymptom: initialData.customSymptom || ""
  });
  
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const dateInputRef = useRef(null);

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    // If it's already YYYY-MM-DD
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
      return new Date(dateStr);
    }
    // If it's DD-MM-YYYY
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const submitText = mode === "reschedule" ? "Confirm Reschedule" : "Confirm Booking";

  const handleDateClick = (e) => {
    e.preventDefault();
    if (dateInputRef.current) {
      dateInputRef.current.type = "date";
      if (dateInputRef.current.showPicker) {
        try {
          dateInputRef.current.showPicker();
        } catch (err) {
          console.error(err);
        }
      }
      setIsDateFocused(true);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctors?limit=100');
        if (response.data.success) {
          setDoctors(response.data.data.map(doc => ({
            _id: doc._id,
            name: doc.name,
            specialty: doc.specialization || doc.specialty || "General",
            email: doc.email,
            image: doc.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            feeAmount: doc.consultationFee || doc.fee || 500,
            availableDays: doc.availableDays || [],
            availableTimeSlots: doc.availableTimeSlots || null
          })));
        }
      } catch (err) {
        console.error("Error fetching doctors for form:", err);
      }
    };
    fetchDoctors();
  }, []);

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
      setFormData(prev => ({ 
        ...prev, 
        [name]: String(value),
        ...(name === "date" ? { time: "" } : {}) 
      }));
      if (name === "date") {
        setIsDateFocused(false);
        if (dateInputRef.current) dateInputRef.current.type = "text";
      }
    }
  };

  const handleTypeSelect = (type) => {
    if (isTypeLocked) return;
    setFormData(prev => ({ ...prev, type }));
  };

  const selectedDoctor = doctors.find(d => String(d._id) === String(formData.doctorId)) || 
    (formData.doctorId && initialData.doctorName ? {
      _id: formData.doctorId,
      name: initialData.doctorName,
      feeAmount: initialData.fee || initialData.feeAmount || 500,
      availableDays: initialData.availableDays || null,
      availableTimeSlots: initialData.availableTimeSlots || null
    } : null);
  const availableTimeSlots = selectedDoctor?.availableTimeSlots || null;
  const availableDays = selectedDoctor?.availableDays || [];



  const isDateAvailable = (date) => {
    if (!availableDays || availableDays.length === 0) return true;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return availableDays.includes(dayName);
  };

  const toggleSymptom = (symptom) => {
    if (lockedFields.includes('symptoms')) return;
    setFormData(prev => {
      const current = prev.symptoms;
      if (current.includes(symptom)) {
        return { ...prev, symptoms: current.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...current, symptom] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(d => String(d._id) === String(formData.doctorId)) || (lockedFields.includes('doctorId') ? { _id: formData.doctorId, name: initialData.doctorName, email: initialData.doctorEmail, specialty: initialData.specialty } : null);
    onSubmit(formData, selectedDoctor);
  };

  const filteredDoctors = formData.specialty ? doctors.filter(d => d.specialty?.toLowerCase().trim() === formData.specialty?.toLowerCase().trim()) : doctors;
  const availableSymptoms = formData.specialty ? (symptomMap[formData.specialty] || ["General Symptoms"]) : [];
  const ALL_SPECIALTIES = [
    "Cardiology", "Neurology", "Orthopedics", "Gynecology", 
    "Pediatrics", "Dermatology", "Psychiatry", "Dentistry"
  ];
  const dynamicSpecialties = Array.from(new Set([...ALL_SPECIALTIES, ...doctors.map(d => d.specialty)]));
  
  const isTypeLocked = lockedFields.includes('type');
  const isDoctorLocked = lockedFields.includes('doctorId');
  const isSpecialtyLocked = lockedFields.includes('specialty');
  const isSymptomsLocked = lockedFields.includes('symptoms');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Specialty Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaStethoscope className="text-teal-500" /> Select Specialty *
          </label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
            disabled={isSpecialtyLocked}
            className={`w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900 ${isSpecialtyLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="" disabled hidden>Choose specialty...</option>
            {isSpecialtyLocked && !dynamicSpecialties.includes(formData.specialty) && <option value={formData.specialty}>{formData.specialty}</option>}
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
            disabled={!formData.specialty || isDoctorLocked}
            className={`w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900 ${!formData.specialty || isDoctorLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="" disabled hidden>
              {!formData.specialty ? "Select specialty first" : "Choose a doctor..."}
            </option>
            {isDoctorLocked && !filteredDoctors.find(d => String(d._id) === String(formData.doctorId)) && <option value={formData.doctorId}>{initialData.doctorName || formData.doctorId}</option>}
            {filteredDoctors.map(doc => (
              <option key={doc._id} value={String(doc._id)}>{doc.name}</option>
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
            className={`border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${isTypeLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${formData.type === "In-Person Consult"
              ? "border-red-500 bg-red-50 shadow-sm"
              : "border-gray-100 hover:border-gray-300 bg-white"
              }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.type === "In-Person Consult" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className={`font-bold transition-colors ${formData.type === "In-Person Consult" ? "text-gray-900" : "text-gray-700"}`}>In-Person</p>
              <p className="text-xs text-gray-500">Visit the clinic</p>
            </div>
          </div>

          <div
            onClick={() => handleTypeSelect("Video Consult")}
            className={`border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${isTypeLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${formData.type === "Video Consult"
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-100 hover:border-gray-300 bg-white"
              }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.type === "Video Consult" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Date *
          </label>
            <DatePicker
              selected={parseDateString(formData.date)}
              onChange={(date) => {
                if (date) {
                  const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                  const dateString = offsetDate.toISOString().split('T')[0];
                  handleInputChange({ target: { name: 'date', value: dateString } });
                } else {
                  handleInputChange({ target: { name: 'date', value: "" } });
                }
              }}
              filterDate={isDateAvailable}
              minDate={new Date()}
              disabled={!formData.doctorId}
              placeholderText={!formData.doctorId ? "Please select a doctor first" : "Select date"}
              className={`w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer text-gray-900 ${!formData.doctorId ? 'opacity-70 cursor-not-allowed' : ''}`}
              wrapperClassName="w-full"
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
            disabled={!formData.date}
            className={`w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer appearance-none text-gray-900 ${!formData.date ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <option value="" disabled hidden>{formData.date ? "Choose a time slot..." : "Select date first"}</option>
            {generateAvailableTimeSlots(formData.date, availableTimeSlots).map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Consultation Fee Display */}
      <div className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 flex justify-center items-center overflow-hidden h-[54px]">
          <AnimatePresence mode="wait">
            {!selectedDoctor ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 font-medium text-center w-full"
              >
                Consultation Fee
              </motion.div>
            ) : (
              <motion.div
                key="fee"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-primary text-center w-full"
              >
                BDT {selectedDoctor.feeAmount || 500}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Dynamic Symptoms Tags */}
      {!isSymptomsLocked && mode !== "reschedule" && (
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
                      placeholder="Please specify your symptoms..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none text-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-[#0b6e66] transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : submitText}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
