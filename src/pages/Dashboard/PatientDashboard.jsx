import { motion } from "framer-motion";
import { FaCalendarCheck, FaUserMd, FaWallet, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaVideo, FaMapMarkerAlt } from "react-icons/fa";

const PatientDashboard = () => {
  // Mock Data
  const stats = [
    { title: "My Appointments", value: "2", icon: <FaCalendarCheck className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Total Consultations", value: "14", icon: <FaUserMd className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Total Payments", value: "$450", fullValue: "$450.00", icon: <FaWallet className="text-purple-600" />, bg: "bg-purple-100/50" },
    { title: "Favorite Doctors", value: "4", icon: <FaStar className="text-orange-500" />, bg: "bg-orange-100/50" },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      date: "Oct 24, 2026",
      time: "10:00 AM - 10:30 AM",
      type: "Video Consult",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    }
  ];

  const appointmentHistory = [
    { id: 1, doctor: "Dr. Michael Chen", date: "Sep 15, 2026", status: "Completed" },
    { id: 2, doctor: "Dr. Emily Wong", date: "Aug 02, 2026", status: "Completed" },
    { id: 3, doctor: "Dr. Sarah Jenkins", date: "Jul 20, 2026", status: "Cancelled" },
    { id: 4, doctor: "Dr. Robert Smith", date: "Jun 10, 2026", status: "Completed" },
  ];

  const favoriteDoctors = [
    { id: 1, name: "Dr. Sarah Jenkins", specialty: "Cardiologist", rating: "4.9", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", rating: "4.8", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  ];

  const recentActivities = [
    { id: 1, action: "Booked Appointment", target: "Dr. Sarah Jenkins", time: "2 hours ago", type: "booking" },
    { id: 2, action: "Payment Successful", target: "$50 for Consultation", time: "1 day ago", type: "payment" },
    { id: 3, action: "Prescription Added", target: "By Dr. Michael Chen", time: "3 days ago", type: "prescription" },
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
            Welcome back, John!
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Here's what's happening with your health profile today.
          </p>
        </div>
        <button className="btn btn-primary bg-primary border-primary text-white hover:bg-primary-focus rounded-xl px-6 shadow-sm">
          Book New Appointment
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
              <button className="text-primary font-semibold text-sm hover:underline">View All</button>
            </div>

            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/30 transition-colors bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={apt.image} alt={apt.doctorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{apt.doctorName}</h4>
                    <p className="text-primary font-medium text-sm mb-2">{apt.specialty}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                      <span className="flex items-center gap-1"><FaCalendarCheck className="text-gray-400" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><FaClock className="text-gray-400" /> {apt.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:ml-auto w-full sm:w-auto">
                  <div className="flex items-center justify-center gap-1 bg-teal-50 text-primary text-xs font-bold px-3 py-1.5 rounded-lg w-full">
                    {apt.type === 'Video Consult' ? <FaVideo /> : <FaMapMarkerAlt />}
                    {apt.type}
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button className="btn btn-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">Reschedule</button>
                    <button className="btn btn-sm btn-primary text-white hover:bg-primary-focus rounded-lg">Join Call</button>
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
                  <tr className="border-b border-gray-100 text-gray-500 text-sm font-semibold">
                    <th className="pb-3 pl-4">Doctor Name</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentHistory.map((history, idx) => (
                    <tr key={history.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === appointmentHistory.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4 pl-4 font-bold text-gray-900">{history.doctor}</td>
                      <td className="py-4 text-gray-600 text-sm font-medium">{history.date}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center justify-center w-28 gap-1.5 py-1 rounded-full text-xs font-bold ${history.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {history.status === 'Completed' ? <FaCheckCircle /> : <FaTimesCircle />}
                          {history.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-primary hover:text-[#095c55] font-bold text-sm transition-colors">Review</button>
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
              {favoriteDoctors.map(doc => (
                <div key={doc.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-gray-500 text-xs font-medium">{doc.specialty}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-yellow-500">
                        <FaStar /> {doc.rating}
                      </div>
                    </div>
                  </div>
                  <button className="text-primary p-2 bg-teal-50 rounded-lg hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <FaCalendarCheck />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              Find More Doctors
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

    </div>
  );
};

export default PatientDashboard;
