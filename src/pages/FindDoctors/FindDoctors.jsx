import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../../components/shared/DoctorCard";
import axiosInstance from "../../api/axiosInstance";

// Dynamic specialties will be populated from doctors data

const FindDoctors = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState(searchParams.get("specialization") || "All");
  
  const initialSortBy = searchParams.get("sortBy") === "experience_desc" ? "exp-high-low" : "default";
  const [sortBy, setSortBy] = useState(initialSortBy);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const doctorsPerPage = 8;

  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch doctors from backend with pagination, search, and sorting
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        let sortParam = "";
        if (sortBy === "fee-low-high") sortParam = "fee";
        else if (sortBy === "exp-high-low") sortParam = "experience";
        else if (sortBy === "rating-high-low") sortParam = "rating";

        const params = new URLSearchParams({
          page: currentPage,
          limit: doctorsPerPage
        });

        if (searchQuery) params.append("search", searchQuery);
        if (specialtyFilter !== "All") params.append("specialization", specialtyFilter);
        if (sortParam) params.append("sortBy", sortParam);
        params.append("status", "verified");

        const response = await axiosInstance.get(`/doctors?${params.toString()}`);
        const reviewsRes = await axiosInstance.get(`/reviews`).catch(() => ({ data: { data: [] } }));
        const allReviews = reviewsRes.data.data || [];

        if (response.data.success) {
          const mappedDocs = response.data.data.map(doc => {
            const exp = parseInt(doc.experience) || 5;
            const designation = doc.designation || "Consultant";
            const feeAmt = parseInt(doc.consultationFee) || 500;

            const doctorReviews = allReviews.filter(r => r.doctorEmail === doc.email);
            const reviewCount = doctorReviews.length;
            const avgRating = reviewCount > 0 
              ? (doctorReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) 
              : "New";

            return {
              _id: doc._id,
              name: doc.name,
              specialty: doc.specialization || doc.specialty || "General",
              designation: designation,
              experience: `${exp}+ Years Exp.`,
              experienceYears: exp,
              image: doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "",
              rating: avgRating,
              reviews: reviewCount,
              fee: `BDT ${feeAmt}`,
              feeAmount: feeAmt,
            };
          });
          setDoctors(mappedDocs);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error?.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the fetch slightly to prevent spamming on rapid typing
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, specialtyFilter, sortBy, currentPage]);

  const dynamicSpecialties = [
    "All", "Cardiology", "Neurology", "Pediatrics", "Dermatology", "Orthopedics", "General", "Psychiatry"
  ];

  const currentDoctors = doctors;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <section className="bg-[#0b6e66] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Find Your Doctor
          </motion.h1>
          <motion.p
            className="text-teal-50 text-lg md:text-xl max-w-2xl mx-auto font-inter whitespace-nowrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Connect with specialized, verified doctors and book your appointment easily.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-inter text-sm"
            />
          </div>

          {/* Filters */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex items-center">
              <FaFilter className="absolute left-4 text-gray-400 pointer-events-none" />
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer font-inter text-sm w-full sm:w-auto"
              >
                {dynamicSpecialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="relative flex items-center">
              <FaSortAmountDown className="absolute left-4 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer font-inter text-sm w-full sm:w-auto"
              >
                <option value="default">Sort By: Default</option>
                <option value="fee-low-high">Fee: Low to High</option>
                <option value="fee-high-low">Fee: High to Low</option>
                <option value="rating-high-low">Rating: Highest First</option>
                <option value="exp-high-low">Experience: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="mb-12 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : currentDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentDoctors.map((doctor, index) => (
                <DoctorCard key={doctor._id} doctor={doctor} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Doctors Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === idx + 1 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
