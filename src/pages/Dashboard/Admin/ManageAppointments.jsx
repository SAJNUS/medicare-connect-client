import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCalendarCheck, FaVideo, FaMapMarkerAlt, FaTimesCircle, FaCheckCircle, FaClock, FaBan, FaRegCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const initialAppointments = [
  {
    id: "APT-9041",
    patientName: "Alice Johnson",
    doctorName: "Dr. James Wilson",
    date: "Oct 24, 2026",
    time: "10:00 AM",
    type: "Video Consult",
    status: "Approved",
    avatar: "https://i.pravatar.cc/150?u=alice"
  },
  {
    id: "APT-8832",
    patientName: "Robert Smith",
    doctorName: "Dr. Sarah Jenkins",
    date: "Oct 25, 2026",
    time: "02:30 PM",
    type: "In-Person",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?u=robert"
  },
  {
    id: "APT-7619",
    patientName: "Emily Wong",
    doctorName: "Dr. Michael Chen",
    date: "Oct 15, 2026",
    time: "09:00 AM",
    type: "Video Consult",
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?u=emily"
  },
  {
    id: "APT-7001",
    patientName: "John Doe",
    doctorName: "Dr. James Wilson",
    date: "Oct 12, 2026",
    time: "11:00 AM",
    type: "In-Person",
    status: "Cancelled",
    avatar: "https://i.pravatar.cc/150?u=john"
  },
  {
    id: "APT-6544",
    patientName: "Sarah Connor",
    doctorName: "Dr. Emily Wong",
    date: "Oct 26, 2026",
    time: "04:15 PM",
    type: "Video Consult",
    status: "Approved",
    avatar: "https://i.pravatar.cc/150?u=sarahc"
  }
];

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id ? { ...apt, status: "Cancelled" } : apt
    ));
    
    toast.success(`Successfully cancelled appointment for ${selectedAppointment.patientName}.`);
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Approved":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><FaCheckCircle /> Approved</span>;
      case "Pending":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700"><FaClock /> Pending</span>;
      case "Completed":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700"><FaCalendarCheck /> Completed</span>;
      case "Cancelled":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><FaTimesCircle /> Cancelled</span>;
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
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Appointments</h1>
          <p className="text-sm font-medium text-gray-500">Monitor all platform appointments.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full sm:w-auto pb-2 sm:pb-0">
            {["All", "Pending", "Approved", "Completed", "Cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${statusFilter === f
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Patient</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Doctor</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Date & Time</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Type</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <FaRegCalendarAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="font-semibold text-gray-900 text-lg">No appointments found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={apt.avatar} alt={apt.patientName} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900">{apt.patientName}</p>
                        <p className="text-xs font-medium text-gray-500">{apt.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{apt.doctorName}</p>
                  </td>
                  <td className="p-4 text-center">
                    <p className="font-bold text-gray-900 text-sm">{apt.date}</p>
                    <p className="text-xs font-medium text-gray-500">{apt.time}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-bold">
                      {apt.type === 'Video Consult' ? <FaVideo className="text-teal-500" /> : <FaMapMarkerAlt className="text-blue-500" />}
                      {apt.type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(apt.status)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleCancelClick(apt)} 
                      disabled={apt.status === "Completed" || apt.status === "Cancelled"}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        (apt.status === "Completed" || apt.status === "Cancelled")
                          ? "text-gray-300 cursor-not-allowed" 
                          : "text-red-500 hover:bg-red-50"
                      }`} 
                      title="Cancel Appointment"
                    >
                      <FaBan className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FaRegCalendarAlt className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="font-semibold text-gray-900 text-lg">No appointments found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={apt.avatar} alt={apt.patientName} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{apt.patientName}</h3>
                    <p className="text-xs font-medium text-gray-500">{apt.id}</p>
                  </div>
                </div>
                <div>{getStatusBadge(apt.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                <div className="col-span-2 flex items-center justify-between border-b border-gray-200/50 pb-2 mb-1">
                  <span className="text-gray-500 font-semibold">Doctor</span>
                  <span className="font-bold text-gray-900">{apt.doctorName}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-0.5 font-semibold">Date & Time</span>
                  <span className="font-bold text-gray-900">{apt.date}</span>
                  <span className="block text-gray-500 mt-0.5">{apt.time}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-0.5 font-semibold">Type</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-gray-900">
                    {apt.type === 'Video Consult' ? <FaVideo className="text-teal-500" /> : <FaMapMarkerAlt className="text-blue-500" />}
                    {apt.type}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  onClick={() => handleCancelClick(apt)} 
                  disabled={apt.status === "Completed" || apt.status === "Cancelled"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full ${
                    (apt.status === "Completed" || apt.status === "Cancelled")
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <FaBan /> Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl mb-4 bg-red-100 text-red-600">
                  <FaBan />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Cancel Appointment?
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  Are you sure you want to cancel the appointment for <span className="font-bold text-gray-900">{selectedAppointment.patientName}</span> with <span className="font-bold text-gray-900">{selectedAppointment.doctorName}</span>?
                </p>
                <p className="text-xs text-red-500 font-bold mt-3 bg-red-50 py-1.5 px-3 rounded-lg inline-block">This action cannot be undone.</p>
              </div>
              <div className="grid grid-cols-2 bg-gray-50 border-t border-gray-100 divide-x divide-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancel}
                  className="py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAppointments;
