'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Navigation from '@/components/layout/Navigation';
import SoulmatePortrait from '@/components/ai/SoulmatePortrait';
import { FiShare2, FiDownload, FiHeart, FiStar, FiClock, FiUsers, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SpouseReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [birthInfo, setBirthInfo] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('birthInfo');
    if (stored) {
      setBirthInfo(JSON.parse(stored));
    }
    
    // 模拟打字机效果完成
    setTimeout(() => setIsTyping(false), 3000);
  }, []);

  const shareQuote = (quote: string) => {
    // 这里可以实现分享功能
    alert(`分享: ${quote}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />

      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Report Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-display gradient-text mb-4">
                {t('report.spouse.title')}
              </h1>
              <p className="text-xl text-purple-300 mb-6">
                {t('report.spouse.subtitle')}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-purple-400">
                <span className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  {t('report.spouse.generated')} 2025.01.12
                </span>
                <span className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  {t('report.spouse.client')}: {birthInfo?.name || 'You'}
                </span>
              </div>
            </div>
            
            {/* AI Soulmate Portrait */}
            <div className="max-w-md mx-auto mb-12">
              <SoulmatePortrait birthInfo={birthInfo} />
            </div>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <Card glow="gold" className="text-center">
              <div className="mb-6">
                <h2 className="text-3xl font-display mb-4">🙏 Namaste</h2>
                <p className="text-lg text-purple-300 mb-4">
                  {t('report.spouse.welcome')}
                </p>
                <p className="text-base text-purple-400">
                  {t('report.spouse.intro')}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Chart Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.basicInfo')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card glow="purple">
                <div className="text-center">
                  <div className="text-4xl mb-3">♊</div>
                  <h3 className="text-xl font-semibold mb-2">{t('report.spouse.risingSign')}</h3>
                  <p className="text-lg text-purple-300">Mithuna (双子座)</p>
                  <p className="text-sm text-purple-400">聪慧、善于沟通</p>
                </div>
              </Card>
              
              <Card glow="purple">
                <div className="text-center">
                  <div className="text-4xl mb-3">🌙</div>
                  <h3 className="text-xl font-semibold mb-2">{t('report.spouse.moonSign')}</h3>
                  <p className="text-lg text-blue-300">Makara (摩羯座)</p>
                  <p className="text-sm text-blue-400">坚韧、务实、负责</p>
                </div>
              </Card>
              
              <Card glow="purple">
                <div className="text-center">
                  <div className="text-4xl mb-3">☉</div>
                  <h3 className="text-xl font-semibold mb-2">{t('report.spouse.sunSign')}</h3>
                  <p className="text-lg text-red-300">Vrishchika (天蝎座)</p>
                  <p className="text-sm text-red-400">深邃、有力、转化</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Part 1: Marriage Potential Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.part1')}
            </h2>
            
            <div className="space-y-8">
              {/* 7th House Analysis */}
              <Card glow="pink">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <FiStar className="text-pink-400" />
                  第七宫 (Kalatra Bhava) - 婚姻与伴侣之宫
                </h3>
                <div className="space-y-4">
                  <p className="text-purple-300 leading-relaxed">
                    您的第七宫（位于射手座）内无行星落入，这使得宫主星的状态成为分析的绝对核心。
                  </p>
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <h4 className="text-lg font-semibold text-pink-300 mb-2">宫主星状态</h4>
                    <p className="text-purple-200">
                      您的第七宫主星为 Guru (木星)。木星飞入了代表智慧、恋爱与前世福报的第五宫，
                      与代表您自身的命主星水星和代表爱情的天然指示星金星形成紧密合相。这是一个顶级的格局。
                    </p>
                  </div>
                </div>
              </Card>

              {/* Marriage Karaka */}
              <Card glow="gold">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <FiHeart className="text-yellow-400" />
                  婚姻指示星 (Karaka) 的状态
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-yellow-300">金星 (Shukra)</h4>
                    <p className="text-purple-200 text-sm">
                      您的金星位于天秤座，此为 Swakshetra（入庙），是其力量最强的状态之一。
                      它落入吉祥的第五宫，并形成了Malavya Yoga（金曜格），这是五大圣人格局之一。
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-yellow-300">木星 (Guru)</h4>
                    <p className="text-purple-200 text-sm">
                      您的木星不仅是七宫主，其状态也极其优越，位于友宫（天秤座），
                      并与两大吉星（水星、金星）同宫。这揭示了您的伴侣将是智慧、品德高尚且富有魅力之人。
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Part 2: Future Partner Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.part2')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card glow="purple">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiUsers className="text-purple-400" />
                  外貌与性格
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">外貌特征</h4>
                    <p className="text-purple-200 text-sm">
                      综合木星与金星的影响，对方很可能外形俊朗/貌美，气质高雅，富有魅力，笑容温暖。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">性格特质</h4>
                    <p className="text-purple-200 text-sm">
                      智慧（木星）、风趣（水星）、富有艺术感和社交手腕（金星）、内在成熟稳重（土星）、
                      灵魂核心自信且光明磊落（D9太阳）。这是一个集大成者。
                    </p>
                  </div>
                </div>
              </Card>

              <Card glow="purple">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-400" />
                  职业倾向与相遇方式
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">职业领域</h4>
                    <p className="text-blue-200 text-sm">
                      教育、法律、金融、咨询、艺术、管理层或任何需要高等智慧和领导力的领域。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">相遇地点</h4>
                    <p className="text-blue-200 text-sm">
                      七宫主落第五宫，相遇地点极可能与创意、学习、娱乐、艺术展、音乐会或投资相关的社交圈有关。
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Part 3: Marriage Timing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.part3')}
            </h2>
            
            <Card glow="purple">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <FiClock className="text-green-400" />
                主运与次运分析
              </h3>
              <div className="space-y-6">
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                  <h4 className="text-lg font-semibold text-green-300 mb-2">当前大运</h4>
                  <p className="text-green-200">
                    您当前正处于<strong>木星大运（Guru Mahadasha）</strong>之中（2016-2032）。
                    大运主木星本身就是您的第七宫主，这16年是您婚姻的&ldquo;大环境机遇期&rdquo;。
                  </p>
                </div>
                
                <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="text-lg font-semibold text-yellow-300 mb-2">关键时期</h4>
                  <p className="text-yellow-200">
                    木星大运-金星次运（Guru-Shukra Dasha）（2024年6月 - 2027年2月）是启动婚姻的最关键时期。
                    大运主（七宫主）与次运主（婚姻指示星）在本命盘中紧密合相，这是最强烈的&ldquo;正缘&rdquo;信号。
                  </p>
                </div>
                
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                  <h4 className="text-lg font-semibold text-red-300 mb-2">最佳时机</h4>
                  <p className="text-red-200">
                    <strong>2025年至2026年</strong>是您缔结良缘的黄金时间窗口。
                    行运木星将经过您的第一宫双子座，同时行运土星在您的第九宫水瓶座，
                    形成双重过运激活您的第七宫。
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Part 4: Marriage Quality */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.part4')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card glow="pink">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiHeart className="text-pink-400" />
                  婚姻和谐度
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400">🏠</span>
                    <div>
                      <p className="font-semibold text-pink-300">家庭氛围</p>
                      <p className="text-pink-200 text-sm">充满智慧、创造和欢乐</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400">💎</span>
                    <div>
                      <p className="font-semibold text-pink-300">亲密关系</p>
                      <p className="text-pink-200 text-sm">和谐且充满享受</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-pink-400">👑</span>
                    <div>
                      <p className="font-semibold text-pink-300">社会形象</p>
                      <p className="text-pink-200 text-sm">令人羡慕的婚姻关系</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card glow="purple">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiShield className="text-orange-400" />
                  潜在挑战
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-orange-300 mb-1">火星 Dosha</h4>
                    <p className="text-orange-200 text-sm">
                      火星位于第六宫，可能将生活中的冲突和竞争带入关系，需要注意沟通方式。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-300 mb-1">权力平衡</h4>
                    <p className="text-orange-200 text-sm">
                      双方都需要学习在尊重对方主权的同时，进行有效的沟通和妥协，
                      避免因自尊心而产生的权力斗争。
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Part 5: Guidance & Remedies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display gradient-text mb-8 text-center">
              {t('report.spouse.part5')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card glow="purple">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiZap className="text-purple-400" />
                  发挥优势
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-purple-200">拥抱智慧、沟通和创造力天赋</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span className="text-purple-200">建立共同学习、创造的习惯</span>
                  </li>
                </ul>
              </Card>

              <Card glow="purple">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-400" />
                  应对挑战
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-blue-200">学习非暴力沟通</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-blue-200">将好胜心转化为共同目标</span>
                  </li>
                </ul>
              </Card>

              <Card glow="gold">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiStar className="text-yellow-400" />
                  宝石与咒语
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-yellow-200">佩戴天然钻石或白色蓝宝石</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-yellow-200">持诵金星或木星咒语</span>
                  </li>
                </ul>
              </Card>
            </div>
          </motion.div>

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card glow="gold" className="text-center">
              <h2 className="text-3xl font-display mb-6">{t('report.spouse.conclusion')}</h2>
              <div className="space-y-4 text-purple-300">
                <p className="text-lg leading-relaxed">
                  您的命盘描绘了一段非凡的婚姻之旅，它被智慧、爱与前世的福报所深深祝福。
                  您注定会与一位如太阳般高贵且光芒四射的灵魂伴侣相结合，
                  共同开启一段相互成就、充满丰盛的生命篇章。
                </p>
                <p className="text-base leading-relaxed">
                  请记住，星盘是您灵魂的地图，它指明了宝藏的所在，
                  但寻宝的旅程需要您用爱与智慧去亲自走过。
                </p>
                <div className="pt-6">
                  <p className="text-2xl font-display text-yellow-400">
                    Blessings to you on your journey. ✨
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Share CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card glow="pink">
              <div className="text-center">
                <h3 className="text-2xl font-display mb-6">💌 这份报告说进你心里了吗？</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button icon={<FiShare2 />} variant="secondary">
                    分享到社交媒体
                  </Button>
                  <Button icon={<FiDownload />} variant="outline">
                    下载完整报告
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* More Reports */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-display text-center mb-8 gradient-text">
              💫 继续探索你的星盘
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '💼', title: '事业天命', desc: '揭示你的职业使命与天赋', price: '$29.99' },
                { icon: '💰', title: '财富潜力', desc: '解析财富累积方式与投资时机', price: '$39.99' },
                { icon: '🌸', title: '最佳状态', desc: '了解你的生命高峰期与机遇', price: '$24.99' },
              ].map((report, i) => (
                <Card key={i} hover glow="purple" delay={i * 0.1}>
                  <div className="text-center">
                    <div className="text-5xl mb-4">{report.icon}</div>
                    <h4 className="text-xl font-display mb-2">{report.title}</h4>
                    <p className="text-sm text-purple-300 mb-4">{report.desc}</p>
                    <p className="text-yellow-400 font-semibold">{report.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


