'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  FiArrowLeft,
  FiShare2,
  FiDownload,
  FiRefreshCw,
  FiAlertTriangle,
  FiCopy,
} from 'react-icons/fi';

type PortraitBreakdown = {
  physique: string[];
  features: string[];
  aura: string[];
  maturity: string[];
};

interface PortraitData {
  prompt: string;
  breakdown: PortraitBreakdown;
  astrologySummary: Record<string, string | string[]>;
  imageUrl: string | null;
  warnings: string[];
}

const SUMMARY_LABELS: Record<string, string> = {
  seventhHouseSign: '第七宫星座',
  seventhLord: '第七宫主星',
  seventhLordSign: '主星落座',
  seventhLordNakshatra: '主星月宿',
  planetsInSeventhHouse: '第七宫行星',
  daraKarakaPlanet: 'Dara Karaka',
  d9LagnaSign: 'D9 上升星座',
};

export default function SpouseReportPage() {
  const router = useRouter();
  const [birthInfo, setBirthInfo] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(true);
  const [portraitData, setPortraitData] = useState<PortraitData | null>(null);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [portraitError, setPortraitError] = useState<string | null>(null);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('birthInfo');
    if (stored) {
      setBirthInfo(JSON.parse(stored));
    }

    const typingTimeout = setTimeout(() => setIsTyping(false), 3000);

    return () => {
      clearTimeout(typingTimeout);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const generatePortrait = useCallback(
    async (signal?: AbortSignal) => {
      if (!birthInfo || signal?.aborted) return;

      setIsGeneratingPortrait(true);
      setPortraitError(null);

      try {
        const response = await fetch('/api/spouse-portrait', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(birthInfo),
          signal,
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            payload?.error || payload?.details || `请求失败 (${response.status})`;
          throw new Error(message);
        }

        if (!payload || !payload.prompt) {
          throw new Error('未能解析画像数据，请稍后重试。');
        }

        const normalizedBreakdown: PortraitBreakdown = {
          physique: payload.breakdown?.physique ?? [],
          features: payload.breakdown?.features ?? [],
          aura: payload.breakdown?.aura ?? [],
          maturity: payload.breakdown?.maturity ?? [],
        };

        const normalized: PortraitData = {
          prompt: payload.prompt as string,
          breakdown: normalizedBreakdown,
          astrologySummary: payload.astrologySummary ?? {},
          imageUrl: payload.imageUrl ?? null,
          warnings: Array.isArray(payload.warnings) ? payload.warnings : [],
        };

        setPortraitData(normalized);
        setLastGeneratedAt(new Date().toISOString());
        setCopyStatus('idle');
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setPortraitError((error as Error).message || '生成失败，请稍后重试。');
      } finally {
        setIsGeneratingPortrait(false);
      }
    },
    [birthInfo],
  );

  useEffect(() => {
    if (!birthInfo) return;
    const controller = new AbortController();
    generatePortrait(controller.signal);
    return () => controller.abort();
  }, [birthInfo, generatePortrait]);

  const handleRegenerate = useCallback(() => {
    generatePortrait();
  }, [generatePortrait]);

  const handleCopyPrompt = useCallback(() => {
    if (!portraitData?.prompt) return;

    try {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      if (!navigator?.clipboard) {
        throw new Error('浏览器暂不支持快速复制，请手动复制。');
      }

      navigator.clipboard
        .writeText(portraitData.prompt)
        .then(() => {
          setCopyStatus('copied');
          copyTimeoutRef.current = setTimeout(() => {
            setCopyStatus('idle');
          }, 2000);
        })
        .catch(() => {
          setCopyStatus('error');
          copyTimeoutRef.current = setTimeout(() => {
            setCopyStatus('idle');
          }, 2000);
        });
    } catch (err) {
      setCopyStatus('error');
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    }
  }, [portraitData?.prompt]);

  const formattedGeneratedAt = lastGeneratedAt
    ? new Date(lastGeneratedAt).toLocaleString()
    : null;

  const shareQuote = (quote: string) => {
    // 这里可以实现分享功能
    alert(`分享: ${quote}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-twilight-deep/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiArrowLeft />
              返回
            </button>
            <h1 className="text-xl font-display gradient-text">你的灵魂伴侣画像 💕</h1>
            <div className="flex items-center gap-4">
              <button className="hover:text-rose-gold transition-colors">
                <FiShare2 size={20} />
              </button>
              <button className="hover:text-rose-gold transition-colors">
                <FiDownload size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Report Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Card glow="pink">
              <h2 className="text-3xl font-display mb-2">💌 写给 {birthInfo?.name || '你'} 的信</h2>
              <p className="text-text-muted mb-1">基于你的第7宫与Navamsa盘</p>
              <p className="text-text-muted text-sm">精心解读</p>
              <p className="text-text-muted text-xs mt-2">生成于 2025.10.12</p>
            </Card>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <p className="text-2xl font-display text-text-secondary mb-6 leading-relaxed">
              亲爱的{birthInfo?.name || '你'}，
            </p>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              当我凝视你的星盘，我看到了一个灵动的灵魂。💫
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              你的第7宫主星木星，位于第5宫天秤座——这是一个充满智慧与优雅的位置。
              而在你的Navamsa婚姻盘中，我看到了...
            </p>
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-1 h-6 bg-rose-gold ml-1"
              />
            )}
          </motion.div>

          {/* AI Portrait Generator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-16"
          >
            <Card glow="gold" className="p-8">
              <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start">
                <div className="w-full">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center">
                    {isGeneratingPortrait ? (
                      <div className="px-6 text-center text-text-muted animate-pulse">
                        正在调用星象与AI灵感，稍等片刻...
                      </div>
                    ) : portraitError ? (
                      <div className="px-6 text-center text-rose-100 text-sm">
                        {portraitError}
                      </div>
                    ) : portraitData?.imageUrl ? (
                      <Image
                        src={portraitData.imageUrl}
                        alt="你的灵魂伴侣画像"
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="px-6 text-center text-text-muted text-sm leading-relaxed">
                        画像生成成功，但当前模型未返回图片链接。你仍然可以使用下方的AI绘画提示词，在喜爱的图像平台中生成配偶画像。
                      </div>
                    )}
                  </div>
                  {formattedGeneratedAt && (
                    <p className="mt-4 text-center text-xs text-text-muted">
                      最近生成时间：{formattedGeneratedAt}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display gradient-text flex items-center gap-2">
                      <span>AI 灵魂伴侣画像</span>
                      <span className="text-2xl">💞</span>
                    </h3>
                    <p className="text-sm text-text-muted">
                      基于 {birthInfo?.date} {birthInfo?.time} 于 {birthInfo?.city} 的出生信息，结合吠陀占星第七宫与Navamsa盘关键指标生成。
                    </p>
                  </div>

                  {portraitData?.warnings?.length ? (
                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
                      {portraitData.warnings.map((warning, index) => {
                        const isPositive = /成功|success/i.test(warning);
                        return (
                          <p
                            key={`${warning}-${index}`}
                            className={`flex items-start gap-2 leading-relaxed ${
                              isPositive ? 'text-emerald-200' : 'text-amber-200'
                            }`}
                          >
                            <FiAlertTriangle
                              className={`mt-0.5 ${isPositive ? 'text-emerald-200' : 'text-amber-200'}`}
                            />
                            <span>{warning}</span>
                          </p>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={handleRegenerate}
                        icon={<FiRefreshCw />}
                        disabled={isGeneratingPortrait || !birthInfo}
                      >
                        {isGeneratingPortrait ? '重新生成中...' : '重新召唤画像'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<FiCopy />}
                        onClick={handleCopyPrompt}
                        disabled={!portraitData?.prompt || isGeneratingPortrait}
                      >
                        复制提示词
                      </Button>
                      {copyStatus === 'copied' && (
                        <span className="text-xs text-emerald-200">已复制到剪贴板！</span>
                      )}
                      {copyStatus === 'error' && (
                        <span className="text-xs text-rose-200">复制失败，请手动复制。</span>
                      )}
                    </div>

                    {portraitData?.prompt ? (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
                          AI 绘画提示词
                        </p>
                        <div className="max-h-52 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-text-secondary">
                          {portraitData.prompt}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted">
                        正在为你准备提示词...
                      </p>
                    )}
                  </div>

                  {portraitData?.breakdown ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {portraitData.breakdown.physique.length > 0 && (
                        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                          <h4 className="text-sm font-semibold text-text-secondary">体态线索</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            {portraitData.breakdown.physique.map((item, index) => (
                              <li key={`physique-${index}`} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {portraitData.breakdown.features.length > 0 && (
                        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                          <h4 className="text-sm font-semibold text-text-secondary">五官刻画</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            {portraitData.breakdown.features.map((item, index) => (
                              <li key={`feature-${index}`} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {portraitData.breakdown.aura.length > 0 && (
                        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                          <h4 className="text-sm font-semibold text-text-secondary">灵魂气质</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            {portraitData.breakdown.aura.map((item, index) => (
                              <li key={`aura-${index}`} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {portraitData.breakdown.maturity.length > 0 && (
                        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                          <h4 className="text-sm font-semibold text-text-secondary">成熟后魅力</h4>
                          <ul className="space-y-2 text-sm text-text-muted">
                            {portraitData.breakdown.maturity.map((item, index) => (
                              <li key={`maturity-${index}`} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {portraitData?.astrologySummary ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-text-secondary">占星关键点</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(portraitData.astrologySummary).map(([key, value]) => {
                          if (!value || (Array.isArray(value) && value.length === 0)) {
                            return null;
                          }
                          const label = SUMMARY_LABELS[key] ?? key;
                          const displayValue = Array.isArray(value)
                            ? value.join(', ')
                            : value;
                          return (
                            <span
                              key={key}
                              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-text-muted"
                            >
                              {label}: {displayValue}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
          </div>

          {/* Section 1: Personality */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-4xl font-display gradient-text mb-8 flex items-center gap-3">
              💕 TA的性格与灵魂
            </h3>
            
            <div className="h-px bg-gradient-to-r from-transparent via-rose-gold to-transparent mb-8" />

            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                TA的内心世界，充满了双子座的好奇心与求知欲。就像一本永远读不完的书，
                每一页都有新的惊喜。TA是个天生的沟通者，总能用巧妙的言语点亮任何场合...
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                你会发现，TA的思维跳跃而敏捷，总是对世界充满新鲜的视角。
                和TA在一起，你永远不会感到无聊。🦋
              </p>

              {/* Illustration Placeholder */}
              <div className="py-12 flex justify-center">
                <div className="w-64 h-48 glass-card flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">💑</div>
                    <p className="text-text-muted text-sm">精美的插画: 两个剪影在交流</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                基于你的Navamsa盘，TA很可能具有这些特质：
              </p>

              <Card glow="purple">
                <h4 className="text-2xl font-display mb-4 flex items-center gap-2">
                  <span>🌸</span> 核心性格
                </h4>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-gold mt-1">•</span>
                    <span><strong>知识的渴求者</strong> - TA永远在学习，永远在成长</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-gold mt-1">•</span>
                    <span><strong>灵活的思考者</strong> - 能从多个角度看待问题</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-gold mt-1">•</span>
                    <span><strong>社交的蝴蝶</strong> - 在人群中如鱼得水</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-gold mt-1">•</span>
                    <span><strong>表达的艺术家</strong> - 善于用语言和文字表达情感</span>
                  </li>
                </ul>
              </Card>

              <div className="quote-highlight">
                <p className="text-text-secondary leading-relaxed">
                  然而，TA的灵魂也有其脆弱之处。双子座的能量有时会让TA显得难以捉摸，
                  甚至有些“心不在焉”。这并非冷漠，而是TA的心智总是同时处理着太多的想法... 💭
                </p>
                <button
                  onClick={() => shareQuote('TA的灵魂也有其脆弱之处...')}
                  className="mt-3 text-sm text-rose-gold hover:text-coral-pink flex items-center gap-2"
                >
                  <span>💬</span> 分享这段话
                </button>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
          </div>

          {/* Section 2: Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-4xl font-display gradient-text mb-8 flex items-center gap-3">
              🌙 TA的外貌与气质
            </h3>
            
            <div className="h-px bg-gradient-to-r from-transparent via-lavender-light to-transparent mb-8" />

            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                当你第一次见到TA时，你很可能会被TA的灵动气质所吸引。
                基于你的D9盘显示...
              </p>

              <Card glow="gold">
                <h4 className="text-2xl font-display mb-4 flex items-center gap-2">
                  <span>👁️</span> 外貌特征
                </h4>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span><strong>身形:</strong> 修长而灵活，动作敏捷</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span><strong>面容:</strong> 年轻而充满活力，一双会说话的眼睛</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span><strong>气质:</strong> 明快、轻盈，仿佛永远充满能量</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span><strong>风格:</strong> 现代而多变，喜欢尝试不同穿搭</span>
                  </li>
                </ul>
              </Card>

              <p className="text-lg text-text-secondary leading-relaxed">
                TA的存在本身就像一阵清新的风，让周围的空气都变得生动起来。
              </p>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
            <span className="text-4xl">✨</span>
          </div>

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-4xl font-display gradient-text mb-8">💌 写在最后</h3>
            
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                亲爱的{birthInfo?.name || '你'}，你的第7宫告诉我，你注定要与一个能拓展你思维、
                激发你智慧的人相伴。这段关系不仅是情感的连接，更是灵魂成长的催化剂。
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                记住，星盘倾向，但不强制。这份报告是你理解自我、拥抱未来的工具，
                而非宿命的枷锁。
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                愿你在爱中成长，在关系中绽放最真实的自己。💕
              </p>

              <div className="pt-8 text-center">
                <p className="text-2xl handwritten text-rose-gold">
                  AstroSoul with love ✨
                </p>
              </div>
            </div>
          </motion.div>

          {/* Share CTA */}
          <Card glow="pink" delay={0.4}>
            <div className="text-center">
              <h3 className="text-2xl font-display mb-6">💌 这份报告说进你心里了吗？</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button icon={<FiShare2 />} variant="secondary">
                  分享到Instagram Story
                </Button>
                <Button icon={<FiDownload />} variant="outline">
                  下载PDF
                </Button>
              </div>
            </div>
          </Card>

          {/* More Reports */}
          <div className="mt-16">
            <h3 className="text-3xl font-display text-center mb-8 gradient-text">
              💫 继续探索你的星盘
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '💼', title: '事业天命', desc: '揭示你的职业使命与天赋', price: '$9.99' },
                { icon: '💰', title: '财富潜力', desc: '解析财富累积方式', price: '即将推出' },
                { icon: '🌸', title: '最佳状态', desc: '了解你的生命高峰期', price: '即将推出' },
              ].map((report, i) => (
                <Card key={i} hover glow="purple" delay={i * 0.1}>
                  <div className="text-center">
                    <div className="text-5xl mb-4">{report.icon}</div>
                    <h4 className="text-xl font-display mb-2">{report.title}</h4>
                    <p className="text-sm text-text-muted mb-4">{report.desc}</p>
                    <p className="text-rose-gold font-semibold">{report.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



