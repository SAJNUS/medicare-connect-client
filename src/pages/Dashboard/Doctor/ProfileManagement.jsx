import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaSave, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { toast } from "react-hot-toast";

const initialProfile = {
  name: "Dr. Sarah Jenkins",
  specialty: "Cardiologist",
  qualifications: "MBBS, MD (Cardiology), FACC",
  experience: 12,
  consultationFee: 150,
  availableSlots: "Mon-Fri: 09:00 AM - 05:00 PM"
};

const ProfileManagement = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!profile.qualifications.trim()) {
      newErrors.qualifications = "Qualifications cannot be empty.";
    }
    if (profile.experience === "" || profile.experience < 0) {
      newErrors.experience = "Experience must be 0 or greater.";
    }
    if (profile.consultationFee === "" || profile.consultationFee <= 0) {
      newErrors.consultationFee = "Consultation fee must be greater than 0.";
    }
    if (!profile.availableSlots.trim()) {
      newErrors.availableSlots = "Available slots cannot be empty.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    setIsSaving(true);
    
    // Mock API delay
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5"
      >
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
          <FaUserMd />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Management</h1>
          <p className="text-sm font-medium text-gray-500">Update your public profile and consultation details.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Professional Information</h2>
          <p className="text-xs text-gray-500 mt-1">This information will be displayed to patients booking an appointment.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400">Contact admin to change your registered name.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Specialty</label>
              <input 
                type="text" 
                value={profile.specialty}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FaGraduationCap className="text-teal-500" /> Qualifications
            </label>
            <input 
              type="text" 
              value={profile.qualifications}
              onChange={(e) => {
                setProfile({...profile, qualifications: e.target.value});
                if (errors.qualifications) setErrors({...errors, qualifications: null});
              }}
              className={`w-full px-4 py-3 bg-white border ${errors.qualifications ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'} rounded-xl text-sm transition-all font-medium text-gray-900 focus:outline-none focus:ring-2`}
              placeholder="e.g. MBBS, MD (Cardiology)"
            />
            {errors.qualifications && <p className="text-xs text-red-500 font-medium">{errors.qualifications}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FaBriefcase className="text-teal-500" /> Experience (Years)
              </label>
              <input 
                type="number" 
                min="0"
                value={profile.experience}
                onChange={(e) => {
                  setProfile({...profile, experience: e.target.value === '' ? '' : Number(e.target.value)});
                  if (errors.experience) setErrors({...errors, experience: null});
                }}
                className={`w-full px-4 py-3 bg-white border ${errors.experience ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'} rounded-xl text-sm transition-all font-medium text-gray-900 focus:outline-none focus:ring-2`}
                placeholder="e.g. 10"
              />
              {errors.experience && <p className="text-xs text-red-500 font-medium">{errors.experience}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FaMoneyBillWave className="text-teal-500" /> Consultation Fee ($)
              </label>
              <input 
                type="number" 
                min="1"
                value={profile.consultationFee}
                onChange={(e) => {
                  setProfile({...profile, consultationFee: e.target.value === '' ? '' : Number(e.target.value)});
                  if (errors.consultationFee) setErrors({...errors, consultationFee: null});
                }}
                className={`w-full px-4 py-3 bg-white border ${errors.consultationFee ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'} rounded-xl text-sm transition-all font-medium text-gray-900 focus:outline-none focus:ring-2`}
                placeholder="e.g. 100"
              />
              {errors.consultationFee && <p className="text-xs text-red-500 font-medium">{errors.consultationFee}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FaClock className="text-teal-500" /> Available Slots Overview
            </label>
            <input 
              type="text" 
              value={profile.availableSlots}
              onChange={(e) => {
                setProfile({...profile, availableSlots: e.target.value});
                if (errors.availableSlots) setErrors({...errors, availableSlots: null});
              }}
              className={`w-full px-4 py-3 bg-white border ${errors.availableSlots ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-teal-500/20 focus:border-teal-500'} rounded-xl text-sm transition-all font-medium text-gray-900 focus:outline-none focus:ring-2`}
              placeholder="e.g. Mon-Fri: 09:00 AM - 05:00 PM"
            />
            {errors.availableSlots && <p className="text-xs text-red-500 font-medium">{errors.availableSlots}</p>}
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 shadow-sm shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><FaSave /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileManagement;
