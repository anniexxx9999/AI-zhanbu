'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StarField from '@/components/particles/StarField';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { FiUser, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { astrologyAPI } from '@/services/api';

export default function BirthInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Asta Sharma',
    date: '1990-05-20',
    time: '08:30',
    city: 'New Delhi, India',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDefaultData, setIsDefaultData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearDefaultData = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      city: '',
    });
    setIsDefaultData(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = '请告诉我你的名字 🙈';
    if (!formData.date) newErrors.date = '出生日期很重要哦 ✨';
    if (!formData.time) newErrors.time = '精准到分钟会更准确呢 💫';
    if (!formData.city) newErrors.city = '让我知道你在哪里出生的 🌸';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 保存到 localStorage 并跳转
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await astrologyAPI.calculateChart(formData);

      if (!response.success || !response.data) {
        throw new Error(response.message || response.error || '星盘生成失败，请稍后重试');
      }

      localStorage.setItem('birthInfo', JSON.stringify(formData));
      localStorage.setItem('latestChartData', JSON.stringify(response.data));

      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to submit birth info:', err);
      setSubmitError(err instanceof Error ? err.message : '星盘生成失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-display mb-4 gradient-text"
            >
              ✨ 开启你的星盘之旅
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-lg"
            >
              嘿姐妹！告诉我你的出生信息，让我为你揭开宇宙的秘密 💫
            </motion.p>
          </div>

          {submitError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-100 rounded-xl text-sm"
            >
              {submitError}
            </motion.div>
          )}

          {/* Form Card */}
          <Card glow="purple">
            {/* Default Data Notice */}
            {isDefaultData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎭</span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        正在使用示例数据
                      </p>
                      <p className="text-xs text-purple-200">
                        点击 &quot;输入我的信息&quot; 来替换为您的真实出生信息
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearDefaultData}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    输入我的信息
                  </button>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <Input
                label="你的名字（昵称也可以哦）"
                placeholder="比如：小雪、Xuan..."
                icon={<FiUser />}
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (isDefaultData) setIsDefaultData(false);
                }}
                error={errors.name}
              />

              {/* Date Input */}
              <Input
                label="出生日期"
                type="date"
                icon={<FiCalendar />}
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (isDefaultData) setIsDefaultData(false);
                }}
                error={errors.date}
              />

              {/* Time Input */}
              <Input
                label="出生时间（越精确越好）"
                type="time"
                icon={<FiClock />}
                value={formData.time}
                onChange={(e) => {
                  setFormData({ ...formData, time: e.target.value });
                  if (isDefaultData) setIsDefaultData(false);
                }}
                error={errors.time}
              />

              {/* City Input */}
              <Input
                label="出生城市"
                placeholder="比如：上海、北京、Mumbai..."
                icon={<FiMapPin />}
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (isDefaultData) setIsDefaultData(false);
                }}
                error={errors.city}
              />

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <p className="text-sm text-text-muted leading-relaxed">
                  🔒 <span className="text-text-secondary">你的隐私对我们很重要</span>
                  <br />
                  我们只会用这些信息来生成你的专属星盘，绝不会分享给任何第三方 💕
                </p>
              </motion.div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                icon="✨"
                disabled={submitting}
              >
                {submitting ? '星盘生成中...' : '揭示我的命盘'}
              </Button>

              {/* Back Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-text-muted hover:text-text-secondary transition-colors text-sm"
                >
                  ← 返回首页
                </button>
              </div>
            </form>
          </Card>

          {/* Info Cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { icon: '🌸', title: '精准计算', text: '基于瑞士星历表' },
              { icon: '💕', title: 'AI解读', text: '温暖而专业' },
              { icon: '🔒', title: '隐私保护', text: '数据加密存储' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center p-4 glass-card"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
