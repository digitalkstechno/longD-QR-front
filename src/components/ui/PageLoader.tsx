import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg-dark">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-white shadow-[0_0_30px_rgba(200,164,93,0.15)] flex items-center justify-center p-2 mb-6"
      >
        <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
      </motion.div>
      {/* CSS animation — immune to React re-renders */}
      <div className="w-40 h-1 bg-brand-primary/15 rounded-full overflow-hidden relative">
        <div className="loader-bar absolute inset-y-0 left-0 w-1/3 bg-brand-primary rounded-full" />
      </div>
    </div>
  );
};

