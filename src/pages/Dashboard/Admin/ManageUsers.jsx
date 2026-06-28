import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTrash, FaBan, FaCheckCircle, FaUserShield, FaUser, FaUserMd } from "react-icons/fa";
import { toast } from "react-hot-toast";

const initialUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Patient", joinDate: "Oct 12, 2026", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Dr. James Wilson", email: "j.wilson@example.com", role: "Doctor", joinDate: "Oct 10, 2026", status: "Active", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Robert Smith", email: "robert.s@example.com", role: "Patient", joinDate: "Sep 28, 2026", status: "Suspended", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  { id: 4, name: "Emily Wong", email: "emily.w@example.com", role: "Patient", joinDate: "Sep 15, 2026", status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
  { id: 5, name: "Admin System", email: "admin@medicare.com", role: "Admin", joinDate: "Jan 01, 2026", status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === "Active" ? "Suspended" : "Active";
        toast.success(`User ${newStatus.toLowerCase()} successfully!`, {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    toast.success("User deleted successfully!", {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "Admin": return <FaUserShield className="text-purple-500" />;
      case "Doctor": return <FaUserMd className="text-teal-500" />;
      default: return <FaUser className="text-blue-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case "Admin": return "bg-purple-100 text-purple-700";
      case "Doctor": return "bg-teal-100 text-teal-700";
      default: return "bg-blue-100 text-blue-700";
    }
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

      {/* Responsive Users List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {filteredUsers.length === 0 ? (
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs font-medium text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)} {user.role}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-sm text-gray-600 text-center">{user.joinDate}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={user.role === 'Admin'}
                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            className={`p-2 rounded-lg transition-colors ${user.role === 'Admin' ? 'text-gray-300 cursor-not-allowed' : user.status === 'Active' ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                          >
                            {user.status === 'Active' ? <FaBan /> : <FaCheckCircle />}
                          </button>
                          <button 
                            onClick={() => confirmDelete(user)}
                            disabled={user.role === 'Admin'}
                            title="Delete User"
                            className={`p-2 rounded-lg transition-colors ${user.role === 'Admin' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View (hidden on lg) */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-5 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-900 text-base">{user.name}</p>
                        <p className="text-sm font-medium text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex justify-center items-center px-2 py-1 rounded-md text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Role</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)} {user.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Join Date</span>
                      <span className="font-medium text-gray-700">{user.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={user.role === 'Admin'}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-colors ${user.role === 'Admin' ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : user.status === 'Active' ? 'border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100' : 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'}`}
                    >
                      {user.status === 'Active' ? <><FaBan /> Suspend</> : <><FaCheckCircle /> Activate</>}
                    </button>
                    <button 
                      onClick={() => confirmDelete(user)}
                      disabled={user.role === 'Admin'}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border transition-colors ${user.role === 'Admin' ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'}`}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
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

    </div>
  );
};

export default ManageUsers;
