'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  FiCheckCircle, FiStar, FiCrown, FiZap, FiGift, FiDownload,
  FiShare2, FiHeart, FiBookOpen, FiTrendingUp, FiZap as FiZapIcon
} from 'react-icons/fi';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const features = [
    {
      icon: FiStar,
      title: '完整12宫位分析',
      description: '深度解读你人生的每个领域',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: FiHeart,
      title: '灵魂伴侣匹配',
      description: '找到你的完美伴侣',
      color: 'from-pink-500 to-red-600'
    },
    {
      icon: FiTrendingUp,
      title: '事业指导报告',
      description: '职业发展的占星指导',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: FiBookOpen,
      title: '个性化建议',
      description: '基于你的星盘定制建议',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            >
              <FiCheckCircle className="text-4xl text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display gradient-text mb-4">
              支付成功！🎉
            </h1>
            <p className="text-xl text-purple-300 mb-8">
              欢迎加入AstroSoul专业版，你的占星之旅即将开始
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <FiGift className="text-2xl text-yellow-400" />
                <span className="text-lg font-semibold text-white">新用户专享福利</span>
              </div>
              <p className="text-purple-300">
                你已获得7天免费试用 + 20%新用户优惠，总价值超过¥200的专业占星服务
              </p>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-purple-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all px-8 py-3"
              >
                <FiStar className="mr-2" />
                开始占星之旅
              </Button>
              
              <Button
                onClick={() => router.push('/report/spouse')}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 transition-all px-8 py-3"
              >
                <FiHeart className="mr-2" />
                查看灵魂伴侣报告
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {/* 分享功能 */}}
                className="bg-gray-600 hover:bg-gray-500 transition-all px-6 py-2"
              >
                <FiShare2 className="mr-2" />
                分享给朋友
              </Button>
              
              <Button
                onClick={() => {/* 下载功能 */}}
                className="bg-gray-600 hover:bg-gray-500 transition-all px-6 py-2"
              >
                <FiDownload className="mr-2" />
                下载报告
              </Button>
            </div>
          </motion.div>

          {/* Auto Redirect Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12 text-center"
          >
            <div className="bg-purple-500/10 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-purple-300">
                <FiZapIcon className="animate-pulse" />
                <span>自动跳转到仪表盘</span>
                <span className="text-white font-semibold">{countdown}s</span>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-12 text-center"
          >
            <p className="text-purple-300 text-sm mb-4">
              如有任何问题，请联系我们的客服团队
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-purple-300">📧 support@astrosoul.com</span>
              <span className="text-purple-300">💬 在线客服</span>
              <span className="text-purple-300">📱 微信客服</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
