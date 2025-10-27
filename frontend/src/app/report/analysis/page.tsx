'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, FiHeart, FiTrendingUp, FiTarget, FiZap, 
  FiClock, FiUsers, FiDownload, FiShare2, FiBookOpen,
  FiSun, FiMoon, FiCompass, FiGift, FiShield
} from 'react-icons/fi';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import { astrologyAPI, AnalysisData, BirthInfo } from '@/services/api';


export default function AnalysisReportPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        // 从 localStorage 获取分析数据
        const storedData = localStorage.getItem('latestAnalysisData');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setAnalysisData(parsed);
        } else {
          // 如果没有存储的数据，生成新的分析
          await generateNewAnalysis();
        }
      } catch (err) {
        console.error('Error loading analysis data:', err);
        setError('Failed to load analysis data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, []);

  const generateNewAnalysis = async () => {
    try {
      const birthInfo: BirthInfo = JSON.parse(localStorage.getItem('birthInfo') || '{}');
      const response = await astrologyAPI.generateAnalysis(
        birthInfo, 
        '请基于我的星盘进行详细分析'
      );
      
      if (response.success) {
        setAnalysisData(response.data);
        localStorage.setItem('latestAnalysisData', JSON.stringify(response.data));
      } else {
        setError('Failed to generate analysis');
      }
    } catch (err) {
      setError('Failed to generate analysis');
    }
  };

  const parseAnalysisSections = (analysis: string) => {
    const sections = analysis.split(/\n## |\n### /);
    const parsed: { [key: string]: string } = {};
    
    sections.forEach(section => {
      if (section.trim()) {
        const lines = section.split('\n');
        const title = lines[0].replace(/[#*]/g, '').trim();
        const content = lines.slice(1).join('\n').trim();
        if (title && content) {
          parsed[title] = content;
        }
      }
    });
    
    return parsed;
  };

  const formatAnalysisContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-rose-600 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-purple-500 italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  const getRisingDescription = (sign: string) => {
    const descriptions: { [key: string]: string } = {
      'Aries': '自信、勇敢、充满活力的领导者形象，总是第一个迎接挑战',
      'Taurus': '稳重、可靠、充满魅力的形象，给人安全感和信任感',
      'Gemini': '聪明、好奇、善于沟通的形象，总是充满活力和新鲜感',
      'Cancer': '温柔、敏感、充满母性的形象，给人温暖和安全感',
      'Leo': '自信、温暖、充满魅力的领导者形象，天生具有王者风范',
      'Virgo': '细致、完美、充满智慧的形象，总是追求卓越和完美',
      'Libra': '优雅、和谐、充满魅力的形象，总是追求平衡和美感',
      'Scorpio': '神秘、深刻、充满魅力的形象，具有强大的吸引力',
      'Sagittarius': '乐观、自由、充满冒险精神的形象，总是充满希望',
      'Capricorn': '成熟、稳重、充满责任感的形象，给人可靠的感觉',
      'Aquarius': '独特、创新、充满未来感的形象，总是走在时代前沿',
      'Pisces': '梦幻、敏感、充满想象力的形象，具有艺术气质'
    };
    return descriptions[sign] || '独特而迷人的个人魅力，给人留下深刻印象';
  };

  const getMoonDescription = (sign: string) => {
    const descriptions: { [key: string]: string } = {
      'Aries': '需要独立和自主的情感空间，渴望成为情感关系中的领导者',
      'Taurus': '需要稳定和安全感的情感连接，渴望物质和情感的双重满足',
      'Gemini': '需要智力和情感的双重交流，渴望多样化和新鲜的情感体验',
      'Cancer': '需要深度情感连接和家庭温暖，渴望被关爱和保护',
      'Leo': '需要被欣赏和认可的情感支持，渴望成为情感关系中的焦点',
      'Virgo': '需要实用和可靠的情感支持，渴望在关系中提供服务和帮助',
      'Libra': '需要和谐和平衡的情感关系，渴望美丽和优雅的情感体验',
      'Scorpio': '需要深度和真实的情感连接，渴望情感关系的彻底转变',
      'Sagittarius': '需要自由和冒险的情感体验，渴望探索和成长',
      'Capricorn': '需要稳定和承诺的情感关系，渴望建立长久的情感基础',
      'Aquarius': '需要独特和创新的情感体验，渴望情感关系的自由和独立',
      'Pisces': '需要梦幻和灵性的情感连接，渴望无条件的爱和理解'
    };
    return descriptions[sign] || '深度情感连接、梦想与灵性的滋养';
  };

  const getSunDescription = (sign: string) => {
    const descriptions: { [key: string]: string } = {
      'Aries': '勇气、独立与开拓新事物的冲动，天生的领导者和先锋',
      'Taurus': '稳定、坚持与享受美好事物的能力，天生的建设者和守护者',
      'Gemini': '好奇心、沟通能力与学习新知识的渴望，天生的交流者和传播者',
      'Cancer': '关爱、保护与创造情感安全的能力，天生的滋养者和守护者',
      'Leo': '自信、创造力与表达自我的勇气，天生的表演者和领导者',
      'Virgo': '完美主义、服务精神与追求卓越的动力，天生的分析者和改进者',
      'Libra': '和谐、美感与建立平衡关系的能力，天生的调解者和艺术家',
      'Scorpio': '深度、转化与探索生命奥秘的勇气，天生的治疗者和变革者',
      'Sagittarius': '冒险精神、哲学思考与追求真理的热情，天生的探索者和导师',
      'Capricorn': '责任感、雄心壮志与建立长久成就的决心，天生的建设者和领导者',
      'Aquarius': '创新精神、人道主义与推动社会进步的愿景，天生的改革者和发明家',
      'Pisces': '直觉力、同情心与连接精神世界的能力，天生的治疗者和艺术家'
    };
    return descriptions[sign] || '独特而强大的生命力量，驱动你实现人生目标';
  };

  const getPlanetSymbol = (name: string) => {
    const symbols: { [key: string]: string } = {
      'Ascendant': 'Asc',
      'Sun': '☉',
      'Moon': '☽',
      'Mars': '♂',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋'
    };
    return symbols[name] || '★';
  };

  const getSignRuler = (sign: string) => {
    const rulers: { [key: string]: string } = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Saturn',
      'Pisces': 'Jupiter'
    };
    return rulers[sign] || 'Unknown';
  };

  const getPlanetDataForDisplay = (chartData: any) => {
    if (!chartData?.planets) {
      console.log('No planets data found:', chartData);
      return [];
    }

    const planets = chartData.planets;
    
    console.log('Processing planets:', planets.length, 'planets found');

    // Process all planets (including Ascendant which is already in the data)
    const planetData = planets.map((planet: any) => ({
      name: planet.name,
      symbol: getPlanetSymbol(planet.name),
      localizedName: planet.localizedName || planet.name,
      sign: planet.sign || 'Unknown',
      signSymbol: planet.signSymbol || '★',
      house: planet.house || 0,
      degree: planet.degree || 0,
      minute: planet.minute || 0,
      second: planet.second || 0,
      retrograde: planet.retrograde || false,
      ruler: getSignRuler(planet.sign || ''),
      nakshatra: planet.nakshatra || null
    }));

    return planetData;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <StarField />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-8xl mb-8"
            >
              ⭐
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-2xl font-semibold"
            >
              正在加载你的星盘数据...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <StarField />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || 'No analysis data available'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full hover:shadow-lg transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sections = parseAnalysisSections(analysisData.analysis);
  const sectionTitles = Object.keys(sections);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <StarField />
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-display bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                ✨ Your Cosmic Blueprint
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Personalized Vedic Astrology Analysis Report
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  Generated {new Date(analysisData.metadata.generatedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  For You
                </span>
                <span className="flex items-center gap-2">
                  <FiStar className="w-4 h-4" />
                  AI-Powered Analysis
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-rose-600 rounded-full shadow-lg hover:shadow-xl transition-all border border-rose-200"
              >
                <FiDownload className="w-4 h-4" />
                Download PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FiShare2 className="w-4 h-4" />
                Share Report
              </motion.button>
            </div>
          </motion.div>

          {/* Core Trinity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Your Core Trinity
              </h2>
              <p className="text-lg text-gray-600">
                Three cosmic signatures that define the essence of your being
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Rising Sign Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 shadow-lg border border-orange-200 overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl opacity-10">🦁</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">
                      🦁
                    </div>
                    <div>
                      <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">
                        Your First Impression
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Rising {analysisData?.chartData?.risingSign || 'Unknown'}
                      </h3>
                    </div>
                  </div>
                  <p className="text-orange-600 text-sm mb-2">
                    你给世界的第一印象是...
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {getRisingDescription(analysisData?.chartData?.risingSign)}
                  </p>
                </div>
              </motion.div>

              {/* Moon Sign Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200 overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl opacity-10">🌙</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-2xl">
                      🌙
                    </div>
                    <div>
                      <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                        Your Inner World
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Moon {analysisData?.chartData?.moonSign || 'Unknown'}
                      </h3>
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm mb-2">
                    在内心深处，你真正需要的是...
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {getMoonDescription(analysisData?.chartData?.moonSign)}
                  </p>
                </div>
              </motion.div>

              {/* Sun Sign Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-8 shadow-lg border border-rose-200 overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl opacity-10">☀️</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center text-2xl">
                      ☀️
                    </div>
                    <div>
                      <p className="text-rose-600 text-sm font-semibold uppercase tracking-wide">
                        Your Life Force
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Sun {analysisData?.chartData?.sunSign || 'Unknown'}
                      </h3>
                    </div>
                  </div>
                  <p className="text-rose-600 text-sm mb-2">
                    驱动你生命前行的燃料是...
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {getSunDescription(analysisData?.chartData?.sunSign)}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Planets Energy Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                🌟 Planets Energy Overview
              </h2>
              <p className="text-lg text-gray-600">
                每一颗行星都在述说你的生命主题，点击行星卡片，感受宇宙的低语
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {(() => {
                const planetData = getPlanetDataForDisplay(analysisData?.chartData);
                console.log('Rendering planets:', planetData.length, 'cards');
                
                if (planetData.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">正在加载行星数据...</h3>
                      <p className="text-gray-500">请稍候，我们正在为您准备详细的星盘信息</p>
                    </div>
                  );
                }
                
                return planetData;
              })().map((planet, index) => (
                <motion.div
                  key={planet.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Planet Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {planet.symbol}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{planet.name}</h3>
                        <p className="text-xs text-gray-500">{planet.localizedName}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      planet.retrograde 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {planet.retrograde ? '逆行' : '顺行'}
                    </div>
                  </div>

                  {/* Planet Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">星座</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-800">{planet.sign}</span>
                        <span className="text-lg">{planet.signSymbol}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">宫位</span>
                      <span className="text-sm font-medium text-gray-800">第{planet.house}宫</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">度数</span>
                      <span className="text-sm font-medium text-gray-800">
                        {planet.degree}° {planet.minute}' {planet.second}"
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">守护星</span>
                      <span className="text-sm font-medium text-gray-800">{planet.ruler}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">星宿</span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-800">{planet.nakshatra?.name}</div>
                          <div className="text-xs text-gray-500">
                            第{planet.nakshatra?.pada}步 • {planet.nakshatra?.vimsottariLord}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBookOpen className="w-5 h-5 text-rose-500" />
                    Report Sections
                  </h3>
                  <nav className="space-y-2">
                    {sectionTitles.map((title, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSection(title)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          activeSection === title
                            ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {sectionTitles.map((title, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-rose-100"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      {title.includes('核心') && <FiStar className="w-6 h-6 text-yellow-500" />}
                      {title.includes('事业') && <FiTrendingUp className="w-6 h-6 text-blue-500" />}
                      {title.includes('财富') && <FiTarget className="w-6 h-6 text-green-500" />}
                      {title.includes('婚姻') && <FiHeart className="w-6 h-6 text-pink-500" />}
                      {title.includes('健康') && <FiShield className="w-6 h-6 text-red-500" />}
                      {title.includes('Yogas') && <FiZap className="w-6 h-6 text-purple-500" />}
                      {title.includes('运势') && <FiCompass className="w-6 h-6 text-indigo-500" />}
                      {title.includes('总结') && <FiGift className="w-6 h-6 text-orange-500" />}
                      {title}
                    </h2>
                    <div 
                      className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: `<p class="mb-4">${formatAnalysisContent(sections[title])}</p>` 
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Dive Deeper? 🌟
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Your cosmic journey doesn't end here. Explore more personalized insights, 
                get daily guidance, and connect with your soul's purpose.
              </p>
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Explore More
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/report/spouse')}
                  className="px-8 py-4 bg-white text-rose-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-rose-200"
                >
                  Find Your Soulmate
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
