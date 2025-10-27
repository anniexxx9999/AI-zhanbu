'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiZap } from 'react-icons/fi';

interface SoulmatePortraitProps {
  birthInfo?: any;
  astrologicalData?: any;
}

export default function SoulmatePortrait({ birthInfo, astrologicalData }: SoulmatePortraitProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 模拟分析过程
  const startAnalysis = async () => {
    setIsGenerating(true);
    
    // 模拟分析时间
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
  };

  useEffect(() => {
    if (birthInfo) {
      startAnalysis();
    }
  }, [birthInfo]);

  return (
    <div className="relative">
      {/* 灵魂伴侣分析卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative group"
      >
        {/* 背景装饰 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        
        {/* 分析容器 */}
        <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
              />
              <div className="ml-6">
                <p className="text-white font-semibold text-lg">正在分析你的灵魂伴侣特征...</p>
                <p className="text-purple-300 text-sm">基于你的星盘数据深度解析</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {/* 标题区域 */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <FiStar className="text-yellow-400 w-6 h-6" />
                <h3 className="text-2xl font-bold text-white">灵魂伴侣分析</h3>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-all ${
                    isLiked ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* 分析结果 */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">性格特征</h4>
                  <p className="text-purple-200">温柔体贴，富有同情心，具有强烈的直觉力和创造力</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">外貌特征</h4>
                  <p className="text-purple-200">优雅迷人，气质独特，具有神秘而吸引人的魅力</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">匹配度</h4>
                  <p className="text-purple-200">高度匹配，情感共鸣强烈，能够深度理解彼此</p>
                </div>
              </div>

              {/* 底部信息 */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiZap className="text-yellow-400 w-4 h-4" />
                  <span className="text-white font-semibold text-sm">占星分析结果</span>
                </div>
                <p className="text-purple-200 text-xs">
                  基于你的星盘特征深度分析生成
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
