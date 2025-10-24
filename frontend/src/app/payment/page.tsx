'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  FiCheck, FiCreditCard, FiShield, FiLock, FiArrowLeft,
  FiStar, FiAward, FiZap, FiGift, FiClock
} from 'react-icons/fi';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'professional');
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: 选择计划, 2: 支付方式, 3: 确认支付

  const plans = {
    free: {
      name: '基础版',
      price: 0,
      period: '免费',
      icon: FiStar,
      color: 'from-blue-500 to-purple-600'
    },
    professional: {
      name: '专业版',
      price: 99,
      period: '月',
      icon: FiAward,
      color: 'from-purple-500 to-pink-600'
    },
    premium: {
      name: '至尊版',
      price: 299,
      period: '月',
      icon: FiZap,
      color: 'from-yellow-500 to-orange-600'
    }
  };

  const paymentMethods = [
    {
      id: 'wechat',
      name: '微信支付',
      icon: '💚',
      description: '安全便捷，支持零钱和银行卡'
    },
    {
      id: 'alipay',
      name: '支付宝',
      icon: '💙',
      description: '快速支付，支持花呗分期'
    },
    {
      id: 'unionpay',
      name: '银联卡',
      icon: '💳',
      description: '支持各大银行信用卡和储蓄卡'
    }
  ];

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // 模拟支付处理
    setTimeout(() => {
      setIsProcessing(false);
      // 跳转到成功页面
      router.push('/payment/success');
    }, 3000);
  };

  const getPlanFeatures = (planId: string) => {
    const features = {
      professional: [
        '完整12宫位分析',
        '详细行星解读',
        '个性化建议',
        '专业占星图表',
        '婚姻匹配分析',
        '事业指导报告',
        '健康运势提醒',
        'PDF报告下载'
      ],
      premium: [
        '专业版所有功能',
        '专家一对一解读',
        '年度运势预测',
        '个性化开运建议',
        '专属客服支持',
        '高级图表分析',
        '灵魂伴侣深度匹配',
        '无限报告生成'
      ]
    };
    return features[planId as keyof typeof features] || [];
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step > stepNumber ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-16 mt-4">
              <span className="text-sm text-purple-300">选择计划</span>
              <span className="text-sm text-purple-300">支付方式</span>
              <span className="text-sm text-purple-300">确认支付</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Plan Selection & Payment */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Plan Summary */}
              <Card className="mb-8">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentPlan.color} flex items-center justify-center`}>
                      <currentPlan.icon className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentPlan.name}</h3>
                      <p className="text-purple-300">
                        {currentPlan.price === 0 ? '免费使用' : `¥${currentPlan.price}/${currentPlan.period}`}
                      </p>
                    </div>
                  </div>
                  
                  {currentPlan.price > 0 && (
                    <div className="space-y-2">
                      {getPlanFeatures(selectedPlan).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FiCheck className="text-green-400 text-sm" />
                          <span className="text-purple-200 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Payment Methods */}
              {currentPlan.price > 0 && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">选择支付方式</h3>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-purple-400 bg-purple-500/10'
                              : 'border-gray-600 hover:border-purple-300'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <h4 className="text-white font-semibold">{method.name}</h4>
                              <p className="text-purple-300 text-sm">{method.description}</p>
                            </div>
                            <div className="ml-auto">
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                paymentMethod === method.id
                                  ? 'border-purple-400 bg-purple-400'
                                  : 'border-gray-400'
                              }`}>
                                {paymentMethod === method.id && (
                                  <div className="w-full h-full rounded-full bg-white scale-50" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="sticky top-8">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">订单摘要</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-purple-300">计划</span>
                      <span className="text-white">{currentPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">计费周期</span>
                      <span className="text-white">{currentPlan.period}</span>
                    </div>
                    {currentPlan.price > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-purple-300">原价</span>
                          <span className="text-white">¥{currentPlan.price}</span>
                        </div>
                        <div className="flex justify-between text-green-400">
                          <span>新用户优惠</span>
                          <span>-¥{Math.floor(currentPlan.price * 0.2)}</span>
                        </div>
                        <div className="border-t border-gray-600 pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span className="text-white">总计</span>
                            <span className="text-white">¥{Math.floor(currentPlan.price * 0.8)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Security Badges */}
                  <div className="flex items-center gap-4 mb-6 text-sm text-purple-300">
                    <div className="flex items-center gap-1">
                      <FiShield />
                      <span>SSL加密</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiLock />
                      <span>安全支付</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiGift />
                      <span>7天退款</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        处理中...
                      </div>
                    ) : currentPlan.price === 0 ? (
                      '开始使用'
                    ) : (
                      `立即支付 ¥${Math.floor(currentPlan.price * 0.8)}`
                    )}
                  </Button>

                  <p className="text-xs text-purple-300 text-center mt-4">
                    点击支付即表示您同意我们的服务条款和隐私政策
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mx-auto"
            >
              <FiArrowLeft />
              返回上一页
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
