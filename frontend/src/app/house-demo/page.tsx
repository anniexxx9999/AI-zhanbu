'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import HouseDisplay from '@/components/astrology/HouseDisplay';
import { FiStar, FiTrendingUp, FiHeart, FiZap } from 'react-icons/fi';

export default function HouseDemoPage() {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const houseData = [
    {
      id: 'communication',
      title: '沟通与学习',
      subtitle: 'Communication & Learning',
      category: 'Sahaja',
      guardianSign: 'Pisces',
      guardianSymbol: '♓',
      houseLord: 'Mercury',
      potential: 3,
      description: '这个宫位掌管沟通、学习、兄弟姐妹关系以及短途旅行。双鱼座的影响使你在沟通中更加直觉和富有同情心，水星作为宫主星则赋予你敏锐的思维和表达能力。',
      icon: '💬'
    },
    {
      id: 'career',
      title: '事业与声誉',
      subtitle: 'Career & Reputation',
      category: 'Karma',
      guardianSign: 'Capricorn',
      guardianSymbol: '♑',
      houseLord: 'Saturn',
      potential: 4,
      description: '第十宫代表事业、社会地位和公众形象。摩羯座的影响使你具有强烈的责任感和事业心，土星作为宫主星则带来持久的影响力和权威性。',
      icon: '💼'
    },
    {
      id: 'relationships',
      title: '婚姻与伴侣',
      subtitle: 'Marriage & Partnership',
      category: 'Kalatra',
      guardianSign: 'Libra',
      guardianSymbol: '♎',
      houseLord: 'Venus',
      potential: 5,
      description: '第七宫掌管婚姻、伴侣关系和公开的敌人。天秤座的影响使你在关系中追求和谐与平衡，金星作为宫主星则带来爱与美的能量。',
      icon: '💕'
    },
    {
      id: 'wealth',
      title: '财富与资源',
      subtitle: 'Wealth & Resources',
      category: 'Artha',
      guardianSign: 'Taurus',
      guardianSymbol: '♉',
      houseLord: 'Venus',
      potential: 4,
      description: '第二宫掌管财富、价值观和物质资源。金牛座的影响使你重视稳定和安全感，金星作为宫主星则带来财富和享受的能力。',
      icon: '💰'
    }
  ];

  const selectedHouseData = houseData.find(house => house.id === selectedHouse);

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
              🔮 占星学宫位展示
            </h1>
            <p className="text-xl text-purple-300 mb-6">
              优化后的UI/UX设计展示
            </p>
          </motion.div>

          {/* House Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {houseData.map((house, index) => (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedHouse(house.id)}
              >
                <motion.div
                  className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{house.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {house.title}
                    </h3>
                    <p className="text-sm text-purple-300 mb-3">
                      {house.subtitle}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < house.potential ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-purple-400">
                      {house.guardianSign} {house.guardianSymbol}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Selected House Display */}
          {selectedHouseData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <HouseDisplay
                title={selectedHouseData.title}
                subtitle={selectedHouseData.subtitle}
                category={selectedHouseData.category}
                guardianSign={selectedHouseData.guardianSign}
                guardianSymbol={selectedHouseData.guardianSymbol}
                houseLord={selectedHouseData.houseLord}
                potential={selectedHouseData.potential}
                description={selectedHouseData.description}
                onClose={() => setSelectedHouse(null)}
                onUpgrade={() => {
                  alert('升级到专业版！');
                }}
              />
            </motion.div>
          )}

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              ✨ 设计优化亮点
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                <FiStar className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">视觉层次</h3>
                <p className="text-purple-300 text-sm">
                  清晰的信息层次，重要信息突出显示，提升可读性
                </p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                <FiTrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">交互体验</h3>
                <p className="text-purple-300 text-sm">
                  流畅的动画效果，悬停状态，点击反馈，提升用户体验
                </p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                <FiZap className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">响应式设计</h3>
                <p className="text-purple-300 text-sm">
                  适配各种屏幕尺寸，保持一致的视觉体验
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
