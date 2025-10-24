'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { FiLock, FiStar, FiAward, FiZap } from 'react-icons/fi';

interface PaywallProps {
  feature: string;
  message?: string;
  className?: string;
  showUpgradeButton?: boolean;
}

export default function Paywall({ 
  feature, 
  message, 
  className = '',
  showUpgradeButton = true 
}: PaywallProps) {
  const router = useRouter();

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('premium') || feature.includes('expert')) {
      return FiZap;
    }
    if (feature.includes('professional') || feature.includes('detailed')) {
      return FiAward;
    }
    return FiStar;
  };

  const getFeatureColor = (feature: string) => {
    if (feature.includes('premium') || feature.includes('expert')) {
      return 'from-yellow-500 to-orange-600';
    }
    if (feature.includes('professional') || feature.includes('detailed')) {
      return 'from-purple-500 to-pink-600';
    }
    return 'from-blue-500 to-purple-600';
  };

  const getUpgradePlan = (feature: string) => {
    if (feature.includes('premium') || feature.includes('expert')) {
      return 'premium';
    }
    if (feature.includes('professional') || feature.includes('detailed')) {
      return 'professional';
    }
    return 'professional';
  };

  const FeatureIcon = getFeatureIcon(feature);
  const colorClass = getFeatureColor(feature);
  const upgradePlan = getUpgradePlan(feature);

  const handleUpgrade = () => {
    router.push(`/pricing?plan=${upgradePlan}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-400/30 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
          <FeatureIcon className="text-xl text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {message || '解锁更多功能'}
          </h3>
          <p className="text-purple-300 text-sm">
            升级到{upgradePlan === 'premium' ? '至尊版' : '专业版'}获得完整体验
          </p>
        </div>
        <div className="ml-auto">
          <FiLock className="text-2xl text-purple-400" />
        </div>
      </div>
      
      {showUpgradeButton && (
        <Button
          onClick={handleUpgrade}
          className={`w-full bg-gradient-to-r ${colorClass} hover:opacity-90 transition-all`}
        >
          <FeatureIcon className="mr-2" />
          立即升级
        </Button>
      )}
    </motion.div>
  );
}
