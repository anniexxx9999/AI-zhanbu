'use client';

import { motion } from 'framer-motion';

export default function FloatingElements() {
  const elements = [
    { emoji: '✨', x: '10%', delay: 0 },
    { emoji: '🌸', x: '20%', delay: 0.5 },
    { emoji: '💫', x: '30%', delay: 1 },
    { emoji: '🦋', x: '70%', delay: 0.3 },
    { emoji: '🌙', x: '80%', delay: 0.8 },
    { emoji: '⭐', x: '90%', delay: 0.2 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          style={{
            left: element.x,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: element.delay,
            ease: 'linear',
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
}





