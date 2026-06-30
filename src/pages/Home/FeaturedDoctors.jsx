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
        if (response.data.success) {
          // Take only the first 4 doctors for the featured section
          const allDocs = response.data.data.slice(0, 4);
          
          // Map MongoDB doctors to frontend card requirements
          const mappedDocs = allDocs.map(doc => {
            const exp = parseInt(doc.experience) || 5;
            let designation = "Consultant";
            let feeAmt = 500;
            if (exp >= 15) {
              designation = "Professor";
              feeAmt = 1500;
            } else if (exp >= 10) {
              designation = "Associate Professor";
              feeAmt = 1000;
            }

            return {
              id: doc._id,
              name: doc.name,
              specialty: doc.specialization || doc.specialty || "General",
              designation: designation,
              experience: `${exp}+ Years Exp.`,
              image: doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "",
              rating: doc.rating || 4.5,
              reviews: doc.reviews || 0,
              fee: `BDT ${feeAmt}`,
            };
          });
          
          setDoctors(mappedDocs);
        }
      } catch (error) {
        console.error("Error fetching featured doctors:", error);
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
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
