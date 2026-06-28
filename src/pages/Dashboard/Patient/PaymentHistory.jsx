import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";

const PaymentHistory = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState([
    {
      id: "TXN-2026-9041",
      doctorName: "Dr. Sarah Jenkins",
      date: "Oct 24, 2026",
      time: "10:00 AM",
      amount: 150.00,
      method: "Visa ending in 4242",
      cardType: "visa",
      status: "Completed",
      type: "Video Consult"
    },
    {
      id: "TXN-2026-8832",
      doctorName: "Dr. Michael Chen",
      date: "Oct 15, 2026",
      time: "02:30 PM",
      amount: 200.00,
      method: "Mastercard ending in 8812",
      cardType: "mastercard",
      status: "Completed",
      type: "In-Person Consult"
    },
    {
      id: "TXN-2026-7619",
      doctorName: "Dr. Emily Wong",
      date: "Oct 10, 2026",
      time: "09:00 AM",
      amount: 120.00,
      method: "Stripe",
      cardType: "stripe",
      status: "Pending",
      type: "Video Consult"
    },
    {
      id: "TXN-2026-7001",
      doctorName: "Dr. Robert Smith",
      date: "Sep 28, 2026",
      time: "11:00 AM",
      amount: 180.00,
      method: "Visa ending in 4242",
      cardType: "visa",
      status: "Failed",
      type: "In-Person Consult"
    },
    {
      id: "TXN-2026-6544",
      doctorName: "Dr. Sarah Jenkins",
      date: "Sep 15, 2026",
      time: "10:00 AM",
      amount: 150.00,
      method: "Visa ending in 4242",
      cardType: "visa",
      status: "Completed",
      type: "Video Consult"
    }
  ]);

  const handleDownload = (id) => {
    alert(`Downloading receipt for transaction ${id}... (Mock Stripe Integration)`);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === "All" || txn.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      txn.doctorName.toLowerCase().includes(searchLower) || 
      txn.id.toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"><FaCheckCircle /> Completed</span>;
      case "Pending":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100"><FaClock /> Pending</span>;
      case "Failed":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100"><FaTimesCircle /> Failed</span>;
      default:
        return null;
    }
  };

  const getCardIcon = (type) => {
    switch(type) {
      case "visa": return <FaCcVisa className="text-blue-600 text-xl" />;
      case "mastercard": return <FaCcMastercard className="text-orange-600 text-xl" />;
      default: return <FaCreditCard className="text-gray-500 text-xl" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment History</h1>
          <p className="text-sm font-medium text-gray-500">Track and manage your consultation payments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Doctor or TXN ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
            {["All", "Completed", "Pending", "Failed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">No transactions found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                )}
                {filteredTransactions.map((txn) => (
                  <motion.tr 
                    key={txn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.id}</div>
                      <div className="text-xs font-semibold text-gray-500">{txn.date} at {txn.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.doctorName}</div>
                      <div className="text-xs font-semibold text-gray-500">{txn.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm mb-1">${txn.amount.toFixed(2)}</div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                        {getCardIcon(txn.cardType)}
                        {txn.method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.status === "Completed" ? (
                        <button 
                          onClick={() => handleDownload(txn.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs font-semibold">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-gray-100">
          <AnimatePresence>
            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-900">No transactions found</p>
                <p className="text-sm">Try adjusting your filters or search query.</p>
              </div>
            )}
            {filteredTransactions.map((txn) => (
              <motion.div 
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.id}</div>
                    <div className="text-xs font-semibold text-gray-500">{txn.date} • {txn.time}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-900 text-base mb-1">${txn.amount.toFixed(2)}</div>
                    {getStatusBadge(txn.status)}
                  </div>
                </div>

                <div className="flex justify-between items-end gap-4 pt-2 border-t border-gray-50">
                  <div>
                    <div className="font-bold text-gray-800 text-sm mb-0.5">{txn.doctorName}</div>
                    <div className="text-xs font-semibold text-gray-500 mb-2">{txn.type}</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      {getCardIcon(txn.cardType)}
                      {txn.method}
                    </div>
                  </div>
                  
                  {txn.status === "Completed" && (
                    <button 
                      onClick={() => handleDownload(txn.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-primary hover:text-white transition-colors text-xs font-bold border border-gray-200"
                    >
                      <FaDownload /> Receipt
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default PaymentHistory;
