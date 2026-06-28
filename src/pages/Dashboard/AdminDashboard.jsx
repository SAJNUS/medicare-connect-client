import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaCalendarCheck, FaWallet, FaCheckCircle, FaTimesCircle, FaEllipsisH } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const AdminDashboard = () => {
  // Mock Data
  const stats = [
    { title: "Total Users", value: "24,592", icon: <FaUsers className="text-blue-600" />, bg: "bg-blue-100/50" },
    { title: "Active Doctors", value: "1,432", icon: <FaUserMd className="text-teal-600" />, bg: "bg-teal-100/50" },
    { title: "Appointments", value: "8,945", icon: <FaCalendarCheck className="text-purple-600" />, bg: "bg-purple-100/50" },
    { title: "Total Revenue", value: "$124.5k", icon: <FaWallet className="text-yellow-600" />, bg: "bg-yellow-100/50" },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000, appointments: 2400 },
    { name: 'Feb', revenue: 3000, appointments: 1398 },
    { name: 'Mar', revenue: 2000, appointments: 9800 },
    { name: 'Apr', revenue: 2780, appointments: 3908 },
    { name: 'May', revenue: 1890, appointments: 4800 },
    { name: 'Jun', revenue: 2390, appointments: 3800 },
    { name: 'Jul', revenue: 3490, appointments: 4300 },
  ];

  const demographicData = [
    { name: 'Patients', value: 24592 },
    { name: 'Doctors', value: 1432 },
    { name: 'Admins', value: 12 },
  ];
  const COLORS = ['#0b6e66', '#3b82f6', '#f59e0b'];

  const pendingDoctors = [
    { id: 1, name: "Dr. James Wilson", specialty: "Neurologist", date: "Oct 24, 2026", status: "Pending", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Dr. Lisa Cuddy", specialty: "Endocrinologist", date: "Oct 23, 2026", status: "Pending", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Dr. Eric Foreman", specialty: "Neurologist", date: "Oct 22, 2026", status: "Pending", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  ];

  const recentTransactions = [
    { id: "TRX-8492", user: "Alice Johnson", amount: "$50.00", date: "Oct 24, 2026", status: "Completed" },
    { id: "TRX-8493", user: "Robert Smith", amount: "$120.00", date: "Oct 24, 2026", status: "Pending" },
    { id: "TRX-8494", user: "Emily Wong", amount: "$75.00", date: "Oct 23, 2026", status: "Completed" },
    { id: "TRX-8495", user: "Michael Davis", amount: "$45.00", date: "Oct 23, 2026", status: "Failed" },
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
            System Administration
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Monitor platform health, verify doctors, and analyze revenue.
          </p>
        </div>
        <button className="btn btn-outline border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-6 shadow-sm">
          Generate Report
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
              <p className="text-2xl font-bold text-gray-900 leading-tight mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-bold text-gray-900">Revenue & Appointments Trend</h3>
            <select className="select select-sm select-bordered border-gray-200 text-xs focus:outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b6e66" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0b6e66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0b6e66" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-poppins font-bold text-gray-900 mb-2">User Demographics</h3>
          <p className="text-sm text-gray-500 mb-6">Distribution of roles across the platform</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Tables Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Doctor Verification Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-bold text-gray-900">Doctor Verifications</h3>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingDoctors.length} Pending</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm font-semibold">
                  <th className="pb-3 pl-2">Doctor Info</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((doc, idx) => (
                  <tr key={doc.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === pendingDoctors.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.specialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600 text-sm font-medium">{doc.date}</td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-md transition-colors" title="Reject">
                          <FaTimesCircle />
                        </button>
                        <button className="p-1.5 text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded-md transition-colors" title="Approve">
                          <FaCheckCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-primary font-semibold text-sm hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm font-semibold">
                  <th className="pb-3 pl-2">Transaction ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((trx, idx) => (
                  <tr key={trx.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === recentTransactions.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="py-3.5 pl-2 font-mono text-xs font-bold text-gray-600">{trx.id}</td>
                    <td className="py-3.5 text-sm font-bold text-gray-900">{trx.user}</td>
                    <td className="py-3.5 text-sm font-medium text-gray-700">{trx.amount}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center justify-center w-20 py-0.5 rounded-full text-[10px] font-bold ${
                        trx.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default AdminDashboard;
