'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  glow?: 'pink' | 'purple' | 'gold' | 'none';
  className?: string;
  delay?: number;
}

export default function Card({
  children,
  hover = false,
  glow = 'none',
  className = '',
  delay = 0,
}: CardProps) {
  const glowStyles = {
    pink: 'hover:shadow-glow-pink',
    purple: 'hover:shadow-glow-purple',
    gold: 'hover:shadow-glow-gold',
    none: '',
  };

  return (
    <motion.div
      className={`
        glass-card p-6 soft-shadow
        ${hover ? 'hover:scale-105 cursor-pointer' : ''}
        ${glowStyles[glow]}
        transition-all duration-300
        ${className}
      `}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -5 } : {}}
    >
      {children}
    </motion.div>
  );
}




