import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserInjured, FaCalendarDay, FaStar, FaCheckCircle, FaTimesCircle, FaPlusCircle, FaEnvelope, FaFileMedical, FaClock, FaWallet, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import { formatToDDMMYYYY } from "../../utils/dateUtils";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [allAppointments, setAllAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const [aptRes, revRes, schRes] = await Promise.all([
          axiosInstance.get(`/appointments?doctorEmail=${user.email}`),
          axiosInstance.get(`/reviews?doctorEmail=${user.email}`),
          axiosInstance.get(`/schedules?doctorEmail=${user.email}`)
        ]);
        
        if (aptRes.data.success) setAllAppointments(aptRes.data.data);
        if (revRes.data.success) setReviews(revRes.data.data);
        if (schRes.data.success) setSchedules(schRes.data.data);
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Computations
  const todayDateStr = formatToDDMMYYYY(new Date());

  // 1. Total Patients (unique patient emails from accepted/completed apps)
  const uniquePatients = new Set(
    allAppointments
      .filter(a => ['approved', 'completed'].includes(a.appointmentStatus))
      .map(a => a.patientEmail)
  );
  const totalPatients = uniquePatients.size;

  // 2. Today's Appointments (approved/completed today)
  const todaysAppointmentsCount = allAppointments.filter(a => 
    (a.date === todayDateStr || a.appointmentDate === todayDateStr) &&
    ['approved', 'completed'].includes(a.appointmentStatus)
  ).length;

  // 3. Total Earnings (completed and paid)
  const totalEarnings = allAppointments
    .filter(a => a.appointmentStatus === "completed" && a.paymentStatus === "paid")
    .reduce((sum, a) => sum + (parseFloat(a.fee) || 0), 0);

  // 4. Reviews Received
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "0.0";

  const stats = [
    { title: "Total Patients", value: totalPatients.toString(), fullValue: totalPatients.toString(), icon: <FaUserInjured className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Today's Appointments", value: todaysAppointmentsCount.toString(), icon: <FaCalendarDay className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Total Earnings", value: `BDT ${totalEarnings.toLocaleString()}`, fullValue: `BDT ${totalEarnings.toFixed(2)}`, icon: <FaWallet className="text-orange-500" />, bg: "bg-orange-100/50" },
    { title: "Reviews Received", value: averageRating, fullValue: `${reviews.length} total reviews`, icon: <FaStar className="text-yellow-500" />, bg: "bg-yellow-100/50" },
  ];

  // 5. Today's Schedule (from /schedules)
  const todayDateYYYYMMDD = new Date().toISOString().split('T')[0];
  const todaysSchedule = schedules
    .filter(s => s.date === todayDateStr || s.date === todayDateYYYYMMDD)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // 6. Appointment Requests
  const appointmentRequests = allAppointments
    .filter(a => a.appointmentStatus === "pending")
    .map(apt => ({
      id: apt._id,
      patient: apt.patientName || "Patient",
      requestedTime: `${apt.date || apt.appointmentDate}, ${apt.time || apt.timeSlot}`,
      reason: apt.symptoms && apt.symptoms.length > 0 ? apt.symptoms[0] : "General Checkup",
      image: apt.patientImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }))
    .slice(0, 3);

  // 7. Quick Actions
  const quickActions = [
    { title: "Add Prescription", icon: <FaFileMedical />, color: "text-blue-600", bg: "bg-blue-50", hover: "hover:bg-blue-600", link: "/dashboard/doctor/prescription-management" },
    { title: "Update Schedule", icon: <FaClock />, color: "text-purple-600", bg: "bg-purple-50", hover: "hover:bg-purple-600", link: "/dashboard/doctor/manage-schedule" },
    { title: "Message Patients", icon: <FaEnvelope />, color: "text-teal-600", bg: "bg-teal-50", hover: "hover:bg-teal-600", link: "#" },
  ];

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
            Good morning, {user?.name ? `Dr. ${user.name.split(' ')[0]}` : "Doctor"}!
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Here's what your schedule looks like today.
          </p>
        </div>
        <Link to="/dashboard/doctor/manage-schedule" className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-xl px-6 shadow-sm">
          <FaPlusCircle className="mr-2" /> Add Slot
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
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
            {stat.trend && (
              <div className="mt-5 flex items-center gap-1.5 text-sm">
                <span className="text-teal-600 font-bold">{stat.trend}</span>
                <span className="text-gray-500 font-medium">{stat.trendText}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Primary Content) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Schedule Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-poppins font-bold text-gray-900">Today's Schedule</h3>
              <button className="text-primary font-semibold text-sm hover:underline">View Calendar</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 flex justify-center items-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : todaysSchedule.length > 0 ? (
                todaysSchedule.map((slot) => (
                  <div key={slot._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors bg-gray-50/30">
                    <div className="px-4 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="text-sm font-bold">{slot.startTime}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{slot.status === 'booked' ? "Booked Slot" : slot.status === 'available' ? "Available Slot" : "Unavailable"}</h4>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                        {slot.type === 'Video Consult' ? <FaVideo className="text-blue-500 text-xs" /> : <FaMapMarkerAlt className="text-red-500 text-xs" />} {slot.type}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {slot.status === 'booked' ? (
                        <Link to="/dashboard/doctor/prescription-management" className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-lg flex-1 sm:flex-none h-9 px-4">Rx / Records</Link>
                      ) : (
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 uppercase tracking-wider">{slot.status}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
                  <FaCalendarDay className="text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No schedule slots available for today.</p>
                  <Link to="/dashboard/doctor/manage-schedule" className="mt-4 text-primary font-bold text-sm hover:underline">Add Schedule</Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Appointment Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-poppins font-bold text-gray-900">Appointment Requests</h3>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{appointmentRequests.length} New</span>
            </div>
            
            <div className="space-y-4">
              {appointmentRequests.length > 0 ? (
                appointmentRequests.map(req => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                      <img src={req.image} alt={req.patient} className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start sm:block">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{req.patient}</h4>
                          <span className="flex sm:hidden items-center gap-1 text-primary bg-teal-50 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0"><FaClock /> {req.requestedTime}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 text-xs font-medium text-gray-500 mt-1">
                          <span className="hidden sm:flex items-center gap-1 text-primary bg-teal-50 px-2 py-0.5 rounded-md w-max"><FaClock /> {req.requestedTime}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{req.reason}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Decline">
                        <FaTimesCircle className="text-xl" />
                      </button>
                      <button className="p-2 text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded-lg transition-colors" title="Approve">
                        <FaCheckCircle className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 font-medium text-sm">
                  No pending appointment requests.
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Secondary Content) */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-poppins font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} to={action.link} className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-100 ${action.hover} hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-md`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${action.bg} ${action.color} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                    {action.icon}
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-white transition-colors">{action.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;
