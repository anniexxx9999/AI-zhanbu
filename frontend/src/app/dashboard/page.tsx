'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { astrologyAPI, BirthInfo, ChartData } from '@/services/api';
import { 
  FiHeart, FiChevronDown, FiChevronLeft, FiChevronRight, FiStar, 
  FiTrendingUp, FiClock, FiZap, FiTarget, FiLock, FiBookOpen,
  FiCompass, FiGift, FiSun, FiMoon
} from 'react-icons/fi';
import StarField from '@/components/particles/StarField';
import Navigation from '@/components/layout/Navigation';
import Button from '@/components/ui/Button';

// Mock data
const fallbackBirthInfo = {
  name: 'Xuan',
  date: '1995-05-15',
  time: '14:30',
  city: 'Mumbai, India',
};

// Core Trinity Data
const coreTrinity = { loading: true };

// Life Energy Data
const lifeEnergy = { loading: true };

// 12 Life Arenas - Complete Professional Astrology Data
const lifeArenas = [];

// Dasha Timeline Data
const dashaTimeline = [];

const currentDasha = { loading: true };

// Cosmic Toolkit
const cosmicToolkit = { loading: true };

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [birthInfoState, setBirthInfoState] = useState<BirthInfo | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArena, setSelectedArena] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('trinity');

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const storedBirthInfo = window.localStorage.getItem('birthInfo');
        const parsedBirthInfo: BirthInfo = storedBirthInfo
          ? JSON.parse(storedBirthInfo)
          : fallbackBirthInfo;

        if (!storedBirthInfo) {
          window.localStorage.setItem('birthInfo', JSON.stringify(parsedBirthInfo));
        }

        setBirthInfoState(parsedBirthInfo);

        const cachedChartData = window.localStorage.getItem('latestChartData');
        let hasCachedChart = false;
        if (cachedChartData) {
          try {
            const parsedChart: ChartData = JSON.parse(cachedChartData);
            setChartData(parsedChart);
            hasCachedChart = true;
          } catch (cacheErr) {
            console.warn('Failed to parse cached chart data:', cacheErr);
            window.localStorage.removeItem('latestChartData');
          }
        }

        try {
          const response = await astrologyAPI.calculateChart(parsedBirthInfo);
          if (response.success && response.data) {
            setChartData(response.data);
            window.localStorage.setItem('latestChartData', JSON.stringify(response.data));
          } else if (!hasCachedChart) {
            setError(response.message || response.error || '占星数据获取失败');
          }
        } catch (networkErr) {
          console.error('Failed to refresh chart data', networkErr);
          if (!hasCachedChart) {
            setError('占星数据获取失败，请稍后重试');
          }
        }
      } catch (err) {
        console.error('Failed to load chart data', err);
        setError('占星数据获取失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  const effectiveBirthInfo = birthInfoState ?? fallbackBirthInfo;

  const displayCoreTrinity = useMemo(() => {
    if (!chartData) {
      return { loading: true };
    }
    return {
      lagna: {
        sign: chartData.risingSign || '—',
        emoji: '🦁',
        mask: '—',
        desc: '—'
      },
      moon: {
        sign: chartData.moonSign || '—',
        emoji: '🌙',
        need: '—',
        desc: '—'
      },
      sun: {
        sign: chartData.sunSign || '—',
        emoji: '☀️',
        fuel: '—',
        desc: '—'
      }
    };
  }, [chartData]);

  const displayLifeArenas = useMemo(() => {
    if (!chartData || !chartData.houses) {
      return [];
    }

    return chartData.houses.map((house) => {
      const planetsIn = house.planets.map(
        (planet) => `${planet.name}${planet.signSymbol ? ` ${planet.signSymbol}` : ''}`
      );

      return {
        house: house.number,
        name: house.name || `第${house.number}宫`,
        nameEn: house.nameEn || '',
        sanskrit: house.sanskrit || '',
        emoji: '🏠',
        rating: 3,
        sign: house.signSymbol ? `${house.sign} ${house.signSymbol}` : house.sign,
        lord: house.lord || '未知',
        lordPlacement: house.lordPlacement || '未知',
        lordStrength: house.lordStrength || '未知',
        planetsIn: planetsIn,
        aspects: [],
      };
    });
  }, [chartData]);

  // 当前年龄和时间轴位置
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(effectiveBirthInfo.date).getFullYear();
  const currentAge = currentYear - birthYear;

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1430] text-white gap-3">
        <div className="text-4xl">🌟</div>
        <div className="text-lg">正在加载你的星盘数据...</div>
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1430] text-white gap-3 px-6 text-center">
        <div className="text-4xl">😔</div>
        <div className="text-lg">加载星盘数据时出现问题</div>
        <p className="text-sm text-purple-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          重新尝试
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <div className="relative z-10 min-h-screen bg-transparent text-text-primary">
        {/* Navigation */}
        <Navigation />

        <main className="max-w-[1200px] mx-auto px-6 py-10">
          {/* Module 1: Welcome Dashboard - 欢迎来到你的宇宙中心 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="relative rounded-[32px] p-10 md:p-14 bg-gradient-to-br from-[rgba(255,182,217,0.12)] via-[rgba(199,184,234,0.08)] to-[rgba(255,182,217,0.12)] border border-[rgba(255,182,217,0.25)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
              {/* Floating decorative elements */}
              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 text-5xl opacity-40"
              >
                ✨
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 text-5xl opacity-40"
              >
                🌸
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20"
              >
                💫
              </motion.div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="text-7xl mb-3">🌙</div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-pink-300/30 rounded-full blur-2xl"
                    />
                  </div>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-serif mb-5 text-white leading-tight"
                  style={{ textShadow: '0 2px 12px rgba(255, 182, 217, 0.4), 0 0 40px rgba(199, 184, 234, 0.3)' }}
                >
                  Welcome to Your Cosmic Journey
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-[#E8D5F2] mb-3 font-light"
                >
                  {effectiveBirthInfo.name}, this is your celestial blueprint ✨
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(255,182,217,0.15)] backdrop-blur-sm border border-[rgba(255,182,217,0.3)] shadow-lg"
                >
                  <span className="text-sm text-[#FFB6D9]">
                    {effectiveBirthInfo.date} • {effectiveBirthInfo.time} • {effectiveBirthInfo.city}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Core Trinity Cards - 核心三要素 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300"></div>
                <span className="text-4xl">✨</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300"></div>
              </motion.div>
              <h2 
                className="text-3xl md:text-4xl font-serif text-white mb-3"
                style={{ textShadow: '0 2px 12px rgba(255, 182, 217, 0.4), 0 0 30px rgba(199, 184, 234, 0.25)' }}
              >
                Your Core Trinity
              </h2>
              <p className="text-lg text-[#E8D5F2] max-w-2xl mx-auto font-light">
                Three cosmic signatures that define the essence of your being
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Lagna Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative rounded-[24px] p-8 bg-gradient-to-br from-[#FFF9F0] via-white to-[#FFF5E6] border border-amber-100 hover:border-amber-200 hover:shadow-[0_20px_60px_-15px_rgba(251,191,36,0.3)] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <motion.div 
                  className="absolute top-0 right-0 text-7xl opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  {displayCoreTrinity.lagna.emoji}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-3xl">{displayCoreTrinity.lagna.emoji}</span>
                  </motion.div>
                  <div className="text-[10px] text-amber-600 mb-2 font-semibold uppercase tracking-[0.15em] letterspacing-wider">Your First Impression</div>
                  <div className="font-serif text-2xl mb-3 text-gray-800">Rising {displayCoreTrinity.lagna.sign}</div>
                  <p className="text-sm text-amber-700/80 mb-4 italic leading-relaxed">{displayCoreTrinity.lagna.mask}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{displayCoreTrinity.lagna.desc}</p>
                </div>
              </motion.div>

              {/* Moon Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative rounded-[24px] p-8 bg-gradient-to-br from-[#F0F4FF] via-white to-[#E6EFFF] border border-blue-100 hover:border-blue-200 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <motion.div 
                  className="absolute top-0 right-0 text-7xl opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {displayCoreTrinity.moon.emoji}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow"
                    whileHover={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-3xl">{displayCoreTrinity.moon.emoji}</span>
                  </motion.div>
                  <div className="text-[10px] text-blue-600 mb-2 font-semibold uppercase tracking-[0.15em]">Your Inner World</div>
                  <div className="font-serif text-2xl mb-3 text-gray-800">Moon {displayCoreTrinity.moon.sign}</div>
                  <p className="text-sm text-blue-700/80 mb-4 italic leading-relaxed">{displayCoreTrinity.moon.need}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{displayCoreTrinity.moon.desc}</p>
                </div>
              </motion.div>

              {/* Sun Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative rounded-[24px] p-8 bg-gradient-to-br from-[#FFF0F5] via-white to-[#FFE6F0] border border-rose-100 hover:border-rose-200 hover:shadow-[0_20px_60px_-15px_rgba(244,63,94,0.3)] transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <motion.div 
                  className="absolute top-0 right-0 text-7xl opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {displayCoreTrinity.sun.emoji}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow"
                    whileHover={{ rotate: [0, 360] }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-3xl">{displayCoreTrinity.sun.emoji}</span>
                  </motion.div>
                  <div className="text-[10px] text-rose-600 mb-2 font-semibold uppercase tracking-[0.15em]">Your Life Force</div>
                  <div className="font-serif text-2xl mb-3 text-gray-800">Sun {displayCoreTrinity.sun.sign}</div>
                  <p className="text-sm text-rose-700/80 mb-4 italic leading-relaxed">{displayCoreTrinity.sun.fuel}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{displayCoreTrinity.sun.desc}</p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Life Energy Dashboard - 生命能量仪表盘 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-3 drop-shadow-lg flex items-center justify-center gap-2">
                <span className="text-3xl">⚡</span>
                生命能量仪表盘
                <span className="text-sm text-purple-300 font-normal">(Life Energy Dashboard)</span>
              </h2>
              <p className="text-purple-200 drop-shadow-md">
                你的宇宙超能力与成长课题
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strongest Planets */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <FiZap className="text-green-400 text-xl" />
                  <h3 className="font-serif text-xl text-white">你的超能力</h3>
                  <span className="text-xs text-green-300">(最强行星)</span>
                </div>
                
                <div className="space-y-4">
                  {lifeEnergy.strongest && Array.isArray(lifeEnergy.strongest) && lifeEnergy.strongest.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-white">{item.planet}</div>
                          <div className="text-xs text-green-300 font-mono">{item.score}/100</div>
                        </div>
                        <div className="text-xs text-green-400 mb-2">{item.power}</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                        {/* Progress bar */}
                        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weakest Planet - Growth Area */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <FiTarget className="text-amber-400 text-xl" />
                  <h3 className="font-serif text-xl text-white">你的成长课题</h3>
                  <span className="text-xs text-amber-300">(最弱行星)</span>
    </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-5xl mb-4 block">{lifeEnergy.weakest?.emoji || "⚡"}</span>
                  <div className="font-semibold text-xl text-white mb-2">{lifeEnergy.weakest?.planet || "—"}</div>
                  <div className="text-sm text-amber-400 mb-3">{lifeEnergy.weakest?.lesson || "—"}</div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{lifeEnergy.weakest?.desc || "—"}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lifeEnergy.weakest?.score || 0}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                      />
                    </div>
                    <div className="text-xs text-amber-300 font-mono">{lifeEnergy.weakest?.score || 0}/100</div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-xs text-amber-400 mb-1 font-semibold">💡 成长建议</div>
                    <p className="text-sm text-gray-300">通过冥想、运动和直面挑战，逐步强化这一能量。记住：弱点是你最大的成长空间。</p>
                  </div>
                </motion.div>
              </div>
        </div>
      </motion.section>

          {/* Module 2: 12 Life Arenas - 你的人生十二大领域 (Professional Astrology Analysis) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 
                className="text-2xl md:text-3xl font-serif text-white mb-3 flex items-center justify-center gap-2"
                style={{ textShadow: '0 2px 12px rgba(255, 182, 217, 0.4), 0 0 30px rgba(199, 184, 234, 0.25)' }}
              >
                <span className="text-3xl">🎯</span>
                你的人生十二大领域
                <span className="text-sm text-[#E8D5F2] font-normal">(The 12 Arenas of Your Life)</span>
              </h2>
              <p className="text-[#E8D5F2]">
                基于 D1 Rasi Chart 的专业占星分析 · 点击任意宫位查看详情
              </p>
            </div>

            {/* 简化版网格布局 - 仍保持易用性 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {displayLifeArenas.map((arena, idx) => {
                const getHouseColor = (rating: number) => {
                  if (rating === 5) return 'from-[#FFB6D9]/30 to-[#FFC8E3]/30';
                  if (rating === 4) return 'from-[#E8B4D9]/30 to-[#C7B8EA]/30';
                  if (rating === 3) return 'from-[#C7B8EA]/30 to-[#9B8FC4]/30';
                  return 'from-[#8B7AB8]/30 to-[#6B5B95]/30';
                };

                return (
                  <motion.div
                    key={arena.house}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.03 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    onClick={() => setSelectedArena(selectedArena === arena.house ? null : arena.house)}
                    className={`relative rounded-xl p-5 cursor-pointer transition-all border backdrop-blur-xl ${
                      selectedArena === arena.house 
                        ? 'bg-gradient-to-br from-[#FFB6D9]/20 to-[#C7B8EA]/20 border-[#FFB6D9] shadow-[0_0_20px_rgba(255,182,217,0.4)]' 
                        : `bg-gradient-to-br ${getHouseColor(arena.rating)} border-[rgba(255,182,217,0.2)] hover:border-[rgba(255,182,217,0.4)]`
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">{arena.emoji}</div>
                      <div className="text-xs text-[#C7B8EA] mb-1">第 {arena.house} 宫 • {arena.sanskrit}</div>
                      <div className="font-serif text-sm text-white mb-2 leading-tight">{arena.name}</div>
                      <div className="flex items-center justify-between">
                        {renderStarRating(arena.rating)}
                        <FiChevronRight className={`text-[#FFB6D9] transition-transform ${selectedArena === arena.house ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Professional Detail Panel */}
            <AnimatePresence>
              {selectedArena && (() => {
                const arena = displayLifeArenas.find(a => a.house === selectedArena);
                if (!arena) return null;
                
                // 检查是否有完整专业数据
                const hasFullData = arena && 'professionalAnalysis' in arena && arena.professionalAnalysis;
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[rgba(255,182,217,0.08)] via-[rgba(199,184,234,0.06)] to-[rgba(255,182,217,0.08)] border border-[rgba(255,182,217,0.25)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 pb-4 border-b border-[rgba(255,182,217,0.2)]">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl">{arena.emoji}</span>
                        <div>
                          <h3 className="font-serif text-2xl text-white mb-1">{arena.name}</h3>
                          <div className="text-sm text-[#C7B8EA] flex items-center gap-2">
                            <span>{arena.nameEn}</span>
                            <span>•</span>
                            <span>{arena.sanskrit}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-[#E8D5F2]">宫位潜力：</span>
                            {renderStarRating(arena.rating)}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedArena(null)}
                        className="w-8 h-8 rounded-full bg-[rgba(255,182,217,0.2)] text-[#FFB6D9] hover:bg-[rgba(255,182,217,0.3)] transition flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>

                    {hasFullData ? (
                      <div className="space-y-6">
                        {/* 宫位基础分析 */}
                        <div className="rounded-xl p-5 bg-[rgba(26,20,48,0.4)] border border-[rgba(255,182,217,0.15)]">
                          <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                            📊 宫位基础分析
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-[rgba(255,182,217,0.08)] border border-[rgba(255,182,217,0.15)]">
                              <div className="text-xs text-[#C7B8EA] mb-1">守护星座</div>
                              <div className="text-sm font-semibold text-white">{arena.sign}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(255,182,217,0.08)] border border-[rgba(255,182,217,0.15)]">
                              <div className="text-xs text-[#C7B8EA] mb-1">宫主星</div>
                              <div className="text-sm font-semibold text-white">{arena.lord}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(255,182,217,0.08)] border border-[rgba(255,182,217,0.15)]">
                              <div className="text-xs text-[#C7B8EA] mb-1">宫主星位置</div>
                              <div className="text-sm font-semibold text-white">{arena.lordPlacement}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(255,182,217,0.08)] border border-[rgba(255,182,217,0.15)]">
                              <div className="text-xs text-[#C7B8EA] mb-1">宫主星力量</div>
                              <div className="text-sm font-semibold text-white">{arena.lordStrength}</div>
                            </div>
                          </div>
                        </div>

                        {/* 行星影响 */}
                        {arena.aspects && arena.aspects.length > 0 && (
                          <div className="rounded-xl p-5 bg-[rgba(26,20,48,0.4)] border border-[rgba(255,182,217,0.15)]">
                            <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                              🪐 行星影响
                            </h4>
                            <div className="space-y-2">
                              {arena.planetsIn && arena.planetsIn.length > 0 ? (
                                <div>
                                  <div className="text-xs text-[#C7B8EA] mb-2">落入行星：</div>
                                  <div className="flex flex-wrap gap-2">
                                    {arena.planetsIn.map((planet: string, i: number) => (
                                      <span key={i} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFB6D9] to-[#FFC8E3] text-[#1A1430] text-xs font-semibold">
                                        {planet}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-[#E8D5F2] mb-3">
                                  落入行星：<span className="text-[#C7B8EA]">无（看宫主星表现）</span>
                                </div>
                              )}
                              <div className="text-xs text-[#C7B8EA] mb-2 mt-3">受到相位：</div>
                              <div className="space-y-2">
                                {arena.aspects.map((aspect: any, i: number) => (
                                  <div 
                                    key={i}
                                    className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                                      aspect.type === 'benefic' 
                                        ? 'bg-[rgba(76,175,80,0.15)] border-l-2 border-[#4CAF50]'
                                        : 'bg-[rgba(255,152,0,0.15)] border-l-2 border-[#FF9800]'
                                    }`}
                                  >
                                    <span className="text-xl">{aspect.icon}</span>
                                    <span className="text-[#E8D5F2]">{aspect.description}</span>
                                  </div>
                                ))}
                              </div>
                              {arena.specialConfig && (
                                <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-[#FFB6D9]/20 to-[#C7B8EA]/20 border border-[#FFB6D9]/30">
                                  <div className="text-xs text-[#C7B8EA] mb-1">✨ 特殊配置</div>
                                  <div className="text-sm font-semibold text-white">{arena.specialConfig}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 专业解读 */}
                        {arena.professionalAnalysis && (
                          <div className="rounded-xl p-5 bg-[rgba(26,20,48,0.4)] border border-[rgba(255,182,217,0.15)]">
                            <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                              ✨ 专业解读
                            </h4>
                            <p className="text-[#E8D5F2] leading-relaxed mb-4 text-sm">
                              {arena.professionalAnalysis}
                            </p>
                            
                            {arena.judgment && (
                              <div className={`p-4 rounded-lg border-l-4 mb-4 ${
                                arena.judgment.type === 'favorable' ? 'bg-[rgba(76,175,80,0.1)] border-[#4CAF50]' :
                                arena.judgment.type === 'challenging' ? 'bg-[rgba(255,152,0,0.1)] border-[#FF9800]' :
                                'bg-[rgba(33,150,243,0.1)] border-[#2196F3]'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">{arena.judgment.icon}</span>
                                  <div>
                                    <strong className="text-white">吉凶判断：</strong>
                                    <span className="text-[#FFB6D9] ml-2">{arena.judgment.label}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-[#E8D5F2] mt-2">{arena.judgment.reason}</p>
                              </div>
                            )}

                            {/* 优势与挑战 */}
                            {arena.advantages && arena.challenges && (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)]">
                                  <h5 className="text-sm font-semibold text-white mb-2">✅ 优势领域</h5>
                                  <ul className="space-y-1.5">
                                    {arena.advantages.map((adv: string, i: number) => (
                                      <li key={i} className="text-xs text-[#E8D5F2] pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-[#4CAF50]">
                                        {adv}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-4 rounded-lg bg-[rgba(255,152,0,0.1)] border border-[rgba(255,152,0,0.3)]">
                                  <h5 className="text-sm font-semibold text-white mb-2">⚠️ 需要注意</h5>
                                  <ul className="space-y-1.5">
                                    {arena.challenges.map((ch: string, i: number) => (
                                      <li key={i} className="text-xs text-[#E8D5F2] pl-4 relative before:content-['!'] before:absolute before:left-0 before:text-[#FF9800]">
                                        {ch}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 关键时期 */}
                        {arena.keyPeriods && arena.keyPeriods.length > 0 && (
                          <div className="rounded-xl p-5 bg-[rgba(26,20,48,0.4)] border border-[rgba(255,182,217,0.15)]">
                            <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                              📈 关键时期
                            </h4>
                            <div className="space-y-3">
                              {arena.keyPeriods.map((period: any, i: number) => (
                                <div key={i} className="p-3 rounded-lg bg-[rgba(255,182,217,0.08)] border-l-3 border-[#FFB6D9]">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-[#FFB6D9]">{period.name}</span>
                                    <span className="text-xs text-[#C7B8EA]">{period.years}</span>
                                  </div>
                                  <p className="text-xs text-[#E8D5F2]">{period.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 行动建议 */}
                        {arena.actionAdvice && (
                          <div className="rounded-xl p-5 bg-[rgba(26,20,48,0.4)] border border-[rgba(255,182,217,0.15)]">
                            <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                              🎯 行动建议
                            </h4>
                            <div className="space-y-4">
                              {arena.actionAdvice.leverage && (
                                <div>
                                  <h5 className="text-sm text-white mb-2">✓ 发挥优势</h5>
                                  <ul className="space-y-1.5">
                                    {arena.actionAdvice.leverage.map((item: string, i: number) => (
                                      <li key={i} className="text-xs text-[#E8D5F2] pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-[#FFB6D9]">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {arena.actionAdvice.cope && (
                                <div>
                                  <h5 className="text-sm text-white mb-2">✓ 应对挑战</h5>
                                  <ul className="space-y-1.5">
                                    {arena.actionAdvice.cope.map((item: string, i: number) => (
                                      <li key={i} className="text-xs text-[#E8D5F2] pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-[#FFB6D9]">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Vedic Remedies */}
                        {arena.remedies && (
                          <div className="rounded-xl p-5 bg-gradient-to-br from-[#FFB6D9]/10 to-[#C7B8EA]/10 border border-[#FFB6D9]/30">
                            <h4 className="text-[#FFB6D9] font-semibold mb-3 flex items-center gap-2">
                              🔮 补救措施 (Vedic Remedies)
                            </h4>
                            <div className="grid md:grid-cols-3 gap-3">
                              {arena.remedies.gemstone && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(26,20,48,0.4)]">
                                  <span className="text-2xl">💎</span>
                                  <div>
                                    <div className="text-xs text-[#C7B8EA]">宝石</div>
                                    <div className="text-sm text-white font-semibold">{arena.remedies.gemstone}</div>
                                  </div>
                                </div>
                              )}
                              {arena.remedies.day && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(26,20,48,0.4)]">
                                  <span className="text-2xl">📅</span>
                                  <div>
                                    <div className="text-xs text-[#C7B8EA]">吉日</div>
                                    <div className="text-sm text-white font-semibold">{arena.remedies.day}</div>
                                  </div>
                                </div>
                              )}
                              {arena.remedies.mantra && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(26,20,48,0.4)] md:col-span-3">
                                  <span className="text-2xl">🕉️</span>
                                  <div className="flex-1">
                                    <div className="text-xs text-[#C7B8EA] mb-1">咒语</div>
                                    <code className="text-sm text-[#FFB6D9] font-mono">{arena.remedies.mantra}</code>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // 简化版宫位（没有完整数据）
                      <div className="text-center py-8">
                        <p className="text-[#E8D5F2] mb-4">
                          {arena.sign && arena.lord ? (
                            <>守护星座：{arena.sign} • 宫主星：{arena.lord}</>
                          ) : (
                            '此宫位的详细专业分析正在完善中'
                          )}
                        </p>
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                          <p className="text-sm text-purple-200 mb-3">
                            如需完整的12宫位深度解读，请升级至专业版报告
                          </p>
                          <Button
                            onClick={() => router.push('/pricing')}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all text-sm px-4 py-2"
                          >
                            <FiStar className="mr-1" />
                            立即升级
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.section>

          */}
          {/* Module 3: Dasha Timeline - 你的生命季节 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-3 drop-shadow-lg flex items-center justify-center gap-2">
                <span className="text-3xl">⏳</span>
                你的生命季节：人生大运
                <span className="text-sm text-purple-300 font-normal">(Life Seasons: Dasha System)</span>
              </h2>
              <p className="text-purple-200 drop-shadow-md">
                理解你人生的宏观节奏，何时播种，何时收获
              </p>
            </div>

            {/* Timeline Visualization */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-purple-300">1995 (出生)</div>
                <div className="text-sm text-white font-semibold">当前 ({currentYear}，{currentAge}岁)</div>
                <div className="text-sm text-purple-300">2048</div>
              </div>

              {/* Timeline bars */}
              <div className="space-y-2 mb-6">
                {dashaTimeline.map((period, idx) => {
                  const totalYears = period.end - period.start;
                  const percentage = (totalYears / (2048 - 1995)) * 100;
                  
                  return (
            <motion.div
                      key={idx}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-10 rounded-lg flex items-center px-4 text-white text-sm font-medium relative overflow-hidden"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: period.color,
                            minWidth: '120px'
                          }}
                        >
                          <div className="relative z-10 flex items-center gap-2">
                            <span>{period.planet}</span>
                            {period.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-white/30 text-xs">当前</span>
                            )}
                          </div>
                          {period.isCurrent && (
                            <motion.div
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-white/10"
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {period.start}-{period.end}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Current position marker */}
              <div className="relative h-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-0 w-1 h-6 bg-white rounded-full"
                  style={{ left: `${((currentYear - 1995) / (2048 - 1995)) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">
                    📍 你在这里
              </div>
            </motion.div>
              </div>
            </div>

            {/* Current Season Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🌸</div>
                <div className="flex-1">
                  <div className="text-xs text-pink-300 mb-2 uppercase tracking-wide">Current Season</div>
                  <h3 className="font-serif text-2xl text-white mb-2">
                    {currentDasha.major?.planet || "—"} 大运期
                  </h3>
                  <div className="text-sm text-purple-300 mb-4">{currentDasha.major?.period || "—"}</div>
                  
                  <p className="text-white mb-6 leading-relaxed">{currentDasha.major?.theme || "—"}</p>

                  <div className="p-4 rounded-xl bg-white/5 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-purple-400" />
                      <div className="text-sm text-purple-300 font-semibold">当前焦点 (次运期)</div>
                    </div>
                    <p className="text-sm text-gray-300">
                      在 <span className="text-white font-medium">{currentDasha.minor?.planet || "—"}</span> 的次运期 ({currentDasha.minor?.period || "—"})，
                      {currentDasha.minor?.focus || "—"}。
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCompass className="text-purple-300" />
                      <div className="text-sm text-purple-300 font-semibold">本季策略</div>
                    </div>
                    <p className="text-sm text-white leading-relaxed">
                      {currentDasha.strategy || "—"}
                    </p>
                  </div>
                </div>
              </div>
        </div>
      </motion.section>

          {/* Module 5: Cosmic Toolkit - 你的宇宙工具箱 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-3 drop-shadow-lg flex items-center justify-center gap-2">
                <span className="text-3xl">🧰</span>
                你的宇宙工具箱
                <span className="text-sm text-purple-300 font-normal">(Your Cosmic Toolkit)</span>
              </h2>
              <p className="text-purple-200 drop-shadow-md">
                基于你的星盘，提供个性化的能量提升建议
          </p>
        </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Colors & Gems */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <FiGift className="text-yellow-400 text-xl" />
                  <h3 className="font-serif text-xl text-white">幸运色与宝石</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-yellow-300 mb-2">💛 Power Colors</div>
                    <div className="flex gap-2">
                      {cosmicToolkit.colors && Array.isArray(cosmicToolkit.colors) ? cosmicToolkit.colors.map : [].map((color, idx) => (
                        <div key={idx} className="px-3 py-2 rounded-lg bg-white/10 text-sm text-white">
                          {color}
          </div>
        ))}
                    </div>
                    <p className="text-xs text-gray-300 mt-2">
                      穿戴这些颜色能增强你的 {cosmicToolkit.gemPlanet} 能量
                    </p>
                  </div>

            <div>
                    <div className="text-xs text-yellow-300 mb-2">💎 推荐宝石</div>
                    <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30">
                      <div className="font-semibold text-white mb-1">{cosmicToolkit.gem}</div>
                      <p className="text-xs text-gray-300">
                        与你最强吉星 [{cosmicToolkit.gemPlanet}] 相关，能增强智慧和机遇
                      </p>
                    </div>
                  </div>
            </div>
              </div>

              {/* Mantra & Activities */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <FiSun className="text-purple-400 text-xl" />
                  <h3 className="font-serif text-xl text-white">个人咒语与活动</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-purple-300 mb-2">🕉️ Personal Mantra</div>
                    <div className="px-4 py-3 rounded-lg bg-white/10">
                      <div className="font-mono text-white text-center mb-1">{cosmicToolkit.mantra}</div>
                      <p className="text-xs text-gray-300 text-center">
                        持诵此咒语，有助于平复情绪、增强内在力量
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-purple-300 mb-2">✨ 推荐活动 (充能方式)</div>
                    <ul className="space-y-2">
                      {cosmicToolkit.activities && Array.isArray(cosmicToolkit.activities) ? cosmicToolkit.activities.map : [].map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-purple-400 mt-0.5">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 p-3 rounded-lg bg-white/5 text-center">
                      <div className="text-xs text-purple-300 mb-1">幸运日</div>
                      <div className="text-sm text-white font-semibold">{cosmicToolkit.luckyDay}</div>
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-white/5 text-center">
                      <div className="text-xs text-purple-300 mb-1">主元素</div>
                      <div className="text-sm text-white font-semibold">{cosmicToolkit.element}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </motion.section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <div className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#FFE9F1] via-[#FFD8E4] to-[#FFB6C1] overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-10">💕</div>
              <div className="absolute bottom-0 left-0 text-5xl opacity-10">✨</div>

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="text-3xl mb-3">💖</div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#2C2A32] mb-3">
                  想知道谁是你的灵魂伴侣？
                </h3>
                <p className="text-[#5C5364] mb-6 leading-relaxed">
                  基于你的星盘，我们还能为你匹配完美的灵魂伴侣，
                  揭示你们的宿命连接与爱情蓝图。
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/report/analysis')}
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
                  >
                    <FiStar className="text-xl" />
                    生成详细分析报告
                    <FiChevronRight />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/report/spouse')}
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-[#FF69B4] hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
                  >
                    <FiHeart className="text-xl" />
                    查看灵魂伴侣报告
                    <FiChevronRight />
                  </motion.button>
                </div>

                <p className="text-sm text-[#8B7794]">
                  ✨ 已有 10,000+ 人找到真爱
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Helper Components
function BigCard({ title, highlight, color, line, emoji }: any) {
  return (
    <div className="rounded-2xl p-6 border" style={{ background: color, borderColor: '#E8DDEB' }}>
      <div className="text-xs text-[#7A6F82] mb-1">Your essence</div>
      <div className="font-serif text-lg text-[#2C2A32] mb-1">{title}</div>
      <div className="text-sm text-[#6E6277] mb-2">{highlight}</div>
      <p className="text-sm text-[#5C5364]">{line}</p>
      <div className="text-2xl mt-3">{emoji}</div>
    </div>
  );
}

function FlowerOfLife({ selectedHouse, onSelectHouse }: any) {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const radius = 120;
  const petalRadius = 36;
  const centerX = 120;
  const centerY = 120;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-[260px] h-[260px]">
        <defs>
          <radialGradient id="petal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F1D7E3" stopOpacity="1" />
          </radialGradient>
        </defs>

        {houses.map((house) => {
          const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isSelected = selectedHouse === house;

          return (
            <g
              key={house}
              onClick={() => onSelectHouse(house)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r={petalRadius}
                fill={isSelected ? '#A078A6' : 'url(#petal)'}
                opacity={isSelected ? 1 : 0.9}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="12"
                fill={isSelected ? '#FFFFFF' : '#6E6277'}
              >
                {house}
              </text>
            </g>
          );
        })}

        <circle cx={centerX} cy={centerY} r="30" fill="#FFFFFF" stroke="#E8DDEB" />
      </svg>
    </div>
  );
}
