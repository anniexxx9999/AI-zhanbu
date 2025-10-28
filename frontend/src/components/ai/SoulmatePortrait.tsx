'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiRefreshCw, FiDownload, FiShare2, FiHeart, FiStar, FiEye, FiZap } from 'react-icons/fi';
import { generateSoulmatePrompt, generateMultiplePrompts, getAstrologicalInsights, AstrologicalData } from '@/utils/aiPromptGenerator';

interface SoulmatePortraitProps {
  birthInfo?: any;
  astrologicalData?: any;
}

export default function SoulmatePortrait({ birthInfo, astrologicalData }: SoulmatePortraitProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);

  // 基于占星数据生成AI提示词
  const generatePrompt = useCallback(() => {
    const astroData: AstrologicalData = {
      sunSign: astrologicalData?.sunSign || 'Leo',
      moonSign: astrologicalData?.moonSign || 'Pisces',
      venusSign: astrologicalData?.venusSign || 'Libra',
      marsSign: astrologicalData?.marsSign || 'Aries',
      risingSign: astrologicalData?.risingSign || 'Scorpio',
      seventhHouse: astrologicalData?.seventhHouse,
      navamsa: astrologicalData?.navamsa
    };

    return generateSoulmatePrompt(astroData, {
      style: 'mystical',
      quality: 'high',
      mood: 'mysterious'
    });
  }, [astrologicalData]);

  // 模拟AI图片生成
  const generateImage = useCallback(async () => {
    setIsGenerating(true);
    const prompt = generatePrompt();
    setGenerationPrompt(prompt);
    
    // 模拟生成时间
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 使用占位图片，实际项目中会调用AI API
    const placeholderImages = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
    ];
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setCurrentImage(randomImage);
    setIsGenerating(false);
  }, [generatePrompt]);

  useEffect(() => {
    if (birthInfo) {
      generateImage();
    }
  }, [birthInfo, astrologicalData, generateImage]);


  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = 'soulmate-portrait.jpg';
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '我的灵魂伴侣画像',
        text: '基于占星学AI生成的灵魂伴侣画像',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="relative">
      {/* 主图片展示区域 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative group"
      >
        {/* 背景装饰 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        
        {/* 图片容器 */}
        <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
          {isGenerating ? (
            <div className="aspect-[3/4] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
              />
              <div className="ml-4">
                <p className="text-white font-semibold">AI正在生成你的灵魂伴侣画像...</p>
                <p className="text-purple-300 text-sm">基于你的星盘特征</p>
              </div>
            </div>
          ) : currentImage ? (
            <div className="relative">
              <Image
                src={currentImage}
                alt="Soulmate Portrait"
                width={400}
                height={600}
                className="w-full aspect-[3/4] object-cover rounded-xl shadow-2xl"
                priority
              />
              
              {/* 图片叠加效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
              
              {/* 悬浮操作按钮 */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                    isLiked ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>

              {/* 底部信息 */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-white font-semibold text-sm">AI生成画像</span>
                  </div>
                  <p className="text-purple-200 text-xs">
                    基于你的星盘特征个性化生成
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <FiEye className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">发现你的灵魂伴侣</p>
                <p className="text-purple-300 text-sm">AI将根据你的星盘生成专属画像</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>



    </div>
  );
}
