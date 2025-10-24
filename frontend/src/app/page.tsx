'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();

  const testimonials = [
    {
      name: 'Sarah',
      age: 28,
      avatar: '👩',
      rating: 5,
      text: '报告里描述的配偶特质和我现在的男朋友一模一样！',
    },
    {
      name: 'Mia',
      age: 25,
      avatar: '👧',
      rating: 5,
      text: 'AI的语言好温暖，让我重新认识了自己。就像有个懂我的闺蜜在跟我聊天。',
    },
    {
      name: 'Lily',
      age: 31,
      avatar: '🧑‍🦰',
      rating: 5,
      text: '界面太美了，每次打开都像进入一个魔法世界💫',
    },
  ];

  const features = [
    {
      icon: '🌸',
      title: '告诉我们你的出生时刻',
      description: '精准到分钟的出生信息',
    },
    {
      icon: '✨',
      title: '获得精准的星盘',
      description: '基于专业计算引擎',
    },
    {
      icon: '💕',
      title: 'AI温暖解读',
      description: '像闺蜜一样理解你',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 星空背景 */}
      <StarField />

      {/* 主内容 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-4 gradient-text text-gradient-animate">
              AstroSoul
            </h1>
            <div className="w-24 h-1 bg-accent-gradient mx-auto rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-display mb-6 gradient-text"
          >
            ✨ 映射你的灵魂，发现你的命运 ✨
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed"
          >
            用古老的印度占星智慧 × 现代AI的温暖解读
            <br />
            揭示你内在的宇宙
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              icon="🌸"
              onClick={() => router.push('/birth-info')}
            >
              开启我的星盘之旅
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-text-muted"
          >
            已有 <span className="text-rose-gold font-semibold">10,247</span> 位姐妹找到了答案 💕
          </motion.p>

          {/* 向下滚动提示 */}
          <motion.div
            className="absolute bottom-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-text-muted text-sm mb-2">向下滑动探索</p>
            <div className="w-6 h-10 border-2 border-text-muted rounded-full mx-auto flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-text-muted rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display text-center mb-16 gradient-text"
          >
            她们这样说 AstroSoul...
          </motion.h3>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} delay={index * 0.2} glow="pink" hover>
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <h4 className="font-semibold text-lg mb-1">
                  {testimonial.name}, {testimonial.age}
                </h4>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-gold">⭐</span>
                  ))}
                </div>
                <p className="text-text-secondary leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Spouse Portrait Section */}
        <section className="py-20 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-display text-center mb-16 gradient-text"
            >
              💫 发现你的灵魂伴侣
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Description */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="text-6xl mb-6">💕</div>
                <p className="text-text-secondary text-lg leading-relaxed">
                  AI会基于你的第7宫和D9婚姻盘，为你揭示:
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: '💕', text: 'TA的性格与灵魂' },
                    { icon: '✨', text: 'TA的外貌与气质' },
                    { icon: '🌙', text: '你们的相遇方式' },
                    { icon: '🦋', text: '相处的甜蜜与挑战' },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-lg"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-text-secondary">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="pt-6 space-y-2 text-text-muted">
                  <p>1500+字温暖解读</p>
                  <p className="text-rose-gold font-semibold">永久保存 | $9.99</p>
                </div>
              </motion.div>

              {/* Right: Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card glow="purple">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-pink/20 to-lavender-light/20 blur-3xl" />
                    <div className="relative p-6">
                      <p className="text-text-secondary leading-relaxed mb-6">
                        &ldquo;TA的内心世界充满好奇心与求知欲，像一本永远读不完的书。
                        你们很可能在学习或交流的场景中相遇，那将是一场思想的火花碰撞...&rdquo;
                      </p>
                      <div className="h-32 bg-gradient-to-b from-transparent to-twilight-deep flex items-end justify-center pb-4">
                        <Button onClick={() => router.push('/birth-info')}>
                          解锁完整画像
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-6">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display text-center mb-16 gradient-text"
          >
            它是如何运作的?
          </motion.h3>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2 text-text-primary">
                    {feature.title}
                  </h4>
                  <p className="text-text-secondary">{feature.description}</p>
                  {index < features.length - 1 && (
                    <div className="hidden md:block text-4xl text-rose-gold mt-6">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              icon="🌸"
              onClick={() => router.push('/birth-info')}
            >
              开启我的星盘之旅
            </Button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center text-text-muted border-t border-white/10">
          <p className="mb-4">
            基于瑞士星历表精准计算 | 由顶尖AI模型驱动
          </p>
          <p className="text-sm">
            © 2025 AstroSoul. 映射灵魂，发现命运 💫
          </p>
        </footer>
      </div>
    </div>
  );
}
