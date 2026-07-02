import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaUserMd, FaPlus, FaHashtag, FaHeartbeat, FaBrain, FaBaby, FaBone, FaVenus, FaTooth, FaHeadSideVirus } from "react-icons/fa";
import { useModal } from "../../../context/ModalContext";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
import PaymentModal from "../../../components/payment/PaymentModal";
import toast from "react-hot-toast";
import { formatToDDMMYYYY, generateAvailableTimeSlots } from "../../../utils/dateUtils";

const getSpecialtyIcon = (specialty) => {
  if (!specialty) return <FaUserMd />;
  const s = specialty.toLowerCase();
  if (s.includes("cardiology")) return <FaHeartbeat />;
  if (s.includes("neurology")) return <FaBrain />;
  if (s.includes("pediatric")) return <FaBaby />;
  if (s.includes("orthopedics")) return <FaBone />;
  if (s.includes("dermatology")) return <FaUserMd />;
  if (s.includes("gynecology")) return <FaVenus />;
  if (s.includes("dentistry")) return <FaTooth />;
  if (s.includes("psychiatry")) return <FaHeadSideVirus />;
  return <FaUserMd />;
};

const MyAppointments = () => {
  const [filter, setFilter] = useState("All");
  const { openModal } = useModal();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalData, setPaymentModalData] = useState(null);

  const [cancelData, setCancelData] = useState(null);

  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [isRescheduleDateFocused, setIsRescheduleDateFocused] = useState(false);
  const rescheduleDateInputRef = useRef(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (authLoading) return;
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      try {
        const [aptRes, docRes] = await Promise.all([
          axiosInstance.get(`/appointments?patientEmail=${user.email}`),
          axiosInstance.get('/doctors').catch(() => ({ data: { data: [] } }))
        ]);

        const doctorsList = docRes.data?.data || [];

        if (aptRes.data.success) {
          const mappedApts = aptRes.data.data.map(apt => {
            const docDetails = doctorsList.find(d => d._id === apt.doctorId || d.name === apt.doctorName);
            const exp = docDetails ? parseInt(docDetails.experience) || 5 : 5;
            let designation = "Consultant";
            if (exp >= 15) designation = "Professor";
            else if (exp >= 10) designation = "Associate Professor";

            return {
              id: apt._id,
              aptId: apt.aptId || apt._id.substring(0, 8),
              doctorName: apt.doctorName,
              specialty: docDetails?.specialization || docDetails?.specialty || apt.specialty || "General",
              designation,
              date: apt.date || apt.appointmentDate,
              time: apt.time || apt.timeSlot,
              type: apt.type || "In-Person Consult",
              status: apt.appointmentStatus === "awaiting_payment" ? "Waiting"
                : apt.appointmentStatus === "pending" ? "Pending"
                  : apt.appointmentStatus === "approved" ? "Upcoming"
                    : apt.appointmentStatus === "completed" ? "Completed"
                      : apt.appointmentStatus === "rejected" ? "Rejected"
                        : apt.appointmentStatus === "cancelled" ? "Cancelled" : "Waiting",
              image: docDetails?.photoURL || docDetails?.image || docDetails?.avatar || docDetails?.photoUrl || "",
              rawStatus: apt.appointmentStatus,
              paymentStatus: apt.paymentStatus || 'unpaid',
              fee: apt.fee,
              patientEmail: apt.patientEmail,
              doctorEmail: apt.doctorEmail,
              patientName: apt.patientName
            };
          });
          setAppointments(mappedApts);
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [user, authLoading]);

  const handleCancel = (id) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    if (apt.rawStatus !== 'pending' && apt.rawStatus !== 'awaiting_payment') {
      toast.error("Only Waiting or Pending appointments can be cancelled.");
      return;
    }
    setCancelData(apt);
  };

  const confirmCancel = async () => {
    if (!cancelData) return;
    try {
      await axiosInstance.patch(`/appointments/${cancelData.id}/status`, { status: 'cancelled' });
      setAppointments(appointments.map(a =>
        a.id === cancelData.id ? { ...a, status: "Cancelled", rawStatus: "cancelled" } : a
      ));
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      toast.error("Failed to cancel appointment");
    } finally {
      setCancelData(null);
    }
  };

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
        setAppointments(appointments.map(a =>
          a.id === rescheduleData.id ? { ...a, date: formatToDDMMYYYY(rescheduleForm.date), time: rescheduleForm.time } : a
        ));
        setRescheduleData(null);
        setRescheduleForm({ date: '', time: '' });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reschedule appointment");
    }
  };

  const handleReschedule = (id) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      if (apt.rawStatus !== 'pending' && apt.rawStatus !== 'awaiting_payment') {
        toast.error("Only Waiting or Pending appointments can be rescheduled.");
        return;
      }
      setRescheduleData(apt);
      setRescheduleForm({ date: '', time: '' });
    }
  };

  const handleBookAppointment = (newAppointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const handlePaymentSuccess = (transactionId) => {
    setAppointments(appointments.map(apt =>
      apt.id === paymentModalData.id ? { ...apt, paymentStatus: 'paid' } : apt
    ));
    setPaymentModalData(null);
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "All") return true;
    return apt.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Waiting":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold"><FaClock /> Waiting</span>;
      case "Pending":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold"><FaClock /> Pending</span>;
      case "Upcoming":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold"><FaClock /> Upcoming</span>;
      case "Completed":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold"><FaCheckCircle /> Completed</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold"><FaTimesCircle /> Rejected</span>;
      case "Cancelled":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold"><FaTimesCircle /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-sm font-medium text-gray-500">Manage your consultations, payments, and appointment history.</p>
        </div>

        <button
          onClick={() => openModal(handleBookAppointment)}
          className="w-full md:w-auto mt-4 md:mt-0 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-[#095c55] transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          <FaPlus /> New Appointment
        </button>
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {["All", "Waiting", "Pending", "Upcoming", "Completed", "Rejected", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filter === f
              ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="col-span-full min-h-[300px] flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="col-span-full min-h-[300px] flex flex-col items-center justify-center p-12 text-center">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-500 text-sm">You don't have any {filter.toLowerCase() !== 'all' ? filter.toLowerCase() : ''} appointments.</p>
            </div>
          ) : (
            filteredAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  {getStatusBadge(apt.status)}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    <img src={apt.image} alt={apt.doctorName} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-0.5 pr-24">{apt.doctorName}</h3>
                      {apt.designation && (
                        <p className="text-[#0b6e66] text-xs font-semibold mb-1">
                          {apt.designation}
                        </p>
                      )}
                      <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                        <span className="text-primary">{getSpecialtyIcon(apt.specialty)}</span> {apt.specialty}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <FaCalendarAlt className="text-teal-500" />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                        <FaClock className="text-orange-500" />
                        {apt.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        {apt.type === 'Video Consult' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-red-500" />}
                        {apt.type}
                      </div>
                    </div>

                    {/* Action Buttons — per status */}
                    <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">

                      {/* WAITING: booked but unpaid */}
                      {apt.status === "Waiting" && (
                        <>
                          <button
                            onClick={() => setPaymentModalData(apt)}
                            className="flex-1 py-2.5 px-4 bg-primary text-white hover:bg-[#0b6e66] font-bold rounded-xl transition-colors shadow-sm text-sm"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleReschedule(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-red-500 text-white hover:bg-red-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* PENDING: paid, awaiting doctor approval */}
                      {apt.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleReschedule(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-red-500 text-white hover:bg-red-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
                            title="Cancelling a paid appointment will trigger an automatic refund."
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* UPCOMING: doctor approved */}
                      {apt.status === "Upcoming" && (
                        <>
                          <button
                            onClick={() => handleReschedule(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
                          >
                            Reschedule
                          </button>
                          {apt.type === "Video Consult" ? (
                            <button
                              className="flex-1 py-2.5 px-4 bg-primary text-white hover:bg-[#0b6e66] font-bold rounded-xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
                            >
                              <FaVideo /> Join Call
                            </button>
                          ) : (
                            <button
                              className="flex-1 py-2.5 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-colors text-sm"
                            >
                              View Details
                            </button>
                          )}
                        </>
                      )}

                      {/* COMPLETED */}
                      {apt.status === "Completed" && (
                        <button
                          onClick={() => navigate('/dashboard/patient/prescriptions')}
                          className="w-full py-2.5 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-colors text-sm"
                        >
                          View Prescription
                        </button>
                      )}

                      {/* REJECTED */}
                      {apt.status === "Rejected" && (
                        <button
                          onClick={() => openModal(handleBookAppointment)}
                          className="w-full py-2.5 px-4 bg-primary text-white hover:bg-[#0b6e66] font-bold rounded-xl transition-colors shadow-sm text-sm"
                        >
                          Book Again
                        </button>
                      )}

                      {/* CANCELLED */}
                      {apt.status === "Cancelled" && (
                        <button
                          onClick={() => openModal(handleBookAppointment)}
                          className="w-full py-2.5 px-4 bg-primary text-white hover:bg-[#0b6e66] font-bold rounded-xl transition-colors shadow-sm text-sm"
                        >
                          Rebook
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <PaymentModal
        isOpen={!!paymentModalData}
        onClose={() => setPaymentModalData(null)}
        appointment={paymentModalData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelData(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm relative z-10 overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
                <FaTimesCircle />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
              <p className="text-gray-500 text-sm mb-2 font-medium">Are you sure you want to cancel your appointment with {cancelData.doctorName} on {cancelData.date}? This action cannot be undone.</p>
              {cancelData.status === "Pending" && (
                <p className="text-blue-600 text-xs font-semibold bg-blue-50 rounded-lg px-3 py-2 mb-4">
                  💳 Since this appointment was paid, a refund will be processed automatically.
                </p>
              )}
              {cancelData.status !== "Pending" && <div className="mb-4" />}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCancelData(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleData(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Reschedule Appointment</h3>
                <button onClick={() => setRescheduleData(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleRescheduleSubmit} className="p-6">
                <p className="text-gray-600 text-sm mb-6">
                  Select a new date and time for your appointment with <span className="font-bold text-gray-900">{rescheduleData.doctorName}</span>.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Date</label>
                    <input
                      ref={rescheduleDateInputRef}
                      type={isRescheduleDateFocused || !rescheduleForm.date ? "date" : "text"}
                      onFocus={() => setIsRescheduleDateFocused(true)}
                      onBlur={() => setIsRescheduleDateFocused(false)}
                      onClick={handleRescheduleDateClick}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      value={isRescheduleDateFocused || !rescheduleForm.date ? rescheduleForm.date : formatToDDMMYYYY(rescheduleForm.date)}
                      onChange={(e) => {
                        setRescheduleForm({ ...rescheduleForm, date: e.target.value });
                        setIsRescheduleDateFocused(false);
                        if (rescheduleDateInputRef.current) rescheduleDateInputRef.current.type = "text";
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Time</label>
                    <select
                      required
                      value={rescheduleForm.time}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none font-medium"
                    >
                      <option value="" disabled hidden>{rescheduleForm.date ? "Choose a time slot..." : "Select date first"}</option>
                      {generateAvailableTimeSlots(rescheduleForm.date).map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setRescheduleData(null)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-[#0b6e66] transition-colors shadow-lg shadow-primary/30 text-sm">Confirm Reschedule</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
