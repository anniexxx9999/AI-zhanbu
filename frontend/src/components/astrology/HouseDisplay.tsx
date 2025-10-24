'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiTrendingUp, FiInfo, FiZap } from 'react-icons/fi';
import Card from '@/components/ui/Card';

interface HouseDisplayProps {
  title: string;
  subtitle: string;
  category: string;
  guardianSign: string;
  guardianSymbol: string;
  houseLord: string;
  potential: number;
  maxPotential?: number;
  onClose?: () => void;
  onUpgrade?: () => void;
  description?: string;
  isUpgradeable?: boolean;
}

export default function HouseDisplay({
  title,
  subtitle,
  category,
  guardianSign,
  guardianSymbol,
  houseLord,
  potential,
  maxPotential = 5,
  onClose,
  onUpgrade,
  description,
  isUpgradeable = true
}: HouseDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxPotential; i++) {
      stars.push(
        <motion.span
          key={i}
          className={`text-lg ${
            i <= potential ? 'text-yellow-400' : 'text-gray-600'
          }`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          ★
        </motion.span>
      );
    }
    return stars;
  };

  const getPotentialColor = () => {
    const percentage = (potential / maxPotential) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPotentialText = () => {
    const percentage = (potential / maxPotential) * 100;
    if (percentage >= 80) return '卓越';
    if (percentage >= 60) return '良好';
    if (percentage >= 40) return '一般';
    return '待提升';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
    >
      <Card 
        glow="purple" 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20" />
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-lg" />
        </div>

        {/* Close Button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-4 h-4" />
          </motion.button>
        )}

        {/* Header Section */}
        <div className="relative z-10 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              💬
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {title}
              </h2>
              <p className="text-purple-300 text-sm">
                {subtitle} • {category}
              </p>
            </div>
          </div>

          {/* Potential Rating */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-purple-300">宫位潜力:</span>
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>
            <motion.span
              className={`text-sm font-semibold ${getPotentialColor()}`}
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              {getPotentialText()}
            </motion.span>
          </div>
        </div>

        {/* Core Information */}
        <div className="relative z-10 mb-6">
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-500/30">
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
        </div>

        {/* Description */}
        {description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="relative z-10 mb-6"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
                <FiInfo className="w-4 h-4" />
                <span className="text-sm">查看详细解读</span>
                <motion.span
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </div>
            </button>
            
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 bg-black/20 rounded-lg border border-purple-500/20"
                >
                  <p className="text-purple-200 text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Upgrade CTA */}
        {isUpgradeable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
              <p className="text-purple-200 text-sm mb-4 text-center">
                如需完整的12宫位深度解读，请升级至专业版报告
              </p>
              <motion.button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiZap className="w-4 h-4" />
                立即升级
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Hover Effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
