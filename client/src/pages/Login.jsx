import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, TrendingUp, AlertCircle, Loader2, ShieldCheck, Globe } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("admin@vaultflow.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      // Explicitly navigating to dashboard after successful login
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid institutional credentials. Please verify and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 mesh-gradient overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[140px] animate-pulse" />

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass-card p-12 lg:p-16 shadow-[0_0_80px_rgba(0,0,0,0.5)] border-white/10 backdrop-blur-3xl relative overflow-hidden">
          {/* Subtle light sweep animation */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
          />

          <div className="flex flex-col items-center mb-12 relative text-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] mb-8 cursor-pointer relative"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-indigo-400 blur-xl opacity-20" />
              <TrendingUp className="text-white relative z-10" size={40} />
            </motion.div>
            
            <h1 className="text-5xl font-black text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              VaultFlow Portal
            </h1>
            <p className="text-indigo-200/60 text-lg font-medium max-w-sm">
              Secure institutional access for digital asset intelligence and real-time ledger auditing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-300 p-5 rounded-2xl flex items-center gap-4"
                >
                  <AlertCircle size={24} className="shrink-0" />
                  <p className="text-sm font-bold tracking-wide leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-indigo-300/50 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-all duration-300" size={24} />
                  <input
                    type="email"
                    placeholder="name@institution.com"
                    className="premium-input pl-14 py-5 text-lg bg-white/[0.03] border-white/10 group-hover:border-white/20 focus:bg-white/[0.07] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-indigo-300/50 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-all duration-300" size={24} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="premium-input pl-14 py-5 text-lg bg-white/[0.03] border-white/10 group-hover:border-white/20 focus:bg-white/[0.07] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Remember terminal</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors tracking-wide">
                Recovery Access
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group premium-btn py-6 flex items-center justify-center gap-4 text-xl font-bold bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  <span>Secure Syncing...</span>
                </>
              ) : (
                <>
                  <LogIn size={28} />
                  <span>Initialize Portal Access</span>
                </>
              )}
            </button>
          </form>

          {/* Trust badges/Trust footer */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-500 font-medium">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-500/60" />
              <span className="text-xs uppercase tracking-tighter">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-indigo-500/60" />
              <span className="text-xs uppercase tracking-tighter">Global Audit Node 07</span>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-tighter">System Nominal</span>
            </div>
          </div>
        </div>
        
        {/* Extra aesthetics outside card */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.02] rounded-full" />
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/[0.01] rounded-full" />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-12 space-y-2"
        >
          <p className="text-gray-500/40 text-xs uppercase tracking-[0.4em] font-black italic">
            VaultFlow Strategic Intelligence
          </p>
          <p className="text-gray-600/30 text-[10px] font-mono">
            BUILD_VER: 2.4.9-MARK_ELITE // AUTH_PROTO: Institutional_G3
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
