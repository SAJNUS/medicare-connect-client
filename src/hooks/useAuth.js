import { useState, useEffect } from "react";

// Mock authentication hook simulating Firebase/JWT role-based auth
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user from Firebase or decoding JWT
    const fetchUser = async () => {
      setLoading(true);
      try {
        // For testing purposes, we read from localStorage.
        // Set this in your browser console: localStorage.setItem('test_userRole', 'doctor')
        // In a real app, you would read this from the JWT token or Firebase Custom Claims.
        
        const testRole = localStorage.getItem("test_userRole") || "patient";
        
        let profile = {};
        if (testRole === "patient") {
          profile = {
            name: "John Doe",
            designation: "Patient",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
          };
        } else if (testRole === "doctor") {
          profile = {
            name: "Dr. James Carter",
            designation: "Senior Cardiologist",
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
          };
        } else if (testRole === "admin") {
          profile = {
            name: "Admin Sarah",
            designation: "System Administrator",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
          };
        }

        setUser({
          uid: "mock-uid-123",
          email: `${testRole}@medicare.com`,
          role: testRole, // "patient", "doctor", or "admin"
          ...profile
        });
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
