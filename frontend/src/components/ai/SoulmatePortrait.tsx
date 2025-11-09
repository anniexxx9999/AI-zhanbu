'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiRefreshCw, FiDownload, FiShare2, FiHeart, FiStar, FiEye, FiZap } from 'react-icons/fi';
import { generateSoulmatePrompt, generateMultiplePrompts, getAstrologicalInsights, AstrologicalData } from '@/utils/aiPromptGenerator';
import { astrologyAPI } from '@/services/api';

interface SoulmatePortraitProps {
  birthInfo?: any;
  astrologicalData?: any;
}

export default function SoulmatePortrait({ birthInfo, astrologicalData }: SoulmatePortraitProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage获取占星数据
  const getChartData = useCallback(() => {
    try {
      const stored = localStorage.getItem('latestChartData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse chart data from localStorage:', e);
    }
    return null;
  }, []);

  // 基于占星数据生成AI提示词
  const generatePrompt = useCallback(() => {
    const chartData = getChartData();
    
    // 提取第7宫数据
    const seventhHouse = astrologicalData?.seventhHouse || chartData?.houses?.find((h: any) => h.number === 7);
    
    // 提取第7宫内的行星（从planets数组中找出house为7的行星）
    let seventhHousePlanets: Array<{name: string; sign: string}> = [];
    if (chartData?.planets && Array.isArray(chartData.planets)) {
      seventhHousePlanets = chartData.planets
        .filter((p: any) => p.house === 7)
        .map((p: any) => ({
          name: p.name,
          sign: p.sign || p.zodiacSignName || 'Unknown'
        }));
    }
    
    // 构建完整的第7宫数据
    const completeSeventhHouse = seventhHouse ? {
      ...seventhHouse,
      planets: seventhHousePlanets.length > 0 
        ? seventhHousePlanets 
        : seventhHouse.planets || []
    } : undefined;
    
    // 提取金星的Nakshatra（星宿）
    const venusPlanet = chartData?.planets?.find((p: any) => p.name === 'Venus');
    const venusNakshatra = venusPlanet?.nakshatra?.name || venusPlanet?.nakshatra;
    
    const astroData: AstrologicalData = {
      sunSign: astrologicalData?.sunSign || chartData?.sunSign || 'Leo',
      moonSign: astrologicalData?.moonSign || chartData?.moonSign || 'Pisces',
      venusSign: astrologicalData?.venusSign || venusPlanet?.sign || 'Libra',
      venusNakshatra: astrologicalData?.venusNakshatra || venusNakshatra,
      marsSign: astrologicalData?.marsSign || chartData?.planets?.find((p: any) => p.name === 'Mars')?.sign || 'Aries',
      risingSign: astrologicalData?.risingSign || chartData?.risingSign || 'Scorpio',
      seventhHouse: completeSeventhHouse,
      navamsa: astrologicalData?.navamsa
    };

    // 从 birthInfo 获取用户性别
    const userGender = birthInfo?.gender as 'male' | 'female' | undefined;

    return generateSoulmatePrompt(astroData, {
      style: 'realistic', // 改为写实风格
      quality: 'high',
      mood: 'mysterious'
    }, userGender);
  }, [astrologicalData, birthInfo, getChartData]);

  // 调用即梦AI生成图片
  const generateImage = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = generatePrompt();
      setGenerationPrompt(prompt);
      
      console.log('🔄 开始生成图片，prompt:', prompt.substring(0, 100));
      
      // 调用即梦AI API
      const response = await astrologyAPI.generateAIImage(prompt, {
        width: 1024,
        height: 1024,
        use_pre_llm: true,
        seed: -1
      });

      console.log('📥 API响应:', response);

      // 后端返回的是扁平结构：{success: true, imageUrl: "...", imageUrls: [...]}
      // 而不是嵌套结构：{success: true, data: {imageUrl: "..."}}
      const imageUrl = response.data?.imageUrl || response.imageUrl;
      const imageUrls = response.data?.imageUrls || response.imageUrls;

      if (response.success && imageUrl) {
        console.log('✅ 图片生成成功，URL:', imageUrl);
        setCurrentImage(imageUrl);
      } else {
        console.error('❌ API返回失败:', {
          success: response.success,
          error: response.error,
          message: response.message,
          imageUrl: imageUrl,
          response: response
        });
        throw new Error(response.error || response.message || 'Failed to generate image');
      }
    } catch (err: any) {
      console.error('❌ AI image generation error:', err);
      console.error('错误详情:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      setError(err.message || '生成图片失败，请稍后重试');
      
      // 失败时使用占位图片
      const placeholderImages = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
      ];
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setCurrentImage(randomImage);
    } finally {
      setIsGenerating(false);
    }
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
            <div className="aspect-[3/4] flex flex-col items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-semibold">即梦AI正在生成你的灵魂伴侣画像...</p>
                <p className="text-purple-300 text-sm mt-1">基于你的星盘特征</p>
                {generationPrompt && (
                  <p className="text-purple-400 text-xs mt-2 max-w-xs truncate">
                    {generationPrompt.substring(0, 50)}...
                  </p>
                )}
              </div>
            </div>
          ) : error ? (
            <div className="aspect-[3/4] flex flex-col items-center justify-center">
              <FiEye className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-300 font-semibold mb-2">生成失败</p>
              <p className="text-purple-300 text-sm text-center px-4">{error}</p>
              <button
                onClick={generateImage}
                className="mt-4 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-white text-sm"
              >
                重新生成
              </button>
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
                    <span className="text-white font-semibold text-sm">即梦AI生成画像</span>
                  </div>
                  <p className="text-purple-200 text-xs">
                    基于你的星盘特征个性化生成
                  </p>
                  {generationPrompt && (
                    <button
                      onClick={generateImage}
                      className="mt-2 w-full px-3 py-1.5 rounded bg-purple-600/50 hover:bg-purple-600/70 transition-colors text-white text-xs flex items-center justify-center gap-2"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      重新生成
                    </button>
                  )}
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
