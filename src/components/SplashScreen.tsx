import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Flame, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setScreen, user } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setScreen('home');
      } else {
        setScreen('login');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [setScreen, user]);

  return (
    <div id="splash-screen" className="relative flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white p-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />

      {/* Top Decorator */}
      <div className="w-full flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Lightning Fast Delivery</span>
        </motion.div>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center text-center max-w-sm z-10">
        <motion.div
          initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
          animate={{ scale: [0.3, 1.15, 1], rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-24 h-24 bg-white text-purple-700 rounded-3xl flex items-center justify-center shadow-2xl mb-6 border border-white/20"
        >
          <ShoppingBag className="w-12 h-12 stroke-[2.2]" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-amber-950 p-1.5 rounded-full shadow-lg"
          >
            <Flame className="w-4 h-4 fill-amber-950" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-sm font-sans"
        >
          QuickBite
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-purple-100 font-light text-base tracking-wide"
        >
          Fresh Food & Essential Groceries Delivered in Minutes
        </motion.p>
      </div>

      {/* Loading & Action Footer */}
      <div className="w-full flex flex-col items-center gap-6 z-10 max-w-sm">
        {/* Progress Bar Animation */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-yellow-300 via-white to-yellow-300 rounded-full"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (user) {
              setScreen('home');
            } else {
              setScreen('login');
            }
          }}
          className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold py-3.5 px-6 rounded-2xl shadow-xl transition-all duration-200 text-center tracking-wide active:shadow-md cursor-pointer flex justify-center items-center gap-2"
        >
          <span>Get Started</span>
        </motion.button>

        <div className="text-[10px] text-purple-200/70 text-center font-mono select-none">
          v1.4.0 • Secured Express Delivery Network
        </div>
      </div>
    </div>
  );
};
