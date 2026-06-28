import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaCheck, FaTimes, FaInbox, FaUserInjured, FaNotesMedical, FaCheckCircle, FaBan, FaClock as FaClockReg } from "react-icons/fa";

const initialRequests = [
  {
    id: 1,
    patientName: "Alice Smith",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    issue: "Blood Pressure",
    date: "2026-10-24",
    time: "09:00 AM - 09:30 AM",
    type: "In-Person Consult",
    status: "Pending" // Pending, Approved, Rejected
  },
  {
    id: 2,
    patientName: "Bob Johnson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    issue: "Chest Pain",
    date: "2026-10-24",
    time: "10:00 AM - 10:30 AM",
    type: "Video Consult",
    status: "Pending"
  },
  {
    id: 3,
    patientName: "Charlie Brown",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    issue: "Routine Checkup",
    date: "2026-10-22",
    time: "11:00 AM - 11:30 AM",
    type: "In-Person Consult",
    status: "Approved"
  },
  {
    id: 4,
    patientName: "Diana Prince",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    issue: "Prescription Refill",
    date: "2026-10-21",
    time: "02:00 PM - 02:30 PM",
    type: "Video Consult",
    status: "Rejected"
  }
];

const AppointmentRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState("All");

  const filteredRequests = requests.filter(req => filter === "All" || req.status === filter);

  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "Approved" } : req));
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this appointment request?")) {
      setRequests(requests.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
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
                ? "bg-gray-900 text-white shadow-md"
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
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[300px]"
        >
          {filteredRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <FaInbox />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Requests Found</h3>
              <p className="text-gray-500">You don't have any {filter.toLowerCase()} requests at the moment.</p>
            </motion.div>
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
                      <div className="col-span-full flex items-center gap-2 text-xs font-semibold text-gray-700">
                        {req.type === 'Video Consult' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-red-500" />}
                        {req.type}
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
                      <div className="pt-2">
                        <button className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold rounded-xl transition-colors text-sm">
                          View Patient Profile
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
