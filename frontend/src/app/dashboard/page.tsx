'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { astrologyAPI, BirthInfo, ChartData, PlanetPosition } from '@/services/api';
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
const coreTrinity = {
  lagna: { sign: 'Leo', emoji: '🦁', mask: '你给世界的第一印象是...', desc: '自信、温暖、充满魅力的领导者形象' },
  moon: { sign: 'Pisces', emoji: '🌙', need: '在内心深处，你真正需要的是...', desc: '情感的深度连接、梦想与灵性的滋养' },
  sun: { sign: 'Aries', emoji: '☀️', fuel: '驱动你生命前行的燃料是...', desc: '勇气、独立与开拓新事物的冲动' }
};

// Life Energy Data (Fallback)
const fallbackLifeEnergy = {
  strongest: [
    { planet: 'Jupiter', emoji: '✨', power: '智慧与扩张力', score: 95, desc: '你天生拥有强大的学习能力和正向影响力' },
    { planet: 'Venus', emoji: '💕', power: '美感与关系力', score: 88, desc: '你能轻松创造和谐的人际关系与美好环境' },
    { planet: 'Mercury', emoji: '🎯', power: '沟通与商业才能', score: 82, desc: '你的表达能力和商业头脑超越大多数人' }
  ],
  weakest: { planet: 'Mars', emoji: '⚡', lesson: '行动力与勇气', score: 45, desc: '学会更果断地行动，培养面对冲突的勇气' }
};

