import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem("currentUserEmail");
        if (!email) {
          setUser(null);
          return;
        }

        const response = await axiosInstance.get(`/users/${email}`);
        if (response.data.success && response.data.data) {
          const dbUser = response.data.data;
          setUser({
            ...dbUser,
            uid: dbUser._id, // Map MongoDB _id to uid
            // Keep default fallback UI assets in case they are missing
            avatar: dbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            designation: dbUser.role === 'doctor' ? 'Doctor' : dbUser.role === 'admin' ? 'System Administrator' : 'Patient'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
