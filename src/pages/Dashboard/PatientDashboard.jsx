import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarCheck, FaUserMd, FaWallet, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaVideo, FaMapMarkerAlt, FaHeart, FaHeartbeat, FaBrain, FaBaby, FaBone, FaVenus, FaTooth, FaHeadSideVirus, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../contexts/FavoritesContext";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { formatToDDMMYYYY, generateAvailableTimeSlots, parseDateTimeForSort } from "../../utils/dateUtils";

const getSpecialtyIcon = (specialty) => {
  if (!specialty) return <FaUserMd className="mr-1 text-primary" />;
  const s = specialty.toLowerCase();
  if (s.includes("cardiology")) return <FaHeartbeat className="mr-1 text-primary" />;
  if (s.includes("neurology")) return <FaBrain className="mr-1 text-primary" />;
  if (s.includes("pediatric")) return <FaBaby className="mr-1 text-primary" />;
  if (s.includes("orthopedics")) return <FaBone className="mr-1 text-primary" />;
  if (s.includes("dermatology")) return <FaUserMd className="mr-1 text-primary" />;
  if (s.includes("gynecology")) return <FaVenus className="mr-1 text-primary" />;
  if (s.includes("dentistry")) return <FaTooth className="mr-1 text-primary" />;
  if (s.includes("psychiatry")) return <FaHeadSideVirus className="mr-1 text-primary" />;
  return <FaUserMd className="mr-1 text-primary" />;
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { favorites, favoriteDoctorsData } = useFavorites();
  
  const [allAppointments, setAllAppointments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  // Modals state
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isAllAppointmentsModalOpen, setIsAllAppointmentsModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null); // stores the appointment being rescheduled

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        const aptRes = await axiosInstance.get(`/appointments?patientEmail=${user.email}`);
        if (aptRes.data.success) {
          setAllAppointments(aptRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching patient dashboard data:", err);
      }
    };
    const fetchDoctors = async () => {
      try {
        const docRes = await axiosInstance.get('/doctors');
        if (docRes.data.success) {
          setAllDoctors(docRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchData();
    fetchDoctors();
  }, [user]);

  const upcomingAppointments = allAppointments
    .filter(a => a.appointmentStatus === "pending" || a.appointmentStatus === "approved")
    .map(apt => {
      const docDetails = allDoctors.find(d => d._id === apt.doctorId || d.name === apt.doctorName);
      const exp = docDetails ? parseInt(docDetails.experience) || 5 : 5;
      let designation = "Consultant";
      if (exp >= 15) designation = "Professor";
      else if (exp >= 10) designation = "Associate Professor";

      return {
        id: apt._id,
        doctorName: apt.doctorName,
        specialty: apt.specialty || "General",
        designation,
        date: formatToDDMMYYYY(apt.date || apt.appointmentDate),
        time: apt.time || apt.timeSlot,
        type: apt.type || "In-Person Consult",
        image: docDetails?.photoURL || docDetails?.image || docDetails?.avatar || docDetails?.photoUrl || "",
      };
    })
    .sort((a, b) => parseDateTimeForSort(a.date, a.time) - parseDateTimeForSort(b.date, b.time))
    .slice(0, 3);

  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [isRescheduleDateFocused, setIsRescheduleDateFocused] = useState(false);
  const rescheduleDateInputRef = useRef(null);

  const handleRescheduleDateClick = (e) => {
    e.preventDefault();
    if (rescheduleDateInputRef.current) {
      rescheduleDateInputRef.current.type = "date";
      if (rescheduleDateInputRef.current.showPicker) {
        try {
          rescheduleDateInputRef.current.showPicker();
        } catch (err) {
          console.error(err);
        }
      }
      setIsRescheduleDateFocused(true);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleData) return;
    try {
      const res = await axiosInstance.patch(`/appointments/${rescheduleData.id}/reschedule`, {
        date: formatToDDMMYYYY(rescheduleForm.date),
        time: rescheduleForm.time
      });
      if (res.data.success) {
        toast.success("Appointment rescheduled successfully!");
        setAllAppointments(prev => prev.map(a => 
          a._id === rescheduleData.id ? { ...a, date: formatToDDMMYYYY(rescheduleForm.date), time: rescheduleForm.time } : a
        ));
        setRescheduleData(null);
        setRescheduleForm({ date: '', time: '' });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reschedule appointment");
    }
  };

  const appointmentHistory = allAppointments
    .filter(a => a.appointmentStatus === "completed" || a.appointmentStatus === "rejected")
    .map(apt => ({
      id: apt._id,
      doctorId: apt.doctorId,
      doctor: apt.doctorName,
      date: formatToDDMMYYYY(apt.date || apt.appointmentDate),
      status: apt.appointmentStatus === "completed" ? "Completed" : "Cancelled"
    }))
    .slice(0, 5);

  const totalUpcoming = allAppointments.filter(a => a.appointmentStatus === "pending" || a.appointmentStatus === "approved").length;
  const totalCompleted = allAppointments.filter(a => a.appointmentStatus === "completed").length;
  const totalPaymentsAmount = allAppointments.reduce((sum, apt) => apt.paymentStatus === 'paid' ? sum + (Number(apt.fee) || 0) : sum, 0);

  const stats = [
    { title: "My Appointments", value: totalUpcoming.toString(), icon: <FaCalendarCheck className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Completed Visits", value: totalCompleted.toString(), icon: <FaCheckCircle className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Total Payments", value: `BDT ${totalPaymentsAmount}`, fullValue: `BDT ${totalPaymentsAmount}.00`, icon: <FaWallet className="text-purple-600" />, bg: "bg-purple-100/50" },
    { title: "Favorite Doctors", value: favorites.length.toString(), icon: <FaHeart className="text-red-500" />, bg: "bg-red-100/50" },
  ];

  // Dynamic Recent Activities
  const dynamicActivities = [];
  allAppointments.forEach(apt => {
    const createdAt = apt._id ? new Date(parseInt(apt._id.substring(0, 8), 16) * 1000) : new Date();
    
    // Booking activity
    dynamicActivities.push({
      id: `${apt._id}-booking`,
      action: "Booked Appointment",
      target: `With ${apt.doctorName}`,
      dateObj: createdAt,
      type: "booking"
    });

    // Payment activity
    if (apt.paymentStatus === "paid" || apt.paymentStatus === "Completed") {
      dynamicActivities.push({
        id: `${apt._id}-payment`,
        action: "Payment Successful",
        target: `BDT ${apt.fee || apt.feeAmount || 500} for Consultation`,
        dateObj: new Date(createdAt.getTime() + 60000 * 5), // +5 mins
        type: "payment"
      });
    }

    // Completion / Cancellation activity
    if (apt.appointmentStatus === "completed" || apt.appointmentStatus === "rejected") {
      const isCompleted = apt.appointmentStatus === "completed";
      // We assume completion happened on the appointment date itself
      const parts = (apt.date || apt.appointmentDate || "").split('-');
      let aptDateObj = createdAt;
      if (parts.length === 3) aptDateObj = new Date(parts[2], parts[1] - 1, parts[0], 18, 0, 0); // approx 6 PM on that day

      dynamicActivities.push({
        id: `${apt._id}-status`,
        action: isCompleted ? "Visit Completed" : "Appointment Cancelled",
        target: `With ${apt.doctorName}`,
        dateObj: aptDateObj,
        type: isCompleted ? "prescription" : "booking"
      });
    }
  });

  const recentActivities = dynamicActivities
    .sort((a, b) => b.dateObj - a.dateObj)
    .slice(0, 4)
    .map(act => {
      const diffMs = new Date() - act.dateObj;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));
      let timeStr = "Just now";
      if (diffDays > 0) timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffHours > 0) timeStr = `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      else if (diffMins > 0) timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

      return { ...act, time: timeStr };
    });

  return (
    <div className="space-y-8 pb-8">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-1">
            Welcome back, {user?.name?.split(' ')[0] || "Guest"}!
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Here's what's happening with your health profile today.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-[0_4px_12px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_16px_rgba(13,148,136,0.4)] hover:-translate-y-0.5 transition-all"
        >
          + New Appointment
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 leading-tight mb-0.5" title={stat.fullValue || stat.value}>{stat.value}</p>
                <p className="text-xs font-semibold text-gray-500 leading-tight">{stat.title}</p>
              </div>
            </div>
            {stat.footerText && (
              <div className="mt-5 pt-4 border-t border-gray-50">
                <button className="text-orange-500 font-medium text-sm hover:underline flex items-center gap-1">
                  {stat.footerText} <span className="text-lg leading-none">&rarr;</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column (Primary Content) */}
        <div className="xl:col-span-2 space-y-8">

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-poppins font-bold text-gray-900">Upcoming Appointments</h3>
              <button 
                onClick={() => setIsAllAppointmentsModalOpen(true)}
                className="text-primary font-semibold text-sm hover:underline"
              >
                View All
              </button>
            </div>

            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 transition-colors bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={apt.image} alt={apt.doctorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-0.5">{apt.doctorName}</h4>
                    {apt.designation && (
                      <p className="text-[#0b6e66] text-xs font-medium mb-0.5">
                        {apt.designation}
                      </p>
                    )}
                    <p className="text-gray-500 font-medium text-xs mb-3 flex items-center gap-1">
                      {getSpecialtyIcon(apt.specialty)} {apt.specialty}
                    </p>
                    <div className="flex items-center whitespace-nowrap gap-4 text-xs font-semibold text-gray-600">
                      <span className="flex items-center gap-2">
                        <FaCalendarCheck className="text-blue-500 text-sm" /> {apt.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaClock className="text-orange-500 text-sm" /> {apt.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:ml-auto w-full sm:w-auto">
                  <div className={`flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg w-full ${
                    apt.type === 'Video Consult' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {apt.type === 'Video Consult' ? <FaVideo className="text-sm" /> : <FaMapMarkerAlt className="text-sm" />}
                    {apt.type}
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button 
                      onClick={() => setRescheduleData(apt)}
                      className="btn btn-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                      className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-lg"
                    >
                      Join Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Appointment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-poppins font-bold text-gray-900">Appointment History</h3>
              <button className="text-primary font-semibold text-sm hover:underline">View Full History</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm font-semibold whitespace-nowrap">
                    <th className="pb-3 pl-4 min-w-[150px]">Doctor Name</th>
                    <th className="pb-3 text-center min-w-[120px]">Date</th>
                    <th className="pb-3 text-center min-w-[120px]">Status</th>
                    <th className="pb-3 text-center min-w-[100px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentHistory.map((history, idx) => (
                    <tr key={history.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors whitespace-nowrap ${idx === appointmentHistory.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 pl-4 font-bold text-gray-900">{history.doctor}</td>
                      <td className="py-4 text-gray-600 text-sm font-medium text-center">{history.date}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-28 gap-1.5 py-1 rounded-full text-xs font-bold ${history.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {history.status === 'Completed' ? <FaCheckCircle /> : <FaTimesCircle />}
                          {history.status}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <button 
                          onClick={() => history.doctorId ? navigate(`/doctors/${history.doctorId}`) : navigate('/doctors')} 
                          className="text-primary hover:text-[#095c55] font-bold text-sm transition-colors"
                        >
                          Rebook
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>

        {/* Right Column (Secondary Content) */}
        <div className="space-y-8">

          {/* Favorite Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-poppins font-bold text-gray-900 mb-6">Favorite Doctors</h3>
            <div className="space-y-5">
              {favoriteDoctorsData.length > 0 ? favoriteDoctorsData.slice(0, 3).map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-0.5">{doc.name}</h4>
                      {doc.designation && (
                        <p className="text-[#0b6e66] text-[11px] font-medium flex items-center mb-0.5">
                          {doc.designation}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs font-medium flex items-center">
                        {getSpecialtyIcon(doc.specialty)} {doc.specialty}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(doc.id, doc.name);
                    }}
                    className="text-primary p-2 bg-teal-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors opacity-100">
                    <FaHeart className="text-red-500 group-hover:text-white" />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No favorite doctors yet.</p>
              )}
            </div>
            <button 
              onClick={() => setIsFavoritesModalOpen(true)}
              className="w-full mt-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              View More
            </button>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-poppins font-bold text-gray-900 mb-6">Recent Activities</h3>

            <div className="relative pl-3 border-l-2 border-gray-100 space-y-6">
              {recentActivities.map((activity, idx) => (
                <div key={activity.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${activity.type === 'booking' ? 'bg-primary' :
                    activity.type === 'payment' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}></div>

                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-none mb-1">{activity.action}</p>
                    <p className="text-xs font-medium text-gray-500">{activity.target}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {/* All Favorites Modal */}
        {isFavoritesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsFavoritesModalOpen(false)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 font-poppins">All Favorite Doctors</h3>
                <button 
                  onClick={() => setIsFavoritesModalOpen(false)} 
                  className="text-gray-400 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 bg-gray-50/30 flex-1">
                {favoriteDoctorsData.length > 0 ? favoriteDoctorsData.map(doc => (
                  <div key={doc.id} onClick={() => navigate(`/doctors/${doc.id}`)} className="flex items-center justify-between group cursor-pointer hover:bg-white bg-transparent p-3 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-3">
                      <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{doc.name}</h4>
                        {doc.designation && <p className="text-[#0b6e66] text-[11px] font-medium flex items-center mb-0.5">{doc.designation}</p>}
                        <p className="text-gray-500 text-xs font-medium flex items-center">{getSpecialtyIcon(doc.specialty)} {doc.specialty}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(doc.id, doc.name); }}
                      className="text-primary p-2 bg-teal-50 rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <FaHeart className="text-red-500 hover:text-white" />
                    </button>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 text-sm">No favorite doctors yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* All Upcoming Appointments Modal */}
        {isAllAppointmentsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAllAppointmentsModalOpen(false)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 font-poppins">All Upcoming Appointments</h3>
                <button 
                  onClick={() => setIsAllAppointmentsModalOpen(false)} 
                  className="text-gray-400 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 bg-gray-50/30 flex-1">
                {allAppointments.filter(a => a.appointmentStatus === "pending" || a.appointmentStatus === "approved").length > 0 ? (
                  allAppointments.filter(a => a.appointmentStatus === "pending" || a.appointmentStatus === "approved").map(apt => {
                    const docDetails = allDoctors.find(d => d._id === apt.doctorId || d.name === apt.doctorName);
                    const exp = docDetails ? parseInt(docDetails.experience) || 5 : 5;
                    let designation = "Consultant";
                    if (exp >= 15) designation = "Professor";
                    else if (exp >= 10) designation = "Associate Professor";

                    const mappedApt = {
                      id: apt._id, doctorName: apt.doctorName, specialty: apt.specialty || "General", designation,
                      date: apt.date || apt.appointmentDate, time: apt.time || apt.timeSlot, type: apt.type || "In-Person Consult",
                      image: docDetails?.photoURL || docDetails?.image || docDetails?.avatar || docDetails?.photoUrl || "",
                    };
                    return mappedApt;
                  }).sort((a, b) => parseDateTimeForSort(a.date, a.time) - parseDateTimeForSort(b.date, b.time)).map(mappedApt => {
                    return (
                      <div key={mappedApt.id} className="border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 bg-white shadow-sm transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={mappedApt.image} alt={mappedApt.doctorName} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-0.5">{mappedApt.doctorName}</h4>
                            <p className="text-[#0b6e66] text-xs font-medium mb-0.5">{mappedApt.designation}</p>
                            <p className="text-gray-500 font-medium text-xs mb-3 flex items-center gap-1">{getSpecialtyIcon(mappedApt.specialty)} {mappedApt.specialty}</p>
                            <div className="flex items-center whitespace-nowrap gap-4 text-xs font-semibold text-gray-600">
                              <span className="flex items-center gap-2"><FaCalendarCheck className="text-blue-500 text-sm" /> {formatToDDMMYYYY(mappedApt.date)}</span>
                              <span className="flex items-center gap-2"><FaClock className="text-orange-500 text-sm" /> {mappedApt.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:ml-auto w-full sm:w-auto">
                          <div className={`flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg w-full ${mappedApt.type === 'Video Consult' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                            {mappedApt.type === 'Video Consult' ? <FaVideo className="text-sm" /> : <FaMapMarkerAlt className="text-sm" />} {mappedApt.type}
                          </div>
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <button onClick={() => setRescheduleData(mappedApt)} className="btn btn-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg">Reschedule</button>
                            <button onClick={() => window.open('https://meet.google.com', '_blank')} className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-lg">Join Call</button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500">No upcoming appointments found.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setRescheduleData(null)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 font-poppins">Reschedule Appointment</h3>
                <button onClick={() => setRescheduleData(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleRescheduleSubmit} className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Select a new date and time for your appointment with <span className="font-bold text-gray-900">{rescheduleData.doctorName}</span>.
                </p>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Date</label>
                    <input 
                      ref={rescheduleDateInputRef}
                      type={isRescheduleDateFocused || !rescheduleForm.date ? "date" : "text"}
                      onFocus={() => setIsRescheduleDateFocused(true)}
                      onBlur={() => setIsRescheduleDateFocused(false)}
                      onClick={handleRescheduleDateClick}
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      value={isRescheduleDateFocused || !rescheduleForm.date ? rescheduleForm.date : formatToDDMMYYYY(rescheduleForm.date)}
                      onChange={(e) => {
                        setRescheduleForm({...rescheduleForm, date: e.target.value});
                        setIsRescheduleDateFocused(false);
                        if (rescheduleDateInputRef.current) rescheduleDateInputRef.current.type = "text";
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none cursor-pointer text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Time</label>
                    <select 
                      name="time"
                      required 
                      value={rescheduleForm.time} 
                      onChange={(e) => setRescheduleForm({...rescheduleForm, time: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer" 
                    >
                      <option value="" disabled hidden>{rescheduleForm.date ? "Choose a time slot..." : "Select date first"}</option>
                      {generateAvailableTimeSlots(rescheduleForm.date).map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setRescheduleData(null)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-focus transition-colors shadow-lg shadow-primary/30">Confirm Reschedule</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PatientDashboard;
