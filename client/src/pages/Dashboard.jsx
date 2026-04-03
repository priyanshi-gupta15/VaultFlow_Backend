import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  ChevronRight,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];

const Dashboard = () => {
  const { user, isAnalyst } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/finance/summary");
        setSummary(data.data.summary);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAnalyst) {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [isAnalyst]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Data...</p>
      </div>
    );
  }

  if (!isAnalyst) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card flex flex-col items-center justify-center p-16 text-center max-w-2xl border-white/5"
        >
          <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl">
            <PieChartIcon className="w-12 h-12 text-indigo-400" />
          </div>
          <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Institutional Access Only</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Real-time analytics and financial summaries are reserved for Analysts and Administrators. 
            Access your transaction history directly via the Records module.
          </p>
          <button className="premium-btn px-8 flex items-center gap-2">
            <span>Request Access</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // Build chart data from categorySummary array
  const categoryData = (summary?.categorySummary || []).map(item => ({
    name: item.category,
    value: Math.abs(item._sum?.amount || item.expense + item.income)
  }));

  const totalCategoryValue = categoryData.reduce((sum, item) => sum + item.value, 0);

  // Monthly trends data
  const monthlyData = summary?.monthlyTrends || [];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <Calendar size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Global Overview • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Strategic Dashboard</h2>
          <p className="text-gray-400 mt-2 font-medium">Monitoring capital flows for <span className="text-white">{user?.name}</span></p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
          <div className="glass-card py-3 px-6 flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shadow-[0_0_10px_#10b981]" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">Node Operational</span>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Total Inflow" 
          amount={summary?.totalIncome || 0} 
          icon={TrendingUp} 
          trend="+12.4%" 
          color="text-emerald-400"
          accent="bg-emerald-400"
        />
        <StatCard 
          title="Total Outflow" 
          amount={summary?.totalExpenses || 0} 
          icon={TrendingDown} 
          trend="-3.2%" 
          color="text-rose-400"
          accent="bg-rose-400"
        />
        <StatCard 
          title="Net Position" 
          amount={summary?.netBalance || 0} 
          icon={Wallet} 
          trend="+8.1%" 
          color="text-indigo-400"
          accent="bg-indigo-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Category Pie Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Allocation Metrics</h3>
              <Activity className="text-gray-500" size={18} />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Asset Category Distribution</p>
          </div>
          
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    stroke="none"
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px" }}
                    itemStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-white">${totalCategoryValue > 1000 ? `${(totalCategoryValue / 1000).toFixed(1)}k` : totalCategoryValue.toFixed(0)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-8 w-full">
              {categoryData.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: COLORS[index % COLORS.length], backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs text-gray-400 font-bold truncate max-w-[80px] uppercase">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">${item.value > 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Trends Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3 glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Performance Analytics</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Monthly Income vs Expense</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-emerald-400 uppercase">Income</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black text-rose-400 uppercase">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="h-full min-h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontWeight: 800, fill: '#64748b' }}
                    dy={15}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontWeight: 800, fill: '#64748b' }}
                    tickFormatter={(v) => `$${v > 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} name="Income" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} maxBarSize={40} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      {summary?.recentActivity?.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Latest transactions across all accounts</p>
            </div>
            <BarChart3 className="text-gray-500" size={18} />
          </div>
          <div className="divide-y divide-white/5">
            {summary.recentActivity.map((record, i) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between px-8 py-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    record.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {record.type === 'INCOME' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{record.description || record.category}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {record.category} • {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-black tabular-nums ${
                  record.type === 'INCOME' ? 'text-emerald-400' : 'text-white'
                }`}>
                  {record.type === 'INCOME' ? '+' : '-'}${Math.abs(record.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const StatCard = ({ title, amount, icon: Icon, trend, color, accent }) => (
  <motion.div 
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="glass-card p-1 relative overflow-hidden group cursor-pointer"
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${accent} opacity-40 group-hover:opacity-100 transition-opacity`} />
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${color} shadow-xl`}>
          <Icon size={28} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
          {trend.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
          ${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <span className="text-gray-600 text-sm font-bold">.{(Math.abs(amount) % 1).toFixed(2).split('.')[1]}</span>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Growth Analytics</span>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
