import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Loader2,
  X,
  History,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  AlertCircle,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Records = () => {
  const { isAdmin } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [filterType, setFilterType] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0]
  });

  const fetchRecords = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchTerm) params.search = searchTerm;
      if (filterType) params.type = filterType;
      
      const { data } = await api.get("/finance", { params });
      setRecords(data.data.records || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filterType]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({ amount: "", category: "", description: "", type: "EXPENSE", date: new Date().toISOString().split("T")[0] });
    setEditingRecord(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingRecord) {
        await api.patch(`/finance/${editingRecord.id}`, payload);
      } else {
        await api.post("/finance", payload);
      }
      
      setShowModal(false);
      resetForm();
      fetchRecords(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save record");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      amount: String(record.amount),
      category: record.category,
      description: record.description || "",
      type: record.type,
      date: new Date(record.date).toISOString().split("T")[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/finance/${id}`);
      fetchRecords(pagination.page);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <History size={16} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Transaction Ledger</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Records</h2>
          <p className="text-gray-500 font-medium">
            Audit-ready financial logs • <span className="text-indigo-400">{pagination.totalCount}</span> entries
          </p>
        </motion.div>
        
        {isAdmin && (
          <motion.button 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { resetForm(); setShowModal(true); }}
            className="premium-btn flex items-center gap-3 px-8 shadow-indigo-500/20"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="font-bold uppercase tracking-widest text-sm">Create Entry</span>
          </motion.button>
        )}
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search transactions, categories, or descriptions..." 
            className="premium-input pl-12 h-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["", "INCOME", "EXPENSE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                filterType === type
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {type || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card p-0 overflow-hidden border-white/5 shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Financial Narrative</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Class</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Magnitude</th>
                {isAdmin && <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ops</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accessing Vault Records...</p>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <AlertCircle className="w-12 h-12 text-gray-600" />
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No Data Points Detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <motion.tr 
                    key={record.id} 
                    variants={itemVariants}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="text-white font-bold tabular-nums">
                          {new Date(record.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tabular-nums">Logged: {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <p className="font-bold text-gray-200 truncate max-w-xs">{record.description || '—'}</p>
                    </td>
                    <td className="py-6 px-8">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                        <Tag size={10} className="text-indigo-400" />
                        {record.category}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                        record.type === "INCOME" ? "text-emerald-400 bg-emerald-400/5" : "text-rose-400 bg-rose-400/5"
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className={`py-6 px-8 text-right tabular-nums ${
                      record.type === "INCOME" ? "text-emerald-400" : "text-white"
                    }`}>
                      <span className="text-xs font-bold opacity-50 mr-1">{record.type === "INCOME" ? "+" : "-"}</span>
                      <span className="text-lg font-black">${Math.abs(record.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    {isAdmin && (
                      <td className="py-6 px-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEdit(record)}
                            className="p-2.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl border border-transparent hover:border-indigo-500/20 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-2.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 border-t border-white/5 bg-white/[0.02]">
            <span className="text-xs text-gray-500 font-bold">
              Page {pagination.page} of {pagination.totalPages} • {pagination.totalCount} total records
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchRecords(pagination.page - 1)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchRecords(pagination.page + 1)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" 
              onClick={() => { setShowModal(false); resetForm(); }}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-2xl relative z-10 p-0 border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {editingRecord ? 'Update Ledger Entry' : 'Financial Ledger Entry'}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Transaction Documentation System</p>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                      <FileText size={12} /> Narrative Description
                    </label>
                    <input 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      type="text" 
                      className="premium-input" 
                      placeholder="e.g. Infrastructure Scalability Operations" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                      <DollarSign size={12} /> Flow Magnitude ($)
                    </label>
                    <input 
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      type="number" 
                      step="0.01" 
                      className="premium-input tabular-nums" 
                      placeholder="0.00" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                      <Calendar size={12} /> Fiscal Date
                    </label>
                    <input 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      type="date" 
                      className="premium-input tabular-nums" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                      <Tag size={12} /> Taxonomy / Category
                    </label>
                    <input 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      type="text" 
                      className="premium-input" 
                      placeholder="e.g. Strategic Growth" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                      <Activity size={12} /> Transaction Class
                    </label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="premium-input appearance-none"
                    >
                      <option value="EXPENSE">Expense Outflow</option>
                      <option value="INCOME">Income Inflow</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-8 py-4 rounded-2xl bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="premium-btn flex-1"
                  >
                    {editingRecord ? 'Update Entry' : 'Commit Entry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;
