import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaCheck, FaTimes, FaInbox, FaUserInjured, FaNotesMedical, FaCheckCircle, FaBan, FaClock as FaClockReg, FaHashtag } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
const AppointmentRequests = () => {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      if (authLoading) return;
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get(`/appointments?doctorEmail=${user.email}`);
        if (response.data.success) {
          const mappedReqs = response.data.data.map(apt => ({
            id: apt._id,
            aptId: apt.aptId || apt._id.substring(0, 8),
            patientName: apt.patientName || "Patient",
            image: apt.patientImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            issue: apt.symptoms && apt.symptoms.length > 0 ? apt.symptoms[0] : "General Checkup",
            date: apt.date || apt.appointmentDate,
            time: apt.time || apt.timeSlot,
            type: apt.type || "In-Person Consult",
            status: apt.appointmentStatus === "pending" ? "Pending"
                  : apt.appointmentStatus === "approved" ? "Approved"
                  : apt.appointmentStatus === "rejected" ? "Rejected" 
                  : apt.appointmentStatus === "completed" ? "Completed" : "Pending",
            rawStatus: apt.appointmentStatus
          }));
          setRequests(mappedReqs);
        }
      } catch (err) {
        console.error("Failed to fetch appointment requests", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [user, authLoading]);

  const filteredRequests = requests.filter(req => filter === "All" || req.status === filter);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/appointments/${id}/status`, { status: 'approved' });
      setRequests(requests.map(req => req.id === id ? { ...req, status: "Approved", rawStatus: "approved" } : req));
      toast.success("Appointment approved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this appointment request?")) {
      try {
        await axiosInstance.patch(`/appointments/${id}/status`, { status: 'rejected' });
        setRequests(requests.map(req => req.id === id ? { ...req, status: "Rejected", rawStatus: "rejected" } : req));
        toast.success("Appointment rejected.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to reject");
      }
    }
  };

  const handleMarkCompleted = async (req) => {
    try {
      await axiosInstance.patch(`/appointments/${req.id}/status`, { status: 'completed' });
      setRequests(requests.map(r => r.id === req.id ? { ...r, status: "Completed", rawStatus: "completed" } : r));

    
    // 2. Show toast
    toast.success("Appointment marked as completed!", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    });

    // 3. Navigate with state
    navigate("/dashboard/doctor/prescriptions", { state: { appointmentData: req } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as completed");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100"><FaClockReg /> Pending</span>;
      case "Approved":
        return <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"><FaCheckCircle /> Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100"><FaBan /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto space-y-8 pb-8"
    >
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointment Requests</h1>
          <p className="text-sm font-medium text-gray-500">Review and manage incoming patient consultation requests.</p>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2"
      >
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              filter === f
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Requests Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[300px] content-start"
        >
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 font-medium">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
              <FaInbox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
              <p className="text-gray-500 text-sm">You don't have any {filter.toLowerCase() !== 'all' ? filter.toLowerCase() : ''} appointment requests.</p>
            </div>
          ) : (
            filteredRequests.map((req, index) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Patient Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                    {req.image ? (
                      <img src={req.image} alt={req.patientName} className="w-full h-full object-cover" />
                    ) : (
                      <FaUserInjured className="text-3xl text-gray-300" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 pr-24">{req.patientName}</h3>
                      <p className="text-gray-500 text-sm flex items-start gap-1.5 mt-2">
                        <FaNotesMedical className="text-primary flex-shrink-0 mt-0.5" /> 
                        <span className="font-medium leading-relaxed">{req.issue}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <FaCalendarAlt className="text-teal-500" />
                        {req.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                        <FaClock className="text-orange-500" />
                        {req.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        {req.type === 'Video Consult' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-red-500" />}
                        {req.type}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                        <FaHashtag className="text-purple-500" />
                        {req.aptId}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {req.status === "Pending" && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 py-2.5 px-4 bg-green-100 text-green-700 hover:bg-green-200 font-bold rounded-xl transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex-1 py-2.5 px-4 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-xl transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {req.status === "Approved" && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => handleMarkCompleted(req)}
                          className="flex-1 py-2.5 px-4 bg-teal-500 text-white hover:bg-teal-600 font-bold rounded-xl transition-colors shadow-sm shadow-teal-500/20 text-sm"
                        >
                          Mark Completed
                        </button>
                        <button className="flex-1 py-2.5 px-4 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold rounded-xl transition-colors text-sm">
                          View Profile
                        </button>
                      </div>
                    )}

                    {req.status === "Rejected" && (
                      <div className="pt-2">
                        <button disabled className="w-full py-2.5 px-4 bg-red-50/50 border border-red-100 text-red-400 font-bold rounded-xl text-sm cursor-not-allowed">
                          Request Rejected
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AppointmentRequests;
