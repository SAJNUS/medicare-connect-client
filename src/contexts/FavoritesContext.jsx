import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // Array of doctorIds
  const [favoriteDoctorsData, setFavoriteDoctorsData] = useState([]); // Array of full doctor objects

  // Fetch favorites when user logs in
  const fetchFavorites = async () => {
    if (!user || user.role !== 'patient') {
      setFavorites([]);
      setFavoriteDoctorsData([]);
      return;
    }
    
    try {
      const res = await axiosInstance.get(`/favorites?patientEmail=${user.email}`);
      if (res.data.success) {
        setFavorites(res.data.data.map(fav => fav.doctorId));
        
        // Also map the joined doctor details
        const docs = res.data.data
          .filter(fav => fav.doctorDetails)
          .map(fav => {
            const doc = fav.doctorDetails;
            // Compute designation
            const exp = parseInt(doc.experience) || 5;
            let designation = "Consultant";
            if (exp >= 15) designation = "Professor";
            else if (exp >= 10) designation = "Associate Professor";

            return {
              id: doc._id,
              name: doc.name,
              specialty: doc.specialization || doc.specialty || "General",
              designation,
              experience: `${exp}+ Years Exp.`,
              image: doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "",
              rating: doc.rating || 4.5, // We don't have review calculation here, but we can just use 4.5 or "New"
            };
          });
          
        setFavoriteDoctorsData(docs);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isFavorited = (doctorId) => {
    return favorites.includes(doctorId);
  };

  const toggleFavorite = async (doctorId, doctorName) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }
    if (user.role !== 'patient') {
      toast.error("Only patients can add favorites");
      return;
    }

    const currentlyFavorited = isFavorited(doctorId);

    // Optimistic UI update
    if (currentlyFavorited) {
      setFavorites(prev => prev.filter(id => id !== doctorId));
      setFavoriteDoctorsData(prev => prev.filter(doc => doc.id !== doctorId));
    } else {
      setFavorites(prev => [...prev, doctorId]);
    }

    try {
      if (currentlyFavorited) {
        await axiosInstance.delete(`/favorites/${doctorId}?patientEmail=${user.email}`);
        toast.success(`Removed ${doctorName || 'doctor'} from favorites`);
      } else {
        await axiosInstance.post('/favorites', {
          patientEmail: user.email,
          doctorId
        });
        toast.success(`Added ${doctorName || 'doctor'} to favorites`);
        // Refresh full data to get the doctor's details
        fetchFavorites();
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Failed to update favorite status");
      // Revert optimistic update
      fetchFavorites();
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteDoctorsData, isFavorited, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
