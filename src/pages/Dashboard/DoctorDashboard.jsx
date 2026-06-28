import { motion } from "framer-motion";
import { FaUserInjured, FaCalendarDay, FaStar, FaCheckCircle, FaTimesCircle, FaPlusCircle, FaEnvelope, FaFileMedical, FaClock, FaWallet } from "react-icons/fa";

const DoctorDashboard = () => {
  // Mock Data
  const stats = [
    { title: "Total Patients", value: "1.2K", fullValue: "1,245", icon: <FaUserInjured className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Today's Appointments", value: "8", icon: <FaCalendarDay className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Total Earnings", value: "$82.5K", fullValue: "$82,450.00", icon: <FaWallet className="text-orange-500" />, bg: "bg-orange-100/50" },
    { title: "Reviews Received", value: "4.9", icon: <FaStar className="text-yellow-500" />, bg: "bg-yellow-100/50" },
  ];

  const todaysAppointments = [
    { id: 1, patient: "Alice Johnson", time: "09:00 AM - 09:30 AM", type: "In-Person Consult", status: "Upcoming" },
    { id: 2, patient: "Robert Smith", time: "10:00 AM - 10:30 AM", type: "Video Consult", status: "Upcoming" },
    { id: 3, patient: "Emily Wong", time: "11:30 AM - 12:00 PM", type: "Follow-up", status: "Upcoming" },
  ];

  const appointmentRequests = [
    { id: 1, patient: "Michael Davis", requestedTime: "Oct 25, 10:00 AM", reason: "Annual Checkup", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { id: 2, patient: "Sarah Jenkins", requestedTime: "Oct 26, 02:00 PM", reason: "Heart Palpitations", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  ];

  const quickActions = [
    { title: "Add Prescription", icon: <FaFileMedical />, color: "text-blue-600", bg: "bg-blue-50", hover: "hover:bg-blue-600" },
    { title: "Update Schedule", icon: <FaClock />, color: "text-purple-600", bg: "bg-purple-50", hover: "hover:bg-purple-600" },
    { title: "Message Patients", icon: <FaEnvelope />, color: "text-teal-600", bg: "bg-teal-50", hover: "hover:bg-teal-600" },
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
            Good morning, Dr. Carter!
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Here's what your schedule looks like today.
          </p>
        </div>
        <button className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-xl px-6 shadow-sm">
          <FaPlusCircle className="mr-2" /> Add Slot
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
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-tight mb-1" title={stat.fullValue || stat.value}>{stat.value}</p>
                <p className="text-[13px] font-semibold text-gray-500 whitespace-nowrap">{stat.title}</p>
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
              {todaysAppointments.map((apt, idx) => (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors bg-gray-50/30">
                  <div className="w-16 h-16 rounded-xl bg-teal-50 flex flex-col items-center justify-center text-primary flex-shrink-0">
                    <span className="text-sm font-bold">{apt.time.split(' ')[0]}</span>
                    <span className="text-xs font-medium">{apt.time.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{apt.patient}</h4>
                    <p className="text-gray-500 text-sm">{apt.type}</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="btn btn-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex-1 sm:flex-none">Records</button>
                    <button className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-lg flex-1 sm:flex-none">Start</button>
                  </div>
                </div>
              ))}
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
              {appointmentRequests.map(req => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <img src={req.image} alt={req.patient} className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{req.patient}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                        <span className="flex items-center gap-1 text-primary bg-teal-50 px-2 py-0.5 rounded-md"><FaClock /> {req.requestedTime}</span>
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
              ))}
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
                <button key={idx} className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-100 ${action.hover} hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-md`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${action.bg} ${action.color} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                    {action.icon}
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-white transition-colors">{action.title}</span>
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;
