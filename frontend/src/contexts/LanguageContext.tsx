'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    'navigation.home': '首页',
    'navigation.dashboard': '仪表板',
    'navigation.pricing': '定价',
    'navigation.language': '语言',
    'homepage.title': '✨ 开启你的星盘之旅',
    'homepage.subtitle': '嘿姐妹! 告诉我你的出生信息, 让我为你揭开宇宙的秘密 💫',
    'homepage.cta': '开启我的星盘之旅',
    'birthInfo.title': '✨ 开启你的星盘之旅',
    'birthInfo.subtitle': '嘿姐妹! 告诉我你的出生信息, 让我为你揭开宇宙的秘密 💫',
    'birthInfo.form.name': '你的名字 (昵称也可以哦)',
    'birthInfo.form.date': '出生日期',
    'birthInfo.form.time': '出生时间 (越精确越好)',
    'birthInfo.form.city': '出生城市',
    'birthInfo.form.submit': '✨ 揭示我的命盘',
    'birthInfo.sampleData.title': '正在使用示例数据',
    'birthInfo.sampleData.description': '点击"输入我的信息"来替换为您的真实出生信息',
    'birthInfo.sampleData.button': '输入我的信息',
    'birthInfo.privacy.title': '你的隐私对我们很重要',
    'birthInfo.privacy.description': '我们只会用这些信息来生成你的专属星盘, 绝不会分享给任何第三方 💕',
    'dashboard.title': '你的星盘分析',
    'dashboard.loading': '正在分析你的星盘...',
    'dashboard.error': '分析失败，请重试',
    'dashboard.upgrade': '立即升级',
    'pricing.title': '选择你的套餐',
    'pricing.subtitle': '解锁更多占星洞察',
    'report.spouse.title': '🔮 印占婚姻命盘分析报告',
    'report.spouse.subtitle': '印占婚姻与灵魂伴侣分析报告',
    'report.spouse.generated': '生成于',
    'report.spouse.client': '咨询者',
    'report.spouse.welcome': '欢迎您，亲爱的求知者。在这浩瀚的星辰之海中，蕴藏着您生命蓝图的深刻密码。',
    'report.spouse.intro': '今日，我们将共同解读您的命盘（Kundali），专注于其中至关重要的篇章——婚姻与伴侣关系（Vivaha）。',
    'report.spouse.basicInfo': '📊 命盘基本信息',
    'report.spouse.risingSign': '上升星座',
    'report.spouse.moonSign': '月亮星座',
    'report.spouse.sunSign': '太阳星座',
    'report.spouse.part1': '💍 第一部分：个人婚姻潜力与模式分析',
    'report.spouse.part2': '👤 第二部分：未来伴侣的特质与来源',
    'report.spouse.part3': '⏰ 第三部分：婚姻时机的判断',
    'report.spouse.part4': '💕 第四部分：婚后生活质量与挑战',
    'report.spouse.part5': '🧘 第五部分：建议与补救措施',
    'report.spouse.conclusion': '🙏 结语：总结与祝福',
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
    'common.back': '返回',
    'common.next': '下一步',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'dashboard.welcome': '欢迎来到您的宇宙旅程',
    'dashboard.subtitle': '这是您的天体蓝图 ✨',
    'dashboard.coreTrinity': '您的核心三位一体',
    'dashboard.coreTrinityDesc': '定义您存在本质的三个宇宙签名',
    'dashboard.firstImpression': '您的第一印象',
    'dashboard.innerWorld': '您的内心世界',
    'dashboard.lifeForce': '您的生命力',
    'dashboard.risingSign': '上升星座',
    'dashboard.moonSign': '月亮星座',
    'dashboard.sunSign': '太阳星座',
    'dashboard.firstImpressionDesc': '你给世界的第一印象是...',
    'dashboard.innerWorldDesc': '在内心深处，你真正需要的是...',
    'dashboard.lifeForceDesc': '驱动你生命前行的燃料是...',
    'dashboard.lifeEnergy': '生命能量分析',
    'dashboard.strongestPowers': '您最强大的力量',
    'dashboard.weakestArea': '成长领域',
    'dashboard.lifeArenas': '12个生命领域',
    'dashboard.lifeArenasDesc': '所有生活领域的完整分析',
    'dashboard.planets': '行星位置',
    'dashboard.planetsDesc': '每个行星在您星盘中的位置',
    'dashboard.aspects': '行星相位',
    'dashboard.aspectsDesc': '行星之间如何相互作用',
    'dashboard.upgrade': '升级到专业版',
    'dashboard.upgradeDesc': '解锁详细分析和个性化洞察',
    'dashboard.birthInfo': '出生信息',
    'dashboard.birthDate': '出生日期',
    'dashboard.birthTime': '出生时间',
    'dashboard.birthCity': '出生城市'
  },
  en: {
    'navigation.home': 'Home',
    'navigation.dashboard': 'Dashboard',
    'navigation.pricing': 'Pricing',
    'navigation.language': 'Language',
    'homepage.title': '✨ Start Your Astrology Journey',
    'homepage.subtitle': 'Hey sister! Tell me your birth information, let me reveal the secrets of the universe for you 💫',
    'homepage.cta': 'Start My Astrology Journey',
    'birthInfo.title': '✨ Start Your Astrology Journey',
    'birthInfo.subtitle': 'Hey sister! Tell me your birth information, let me reveal the secrets of the universe for you 💫',
    'birthInfo.form.name': 'Your Name (nickname is fine too)',
    'birthInfo.form.date': 'Date of Birth',
    'birthInfo.form.time': 'Time of Birth (the more precise the better)',
    'birthInfo.form.city': 'City of Birth',
    'birthInfo.form.submit': '✨ Reveal My Horoscope',
    'birthInfo.sampleData.title': 'Using Sample Data',
    'birthInfo.sampleData.description': 'Click \'Enter My Information\' to replace with your real birth information',
    'birthInfo.sampleData.button': 'Enter My Information',
    'birthInfo.privacy.title': 'Your Privacy Matters to Us',
    'birthInfo.privacy.description': 'We will only use this information to generate your exclusive horoscope, and will never share it with any third party 💕',
    'dashboard.title': 'Your Birth Chart Analysis',
    'dashboard.loading': 'Analyzing your birth chart...',
    'dashboard.error': 'Analysis failed, please try again',
    'dashboard.upgrade': 'Upgrade Now',
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Unlock More Astrological Insights',
    'report.spouse.title': '🔮 Vedic Marriage & Soulmate Analysis Report',
    'report.spouse.subtitle': 'Vedic Marriage & Soulmate Analysis Report',
    'report.spouse.generated': 'Generated on',
    'report.spouse.client': 'Client',
    'report.spouse.welcome': 'Welcome, dear seeker. In this vast ocean of stars, lies the profound code of your life blueprint.',
    'report.spouse.intro': 'Today, we will jointly interpret your birth chart (Kundali), focusing on the most crucial chapter - marriage and partnership (Vivaha).',
    'report.spouse.basicInfo': '📊 Basic Chart Information',
    'report.spouse.risingSign': 'Rising Sign',
    'report.spouse.moonSign': 'Moon Sign',
    'report.spouse.sunSign': 'Sun Sign',
    'report.spouse.part1': '💍 Part 1: Personal Marriage Potential & Pattern Analysis',
    'report.spouse.part2': '👤 Part 2: Future Partner Traits & Origins',
    'report.spouse.part3': '⏰ Part 3: Marriage Timing Analysis',
    'report.spouse.part4': '💕 Part 4: Post-Marriage Quality & Challenges',
    'report.spouse.part5': '🧘 Part 5: Guidance & Remedies',
    'report.spouse.conclusion': '🙏 Conclusion: Summary & Blessings',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'dashboard.welcome': 'Welcome to Your Cosmic Journey',
    'dashboard.subtitle': 'this is your celestial blueprint ✨',
    'dashboard.coreTrinity': 'Your Core Trinity',
    'dashboard.coreTrinityDesc': 'Three cosmic signatures that define the essence of your being',
    'dashboard.firstImpression': 'YOUR FIRST IMPRESSION',
    'dashboard.innerWorld': 'YOUR INNER WORLD',
    'dashboard.lifeForce': 'YOUR LIFE FORCE',
    'dashboard.risingSign': 'Rising',
    'dashboard.moonSign': 'Moon',
    'dashboard.sunSign': 'Sun',
    'dashboard.firstImpressionDesc': 'Your first impression to the world is...',
    'dashboard.innerWorldDesc': 'Deep down, what you truly need is...',
    'dashboard.lifeForceDesc': 'The fuel that drives your life forward is...',
    'dashboard.lifeEnergy': 'Life Energy Analysis',
    'dashboard.strongestPowers': 'Your Strongest Powers',
    'dashboard.weakestArea': 'Area for Growth',
    'dashboard.lifeArenas': '12 Life Arenas',
    'dashboard.lifeArenasDesc': 'Complete analysis of all life areas',
    'dashboard.planets': 'Planetary Positions',
    'dashboard.planetsDesc': 'Where each planet resides in your chart',
    'dashboard.aspects': 'Planetary Aspects',
    'dashboard.aspectsDesc': 'How planets interact with each other',
    'dashboard.upgrade': 'Upgrade to Pro',
    'dashboard.upgradeDesc': 'Unlock detailed analysis and personalized insights',
    'dashboard.birthInfo': 'Birth Information',
    'dashboard.birthDate': 'Birth Date',
    'dashboard.birthTime': 'Birth Time',
    'dashboard.birthCity': 'Birth City'
  },
  hi: {
    'navigation.home': 'होम',
    'navigation.dashboard': 'डैशबोर्ड',
    'navigation.pricing': 'मूल्य निर्धारण',
    'navigation.language': 'भाषा',
    'homepage.title': '✨ अपनी ज्योतिष यात्रा शुरू करें',
    'homepage.subtitle': 'हे बहन! मुझे अपनी जन्म की जानकारी बताएं, मैं आपके लिए ब्रह्मांड के रहस्यों को उजागर करूंगा 💫',
    'homepage.cta': 'अपनी ज्योतिष यात्रा शुरू करें',
    'birthInfo.title': '✨ अपनी ज्योतिष यात्रा शुरू करें',
    'birthInfo.subtitle': 'हे बहन! मुझे अपनी जन्म की जानकारी बताएं, मैं आपके लिए ब्रह्मांड के रहस्यों को उजागर करूंगा 💫',
    'birthInfo.form.name': 'आपका नाम (उपनाम भी ठीक है)',
    'birthInfo.form.date': 'जन्म तिथि',
    'birthInfo.form.time': 'जन्म समय (जितना सटीक हो उतना बेहतर)',
    'birthInfo.form.city': 'जन्म स्थान',
    'birthInfo.form.submit': '✨ मेरी कुंडली प्रकट करें',
    'birthInfo.sampleData.title': 'नमूना डेटा का उपयोग कर रहे हैं',
    'birthInfo.sampleData.description': 'अपनी वास्तविक जन्म जानकारी के साथ बदलने के लिए \'मेरी जानकारी दर्ज करें\' पर क्लिक करें',
    'birthInfo.sampleData.button': 'मेरी जानकारी दर्ज करें',
    'birthInfo.privacy.title': 'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है',
    'birthInfo.privacy.description': 'हम इस जानकारी का उपयोग केवल आपकी विशेष कुंडली उत्पन्न करने के लिए करेंगे, इसे किसी तीसरे पक्ष के साथ कभी साझा नहीं करेंगे 💕',
    'dashboard.title': 'आपका जन्म कुंडली विश्लेषण',
    'dashboard.loading': 'आपकी जन्म कुंडली का विश्लेषण कर रहे हैं...',
    'dashboard.error': 'विश्लेषण विफल, कृपया पुनः प्रयास करें',
    'dashboard.upgrade': 'अभी अपग्रेड करें',
    'pricing.title': 'अपना प्लान चुनें',
    'pricing.subtitle': 'अधिक ज्योतिषीय अंतर्दृष्टि अनलॉक करें',
    'report.spouse.title': '🔮 वैदिक विवाह और आत्मा साथी विश्लेषण रिपोर्ट',
    'report.spouse.subtitle': 'Vedic Marriage & Soulmate Analysis Report',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हुआ',
    'common.retry': 'पुनः प्रयास करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'dashboard.welcome': 'अपनी ब्रह्मांडीय यात्रा में आपका स्वागत है',
    'dashboard.subtitle': 'यह आपका खगोलीय खाका है ✨',
    'dashboard.coreTrinity': 'आपकी मुख्य ट्रिनिटी',
    'dashboard.coreTrinityDesc': 'तीन ब्रह्मांडीय हस्ताक्षर जो आपके अस्तित्व के सार को परिभाषित करते हैं',
    'dashboard.firstImpression': 'आपकी पहली छाप',
    'dashboard.innerWorld': 'आपकी आंतरिक दुनिया',
    'dashboard.lifeForce': 'आपकी जीवन शक्ति',
    'dashboard.risingSign': 'उदय राशि',
    'dashboard.moonSign': 'चंद्र राशि',
    'dashboard.sunSign': 'सूर्य राशि',
    'dashboard.firstImpressionDesc': 'दुनिया को आपकी पहली छाप है...',
    'dashboard.innerWorldDesc': 'गहराई से, आपको वास्तव में जो चाहिए वह है...',
    'dashboard.lifeForceDesc': 'वह ईंधन जो आपके जीवन को आगे बढ़ाता है...',
    'dashboard.lifeEnergy': 'जीवन ऊर्जा विश्लेषण',
    'dashboard.strongestPowers': 'आपकी सबसे मजबूत शक्तियां',
    'dashboard.weakestArea': 'विकास क्षेत्र',
    'dashboard.lifeArenas': '12 जीवन क्षेत्र',
    'dashboard.lifeArenasDesc': 'सभी जीवन क्षेत्रों का पूर्ण विश्लेषण',
    'dashboard.planets': 'ग्रह स्थिति',
    'dashboard.planetsDesc': 'प्रत्येक ग्रह आपके चार्ट में कहां रहता है',
    'dashboard.aspects': 'ग्रह पहलू',
    'dashboard.aspectsDesc': 'ग्रह एक दूसरे के साथ कैसे बातचीत करते हैं',
    'dashboard.upgrade': 'प्रो में अपग्रेड करें',
    'dashboard.upgradeDesc': 'विस्तृत विश्लेषण और व्यक्तिगत अंतर्दृष्टि अनलॉक करें',
    'dashboard.birthInfo': 'जन्म जानकारी',
    'dashboard.birthDate': 'जन्म तिथि',
    'dashboard.birthTime': 'जन्म समय',
    'dashboard.birthCity': 'जन्म शहर'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['zh', 'en', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
