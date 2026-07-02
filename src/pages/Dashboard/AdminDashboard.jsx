import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaCalendarCheck, FaStar, FaDownload, FaWallet } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import axiosInstance from "../../api/axiosInstance";
import { formatCompactNumber } from "../../utils/formatUtils";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    averageRating: 0,
    appointmentTrendData: [],
    specialtyRevenueData: [],
    doctorPerformanceData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (!num) return "0";
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();
  };

  const stats = [
    { title: "Total Patients", value: formatNumber(dashboardData.totalPatients), fullValue: dashboardData.totalPatients.toString(), icon: <FaUsers className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Total Doctors", value: formatNumber(dashboardData.totalDoctors), fullValue: dashboardData.totalDoctors.toString(), icon: <FaUserMd className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Total Appointments", value: formatNumber(dashboardData.totalAppointments), fullValue: dashboardData.totalAppointments.toString(), icon: <FaCalendarCheck className="text-purple-600" />, bg: "bg-purple-100/50" },
    { title: "Average Rating", value: dashboardData.averageRating.toFixed(1), fullValue: `${dashboardData.averageRating.toFixed(1)} / 5.0`, icon: <FaStar className="text-yellow-500" />, bg: "bg-yellow-100/50" },
  ];

  const exportCSV = () => {
    const csvRows = [];
    csvRows.push(['Metric', 'Value']);
    csvRows.push(['Total Patients', dashboardData.totalPatients]);
    csvRows.push(['Total Doctors', dashboardData.totalDoctors]);
    csvRows.push(['Total Appointments', dashboardData.totalAppointments]);
    csvRows.push(['Average Rating', dashboardData.averageRating]);
    csvRows.push([]);
    csvRows.push(['Specialty', 'Revenue']);
    dashboardData.specialtyRevenueData.forEach(item => {
      csvRows.push([item.name, item.value]);
    });
    csvRows.push([]);
    csvRows.push(['Doctor', 'Rating']);
    dashboardData.doctorPerformanceData.forEach(item => {
      csvRows.push([item.name, item.rating]);
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

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
            System Analytics
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Monitor platform health, engagement, and doctor performance.
          </p>
        </div>
        <button onClick={exportCSV} className="btn btn-outline border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-6 shadow-sm flex items-center gap-2">
          <FaDownload /> Export Report
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 leading-tight mb-1" title={stat.fullValue || stat.value}>{stat.value}</p>
              <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Appointments Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-bold text-gray-900">Monthly Appointments Trend</h3>
            <select className="select select-sm select-bordered border-gray-200 text-xs focus:outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.appointmentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAppointments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue by Specialty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
        >
          <h3 className="text-lg font-poppins font-bold text-gray-900 mb-6">Revenue by Specialty</h3>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.specialtyRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.specialtyRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => `BDT ${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#4b5563' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Analytics Charts - Bottom Row */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Doctor Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-bold text-gray-900">Top 7 Doctors by Performance</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.doctorPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="rating" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {dashboardData.doctorPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rating > 4.5 ? '#3b82f6' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
      
    </div>
  );
};

export default AdminDashboard;
