import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaUserMd, FaPlus, FaHashtag } from "react-icons/fa";
import { useModal } from "../../../context/ModalContext";

const MyAppointments = () => {
  const [filter, setFilter] = useState("All");
  const { openModal } = useModal();

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      aptId: "MC-2026-1042",
      doctorName: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      date: "Oct 24, 2026",
      time: "10:00 AM - 10:30 AM",
      type: "Video Consult",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      aptId: "MC-2026-1043",
      doctorName: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "Nov 02, 2026",
      time: "02:00 PM - 03:00 PM",
      type: "In-Person Consult",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      aptId: "MC-2026-1044",
      doctorName: "Dr. Emily Wong",
      specialty: "Dermatologist",
      date: "Sep 15, 2026",
      time: "09:00 AM - 09:30 AM",
      type: "Video Consult",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1594824436998-d58df189038e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 4,
      aptId: "MC-2026-1045",
      doctorName: "Dr. Robert Smith",
      specialty: "Orthopedic",
      date: "Aug 20, 2026",
      time: "11:00 AM - 12:00 PM",
      type: "In-Person Consult",
      status: "Cancelled",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    }
  ]);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: "Cancelled" } : apt
      ));
    }
  };

  const handleReschedule = (id) => {
    alert("Reschedule functionality would open a calendar picker here.");
  };

  const handleBookAppointment = (newAppointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "All") return true;
    return apt.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Upcoming":
        return <span className="flex items-center justify-center w-28 gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold"><FaClock /> Upcoming</span>;
      case "Completed":
        return <span className="flex items-center justify-center w-28 gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold"><FaCheckCircle /> Completed</span>;
      case "Cancelled":
        return <span className="flex items-center justify-center w-28 gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold"><FaTimesCircle /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>

        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
          {["All", "Upcoming", "Completed", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filter === f
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => openModal(handleBookAppointment)}
          className="mt-4 md:mt-0 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-[#095c55] transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          <FaPlus /> Book New Appointment
        </button>
      </motion.div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {filteredAppointments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <FaCalendarAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-500">You don't have any {filter.toLowerCase()} appointments at the moment.</p>
            </motion.div>
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
                      <h3 className="text-xl font-bold text-gray-900 mb-1 pr-24">{apt.doctorName}</h3>
                      <p className="text-primary font-semibold text-sm flex items-center gap-1.5">
                        <FaUserMd /> {apt.specialty}
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
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                        <FaHashtag className="text-purple-500" />
                        {apt.aptId}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      {apt.status === "Upcoming" && (
                        <>
                          <button
                            onClick={() => handleReschedule(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-green-100 text-green-700 hover:bg-green-200 font-bold rounded-xl transition-colors text-sm"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="flex-1 py-2.5 px-4 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-xl transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {apt.status === "Completed" && (
                        <button className="w-full py-2.5 px-4 bg-teal-500 text-white hover:bg-teal-600 font-bold rounded-xl transition-colors shadow-sm shadow-teal-500/20 text-sm">
                          Book Follow-up
                        </button>
                      )}

                      {apt.status === "Cancelled" && (
                        <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition-colors text-sm">
                          Rebook Appointment
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
    </div>
  );
};

export default MyAppointments;
