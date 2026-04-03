import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Loader2,
  RefreshCcw,
  Mail,
  Calendar,
  Lock,
  ChevronRight,
  Fingerprint,
  Trash2
} from "lucide-react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, status) => {
    try {
      await api.patch(`/users/${userId}/status`, { status });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/users/${userId}/status`, { role });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Stats
  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Lock size={16} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Administrative Control Center</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Identity & Access</h2>
          <p className="text-gray-500 font-medium">Provision user roles and manage ecosystem security</p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="glass-card py-2 px-4 flex items-center gap-2 border-indigo-500/10"
          >
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Nodes:</span>
            <span className="text-sm font-black text-white">{users.length}</span>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="glass-card py-2 px-4 flex items-center gap-2 border-emerald-500/10"
          >
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active:</span>
            <span className="text-sm font-black text-emerald-400">{activeCount}</span>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchUsers}
            className="glass-card p-4 hover:border-indigo-500/20 text-gray-400 hover:text-white transition-all shadow-xl"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin text-indigo-400" : ""} />
          </motion.button>
        </div>
      </header>

      <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-6 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Principal Identity</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Privilege Level</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operational Status</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Deployment Date</th>
                <th className="py-6 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                      <p className="text-gray-500 font-extrabold uppercase tracking-widest text-[10px]">Retrieving User Matrix...</p>
                    </div>
                  </td>
                </tr>
              ) : users.map((user) => (
                <motion.tr 
                  key={user.id} 
                  variants={itemVariants}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
                          {(user.name || 'U').charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white tracking-tight">{user.name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} className="text-indigo-400" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="relative inline-block w-full max-w-[140px]">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2.5 outline-none text-gray-300 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="ANALYST">Analyst</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-600 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2 ${
                      user.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      <Fingerprint size={12} />
                      {user.status}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tabular-nums">
                      <Calendar size={14} className="text-indigo-400" />
                      {new Date(user.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      {user.status === 'ACTIVE' ? (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                          className="p-3 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl border border-transparent hover:border-rose-500/30 transition-all shadow-xl"
                          title="Restrict Access"
                        >
                          <UserX size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          className="p-3 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all shadow-xl"
                          title="Authorize Access"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-3 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl border border-transparent hover:border-rose-500/30 transition-all shadow-xl"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
