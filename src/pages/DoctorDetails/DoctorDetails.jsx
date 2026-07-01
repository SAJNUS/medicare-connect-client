import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaGraduationCap, FaCalendarAlt, FaClock, FaCheckCircle, FaHeartbeat, FaBrain, FaBaby, FaBone, FaUserMd, FaVenus, FaTooth, FaHeadSideVirus, FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../../contexts/FavoritesContext";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const getSpecialtyIcon = (specialty) => {
  const s = specialty.toLowerCase();
  if (s.includes("cardiology")) return <FaHeartbeat className="mr-1.5 text-primary" />;
  if (s.includes("neurology")) return <FaBrain className="mr-1.5 text-primary" />;
  if (s.includes("pediatrics")) return <FaBaby className="mr-1.5 text-primary" />;
  if (s.includes("orthopedics")) return <FaBone className="mr-1.5 text-primary" />;
  if (s.includes("dermatology")) return <FaUserMd className="mr-1.5 text-primary" />;
  if (s.includes("gynecology")) return <FaVenus className="mr-1.5 text-primary" />;
  if (s.includes("dentistry")) return <FaTooth className="mr-1.5 text-primary" />;
  if (s.includes("psychiatry")) return <FaHeadSideVirus className="mr-1.5 text-primary" />;
  return null;
};

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const favorited = doctor ? isFavorited(doctor.id) : false;

  const handleFavoriteClick = () => {
    if (doctor) {
      toggleFavorite(doctor.id, doctor.name);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axiosInstance.get(`/doctors/${id}`);
        const reviewsRes = await axiosInstance.get(`/reviews`).catch(() => ({ data: { data: [] } }));
        const allReviews = reviewsRes.data.data || [];

        if (response.data.success && response.data.data) {
          const doc = response.data.data;
          const exp = parseInt(doc.experience) || 5;
          const designation = doc.designation || "Consultant";
          const feeAmt = parseInt(doc.consultationFee) || 500;

          const doctorReviews = allReviews.filter(r => r.doctorEmail === doc.email);
          const reviewCount = doctorReviews.length;
          const avgRating = reviewCount > 0 
            ? (doctorReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) 
            : "New";

          setDoctor({
            id: doc._id,
            name: doc.name,
            designation: designation,
            specialty: doc.specialization || doc.specialty || "General",
            degree: doc.degree || "MBBS",
            experience: `${exp}+ Years Exp.`,
            workingAt: doc.workingAt || "MediCare Hospital",
            fee: `BDT ${feeAmt}`,
            feeAmount: feeAmt,
            rating: avgRating,
            reviews: reviewCount,
            image: doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "",
            about: doc.about || "Experienced and dedicated doctor committed to providing excellent patient care.",
            availability: doc.availability || [],
            qualifications: doc.qualifications || [],
            reviewsList: doc.reviewsList || []
          });
          
          // Auto select first day if available
          if (doc.availability?.[0]?.day) {
            setSelectedDay(doc.availability[0].day);
          } else {
            setSelectedDay("Monday"); // fallback from hardcoded default
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="text-primary hover:underline">
          Go back to Find Doctors
        </button>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime) {
      toast.error("Please select a day and time slot first.");
      return;
    }

    setIsBooking(true);
    try {
      const payload = {
        patientEmail: user?.email,
        patientName: user?.name || "Patient",
        patientImage: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        doctorEmail: doctor.email,
        doctorName: doctor.name || "Unknown Doctor",
        specialty: doctor.specialty || "General",
        doctorImage: doctor.image || "",
        date: selectedDay,
        time: selectedTime,
        type: "In-Person Consult",
        symptoms: [],
        fee: doctor?.feeAmount || 500,
        aptId: `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
      };

      const response = await axiosInstance.post('/appointments', payload);

      if (response.data.success) {
        toast.success(`Appointment booked with ${doctor.name} for ${selectedDay} at ${selectedTime}!`);
        // Navigate back to the find doctors or dashboard after short delay
        setTimeout(() => navigate('/dashboard/patient/appointments'), 1500);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Main Header / Profile Summary */}
        <motion.div
          className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4] w-full relative group/img">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              <button 
                onClick={handleFavoriteClick}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors z-10"
              >
                {favorited ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />}
              </button>
            </div>
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-start">
            <div className="mb-2 mt-2 flex items-center">
              <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 pr-3">
                {doctor.name}
              </h1>
              <div className="flex items-center justify-center mt-1" title="Available for Appointments">
                <FaCheckCircle className="text-green-500/90 text-[18px]" />
              </div>
            </div>
            {doctor.designation && <p className="text-[#0b6e66] font-medium text-sm mb-1">{doctor.designation}</p>}
            <p className="text-primary font-medium text-lg mb-4 flex items-center">{getSpecialtyIcon(doctor.specialty)} {doctor.specialty}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <FaCalendarAlt className="text-[#0b6e66] mr-2 text-lg" />
                <div>
                  <p className="font-bold text-gray-900 leading-none">{doctor.experienceYears}+</p>
                  <p className="text-xs text-gray-500">Years Exp.</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <FaStar className="text-yellow-400 mr-2 text-lg" />
                <div>
                  <p className="font-bold text-gray-900 leading-none">{doctor.rating}</p>
                  <p className="text-xs text-gray-500">{doctor.reviews} Reviews</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 font-inter leading-relaxed max-w-3xl">
              {doctor.bio}
            </p>
          </div>
        </motion.div>

        {/* Content & Booking Grid */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Details */}
          <div className="w-full lg:w-2/3 space-y-8">

            {/* Qualifications */}
            <motion.div
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold font-poppins text-gray-900 mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-primary" /> Qualifications & Education
              </h2>
              <ul className="space-y-4">
                {Array.isArray(doctor.qualifications) 
                  ? doctor.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 font-inter">{qual}</p>
                      </li>
                    ))
                  : <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 font-inter">{doctor.qualifications}</p>
                    </li>
                }
              </ul>
            </motion.div>

            {/* Patient Reviews */}
            <motion.div
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold font-poppins text-gray-900 mb-6">Patient Reviews</h2>
              <div className="space-y-6">
                {doctor.reviewsList.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.patient}</h4>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 font-inter text-sm italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Booking Sidebar */}
          <div className="w-full lg:w-1/3">
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <p className="text-gray-500 font-medium mb-1">Consultation Fee</p>
                <p className="text-3xl font-bold text-[#0b6e66]">{doctor.fee}</p>
              </div>

              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-400" /> Select Day
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {doctor.availability.map((avail) => (
                  <button
                    key={avail.day}
                    onClick={() => { setSelectedDay(avail.day); setSelectedTime(""); }}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all ${selectedDay === avail.day
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                      }`}
                  >
                    {avail.day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {selectedDay && (
                <>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <FaClock className="mr-2 text-gray-400" /> Select Time
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {doctor.availability.find(a => a.day === selectedDay)?.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${selectedTime === slot
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button 
                    onClick={handleBooking}
                    disabled={isBooking}
                    className={`w-full font-bold py-4 rounded-xl shadow-md transition-all duration-300 font-inter text-[15px] ${isBooking ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary hover:bg-primary-focus text-white hover:shadow-lg transform hover:-translate-y-0.5'}`}
                  >
                    {isBooking ? 'Booking...' : 'Book Appointment'}
                  </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