// 12 Life Arenas - Complete Professional Astrology Data
const lifeArenas = [
  {
    house: 1,
    name: '自我与生命力',
    nameEn: 'Identity & Vitality',
    sanskrit: 'Lagna Bhava',
    emoji: '🌅',
    rating: 4,
    sign: 'Gemini ♊',
    lord: 'Mercury ☿',
    lordPlacement: '位于第5宫 (创意宫)',
    lordStrength: 'Strong (7.2/10 Shadbala)',
    planetsIn: [],
    aspects: [
      { type: 'benefic', icon: '✨', description: 'Jupiter 5th aspect (吉相位 - 智慧祝福)' },
      { type: 'malefic', icon: '⚡', description: 'Saturn 7th aspect (挑战相位 - 需要纪律)' }
    ],
    specialConfig: 'Mercury与Venus、Jupiter联合形成Rajayoga',
    professionalAnalysis: '你的上升点落在Gemini，由Mercury守护。Mercury强势地位于第5宫并形成罕见的"三星Rajayoga"（与Venus、Jupiter合相）。这意味着你的个性天生聪慧、好奇心强、适应力极佳。你的生命力通过"智力创造"得到最强表达，给人的第一印象是：机智、健谈、年轻活力。',
    judgment: {
      type: 'favorable',
      icon: '✅',
      label: '极为有利',
      reason: 'Mercury作为Lagna Lord位于三方宫（5th），且得到吉星加持，这是"智慧型人格"的典型配置'
    },
    advantages: [
      '学习能力强，理解速度快',
      '善于沟通，文字/口才出众',
      '多才多艺，兴趣广泛'
    ],
    challenges: [
      '可能过于理性，忽视情感深度',
      '容易分散注意力，难以深耕一事',
      '需要平衡"广度"与"深度"'
    ],
    keyPeriods: [
      { name: 'Mercury Mahadasha', years: '2012-2029年', description: '这是你的"黄金成长期"，智力巅峰' },
      { name: '5th House激活期', years: '持续', description: '创意项目、学习、恋爱都会顺利' }
    ],
    actionAdvice: {
      leverage: ['多写作、演讲、教学，将智慧变现', '发展多元技能组合'],
      cope: ['定期深度专注训练，避免浅尝辄止', '为重要项目设定专注时间块']
    },
    remedies: {
      gemstone: 'Emerald (祖母绿)',
      day: '周三 (Mercury日)',
      mantra: 'Om Budhaya Namaha'
    }
  },
  {
    house: 2,
    name: '财富与价值观',
    nameEn: 'Wealth & Values',
    sanskrit: 'Dhana Bhava',
    emoji: '💰',
    rating: 3,
    sign: 'Cancer ♋',
    lord: 'Moon ☽',
    lordPlacement: '位于第8宫 (转化宫)',
    lordStrength: 'Weak (3.8/10 Shadbala)',
    planetsIn: [],
    aspects: [
      { type: 'malefic', icon: '⚔️', description: 'Mars 4th aspect (挑战相位 - 支出增加)' }
    ],
    specialConfig: '2nd Lord in 8th house - 财富波动配置',
    professionalAnalysis: '你的财富宫由Cancer守护，Moon作为宫主落入第8宫（神秘与转化之宫）。这是一个"不稳定但有深度潜力"的配置。Moon在8th意味着你的财富来源可能与"隐秘、研究、咨询"相关，收入会有起伏，情绪影响财务决策，可能通过"遗产、保险、投资"获得财富。',
    judgment: {
      type: 'challenging',
      icon: '⚠️',
      label: '中性偏挑战',
      reason: '2nd Lord in 8th是财务波动的经典配置，但8th house也代表"意外之财"和"深度转化"'
    },
    advantages: [
      '擅长理财，对隐藏价值敏感',
      '可能通过心理学、占星等"神秘学"赚钱',
      '投资眼光独到（尤其股票、加密货币）'
    ],
    challenges: [
      '避免情绪化消费',
      '收入不稳定，需要储蓄缓冲',
      '与家人的金钱观可能冲突'
    ],
    keyPeriods: [
      { name: 'Moon Mahadasha', years: '1995-2005年', description: '这段时期财务不稳定' },
      { name: 'Rahu/Ketu transit', years: '每18个月', description: '财务转折点' }
    ],
    actionAdvice: {
      leverage: ['从事"转化、治愈、研究"相关工作', '投资你能深度理解的领域'],
      cope: ['建立自动储蓄系统，对抗情绪化支出', '学习财务规划，不依赖直觉']
    },
    remedies: {
      gemstone: 'Pearl (珍珠)',
      day: '周一 (Moon日)',
      mantra: 'Om Chandraya Namaha'
    }
  },
  {
    house: 7,
    name: '婚姻与伴侣关系',
    nameEn: 'Marriage & Partnership',
    sanskrit: 'Kalatra Bhava',
    emoji: '💍',
    rating: 5,
    sign: 'Sagittarius ♐',
    lord: 'Jupiter ♃',
    lordPlacement: '位于第5宫 (创意宫)',
    lordStrength: 'Strong (6.8/10 Shadbala)',
    planetsIn: [],
    aspects: [
      { type: 'benefic', icon: '💕', description: 'Venus aspect (自然婚姻星祝福)' },
      { type: 'benefic', icon: '✨', description: 'Jupiter自身回望 (宫主星守护)' }
    ],
    specialConfig: 'Jupiter Mahapurusha Yoga + 7th Lord与Venus联合 = 理想婚姻组合',
    professionalAnalysis: '你的7th house由Jupiter守护，Jupiter位于5th house与Venus合相。这是"完美婚姻配置"的教科书案例。Jupiter (智慧、扩张、高贵) + Venus (爱、美、艺术) 的组合意味着：你的配偶将是"有智慧、有品位、重视精神成长"的人；你们的关系会建立在"共同的价值观和创造力"之上；婚姻会带给你"幸福感和社会地位提升"。',
    judgment: {
      type: 'favorable',
      icon: '✅',
      label: '极为有利（顶级配置）',
      reason: 'Benefic 7th lord + Venus conjunction = 爱情美满。这是"幸福婚姻"的黄金指标'
    },
    advantages: [
      '吸引高质量伴侣（有智慧、有品位）',
      '婚姻关系和谐，互相成就',
      '配偶可能带来财富或社会资源',
      '在婚姻中感到"被滋养"和"成长"'
    ],
    challenges: [
      'Jupiter可能让你对伴侣期望过高（理想主义）',
      '需要平衡"精神契合"与"现实磨合"',
      '避免因对方"不够完美"而错过良缘'
    ],
    keyPeriods: [
      { name: 'Jupiter Mahadasha', years: '2029-2045年', description: '婚姻黄金期，最容易遇到真命天子/天女' },
      { name: 'Venus Antardasha', years: '2032-2035年', description: '这3年是"结婚高峰期"' }
    ],
    actionAdvice: {
      leverage: [
        '参加"文化活动、学习课程、海外旅行"',
        '在"大学、图书馆、艺术展"等高雅场所社交',
        '通过"导师、长辈介绍"（Jupiter代表导师）'
      ],
      cope: [
        '保持精神成长，与伴侣一起学习',
        '重视共同的价值观和信念',
        '定期创造"浪漫与智慧并存"的约会'
      ]
    },
    remedies: {
      gemstone: 'Yellow Sapphire (黄蓝宝石) + Diamond (钻石)',
      day: '周四 (Jupiter日) & 周五 (Venus日)',
      mantra: 'Om Gurave Namaha | Om Shukraya Namaha'
    }
  },
  // 其他宫位使用简化版数据
  { house: 3, name: '沟通与勇气', nameEn: 'Communication & Courage', sanskrit: 'Sahaja Bhava', emoji: '💬', rating: 3, sign: 'Leo ♌', lord: 'Sun ☉', lordPlacement: '第3宫', lordStrength: 'Medium' },
  { house: 4, name: '家庭与内心', nameEn: 'Home & Heart', sanskrit: 'Sukha Bhava', emoji: '🏠', rating: 4, sign: 'Virgo ♍', lord: 'Mercury ☿', lordPlacement: '第5宫', lordStrength: 'Strong' },
  { house: 5, name: '创造力与子女', nameEn: 'Creativity & Children', sanskrit: 'Putra Bhava', emoji: '🎨', rating: 5, sign: 'Libra ♎', lord: 'Venus ♀', lordPlacement: '第5宫', lordStrength: 'Excellent' },
  { house: 6, name: '健康与竞争', nameEn: 'Health & Competition', sanskrit: 'Ripu Bhava', emoji: '⚕️', rating: 3, sign: 'Scorpio ♏', lord: 'Mars ♂', lordPlacement: '第6宫', lordStrength: 'Medium' },
  { house: 8, name: '转化与神秘', nameEn: 'Transformation & Mystery', sanskrit: 'Randhra Bhava', emoji: '🔮', rating: 3, sign: 'Capricorn ♑', lord: 'Saturn ♄', lordPlacement: '第8宫', lordStrength: 'Strong' },
  { house: 9, name: '智慧与运气', nameEn: 'Wisdom & Fortune', sanskrit: 'Dharma Bhava', emoji: '📚', rating: 5, sign: 'Aquarius ♒', lord: 'Saturn ♄', lordPlacement: '第8宫', lordStrength: 'Strong' },
  { house: 10, name: '事业与名望', nameEn: 'Career & Fame', sanskrit: 'Karma Bhava', emoji: '🎯', rating: 4, sign: 'Pisces ♓', lord: 'Jupiter ♃', lordPlacement: '第5宫', lordStrength: 'Strong' },
  { house: 11, name: '收获与社交', nameEn: 'Gains & Network', sanskrit: 'Labha Bhava', emoji: '🌟', rating: 4, sign: 'Aries ♈', lord: 'Mars ♂', lordPlacement: '第6宫', lordStrength: 'Medium' },
  { house: 12, name: '解脱与灵性', nameEn: 'Liberation & Spirituality', sanskrit: 'Vyaya Bhava', emoji: '🙏', rating: 3, sign: 'Taurus ♉', lord: 'Venus ♀', lordPlacement: '第5宫', lordStrength: 'Strong' }
];

