'use client';

import { motion } from 'framer-motion';
import { useState, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className={`
            block mb-2 font-medium transition-all duration-300
            ${isFocused ? 'text-rose-gold text-sm' : 'text-text-secondary text-base'}
          `}
          animate={{
            y: isFocused ? -4 : 0,
            scale: isFocused ? 0.95 : 1,
          }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-xl">
            {icon}
          </div>
        )}
        
        <motion.input
          {...(props as any)}
          className={`
            input-field
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-coral-pink' : ''}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          whileFocus={{ scale: 1.02 }}
        />
        
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gradient"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      {error && (
        <motion.p
          className="mt-2 text-sm text-coral-pink"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}



