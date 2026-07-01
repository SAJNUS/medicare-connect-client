import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTrash, FaBan, FaCheckCircle, FaUserShield, FaUser, FaUserMd } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatches = roleFilter === "All" || (u.role || "patient").toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && roleMatches;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const emailA = (a.email || "").toLowerCase();
    const emailB = (b.email || "").toLowerCase();
    
    const isDevA = emailA === "sajnussaharearhojayfa@gmail.com";
    const isDevB = emailB === "sajnussaharearhojayfa@gmail.com";
    
    // Pin dev to the absolute bottom
    if (isDevA && !isDevB) return 1;
    if (!isDevA && isDevB) return -1;
    
    const isAdminA = emailA === "medicare@gmail.com";
    const isAdminB = emailB === "medicare@gmail.com";
    
    // Pin admin to second from the bottom
    if (isAdminA && !isAdminB) return 1;
    if (!isAdminA && isAdminB) return -1;
    
    // For all other users, sort by createdAt descending (newest first)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    return dateB - dateA;
  });

  const confirmSuspend = (u) => {
    setSelectedUser(u);
    setIsSuspendModalOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    try {
      const newStatus = (!selectedUser.status || selectedUser.status === "Active") ? "Suspended" : "Active";
      const response = await axiosInstance.patch(`/users/${selectedUser.email}/status`, { status: newStatus });
      if (response.data.success) {
        setUsers(users.map(u => u.email === selectedUser.email ? { ...u, status: newStatus } : u));
        toast.success(`User ${newStatus.toLowerCase()} successfully!`, {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setIsSuspendModalOpen(false);
    }
  };

  const confirmDelete = (u) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await axiosInstance.delete(`/users/${selectedUser.email}`);
      if (response.data.success) {
        setUsers(users.filter(u => u.email !== selectedUser.email));
        toast.success("User deleted successfully!", {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    if (!role) return "bg-green-100 text-green-700"; // Default patient
    const lowerRole = role.toLowerCase();
    switch(lowerRole) {
      case "developer": return "bg-purple-100 text-purple-700";
      case "admin": return "bg-red-100 text-red-700";
      case "doctor": return "bg-blue-100 text-blue-700";
      default: return "bg-green-100 text-green-700";
    }
  };
  
  const getRoleIcon = (role) => {
    if (!role) return <FaUser className="text-green-500" />;
    const lowerRole = role.toLowerCase();
    switch(lowerRole) {
      case "developer": return <FaUserShield className="text-purple-500" />;
      case "admin": return <FaUserShield className="text-red-500" />;
      case "doctor": return <FaUserMd className="text-blue-500" />;
      default: return <FaUser className="text-green-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Users</h1>
          <p className="text-sm font-medium text-gray-500">View, edit, or disable patient and staff accounts.</p>
        </div>

        <div className="flex items-center w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-700"
            />
          </div>
        </div>
      </motion.div>

      {/* Role Filters */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['All', 'Patient', 'Doctor', 'Admin'].map(tab => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
              roleFilter === tab 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Responsive Users List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            Loading users...
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No users found matching "{searchQuery}"
          </div>
        ) : (
          <>
            {/* Desktop Table View (lg and up) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 font-bold text-gray-600 text-sm">User</th>
                    <th className="p-4 font-bold text-gray-600 text-sm text-center">Role</th>
                    <th className="p-4 font-bold text-gray-600 text-sm text-center">Join Date</th>
                    <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                    <th className="p-4 font-bold text-gray-600 text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedUsers.map((user) => {
                    const isSelf = authUser?.email === user.email;
                    const isProtected = user.email === 'medicare@gmail.com' || user.email === 'sajnussaharearhojayfa@gmail.com';
                    const isDisabled = isSelf || isProtected;
                    
                    return (
                    <tr key={user._id || user.email} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || user.photoURL || "https://ui-avatars.com/api/?name="+user.name+"&background=random"} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs font-medium text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)} {user.role || "Patient"}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-sm text-gray-600 text-center">{formatDate(user.createdAt)}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold ${user.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => confirmSuspend(user)}
                            disabled={isDisabled}
                            title={(!user.status || user.status === 'Active') ? 'Suspend User' : 'Activate User'}
                            className={`p-2 rounded-lg transition-colors ${isDisabled ? 'text-gray-300 cursor-not-allowed' : (!user.status || user.status === 'Active') ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                          >
                            {(!user.status || user.status === 'Active') ? <FaBan /> : <FaCheckCircle />}
                          </button>
                          <button 
                            onClick={() => confirmDelete(user)}
                            disabled={isDisabled}
                            title="Delete User"
                            className={`p-2 rounded-lg transition-colors ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View (hidden on lg) */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {sortedUsers.map((user) => {
                const isSelf = authUser?.email === user.email;
                const isProtected = user.email === 'medicare@gmail.com' || user.email === 'sajnussaharearhojayfa@gmail.com';
                const isDisabled = isSelf || isProtected;
                
                return (
                <div key={user._id || user.email} className="p-5 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar || user.photoURL || "https://ui-avatars.com/api/?name="+user.name+"&background=random"} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-900 text-base">{user.name}</p>
                        <p className="text-sm font-medium text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex justify-center items-center px-2 py-1 rounded-md text-xs font-bold ${user.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Role</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)} {user.role || 'Patient'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Join Date</span>
                      <span className="font-medium text-gray-700">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => confirmSuspend(user)}
                      disabled={isDisabled}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-colors ${isDisabled ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : (!user.status || user.status === 'Active') ? 'border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100' : 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'}`}
                    >
                      {(!user.status || user.status === 'Active') ? <><FaBan /> Suspend</> : <><FaCheckCircle /> Activate</>}
                    </button>
                    <button 
                      onClick={() => confirmDelete(user)}
                      disabled={isDisabled}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-colors ${isDisabled ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'}`}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden p-6"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                <FaTrash />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h3>
              <p className="text-gray-500 text-center text-sm mb-6 space-y-1">
                <span className="block">Are you sure you want to delete <strong className="text-gray-700">{selectedUser.name}</strong>?</span>
                <span className="block">This action cannot be undone and will permanently remove their account.</span>
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Confirmation Modal */}
      <AnimatePresence>
        {isSuspendModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSuspendModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden p-6"
            >
              <div className={`w-16 h-16 ${selectedUser.status === 'Suspended' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto`}>
                {selectedUser.status === 'Suspended' ? <FaCheckCircle /> : <FaBan />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {selectedUser.status === 'Suspended' ? 'Activate User' : 'Suspend User'}
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6 space-y-1">
                <span className="block">Are you sure you want to {selectedUser.status === 'Suspended' ? 'activate' : 'suspend'} <strong className="text-gray-700">{selectedUser.name}</strong>?</span>
                <span className="block">They will {selectedUser.status === 'Suspended' ? 'regain' : 'lose'} access to the system.</span>
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsSuspendModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleToggleStatus}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors shadow-sm ${selectedUser.status === 'Suspended' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
                >
                  Yes, {selectedUser.status === 'Suspended' ? 'Activate' : 'Suspend'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageUsers;
