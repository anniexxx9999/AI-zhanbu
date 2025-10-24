'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  FiCheck, FiStar, FiAward, FiZap, FiLock, FiGift, 
  FiTrendingUp, FiHeart, FiBookOpen, FiShield, FiUsers
} from 'react-icons/fi';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    {
      id: 'free',
      name: '基础版',
      nameEn: 'Basic',
      price: '免费',
      period: '',
      description: '体验占星魅力',
      icon: FiStar,
      color: 'from-blue-500 to-purple-600',
      features: [
        '基础出生信息分析',
        '太阳星座解读',
        '3个宫位基础分析',
        '简单性格报告',
        '基础图表显示'
      ],
      limitations: [
        '仅显示部分宫位',
        '无详细解读',
        '无个性化建议'
      ],
      cta: '当前版本',
      ctaColor: 'bg-gray-500',
      popular: false
    },
    {
      id: 'professional',
      name: '专业版',
      nameEn: 'Professional',
      price: '¥99',
      period: '/月',
      description: '深度占星分析',
      icon: FiAward,
      color: 'from-purple-500 to-pink-600',
      features: [
        '完整12宫位分析',
        '详细行星解读',
        '个性化建议',
        '专业占星图表',
        '婚姻匹配分析',
        '事业指导报告',
        '健康运势提醒',
        'PDF报告下载'
      ],
      limitations: [],
      cta: '立即升级',
      ctaColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'premium',
      name: '至尊版',
      nameEn: 'Premium',
      price: '¥299',
      period: '/月',
      description: '专家级占星服务',
      icon: FiZap,
      color: 'from-yellow-500 to-orange-600',
      features: [
        '专业版所有功能',
        '专家一对一解读',
        '年度运势预测',
        '个性化开运建议',
        '专属客服支持',
        '高级图表分析',
        '灵魂伴侣深度匹配',
        '无限报告生成'
      ],
      limitations: [],
      cta: '选择至尊版',
      ctaColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      popular: false
    }
  ];

  const handlePayment = (planId: string) => {
    // 这里会跳转到支付页面
    router.push(`/payment?plan=${planId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display gradient-text mb-6">
              选择你的占星之旅 ✨
            </h1>
            <p className="text-xl text-purple-300 mb-8 max-w-3xl mx-auto">
              解锁宇宙的奥秘，发现你内在的无限潜能。每个版本都经过精心设计，为你提供最适合的占星体验。
            </p>
            
            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-purple-300">
                <FiShield className="text-green-400" />
                <span>安全支付</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <FiGift className="text-pink-400" />
                <span>7天免费试用</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <FiUsers className="text-blue-400" />
                <span>专业占星师支持</span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      最受欢迎
                    </div>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'ring-2 ring-purple-400' : ''}`}>
                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <plan.icon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-purple-300 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-purple-300 ml-1">{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <FiCheck className="text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-200 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 mb-8">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <div key={limitationIndex} className="flex items-start gap-3">
                            <FiLock className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-400 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePayment(plan.id)}
                      className={`w-full ${plan.ctaColor} hover:opacity-90 transition-all`}
                      disabled={plan.id === 'free'}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              常见问题
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    如何取消订阅？
                  </h3>
                  <p className="text-purple-300">
                    你可以随时在账户设置中取消订阅，取消后仍可使用到当前计费周期结束。
                  </p>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    支持哪些支付方式？
                  </h3>
                  <p className="text-purple-300">
                    我们支持微信支付、支付宝、银联卡等多种支付方式，确保安全便捷。
                  </p>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    数据安全如何保障？
                  </h3>
                  <p className="text-purple-300">
                    我们采用银行级加密技术保护你的个人信息，绝不与第三方分享。
                  </p>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    可以退款吗？
                  </h3>
                  <p className="text-purple-300">
                    7天内如不满意，我们提供无条件退款保证。
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
