import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaUndo, FaCcVisa, FaCcMastercard, FaCreditCard, FaFileInvoiceDollar } from "react-icons/fa";
import toast from "react-hot-toast";

const initialPayments = [
  {
    id: "TXN-2026-9041",
    patientName: "Alice Johnson",
    amount: 150.00,
    method: "Visa ending in 4242",
    cardType: "visa",
    date: "Oct 24, 2026",
    status: "Paid",
    avatar: "https://i.pravatar.cc/150?u=alice"
  },
  {
    id: "TXN-2026-8832",
    patientName: "Robert Smith",
    amount: 200.00,
    method: "Mastercard ending in 8812",
    cardType: "mastercard",
    date: "Oct 15, 2026",
    status: "Paid",
    avatar: "https://i.pravatar.cc/150?u=robert"
  },
  {
    id: "TXN-2026-7619",
    patientName: "Emily Wong",
    amount: 120.00,
    method: "Stripe",
    cardType: "other",
    date: "Oct 10, 2026",
    status: "Refunded",
    avatar: "https://i.pravatar.cc/150?u=emily"
  },
  {
    id: "TXN-2026-7001",
    patientName: "John Doe",
    amount: 180.00,
    method: "Visa ending in 4242",
    cardType: "visa",
    date: "Sep 28, 2026",
    status: "Failed",
    avatar: "https://i.pravatar.cc/150?u=john"
  },
  {
    id: "TXN-2026-6544",
    patientName: "Sarah Connor",
    amount: 150.00,
    method: "Visa ending in 4242",
    cardType: "visa",
    date: "Sep 15, 2026",
    status: "Paid",
    avatar: "https://i.pravatar.cc/150?u=sarahc"
  }
];

const PaymentManagement = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefundClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const confirmRefund = () => {
    setPayments(payments.map(payment => 
      payment.id === selectedPayment.id ? { ...payment, status: "Refunded" } : payment
    ));
    
    toast.success(`Successfully issued refund of $${selectedPayment.amount.toFixed(2)} to ${selectedPayment.patientName}.`);
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Paid":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><FaCheckCircle /> Paid</span>;
      case "Refunded":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700"><FaUndo /> Refunded</span>;
      case "Failed":
        return <span className="inline-flex justify-center items-center w-24 gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><FaTimesCircle /> Failed</span>;
      default:
        return null;
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case "visa": return <FaCcVisa className="text-blue-600 text-lg" />;
      case "mastercard": return <FaCcMastercard className="text-orange-600 text-lg" />;
      default: return <FaCreditCard className="text-gray-500 text-lg" />;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Management</h1>
          <p className="text-sm font-medium text-gray-500">Track platform revenue and manage transaction statuses.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or TXN ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full sm:w-auto pb-2 sm:pb-0">
            {["All", "Paid", "Refunded", "Failed"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${statusFilter === f
                    ? "bg-primary text-white shadow-md shadow-primary/20"
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
                <th className="p-4 font-bold text-gray-600 text-sm">Patient Name</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Amount & Method</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Transaction ID</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Date</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <FaFileInvoiceDollar className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="font-semibold text-gray-900 text-lg">No transactions found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={payment.avatar} alt={payment.patientName} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900">{payment.patientName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 text-sm mb-1">${payment.amount.toFixed(2)}</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      {getCardIcon(payment.cardType)}
                      {payment.method}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <p className="font-bold text-gray-900 text-sm">{payment.id}</p>
                  </td>
                  <td className="p-4 text-center">
                    <p className="font-medium text-gray-600 text-sm">{payment.date}</p>
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleRefundClick(payment)} 
                      disabled={payment.status === "Refunded" || payment.status === "Failed"}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        (payment.status === "Refunded" || payment.status === "Failed")
                          ? "text-gray-300 cursor-not-allowed" 
                          : "text-orange-500 hover:bg-orange-50"
                      }`} 
                      title="Issue Refund"
                    >
                      <FaUndo className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredPayments.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FaFileInvoiceDollar className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="font-semibold text-gray-900 text-lg">No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={payment.avatar} alt={payment.patientName} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{payment.patientName}</h3>
                    <p className="text-xs font-medium text-gray-500">{payment.id}</p>
                  </div>
                </div>
                <div>{getStatusBadge(payment.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                <div className="col-span-2 flex items-center justify-between border-b border-gray-200/50 pb-2 mb-1">
                  <span className="text-gray-500 font-semibold">Amount</span>
                  <span className="font-bold text-gray-900 text-sm">${payment.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-0.5 font-semibold">Method</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-gray-900">
                    {getCardIcon(payment.cardType)}
                    {payment.method}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-gray-500 mb-0.5 font-semibold">Date</span>
                  <span className="font-bold text-gray-900">{payment.date}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  onClick={() => handleRefundClick(payment)} 
                  disabled={payment.status === "Refunded" || payment.status === "Failed"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full ${
                    (payment.status === "Refunded" || payment.status === "Failed")
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                      : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  <FaUndo /> Issue Refund
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl mb-4 bg-orange-100 text-orange-600">
                  <FaUndo />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Issue Refund?
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  Are you sure you want to issue a full refund of <span className="font-bold text-gray-900">${selectedPayment.amount.toFixed(2)}</span> to <span className="font-bold text-gray-900">{selectedPayment.patientName}</span>?
                </p>
                <p className="text-xs text-orange-600 font-bold mt-3 bg-orange-50 py-1.5 px-3 rounded-lg inline-block">This action cannot be undone.</p>
              </div>
              <div className="grid grid-cols-2 bg-gray-50 border-t border-gray-100 divide-x divide-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRefund}
                  className="py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  Yes, Refund
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;
