import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserEdit, FaCamera, FaSave, FaTimes, FaUser, FaBirthdayCake, FaTint, FaVenusMars, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeartbeat, FaBriefcase, FaLock } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-hot-toast";
import { updateProfile, updatePassword } from "firebase/auth";
import auth from "../../../firebase/firebase.config";

const initialProfileData = {
  // Personal
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  occupation: "",
  // Contact
  email: "",
  phone: "",
  address: "",
  password: "",
  // Emergency
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  image: ""
};

const MyProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [formData, setFormData] = useState(initialProfileData);

  useEffect(() => {
    if (user) {
      const parts = (user.name || "").trim().split(/\s+/);
      let newFirstName = "";
      let newLastName = "";
      
      if (parts.length <= 2) {
        newFirstName = parts[0] || "";
        newLastName = parts[1] || "";
      } else {
        newLastName = parts.pop() || "";
        newFirstName = parts.join(" ");
      }
      
      const updatedData = {
        ...initialProfileData,
        firstName: newFirstName,
        lastName: newLastName,
        email: user.email || "",
        image: user.avatar || user.photoURL || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        occupation: user.occupation || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyName: user.emergencyName || "",
        emergencyRelation: user.emergencyRelation || "",
        emergencyPhone: user.emergencyPhone || "",
      };
      setProfileData(updatedData);
      setFormData(updatedData);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit: reset form data to current profile data
      setFormData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isGoogleSignIn = user?.providerData?.some(p => p.providerId === 'google.com');

  let creationDateText = "recently";
  const creationTimeSource = user?.metadata?.creationTime || user?.createdAt;
  if (creationTimeSource) {
    const d = new Date(creationTimeSource);
    if (!isNaN(d)) {
      creationDateText = `on ${d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      delete updateData.password; // Don't store password in MongoDB profile schema

      const res = await axiosInstance.patch(`/users/${user.email}/profile`, updateData);
      
      if (res.data.success) {
        if (!isGoogleSignIn && auth.currentUser) {
          const newName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
          
          if (newName !== auth.currentUser.displayName) {
            await updateProfile(auth.currentUser, { displayName: newName });
          }
          if (formData.password && formData.password.trim() !== '') {
            await updatePassword(auth.currentUser, formData.password);
          }
        }
        
        // Ensure the password isn't visible in the view state
        const savedData = { ...formData, password: "" };
        setProfileData(savedData);
        setFormData(savedData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    }
  };

  const handleImageUpload = () => {
    alert("Mock image upload triggered. In a real app, this would open a file picker.");
  };

  const renderField = (icon, label, name, type = "text", options = null, isTextArea = false, disabled = false, isRequired = false) => {
    if (!isEditing) {
      let displayValue = profileData[name] || "N/A";
      if (type === 'date' && profileData[name]) {
        const parts = profileData[name].split('-');
        if (parts.length === 3) {
          displayValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      return (
        <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 h-full">
          <div className="mt-0.5 text-primary">{icon}</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            {type === 'password' ? (
              <p className="text-sm font-semibold text-gray-900">********</p>
            ) : (
              <p className="text-sm font-semibold text-gray-900">{displayValue}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
          <span className="text-primary">{icon}</span> {label}
        </label>
        {isTextArea ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            rows={2}
            disabled={disabled}
            className={`w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}`}
          />
        ) : options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}`}
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            required={isRequired && type !== 'password'} // Password is not required if they don't want to change it
            disabled={disabled}
            placeholder={type === 'password' ? '******** (Leave empty to keep current)' : ''}
            className={`w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}`}
          />
        )}
      </div>
    );
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-5xl mx-auto space-y-8 pb-8"
    >
      
      {/* Header & Global Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
          <p className="text-sm font-medium text-gray-500">Manage your personal and medical information.</p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-focus transition-colors shadow-sm shadow-primary/20"
              >
                <FaSave /> Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-focus transition-colors shadow-sm shadow-primary/20"
            >
              <FaUserEdit /> Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      {isEditing && isGoogleSignIn && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium flex items-center gap-3"
        >
          <FaCircleInfo className="text-lg shrink-0" />
          <span>This account was created using Google. Name, email, and password cannot be changed.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Photo & Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Picture Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm">
                <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="absolute inset-0 bg-gray-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                >
                  <FaCamera className="text-2xl" />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-sm font-semibold text-primary mb-4">
              {profileData.email}
            </p>
            <div className="w-full pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">
                Joined {creationDateText}
              </p>
            </div>
          </motion.div>

          {/* Emergency Contact Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-red-500" /> Emergency Contact
            </h3>
            <div className="space-y-4">
              {renderField(<FaUser />, "Contact Name", "emergencyName")}
              {renderField(<FaUser />, "Relationship", "emergencyRelation", "text", ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"])}
              {renderField(<FaPhone />, "Phone Number", "emergencyPhone", "tel")}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(<FaUser />, "First Name", "firstName", "text", null, false, isGoogleSignIn, true)}
              {renderField(<FaUser />, "Last Name", "lastName", "text", null, false, isGoogleSignIn, false)}
              {renderField(<FaBirthdayCake />, "Date of Birth", "dateOfBirth", "date", null, false, false, false)}
              {renderField(<FaVenusMars />, "Gender", "gender", "text", ["Male", "Female", "Other", "Prefer not to say"], false, false, false)}
              {renderField(<FaTint />, "Blood Group", "bloodGroup", "text", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], false, false, false)}
              {renderField(<FaBriefcase />, "Occupation", "occupation", "text", null, false, false, false)}
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField(<FaEnvelope />, "Email Address", "email", "email", null, false, true, true)}
              {renderField(<FaPhone />, "Phone Number", "phone", "tel", null, false, false, false)}
              <div className="md:col-span-2">
                {renderField(<FaMapMarkerAlt />, "Home Address", "address", "text", null, true, false, false)}
              </div>
            </div>
          </motion.div>

          {/* Security Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Security Information</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {renderField(<FaLock />, "Password", "password", "password", null, false, isGoogleSignIn, true)}
            </div>
          </motion.div>

        </div>
      </div>
    </form>
  );
};

export default MyProfile;
