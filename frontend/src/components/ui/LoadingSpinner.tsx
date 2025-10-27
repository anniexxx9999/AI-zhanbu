'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  text?: string;
  type?: 'flower' | 'stars' | 'moon';
}

export default function LoadingSpinner({ 
  text = '正在为你解读...', 
  type = 'flower' 
}: LoadingSpinnerProps) {
  if (type === 'flower') {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-8 bg-gradient-to-t from-rose-gold to-coral-pink rounded-full"
              style={{
                transformOrigin: 'center center',
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gold rounded-full" />
        </motion.div>
        
        <motion.p
          className="text-text-secondary font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>
    );
  }

  if (type === 'stars') {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-lavender-light rounded-full"
              initial={{
                x: -4,
                y: -4,
              }}
              animate={{
                x: Math.cos((i * 72 * Math.PI) / 180) * 30,
                y: Math.sin((i * 72 * Math.PI) / 180) * 30,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-text-secondary font-medium">{text}</p>
      </div>
    );
  }

  return null;
}





