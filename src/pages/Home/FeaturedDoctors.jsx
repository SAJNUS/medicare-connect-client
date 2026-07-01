import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import DoctorCard from "../../components/shared/DoctorCard";
import axiosInstance from "../../api/axiosInstance";



const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctors?status=verified&limit=4');
        const reviewsRes = await axiosInstance.get(`/reviews`).catch(() => ({ data: { data: [] } }));
        const allReviews = reviewsRes.data.data || [];

        if (response.data.success) {
          // Take only the first 4 doctors for the featured section
          const allDocs = response.data.data.slice(0, 4);
          
          // Map MongoDB doctors to frontend card requirements
          const mappedDocs = allDocs.map(doc => {
            const exp = parseInt(doc.experience) || 5;
            const designation = doc.designation || "Consultant";
            const feeAmt = parseInt(doc.consultationFee) || 500;

            const doctorReviews = allReviews.filter(r => r.doctorEmail === doc.email);
            const reviewCount = doctorReviews.length;
            const avgRating = reviewCount > 0 
              ? (doctorReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) 
              : "New";

            return {
              id: doc._id,
              name: doc.name,
              specialty: doc.specialization || doc.specialty || "General",
              designation: designation,
              experience: `${exp}+ Years Exp.`,
              image: doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "",
              rating: avgRating,
              reviews: reviewCount,
              fee: `BDT ${feeAmt}`,
            };
          });
          
          setDoctors(mappedDocs);
        }
      } catch (error) {
        console.error("Error fetching featured doctors:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDoctors();
  }, []);

  if (loading) return null;
  return (
    <section className="py-10 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900">
            Featured Doctors
          </h2>
          <Link to="/doctors">
            <button className="text-primary font-medium flex items-center hover:underline text-sm md:text-base">
              View All Doctors <FaArrowRight className="ml-2 text-xs" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor._id} doctor={doctor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
