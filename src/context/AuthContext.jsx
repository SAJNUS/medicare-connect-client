import { createContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewRole, setPreviewRole] = useState(null);

  // Create User
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login User
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign-in
  const signInWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout User — also clears the httpOnly JWT cookie on the backend
  const logoutUser = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Best-effort: proceed with Firebase logout regardless
    }
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          // Fetch additional user data from MongoDB
          const response = await axiosInstance.get(`/users/${currentUser.email}`);
          if (response.data.success && response.data.data) {
            const dbUser = response.data.data;
            const normalizedRole = dbUser.role?.toLowerCase() || 'patient';
            setUser({
              ...dbUser,
              email: currentUser.email, // override with firebase verified email
              role: normalizedRole,
              uid: dbUser._id,
              firebaseUid: currentUser.uid,
              avatar: dbUser.photoURL || currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
              designation: normalizedRole === 'doctor' ? 'Doctor' : normalizedRole === 'admin' ? 'Admin' : 'Patient'
            });
            // Keep localStorage sync just in case other parts of the app rely on it temporarily
            localStorage.setItem("currentUserEmail", currentUser.email);
          } else {
            // User authenticated in Firebase but not in MongoDB
            setUser({
              email: currentUser.email,
              firebaseUid: currentUser.uid,
              role: "patient",
              avatar: currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("User not found in MongoDB. Suppressing auth state for registration.");
            // Immediately suppress the temporary Firebase auth state to prevent UI flicker
            setUser(null);
          } else {
            console.error("Failed to fetch MongoDB user:", error);
            setUser({
              email: currentUser.email,
              firebaseUid: currentUser.uid,
              role: "patient"
            });
          }
        }
      } else {
        localStorage.removeItem("currentUserEmail");
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // The user object, with role always sourced from MongoDB
  const enhancedUser = user ? {
    ...user,
    role: user.role || 'patient'
  } : null;

  const authInfo = {
    user: enhancedUser,
    loading,
    createUser,
    loginUser,
    signInWithGoogle,
    logoutUser,
    previewRole,
    setPreviewRole,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
