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
        
        setUser({
          uid: "mock-uid-123",
          email: `${testRole}@medicare.com`,
          role: testRole, // "patient", "doctor", or "admin"
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
