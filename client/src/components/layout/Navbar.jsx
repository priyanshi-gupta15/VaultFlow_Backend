import React from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Search, 
  Command,
  LayoutGrid,
  Settings
} from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-40 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5">
      <div className="flex items-center gap-10">
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl group cursor-pointer hover:border-indigo-500/30 transition-all">
          <Search size={16} className="text-gray-500 group-hover:text-indigo-400" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">Global Command Hub</span>
          <div className="flex items-center gap-1 ml-4 px-1.5 py-0.5 bg-white/10 rounded-md">
            <Command size={10} className="text-gray-400" />
            <span className="text-[9px] font-black text-gray-400 uppercase">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          </button>
          <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <LayoutGrid size={20} />
          </button>
          <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 pl-8 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-white tracking-widest uppercase">{user?.name}</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{user?.role}</p>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-full h-full bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <User size={24} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
