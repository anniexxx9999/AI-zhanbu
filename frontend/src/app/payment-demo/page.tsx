'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import PaymentCTA from '@/components/payment/PaymentCTA';
import Card from '@/components/ui/Card';
import { FiStar, FiZap, FiAward, FiHeart, FiTrendingUp, FiShield } from 'react-icons/fi';

export default function PaymentDemoPage() {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'premium' | 'urgent'>('default');
  const [showCTA, setShowCTA] = useState(true);

  const variants = [
    {
      id: 'default',
      name: '标准版',
      description: '经典的紫色主题，适合一般场景',
      icon: FiStar,
      color: 'purple'
    },
    {
      id: 'premium',
      name: '高级版',
      description: '金色主题，突出高级感',
      icon: FiAward,
      color: 'gold'
    },
    {
      id: 'urgent',
      name: '紧急版',
      description: '红色主题，营造紧迫感',
      icon: FiZap,
      color: 'red'
    }
  ];

  const features = [
    "完整的12宫位深度解读",
    "个性化占星学报告",
    "专业占星师指导",
    "无限次查看和下载",
    "专属客服支持",
    "定期更新内容"
  ];

  const handleUpgrade = () => {
    alert(`升级到${variants.find(v => v.id === selectedVariant)?.name}！`);
  };

  const handleClose = () => {
    setShowCTA(false);
    setTimeout(() => setShowCTA(true), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-display gradient-text mb-4">
              💳 支付引导优化展示
            </h1>
            <p className="text-xl text-purple-300 mb-6">
              提升转化率的支付引导设计
            </p>
          </motion.div>

          {/* Variant Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-display gradient-text mb-6 text-center">
              选择展示变体
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {variants.map((variant) => {
                const IconComponent = variant.icon;
                return (
                  <motion.button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedVariant === variant.id
                        ? 'border-purple-400 bg-purple-900/30'
                        : 'border-gray-600 bg-gray-900/30 hover:border-purple-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
                        variant.id === 'premium' ? 'text-yellow-400' :
                        variant.id === 'urgent' ? 'text-red-400' : 'text-purple-400'
                      }`} />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {variant.name}
                      </h3>
                      <p className="text-sm text-purple-300">
                        {variant.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Payment CTA Display */}
          <motion.div
            key={selectedVariant}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto mb-16"
          >
            {showCTA && (
              <PaymentCTA
                title="如需完整的12宫位深度解读，请升级至专业版报告"
                description="解锁全部占星学洞察，获得个性化的深度分析"
                features={features}
                price="$29.99"
                originalPrice="$49.99"
                discount="限时优惠"
                onUpgrade={handleUpgrade}
                onClose={handleClose}
                variant={selectedVariant}
                guardianSign="Taurus"
                guardianSymbol="♉"
                houseLord="Mars"
              />
            )}
          </motion.div>

          {/* Design Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              ✨ 设计优化亮点
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card glow="purple">
                <div className="text-center p-6">
                  <FiHeart className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">情感连接</h3>
                  <p className="text-purple-300 text-sm">
                    通过占星学符号和个性化信息建立情感连接，提升用户信任感
                  </p>
                </div>
              </Card>
              
              <Card glow="purple">
                <div className="text-center p-6">
                  <FiTrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">紧迫感营造</h3>
                  <p className="text-purple-300 text-sm">
                    限时优惠和倒计时功能创造购买紧迫感，提高转化率
                  </p>
                </div>
              </Card>
              
              <Card glow="gold">
                <div className="text-center p-6">
                  <FiShield className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">信任建立</h3>
                  <p className="text-purple-300 text-sm">
                    安全支付标识和退款保证增强用户信心，降低购买阻力
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Conversion Optimization Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <Card glow="purple" className="p-8">
              <h2 className="text-2xl font-display gradient-text mb-6 text-center">
                🎯 转化率优化策略
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">视觉优化</h3>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>渐变背景增强视觉吸引力</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>动画效果提升交互体验</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>颜色心理学应用（红色=紧迫）</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">文案优化</h3>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>明确的价值主张描述</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>具体功能列表展示</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>社会证明和信任标识</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* A/B Testing Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-display gradient-text mb-6 text-center">
              🧪 A/B测试建议
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card glow="purple">
                <h3 className="text-lg font-semibold text-white mb-4">测试变量</h3>
                <ul className="space-y-2 text-purple-300 text-sm">
                  <li>• 不同颜色主题的转化率</li>
                  <li>• 价格展示方式（原价对比）</li>
                  <li>• 按钮文案（立即升级 vs 立即购买）</li>
                  <li>• 功能列表数量</li>
                  <li>• 倒计时时长</li>
                </ul>
              </Card>
              
              <Card glow="purple">
                <h3 className="text-lg font-semibold text-white mb-4">优化指标</h3>
                <ul className="space-y-2 text-purple-300 text-sm">
                  <li>• 点击率 (CTR)</li>
                  <li>• 转化率 (CVR)</li>
                  <li>• 平均订单价值 (AOV)</li>
                  <li>• 用户停留时间</li>
                  <li>• 滚动深度</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
