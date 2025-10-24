'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiZap, FiLock, FiTrendingUp, FiHeart, FiAward, FiArrowRight, FiCheck } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PaymentCTAProps {
  title?: string;
  description?: string;
  features?: string[];
  price?: string;
  originalPrice?: string;
  discount?: string;
  onUpgrade?: () => void;
  onClose?: () => void;
  variant?: 'default' | 'premium' | 'urgent';
  showFeatures?: boolean;
  showPricing?: boolean;
  guardianSign?: string;
  guardianSymbol?: string;
  houseLord?: string;
}

export default function PaymentCTA({
  title = "如需完整的12宫位深度解读，请升级至专业版报告",
  description = "解锁全部占星学洞察，获得个性化的深度分析",
  features = [
    "完整的12宫位深度解读",
    "个性化占星学报告",
    "专业占星师指导",
    "无限次查看和下载"
  ],
  price = "$29.99",
  originalPrice = "$49.99",
  discount = "限时优惠",
  onUpgrade,
  onClose,
  variant = 'default',
  showFeatures = true,
  showPricing = true,
  guardianSign = "Taurus",
  guardianSymbol = "♉",
  houseLord = "Mars"
}: PaymentCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  // Countdown timer
  useEffect(() => {
    if (variant === 'urgent') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            setShowPulse(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [variant]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          gradient: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-400/50',
          button: 'from-yellow-500 to-orange-500',
          icon: FiAward,
          iconColor: 'text-yellow-400'
        };
      case 'urgent':
        return {
          gradient: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-400/50',
          button: 'from-red-500 to-pink-500',
          icon: FiZap,
          iconColor: 'text-red-400'
        };
      default:
        return {
          gradient: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-400/50',
          button: 'from-purple-500 to-pink-500',
          icon: FiStar,
          iconColor: 'text-purple-400'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      <Card 
        glow={variant === 'urgent' ? 'red' : variant === 'premium' ? 'gold' : 'purple'}
        className={`relative overflow-hidden ${styles.gradient} border ${styles.border}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-xl" />
        </div>

        {/* Close Button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        )}

        {/* Guardian Info */}
        <div className="relative z-10 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-purple-300 text-sm">守护星座:</span>
              <span className="text-white font-semibold">{guardianSign}</span>
              <span className="text-2xl">{guardianSymbol}</span>
            </div>
            <div className="text-purple-300 text-sm">
              宫主星: <span className="text-white font-semibold">{houseLord}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-2 leading-relaxed">
              {title}
            </h3>
            {description && (
              <p className="text-purple-300 text-sm">
                {description}
              </p>
            )}
          </motion.div>

          {/* Features */}
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <FiCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-purple-200 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pricing */}
          {showPricing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                {originalPrice && (
                  <span className="text-gray-400 text-sm line-through">
                    {originalPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-white">
                  {price}
                </span>
                {discount && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {discount}
                  </span>
                )}
              </div>
              {variant === 'urgent' && timeLeft > 0 && (
                <div className="text-red-400 text-sm font-semibold">
                  限时优惠还剩: {formatTime(timeLeft)}
                </div>
              )}
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              onClick={onUpgrade}
              className={`w-full bg-gradient-to-r ${styles.button} hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setShowPulse(true)}
              onHoverEnd={() => setShowPulse(false)}
            >
              {/* Button Background Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{ x: showPulse ? '100%' : '-100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              
              <IconComponent className="w-5 h-5" />
              <span>立即升级</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.span>
              <FiArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-purple-300">
              <FiLock className="w-3 h-3" />
              <span>安全支付 • 7天无理由退款</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute bottom-4 right-4 w-1 h-1 bg-pink-400 rounded-full"
              />
            </>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
