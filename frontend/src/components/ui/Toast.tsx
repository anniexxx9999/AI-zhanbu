'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✨',
    error: '🙈',
    info: '💡',
  };

  const colors = {
    success: 'from-rose-gold to-gold',
    error: 'from-coral-pink to-rose-pink',
    info: 'from-lavender-light to-magic',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-6 right-6 z-50"
      >
        <div className={`glass-card backdrop-blur-xl px-6 py-4 shadow-glow-purple`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icons[type]}</span>
            <p className="text-text-primary font-medium">{message}</p>
          </div>
          <motion.div
            className={`h-1 bg-gradient-to-r ${colors[type]} rounded-full mt-3`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}