const planetDisplayOrder = [
  'Ascendant',
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
  'Uranus',
  'Neptune',
  'Pluto'
];

const formatPlanetDegrees = (planet: PlanetPosition) => {
  const degree = Number.isFinite(planet.degree) ? planet.degree : 0;
  const minute = Number.isFinite(planet.minute) ? planet.minute : 0;
  const second = Number.isFinite(planet.second) ? planet.second : 0;
  return `${degree}° ${minute}' ${second}"`;
};

const formatNakshatra = (nakshatra?: PlanetPosition['nakshatra'] | null) => {
  if (!nakshatra || !nakshatra.name) {
    return '—';
  }

  const pada = nakshatra.pada ? ` • 第${nakshatra.pada}步` : '';
  const lord = nakshatra.vimsottariLord ? ` • 守护星 ${nakshatra.vimsottariLord}` : '';
  return `${nakshatra.name}${pada}${lord}`;
};

const retrogradeLabel = (retrograde: boolean) => (retrograde ? '逆行' : '顺行');

// Dasha Timeline Data (Fallback)
const fallbackDashaTimeline = [
  { planet: 'Mercury', start: 1995, end: 2012, color: '#10B981', theme: '沟通与学习' },
  { planet: 'Venus', start: 2012, end: 2032, color: '#FF69B4', theme: '爱与创造', isCurrent: true },
  { planet: 'Sun', start: 2032, end: 2038, color: '#F59E0B', theme: '权威与成就' },
  { planet: 'Moon', start: 2038, end: 2048, color: '#8B5CF6', theme: '情感与直觉' },
];

