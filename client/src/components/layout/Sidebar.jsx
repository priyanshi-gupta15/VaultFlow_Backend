import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  History, 
  Users, 
  LogOut,
  ShieldCheck,
  TrendingUp,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "ANALYST", "VIEWER"] },
    { name: "Records", path: "/records", icon: <History size={20} />, roles: ["ADMIN", "ANALYST", "VIEWER"] },
    { name: "Admin Panel", path: "/admin", icon: <Users size={20} />, roles: ["ADMIN"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-72 min-h-screen fixed left-0 top-0 glass-card rounded-none border-y-0 border-l-0 z-50 flex flex-col shadow-2xl"
    >
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 180 }}
          className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 glow-indigo cursor-pointer"
        >
          <TrendingUp className="text-white" size={28} />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-none">
            VaultFlow
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Premium Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-3">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={item.path} variants={itemVariants}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-indigo-600/10 text-white" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                  />
                )}
                <span className={`${isActive ? "text-indigo-400 scale-110" : "text-gray-500 group-hover:text-indigo-400"} transition-all duration-300 z-10`}>
                  {item.icon}
                </span>
                <span className="font-semibold tracking-wide z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto z-10"
                  >
                    <ChevronRight size={16} className="text-indigo-400" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Status Card */}
      <div className="p-6 mt-auto border-t border-white/5 bg-gray-900/40 backdrop-blur-md">
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-lg"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl border border-white/20 shadow-inner">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-950 glow-emerald" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-indigo-400" />
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{user?.role}</p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Sign Out Securely</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
