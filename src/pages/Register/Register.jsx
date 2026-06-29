import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const { createUser, signInWithGoogle, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("Patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (formData.photoURL && !/^https?:\/\/.+/.test(formData.photoURL)) {
      newErrors.photoURL = "Must be a valid URL starting with http/https";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = "Password must contain a lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must contain an uppercase letter";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Pre-check MongoDB to avoid dangling Firebase accounts
        try {
          await axiosInstance.get(`/users/${formData.email}`);
          toast.error("User with this email already exists.");
          setIsLoading(false);
          return;
        } catch (dbError) {
          if (dbError.response && dbError.response.status !== 404) {
            throw dbError;
          }
        }

        // Create user in Firebase
        const userCredential = await createUser(formData.email, formData.password);
        const fbUser = userCredential.user;

        const payload = {
          name: formData.name,
          email: formData.email,
          photoURL: formData.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
          password: formData.password,
          role: role.toLowerCase(),
          firebaseUid: fbUser.uid
        };

        const response = await axiosInstance.post('/users', payload);
        
        if (response.data.success) {
          await logoutUser();
          if (role === "Doctor") {
            toast.success("Account created! Please log in.");
          } else {
            toast.success("Account created successfully! Please log in.");
          }
          navigate("/login", { state: { defaultRole: role } });
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message || error.response?.data?.message || "An error occurred during registration");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please fix the validation errors");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const fbUser = result.user;

      try {
        // Check if user exists in DB
        const dbRes = await axiosInstance.get(`/users/${fbUser.email}`);
        const dbUser = dbRes.data.data;
        const dbRole = dbUser?.role?.toLowerCase() || 'patient';
        
        if (dbRole === 'admin') {
          toast.success("Successfully logged in as Admin!");
          navigate("/dashboard");
        } else if (dbRole !== role.toLowerCase()) {
          await logoutUser();
          throw new Error(`Email already registered as ${dbUser.role}. Please log in from the correct tab.`);
        } else {
          toast.success("Successfully logged in with Google!");
          navigate("/");
        }
      } catch (dbError) {
        if (dbError.response && dbError.response.status === 404) {
          // User does not exist, safe to register
          const payload = {
            name: fbUser.displayName || "Google User",
            email: fbUser.email,
            photoURL: fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            password: "google_login_no_password",
            role: role.toLowerCase(),
            firebaseUid: fbUser.uid
          };
          await axiosInstance.post('/users', payload);
          await logoutUser();
          toast.success("Account created successfully! Please log in.");
          navigate("/login", { state: { defaultRole: role } });
        } else {
          throw dbError;
        }
      }
    } catch (error) {
      console.error("Google Login error:", error);
      toast.error(error.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-96 bg-[#0b6e66] skew-y-6 transform origin-top-right -z-10 opacity-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join MediCare Connect today for better health.</p>
        </motion.div>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* Role Selector */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-2 relative">
              <button
                type="button"
                onClick={() => setRole("Patient")}
                className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-200 ${
                  role === "Patient" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Patient
                {role === "Patient" && (
                  <motion.div
                    layoutId="activeRoleRegister"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setRole("Doctor")}
                className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-200 ${
                  role === "Doctor" ? "text-primary" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Doctor
                {role === "Doctor" && (
                  <motion.div
                    layoutId="activeRoleRegister"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl bg-gray-50 focus:bg-white text-sm transition-colors outline-none`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl bg-gray-50 focus:bg-white text-sm transition-colors outline-none`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Photo URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.photoURL ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl bg-gray-50 focus:bg-white text-sm transition-colors outline-none`}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {errors.photoURL && <p className="mt-1 text-xs text-red-500">{errors.photoURL}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary'} rounded-xl bg-gray-50 focus:bg-white text-sm transition-colors outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              <p className="mt-1 text-[10px] text-gray-500">Must be 6+ chars with uppercase & lowercase.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-[#095c55] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FcGoogle className="text-xl mr-2" />
                Sign up with Google
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:text-[#095c55] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