const fallbackCurrentDasha = {
  major: { planet: 'Venus', period: '2012-2032', theme: '这是一个关于爱、创造力与享受的生命季节' },
  minor: { planet: 'Mercury', period: '2023-2025', focus: '焦点转向学习、沟通与商业' },
  strategy: '尽情投入艺术创作、美化生活环境，并积极拓展社交圈。这是播种"美"与"关系"的最佳时机。'
};

// Cosmic Toolkit (Fallback)
const fallbackCosmicToolkit = {
  colors: ['黄色', '金色', '橙色'],
  gem: '黄宝石',
  gemPlanet: 'Jupiter',
  mantra: 'Om Brihaspat aye Namaha',
  activities: ['与家人共度时光', '装饰家居环境', '阅读哲学或灵性书籍'],
  luckyDay: '周四',
  element: '火'
};

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

        // 检查缓存数据是否匹配当前生日信息
        const cachedChartData = window.localStorage.getItem('latestChartData');
        let hasCachedChart = false;
        let cachedBirthInfoMatch = false;
        
        if (cachedChartData) {
          try {
            const parsedChart: ChartData = JSON.parse(cachedChartData);
            // 检查缓存的星盘数据是否匹配当前生日信息
            const cachedBirthInfo = parsedChart.birthInfo;
            if (cachedBirthInfo && 
                cachedBirthInfo.date === parsedBirthInfo.date &&
                cachedBirthInfo.time === parsedBirthInfo.time &&
                cachedBirthInfo.city === parsedBirthInfo.city) {
              cachedBirthInfoMatch = true;
              setChartData(parsedChart);
              hasCachedChart = true;
            } else {
              // 生日信息不匹配，清除旧缓存
              console.log('Birth info changed, clearing old cache');
              window.localStorage.removeItem('latestChartData');
            }
          } catch (cacheErr) {
            console.warn('Failed to parse cached chart data:', cacheErr);
            window.localStorage.removeItem('latestChartData');
          }
        }

        // 总是调用API获取最新数据（如果缓存不匹配或不存在）
        try {
          const response = await astrologyAPI.calculateChart(parsedBirthInfo);
          if (response.success && response.data) {
            console.log('API response received:', {
              hasAnalysis: !!response.data.analysis,
              hasLifeEnergy: !!response.data.analysis?.lifeEnergy,
              hasDashaData: !!response.data.analysis?.dashaData,
              hasHouseAnalyses: !!response.data.analysis?.houseAnalyses,
              hasCosmicToolkit: !!response.data.analysis?.cosmicToolkit,
            });
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

  // 使用API分析数据或fallback数据
  const displayLifeEnergy = useMemo(() => {
    return chartData?.analysis?.lifeEnergy || fallbackLifeEnergy;
  }, [chartData]);

  const displayDashaTimeline = useMemo(() => {
    return chartData?.analysis?.dashaData?.timeline || fallbackDashaTimeline;
  }, [chartData]);

  const displayCurrentDasha = useMemo(() => {
    return chartData?.analysis?.dashaData?.currentDasha || fallbackCurrentDasha;
  }, [chartData]);

  const displayCosmicToolkit = useMemo(() => {
    return chartData?.analysis?.cosmicToolkit || fallbackCosmicToolkit;
  }, [chartData]);

  const displayCoreTrinity = useMemo(() => {
    // 优先使用API分析数据
    if (chartData?.analysis?.coreTrinity) {
      return chartData.analysis.coreTrinity;
    }
    // 如果API没有返回coreTrinity，但返回了基础星座信息，使用fallback但更新星座名称
    if (chartData?.risingSign || chartData?.moonSign || chartData?.sunSign) {
      return {
        lagna: {
          ...coreTrinity.lagna,
          sign: chartData?.risingSign || coreTrinity.lagna.sign,
        },
        moon: {
          ...coreTrinity.moon,
          sign: chartData?.moonSign || coreTrinity.moon.sign,
        },
        sun: {
          ...coreTrinity.sun,
          sign: chartData?.sunSign || coreTrinity.sun.sign,
        },
      };
    }
    // 完全使用fallback数据
    return coreTrinity;
  }, [chartData]);

  const displayLifeArenas = useMemo(() => {
    if (!chartData) {
      return lifeArenas;
    }

    // 优先使用API分析数据
    if (chartData.analysis?.houseAnalyses && chartData.analysis.houseAnalyses.length > 0) {
      return chartData.analysis.houseAnalyses.map((analysis) => {
        const house = chartData.houses.find(h => h.number === analysis.house);
        const planetsIn = house?.planets.map(
          (planet) => `${planet.name}${planet.signSymbol ? ` ${planet.signSymbol}` : ''}`
        ) || [];
        
        return {
          ...analysis,
          planetsIn: planetsIn.length > 0 ? planetsIn : [],
          aspects: [], // API分析中暂不包含相位信息
        };
      });
    }

    // 否则使用基础数据 + 写死的分析
    return chartData.houses.map((house) => {
      const fallback = lifeArenas.find((arena) => arena.house === house.number);
      const planetsIn = house.planets.map(
        (planet) => `${planet.name}${planet.signSymbol ? ` ${planet.signSymbol}` : ''}`
      );

      return {
        ...fallback,
        house: house.number,
        name: house.name || fallback?.name || `第${house.number}宫`,
        nameEn: house.nameEn || fallback?.nameEn || '',
        sanskrit: house.sanskrit || fallback?.sanskrit || '',
        emoji: fallback?.emoji || '🏠',
        rating: fallback?.rating ?? 3,
        sign: house.signSymbol ? `${house.sign} ${house.signSymbol}` : house.sign,
        lord: house.lord || fallback?.lord || '未知',
        lordPlacement: house.lordPlacement || fallback?.lordPlacement || '未知',
        lordStrength: house.lordStrength || fallback?.lordStrength || '未知',
        planetsIn: planetsIn.length > 0 ? planetsIn : fallback?.planetsIn || [],
        aspects: fallback?.aspects || [],
      };
    });
  }, [chartData]);

  const planetInsights = useMemo(() => {
    if (!chartData?.planets || chartData.planets.length === 0) {
      return [];
    }

    const orderMap = new Map<string, number>(
      planetDisplayOrder.map((name, index) => [name, index])
    );

    return [...chartData.planets]
      .sort((a, b) => {
        const orderA = orderMap.get(a.name) ?? 99;
        const orderB = orderMap.get(b.name) ?? 99;
        return orderA - orderB;
      })
      .map((planet) => {
        const signLabel = planet.signSymbol
          ? `${planet.zodiacSignName || planet.sign} ${planet.signSymbol}`
          : planet.zodiacSignName || planet.sign;
        const retrogradeBadgeClass = planet.retrograde
          ? 'bg-red-500/20 text-red-200 border border-red-500/30'
          : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30';

        return {
          ...planet,
          signLabel,
          formattedDegree: formatPlanetDegrees(planet),
          nakshatraText: formatNakshatra(planet.nakshatra),
          retrogradeText: retrogradeLabel(planet.retrograde),
          retrogradeBadgeClass,
          houseLabel: `第${planet.house}宫`
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
                  {displayLifeEnergy.strongest.map((item, idx) => (
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
                  <span className="text-5xl mb-4 block">{displayLifeEnergy.weakest.emoji}</span>
                  <div className="font-semibold text-xl text-white mb-2">{displayLifeEnergy.weakest.planet}</div>
                  <div className="text-sm text-amber-400 mb-3">{displayLifeEnergy.weakest.lesson}</div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{displayLifeEnergy.weakest.desc}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayLifeEnergy.weakest.score}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                      />
                    </div>
                    <div className="text-xs text-amber-300 font-mono">{displayLifeEnergy.weakest.score}/100</div>
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

          {/* Module 3: Planetary Insights - 行星能量总览 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-3 flex items-center justify-center gap-2">
                <span className="text-3xl">🪐</span>
                行星能量总览
                <span className="text-sm text-[#E8D5F2] font-normal">(Planets • Sign • Nakshatra)</span>
              </h2>
              <p className="text-[#E8D5F2]">
                每一颗行星都在述说你的生命主题，点击行星卡片，感受宇宙的低语
              </p>
            </div>

            {planetInsights.length > 0 ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                {planetInsights.map((planet, index) => (
                  <motion.div
                    key={`${planet.name}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="relative rounded-2xl p-6 bg-gradient-to-br from-[rgba(255,182,217,0.12)] via-[rgba(199,184,234,0.08)] to-[rgba(255,182,217,0.12)] border border-[rgba(255,182,217,0.25)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,182,217,0.25)] transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{planet.symbol || '🪐'}</span>
                        <div>
                          <div className="text-lg text-white font-semibold">{planet.name}</div>
                          {planet.localizedName && (
                            <div className="text-xs text-[#C7B8EA] mt-0.5">{planet.localizedName}</div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${planet.retrogradeBadgeClass}`}>
                        {planet.retrogradeText}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-[#E8D5F2]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#C7B8EA]">星座</span>
                        <span className="text-white font-semibold text-right">{planet.signLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C7B8EA]">宫位</span>
                        <span className="text-white text-right">{planet.houseLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C7B8EA]">度数</span>
                        <span className="text-white font-mono text-right">{planet.formattedDegree}</span>
                      </div>
                      {planet.zodiacSignLord && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#C7B8EA]">守护星</span>
                          <span className="text-white text-right">{planet.zodiacSignLord}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[#C7B8EA] block mb-1">星宿</span>
                        <span className="text-white text-sm leading-relaxed">{planet.nakshatraText}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-purple-500/40 bg-purple-500/5 py-12 text-center text-[#C7B8EA]">
                正在等待行星位置数据，请稍候片刻 ✨
              </div>
            )}
          </motion.section>

          {/* Module 4: Dasha Timeline - 你的生命季节 */}
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
                {displayDashaTimeline.map((period, idx) => {
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
                    {displayCurrentDasha.major.planet} 大运期
                  </h3>
                  <div className="text-sm text-purple-300 mb-4">{displayCurrentDasha.major.period}</div>
                  
                  <p className="text-white mb-6 leading-relaxed">{displayCurrentDasha.major.theme}</p>

                  <div className="p-4 rounded-xl bg-white/5 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-purple-400" />
                      <div className="text-sm text-purple-300 font-semibold">当前焦点 (次运期)</div>
                    </div>
                    <p className="text-sm text-gray-300">
                      在 <span className="text-white font-medium">{displayCurrentDasha.minor.planet}</span> 的次运期 ({displayCurrentDasha.minor.period})，
                      {displayCurrentDasha.minor.focus}。
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCompass className="text-purple-300" />
                      <div className="text-sm text-purple-300 font-semibold">本季策略</div>
                    </div>
                    <p className="text-sm text-white leading-relaxed">
                      {displayCurrentDasha.strategy}
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
                      {displayCosmicToolkit.colors.map((color, idx) => (
                        <div key={idx} className="px-3 py-2 rounded-lg bg-white/10 text-sm text-white">
                          {color}
          </div>
        ))}
                    </div>
                    <p className="text-xs text-gray-300 mt-2">
                      穿戴这些颜色能增强你的 {displayCosmicToolkit.gemPlanet} 能量
                    </p>
                  </div>

            <div>
                    <div className="text-xs text-yellow-300 mb-2">💎 推荐宝石</div>
                    <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30">
                      <div className="font-semibold text-white mb-1">{displayCosmicToolkit.gem}</div>
                      <p className="text-xs text-gray-300">
                        与你最强吉星 [{displayCosmicToolkit.gemPlanet}] 相关，能增强智慧和机遇
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
                      <div className="font-mono text-white text-center mb-1">{displayCosmicToolkit.mantra}</div>
                      <p className="text-xs text-gray-300 text-center">
                        持诵此咒语，有助于平复情绪、增强内在力量
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-purple-300 mb-2">✨ 推荐活动 (充能方式)</div>
                    <ul className="space-y-2">
                      {displayCosmicToolkit.activities.map((activity, idx) => (
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
                      <div className="text-sm text-white font-semibold">{displayCosmicToolkit.luckyDay}</div>
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-white/5 text-center">
                      <div className="text-xs text-purple-300 mb-1">主元素</div>
                      <div className="text-sm text-white font-semibold">{displayCosmicToolkit.element}</div>
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

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/report/spouse')}
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-[#FF69B4] hover:shadow-2xl transition-all duration-300 font-semibold text-lg mb-4"
                >
                  <FiHeart className="text-xl" />
                  查看灵魂伴侣报告
          <FiChevronRight />
                </motion.button>

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
