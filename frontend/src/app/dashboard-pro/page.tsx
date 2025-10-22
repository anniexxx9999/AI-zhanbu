'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiSettings, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data (kept simple for prototype)
// ─────────────────────────────────────────────────────────────────────────────
const birthInfo = {
  name: 'Asta Sharma',
  nameLocal: 'अस्ता शर्मा',
  date: '1990-05-20',
  time: '08:30:00 IST',
  location: 'New Delhi, India',
};

const planetsLite = [
  { 
    key: 'sun', 
    title: 'Sun • Your Essence', 
    blurb: 'At your core, a pioneer of courage and divine spark.', 
    tag: 'Soul', 
    color: '#FFD1DC',
    emoji: '☀️',
    details: 'Your Sun sign represents your core identity, life purpose, and the essence of who you are becoming. It shows how you shine your light in the world.',
    influence: 'Leadership style, ego expression, and life direction.',
    position: 'Aries 15°'
  },
  { 
    key: 'moon', 
    title: 'Moon • Your Inner World', 
    blurb: 'An ocean of dreams, compassion and intuition.', 
    tag: 'Emotion', 
    color: '#E6E6FA',
    emoji: '🌙',
    details: 'Your Moon sign reveals your emotional nature, instincts, and what makes you feel secure. It shows your inner world and how you process feelings.',
    influence: 'Emotional needs, nurturing style, and subconscious patterns.',
    position: 'Pisces 22°'
  },
  { 
    key: 'venus', 
    title: "Venus • The Artist of Your Heart", 
    blurb: 'Beauty, connection and harmony through what you create.', 
    tag: 'Love', 
    color: '#FFF0DB',
    emoji: '♀️',
    details: 'Venus governs love, beauty, values, and relationships. It shows how you give and receive love, and what you find beautiful and valuable.',
    influence: 'Love language, aesthetic preferences, and relationship dynamics.',
    position: 'Taurus 8°'
  },
  { 
    key: 'jupiter', 
    title: 'Jupiter • Your Wise Guide', 
    blurb: 'Expansion, meaning and the teacher within.', 
    tag: 'Growth', 
    color: '#BEEBBA',
    emoji: '♃',
    details: 'Jupiter represents expansion, wisdom, higher learning, and your philosophical outlook. It shows where you naturally grow and find meaning.',
    influence: 'Belief systems, opportunities for growth, and life philosophy.',
    position: 'Sagittarius 3°'
  },
];

const yogasLite = [
  { 
    title: 'The Gift of Eloquence', 
    subtitle: 'Budhaditya Yoga', 
    desc: 'Sun × Mercury bless you with sharp intellect and luminous expression.',
    details: 'This powerful combination of Sun and Mercury in your chart grants you exceptional communication skills, sharp analytical thinking, and the ability to express complex ideas with clarity and charisma. You naturally inspire others through your words.',
    influence: 'Career success through communication, leadership roles, and intellectual pursuits.',
    emoji: '🗣️'
  },
  { 
    title: 'Heart Of Grace', 
    subtitle: 'Gaja Kesari Yoga', 
    desc: 'Moon × Jupiter nurture kindness, protection and emotional wisdom.',
    details: 'This beautiful union of Moon and Jupiter creates a heart full of compassion, emotional intelligence, and protective instincts. You naturally care for others and possess deep wisdom about human nature.',
    influence: 'Strong relationships, teaching abilities, and spiritual growth through emotional understanding.',
    emoji: '💖'
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page Component: two modes → narrative (Stellar Self) | chart (Deep Dive)
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardProPage() {
  const [mode, setMode] = useState<'narrative' | 'chart'>('narrative');

  return (
    <div className={mode === 'narrative' ? 'min-h-screen bg-[#FFF8FB] text-[#2C2A32]' : 'min-h-screen bg-[#0a0e1a] text-[#E0E0E0]'}>
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300"
           style={{ 
             background: mode === 'narrative' 
               ? 'rgba(255, 248, 251, 0.9)' 
               : 'rgba(10, 14, 26, 0.9)',
             borderColor: mode === 'narrative' 
               ? '#F1D7E3' 
               : 'rgba(255, 255, 255, 0.1)'
           }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-2xl">✨</div>
              <div>
                <div className={`font-serif text-xl font-bold ${mode === 'narrative' ? 'text-[#2C2A32]' : 'text-[#FFD8A8]'}`}>
                  AstroSoul
          </div>
                <div className={`text-xs ${mode === 'narrative' ? 'text-[#7A6F82]' : 'text-[#A0A0A0]'}`}>
            {mode === 'narrative' ? 'Soulmate Match' : 'Cosmic Compass'}
          </div>
        </div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.button 
                className={`text-sm font-medium transition-colors ${mode === 'narrative' ? 'text-[#6A4AA3] hover:text-[#A078A6]' : 'text-[#E0E0E0] hover:text-[#FFD8A8]'}`}
                whileHover={{ y: -1 }}
              >
                Dashboard
              </motion.button>
              <motion.button 
                className={`text-sm font-medium transition-colors ${mode === 'narrative' ? 'text-[#7A6F82] hover:text-[#6A4AA3]' : 'text-[#A0A0A0] hover:text-[#E0E0E0]'}`}
                whileHover={{ y: -1 }}
              >
                Birth Info
              </motion.button>
              <motion.button 
                className={`text-sm font-medium transition-colors ${mode === 'narrative' ? 'text-[#7A6F82] hover:text-[#6A4AA3]' : 'text-[#A0A0A0] hover:text-[#E0E0E0]'}`}
                whileHover={{ y: -1 }}
              >
                Reports
              </motion.button>
        </div>

            {/* Mode Toggle & Actions */}
            <div className="flex items-center space-x-4">
              {/* Mode Toggle */}
              <motion.button
                onClick={() => setMode(mode === 'narrative' ? 'chart' : 'narrative')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  mode === 'narrative'
                    ? 'bg-gradient-to-r from-[#EADCF1] to-[#FFD8A8] text-[#6A4AA3] hover:shadow-lg'
                    : 'bg-[#FFD700] text-[#0a0e1a] hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">✨</span>
                {mode === 'narrative' ? 'Deep Dive Map' : 'Soulmate Match'}
              </motion.button>

              {/* User Profile */}
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  mode === 'narrative' 
                    ? 'bg-gradient-to-r from-[#A078A6] to-[#FFD8A8] hover:shadow-lg' 
                    : 'bg-[#FFD700] hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">👤</span>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      <main className={mode === 'narrative' ? 'max-w-[900px] mx-auto px-6 py-10' : 'max-w-[1400px] mx-auto px-6 py-8'}>
        {mode === 'narrative' ? (
          <NarrativeView onDeepDive={() => setMode('chart')} />
        ) : (
          <ChartView />
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Narrative Mode (Stellar Self) • Card-based, pastel, empowering copy
// ─────────────────────────────────────────────────────────────────────────────
function NarrativeView({ onDeepDive }: { onDeepDive: () => void }) {
  const router = useRouter();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [highlightPlanet, setHighlightPlanet] = useState<string | null>(null); // sun | moon | venus | jupiter
  const [showWelcomeTip, setShowWelcomeTip] = useState(true);

  return (
    <div className="space-y-10">
      {/* Hero Welcome Section */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFE9F1] via-[#F3EAFD] to-[#FFF0DB] border border-[#F1D7E3] p-8">
          {/* Floating Elements */}
          <div className="absolute top-4 right-8 text-2xl opacity-20 animate-pulse">✨</div>
          <div className="absolute bottom-6 left-8 text-xl opacity-30 animate-bounce">🌸</div>
          <div className="absolute top-1/2 right-12 text-lg opacity-25 animate-pulse">💫</div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="text-lg">👋</span>
              <p className="text-sm tracking-wide text-[#7A6F82] font-medium">Hey gorgeous soul</p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-5xl font-serif mb-4 text-[#2C2A32] leading-tight"
            >
              {birthInfo.name}, your soulmate blueprint is ready 💕
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-[#6E6277] text-lg leading-relaxed max-w-2xl"
            >
              Discover the cosmic secrets to finding your perfect soulmate through ancient Vedic wisdom. 
              Let&apos;s explore what the stars reveal about your ideal love match and relationship destiny.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex items-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <span className="text-sm">💕</span>
                <span className="text-sm font-medium text-[#6A4AA3]">Soulmate matching</span>
        </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <span className="text-sm">🔮</span>
                <span className="text-sm font-medium text-[#6A4AA3]">Cosmic compatibility</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <span className="text-sm">💖</span>
                <span className="text-sm font-medium text-[#6A4AA3]">Love destiny</span>
              </div>
            </motion.div>
          </div>
          
          <AnimatePresence>
            {showWelcomeTip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: 1.2 }}
                className="absolute top-6 right-6 bg-gradient-to-r from-[#A078A6] to-[#FF8A95] text-white p-4 rounded-2xl shadow-xl max-w-sm"
              >
                <div className="text-sm">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <span>✨</span>
                    <span>Pro Tip</span>
                  </div>
                  <div className="text-xs opacity-95 leading-relaxed">
                    Click on any card to discover your soulmate potential. Each placement reveals unique insights about your ideal love match and relationship destiny.
                  </div>
                </div>
                <button 
                  onClick={() => setShowWelcomeTip(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white text-[#A078A6] rounded-full text-sm flex items-center justify-center hover:bg-gray-100 shadow-lg"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* The Big Three - Core Identity */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2C2A32] mb-3">
            Your Love Foundation 💕
          </h2>
          <p className="text-[#6E6277] max-w-2xl mx-auto">
            These three placements reveal your core love language and relationship style. 
            Understanding them is the first step to attracting your perfect soulmate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BigCard 
              title="Rising Sign • Your Love Magnet" 
              highlight="Leo Rising" 
              color="#FFF0DB" 
              line="Your magnetic presence and warm heart naturally attract potential soulmates. People are drawn to your confidence and generous spirit in love." 
              emoji="🦁"
              degree="15° Leo"
              influence="Your natural charisma attracts quality partners"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BigCard 
              title="Moon Sign • Your Emotional Bond" 
              highlight="Pisces Moon" 
              color="#E6F6FF" 
              line="Your emotional world creates deep, soulful connections. You have a natural gift for understanding your partner's emotions and creating intimate bonds." 
              emoji="🌙"
              degree="22° Pisces"
              influence="Your ability to form deep emotional connections"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BigCard 
              title="Sun Sign • Your Love Purpose" 
              highlight="Aries Sun" 
              color="#EAF7E8" 
              line="You're a passionate lover with an adventurous spirit. Your courage and determination inspire your partner to grow and explore love together." 
              emoji="☀️"
              degree="15° Aries"
              influence="Your passionate approach to love and relationships"
            />
          </motion.div>
              </div>
      </motion.section>

      {/* Your Cosmic Influences */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2C2A32] mb-3">
            Your Love Influences 💖
          </h2>
          <p className="text-[#6E6277] max-w-2xl mx-auto">
            Each planet reveals different aspects of your love nature and relationship patterns. 
            Discover how these cosmic energies shape your romantic destiny and soulmate compatibility.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#FFE9F1] to-[#FFF0DB] px-4 py-2 rounded-full">
            <span className="text-sm">💕</span>
            <span className="text-sm font-medium text-[#6A4AA3]">Click to discover your love patterns</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planetsLite.map((p, index) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <PlanetCard planet={p} isHighlighted={highlightPlanet === p.key} onHighlight={setHighlightPlanet} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Your Life Map - Vedic Chart */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="rounded-3xl p-8 bg-gradient-to-br from-[#FFFFFF] to-[#FFF8FB] border border-[#E8DDEB] shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2C2A32] mb-3">
            Your Love Map 💕
          </h2>
          <p className="text-[#6E6277] max-w-2xl mx-auto mb-4">
            This ancient Vedic chart reveals the cosmic blueprint of your love life. 
            Each house shows where different relationship energies manifest in your destiny.
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFE9F1] to-[#FFF0DB] px-4 py-2 rounded-full">
            <span className="text-sm">🔮</span>
            <span className="text-sm font-medium text-[#6A4AA3]">Soulmate Compatibility Chart • Click to explore</span>
          </div>
        </div>
          
          {/* 占星盘容器 */}
          <div className="bg-gradient-to-br from-[#FFFBF0] to-[#FFF8FB] p-6 rounded-2xl border border-[#E8DDEB] shadow-inner">
            <div className="flex justify-center mb-6">
              <NorthIndianChart selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} />
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-[#FFE9F1] to-[#FFF0DB] rounded-2xl p-6 max-w-2xl mx-auto"
              >
                {selectedHouse ? (
                  <div>
                    <h3 className="font-serif text-lg text-[#2C2A32] mb-2">
                      House {selectedHouse}: {getHouseDomain(selectedHouse)}
                    </h3>
                    <p className="text-[#6E6277] leading-relaxed">
                      This area of your life is guided by your inner wisdom and cosmic alignment. 
                      Explore how this house influences your personal growth and life experiences.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-lg text-[#2C2A32] mb-2">
                      Discover Your Life Areas
                    </h3>
                    <p className="text-[#6E6277] leading-relaxed">
                      Click on any house to explore different areas of your life - from relationships and career to spirituality and personal growth.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* 页脚 */}
            <div className="text-center mt-6">
              <p className="text-xs text-[#718096] bg-white/50 px-4 py-2 rounded-full inline-block">
                Life Journey Map • Vedic Astrology • Reference with Attribution
              </p>
            </div>
          </div>
          
          {/* Professional Vedic Astrology Legend */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#F8F9FA] to-[#FFFFFF] rounded-2xl border border-[#E8DDEB]">
            <h5 className="text-sm font-semibold text-[#2C2A32] mb-4 text-center flex items-center justify-center gap-2">
              <span>🔮</span>
              <span>Vedic Astrology Symbols Guide</span>
            </h5>
            
            {/* 行星分类 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 主要行星 */}
              <div className="space-y-2">
                <h6 className="text-xs font-semibold text-[#4A5568] mb-2">Main Planets (Grahas)</h6>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FF0000] flex items-center justify-center">
                      <span className="text-[#FF0000] font-bold text-xs">Su</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Sun (Surya)</div>
                      <div className="text-[#718096]">Soul, vitality, father</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#000000] flex items-center justify-center">
                      <span className="text-[#000000] font-bold text-xs">Mo</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Moon (Chandra)</div>
                      <div className="text-[#718096]">Mind, emotions, mother</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FF8C00] flex items-center justify-center">
                      <span className="text-[#FF8C00] font-bold text-xs">JuR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Jupiter (Guru)</div>
                      <div className="text-[#718096]">Wisdom, teacher, fortune</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#0000FF] flex items-center justify-center">
                      <span className="text-[#0000FF] font-bold text-xs">Sa</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Saturn (Shani)</div>
                      <div className="text-[#718096]">Karma, discipline, longevity</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 次要行星和节点 */}
              <div className="space-y-2">
                <h6 className="text-xs font-semibold text-[#4A5568] mb-2">Other Bodies</h6>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FF1493] flex items-center justify-center">
                      <span className="text-[#FF1493] font-bold text-xs">Ve</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Venus (Shukra)</div>
                      <div className="text-[#718096]">Love, beauty, luxury</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#008000] flex items-center justify-center">
                      <span className="text-[#008000] font-bold text-xs">MeR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Mercury (Budha)</div>
                      <div className="text-[#718096]">Communication, intellect</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#FF0000] flex items-center justify-center">
                      <span className="text-[#FF0000] font-bold text-xs">Ma</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Mars (Mangal)</div>
                      <div className="text-[#718096]">Energy, courage, conflicts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#8B4513] flex items-center justify-center">
                      <span className="text-[#8B4513] font-bold text-xs">Ra</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Rahu (North Node)</div>
                      <div className="text-[#718096]">Desires, obsessions, fame</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#8B4513] flex items-center justify-center">
                      <span className="text-[#8B4513] font-bold text-xs">Ke</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Ketu (South Node)</div>
                      <div className="text-[#718096]">Spirituality, detachment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-[#000000] flex items-center justify-center">
                      <span className="text-[#000000] font-bold text-xs">As</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2A32]">Ascendant (Lagna)</div>
                      <div className="text-[#718096]">Rising sign, personality</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-center text-[#6E6277] mt-4">
            {selectedHouse ? `第${selectedHouse}宫: ${getHouseDomain(selectedHouse)} • 揭示你灵魂伴侣的线索。` : '点击宫位来探索你的爱情命运，发现你的灵魂伴侣会在哪里出现。'}
          </p>
        </div>
      </motion.section>

      {/* Cosmic Gifts (Yogas) */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6">
        {yogasLite.map((y, i) => (
          <YogaCard key={i} yoga={y} index={i} />
        ))}
      </motion.section>

      {/* Current Season (Dasha) */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#FFF0DB] via-[#F7CAC9] to-[#E6E6FA] border border-[#E8DDEB]">
          <div className="text-xs text-[#7A6F82] mb-1">Your current love season</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-serif text-xl text-[#2C2A32] mb-1">Jupiter • Love Expansion</div>
              <p className="text-sm text-[#5C5364]">A 16-year arc of love growth, wisdom and soulmate connection.</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#7A6F82]">2010 — 2026</div>
              <div className="w-40 h-2 bg-white/50 rounded-full overflow-hidden mt-2 relative group">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#A078A6] to-[#FFD700] relative"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                >
                  <div className="absolute right-0 top-0 w-2 h-2 bg-[#FFD700] rounded-full transform translate-x-1 -translate-y-0.5 shadow-lg" />
                </motion.div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2C2A32] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  当前: 2024年 (75% 完成)
              </div>
            </div>
          </div>
          </div>
          <div className="mt-4 text-sm text-[#6E6277] flex items-center gap-2">
            <span className="text-[#A078A6]">💕</span>
            Now highlighting Venus themes: soulmate attraction and romantic creativity.
            <span className="text-xs text-[#A078A6] bg-white/50 px-2 py-1 rounded-full ml-auto">
              Love Period
            </span>
          </div>
        </div>
      </motion.section>

      {/* Soulmate Report CTA */}
      <div className="text-center space-y-4">
        <motion.button 
          onClick={() => router.push('/report/spouse')} 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white hover:shadow-xl transition-all duration-300 font-medium text-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">💖</span>
          查看我的灵魂伴侣
          <FiChevronRight className="text-lg" />
        </motion.button>
        <p className="text-xs text-[#7A6F82] mt-3">获取专业的灵魂伴侣匹配报告和爱情指导</p>
        
        <motion.button 
          onClick={onDeepDive} 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#EADCF1] to-[#FFD8A8] text-[#6A4AA3] hover:shadow-lg transition-all duration-300 font-medium"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">🔮</span>
          深度占星解读
          <FiChevronRight className="text-lg" />
        </motion.button>
      </div>
    </div>
  );
}

function NorthIndianChart({ selectedHouse, onSelectHouse }: { selectedHouse: number | null; onSelectHouse: (h: number) => void }) {
  // 专业印度占星盘实现 - 支持南印度和北印度两种风格
  
  const [chartStyle, setChartStyle] = useState<'south' | 'north'>('south');
  
  const chartSize = 400;
  const padding = 20;
  
  // 星座名称 (梵文)
  const signNames = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
  ];
  
  // 星座英文名称
  const signNamesEn = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // 示例数据：上升点在天秤座 (第7个星座)
  const lagnaSign = 7; // 天秤座
  
  // 行星数据 (基于真实占星计算)
  const planetsData = [
    { symbol: 'As', house: 1, sign: lagnaSign, degree: '15°30\'', color: '#000000', name: 'Ascendant', retrograde: false },
    { symbol: 'Su', house: 9, sign: ((lagnaSign + 9 - 2) % 12) + 1, degree: '12°45\'', color: '#FF0000', name: 'Sun', retrograde: false },
    { symbol: 'Mo', house: 2, sign: ((lagnaSign + 2 - 2) % 12) + 1, degree: '28°12\'', color: '#000000', name: 'Moon', retrograde: false },
    { symbol: 'Ma', house: 7, sign: ((lagnaSign + 7 - 2) % 12) + 1, degree: '8°33\'', color: '#FF0000', name: 'Mars', retrograde: false },
    { symbol: 'MeR', house: 9, sign: ((lagnaSign + 9 - 2) % 12) + 1, degree: '25°18\'', color: '#008000', name: 'Mercury', retrograde: true },
    { symbol: 'JuR', house: 1, sign: lagnaSign, degree: '22°56\'', color: '#FF8C00', name: 'Jupiter', retrograde: true },
    { symbol: 'Ve', house: 11, sign: ((lagnaSign + 11 - 2) % 12) + 1, degree: '19°07\'', color: '#FF1493', name: 'Venus', retrograde: false },
    { symbol: 'Sa', house: 12, sign: ((lagnaSign + 12 - 2) % 12) + 1, degree: '14°29\'', color: '#0000FF', name: 'Saturn', retrograde: false },
    { symbol: 'Ra', house: 1, sign: lagnaSign, degree: '18°42\'', color: '#8B4513', name: 'Rahu', retrograde: false },
    { symbol: 'Ke', house: 7, sign: ((lagnaSign + 7 - 2) % 12) + 1, degree: '18°42\'', color: '#8B4513', name: 'Ketu', retrograde: false }
  ];
  
  // 南印度占星盘渲染
  const renderSouthIndianChart = () => {
    const cellWidth = chartSize / 4;
    const cellHeight = chartSize / 4;
    
    // 南印度占星盘固定星座布局 (3x4网格)
    const fixedSignLayout = [
      [10, 11, 12, 1],  // 第一行：摩羯、水瓶、双鱼、白羊
      [9, 0, 0, 2],     // 第二行：射手、中心、中心、金牛  
      [8, 7, 6, 3],     // 第三行：天蝎、天秤、处女、双子
      [0, 5, 4, 0]      // 第四行：中心、狮子、巨蟹、中心
    ];
    
    const getSignForHouse = (houseNum: number) => {
      return ((lagnaSign + houseNum - 2) % 12) + 1;
    };
    
    const getHousePosition = (houseNum: number) => {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (fixedSignLayout[row][col] === houseNum) {
            return {
              x: padding + col * cellWidth + cellWidth / 2,
              y: padding + row * cellHeight + cellHeight / 2,
              row,
              col
            };
          }
        }
      }
      return null;
    };
    
    const renderHouse = (houseNum: number) => {
      const position = getHousePosition(houseNum);
      if (!position) return null;
      
      const signNum = getSignForHouse(houseNum);
      const isKendra = [1, 4, 7, 10].includes(houseNum);
      const isSelected = selectedHouse === houseNum;
      
  return (
        <g key={houseNum}>
          <rect
            x={position.x - cellWidth / 2}
            y={position.y - cellHeight / 2}
            width={cellWidth}
            height={cellHeight}
            fill={isSelected ? '#FFF8DC' : 'white'}
            stroke={isKendra ? '#E53E3E' : '#D1D5DB'}
            strokeWidth={isKendra ? 3 : 1}
            className="cursor-pointer"
            onClick={() => onSelectHouse(houseNum)}
          />
          
          <text
            x={position.x}
            y={position.y - 15}
            fontSize="28"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#2D3748"
          >
            {signNum}
          </text>
          
          <text
            x={position.x}
            y={position.y + 5}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#E53E3E"
          >
            {houseNum}
          </text>
          
          <text
            x={position.x}
            y={position.y + 20}
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#718096"
          >
            {signNames[signNum - 1].substring(0, 4)}
          </text>
          
          {houseNum === 1 && (
            <g>
              <line
                x1={position.x - 20}
                y1={position.y - 30}
                x2={position.x + 20}
                y2={position.y - 30}
                stroke="#E53E3E"
                strokeWidth="2"
              />
              <text
                x={position.x}
                y={position.y - 35}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#E53E3E"
              >
                LAGNA
              </text>
            </g>
          )}
        </g>
      );
    };
    
    const renderPlanet = (planet: any) => {
      const position = getHousePosition(planet.house);
      if (!position) return null;
      
      const planetOffset = planetsData.filter(p => p.house === planet.house).indexOf(planet);
      const offsetX = (planetOffset % 3 - 1) * 15;
      const offsetY = Math.floor(planetOffset / 3) * 15;
      
          return (
        <g key={planet.symbol}>
          <g className="cursor-pointer">
            <circle
              cx={position.x + offsetX}
              cy={position.y + offsetY + 35}
              r="12"
              fill="white"
              stroke={planet.color}
              strokeWidth="2"
            />
            <title>{`${planet.name} in ${signNamesEn[planet.sign - 1]} ${planet.degree} ${planet.retrograde ? '(Retrograde)' : ''}`}</title>
          </g>
          
          <text
            x={position.x + offsetX}
            y={position.y + offsetY + 39}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={planet.color}
          >
            {planet.symbol}
          </text>
          
          {planet.retrograde && (
            <text
              x={position.x + offsetX + 8}
              y={position.y + offsetY + 32}
              fontSize="8"
              fill={planet.color}
            >
              R
            </text>
          )}
            </g>
          );
    };
    
    return (
      <svg 
        viewBox={`0 0 ${chartSize + padding * 2} ${chartSize + padding * 2}`}
        className="w-[440px] h-[440px] border border-[#E8DDEB] rounded-lg bg-[#FFFAF0] shadow-lg"
      >
        <rect 
          x={padding} 
          y={padding} 
          width={chartSize} 
          height={chartSize} 
          fill="none" 
          stroke="#2D3748" 
          strokeWidth="2"
        />
        
        {[1, 2, 3].map(i => (
          <line 
            key={`h-${i}`} 
            x1={padding} 
            y1={padding + i * cellHeight} 
            x2={padding + chartSize} 
            y2={padding + i * cellHeight} 
            stroke="#D1D5DB" 
            strokeWidth="1"
          />
        ))}
        {[1, 2, 3].map(i => (
          <line 
            key={`v-${i}`} 
            x1={padding + i * cellWidth} 
            y1={padding} 
            x2={padding + i * cellWidth} 
            y2={padding + chartSize} 
            stroke="#D1D5DB" 
            strokeWidth="1"
          />
        ))}
        
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(renderHouse)}
        {planetsData.map(renderPlanet)}
        
        <circle 
          cx={padding + chartSize / 2} 
          cy={padding + chartSize / 2} 
          r="25" 
          fill="none" 
          stroke="#D69E2E" 
          strokeWidth="2"
        />
        <text 
          x={padding + chartSize / 2} 
          y={padding + chartSize / 2} 
          fontSize="12" 
          fontWeight="bold" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#D69E2E"
        >
          RASI
        </text>
      </svg>
    );
  };
  
  // 北印度占星盘渲染 (菱形)
  const renderNorthIndianChart = () => {
    const centerX = padding + chartSize / 2;
    const centerY = padding + chartSize / 2;
    const radius = chartSize / 2 - 20;
    
    // 北印度占星盘12个菱形宫位的位置 (逆时针)
    const getHousePosition = (houseNum: number) => {
      const angle = ((houseNum - 1) * 30 - 90) * Math.PI / 180; // 从顶部开始
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };
    
    const getSignForHouse = (houseNum: number) => {
      return ((lagnaSign + houseNum - 2) % 12) + 1;
    };
    
    const renderHouse = (houseNum: number) => {
      const position = getHousePosition(houseNum);
      const signNum = getSignForHouse(houseNum);
      const isKendra = [1, 4, 7, 10].includes(houseNum);
      const isSelected = selectedHouse === houseNum;
      
      return (
        <g key={houseNum}>
          {/* 菱形宫位 */}
          <polygon
            points={`
              ${position.x},${position.y - 25}
              ${position.x + 25},${position.y}
              ${position.x},${position.y + 25}
              ${position.x - 25},${position.y}
            `}
            fill={isSelected ? '#FFF8DC' : 'white'}
            stroke={isKendra ? '#E53E3E' : '#D1D5DB'}
            strokeWidth={isKendra ? 3 : 1}
            className="cursor-pointer"
            onClick={() => onSelectHouse(houseNum)}
          />
          
          <text
            x={position.x}
            y={position.y - 8}
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#2D3748"
          >
            {signNum}
          </text>
          
          <text
            x={position.x}
            y={position.y + 8}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#E53E3E"
          >
            {houseNum}
          </text>
          
          {houseNum === 1 && (
            <g>
              <line
                x1={position.x - 20}
                y1={position.y - 35}
                x2={position.x + 20}
                y2={position.y - 35}
                stroke="#E53E3E"
                strokeWidth="2"
              />
              <text
                x={position.x}
                y={position.y - 45}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#E53E3E"
              >
                LAGNA
              </text>
            </g>
          )}
        </g>
      );
    };
    
    const renderPlanet = (planet: any) => {
      const position = getHousePosition(planet.house);
      const planetOffset = planetsData.filter(p => p.house === planet.house).indexOf(planet);
      const offsetX = (planetOffset % 2 - 0.5) * 10;
      const offsetY = Math.floor(planetOffset / 2) * 10;
      
      return (
        <g key={planet.symbol}>
          <g className="cursor-pointer">
            <circle
              cx={position.x + offsetX}
              cy={position.y + offsetY}
              r="10"
              fill="white"
              stroke={planet.color}
              strokeWidth="2"
            />
            <title>{`${planet.name} in ${signNamesEn[planet.sign - 1]} ${planet.degree} ${planet.retrograde ? '(Retrograde)' : ''}`}</title>
          </g>
          
          <text
            x={position.x + offsetX}
            y={position.y + offsetY + 4}
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={planet.color}
          >
            {planet.symbol}
          </text>
          
          {planet.retrograde && (
            <text
              x={position.x + offsetX + 6}
              y={position.y + offsetY - 6}
              fontSize="6"
              fill={planet.color}
            >
              R
            </text>
          )}
        </g>
      );
    };
    
    return (
      <svg 
        viewBox={`0 0 ${chartSize + padding * 2} ${chartSize + padding * 2}`}
        className="w-[440px] h-[440px] border border-[#E8DDEB] rounded-lg bg-[#FFFAF0] shadow-lg"
      >
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="none" 
          stroke="#2D3748" 
          strokeWidth="2"
        />
        
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(renderHouse)}
        {planetsData.map(renderPlanet)}
        
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="20" 
          fill="none" 
          stroke="#D69E2E" 
          strokeWidth="2"
        />
        <text 
          x={centerX} 
          y={centerY} 
          fontSize="10" 
          fontWeight="bold" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#D69E2E"
        >
          RASI
        </text>
      </svg>
    );
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* 占星盘标题和切换按钮 */}
      <div className="text-center">
        <h4 className="text-xl font-bold text-[#2D3748] mb-3">
          {chartStyle === 'south' ? 'South Indian Rasi Chart' : 'North Indian Rasi Chart'}
        </h4>
        <div className="flex items-center justify-center gap-4 text-sm text-[#718096] mb-4">
          <span>Lagna: {signNames[lagnaSign - 1]} ({signNamesEn[lagnaSign - 1]})</span>
          <span>•</span>
          <span>House System: {chartStyle === 'south' ? 'South Indian' : 'North Indian'}</span>
        </div>
        
        {/* 风格切换按钮 */}
        <div className="flex items-center gap-2 bg-[#F7FAFC] rounded-lg p-1">
          <button
            onClick={() => setChartStyle('south')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chartStyle === 'south' 
                ? 'bg-white text-[#2D3748] shadow-sm' 
                : 'text-[#718096] hover:text-[#2D3748]'
            }`}
          >
            South Indian
          </button>
          <button
            onClick={() => setChartStyle('north')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              chartStyle === 'north' 
                ? 'bg-white text-[#2D3748] shadow-sm' 
                : 'text-[#718096] hover:text-[#2D3748]'
            }`}
          >
            North Indian
          </button>
        </div>
      </div>
      
      {/* 渲染对应的占星盘 */}
      {chartStyle === 'south' ? renderSouthIndianChart() : renderNorthIndianChart()}
      
      {/* 占星盘说明 */}
      <div className="text-center max-w-lg">
        <p className="text-sm text-[#718096] leading-relaxed">
          {chartStyle === 'south' 
            ? 'Traditional South Indian Rasi Chart with fixed zodiac positions. Red borders indicate Kendra (angular) houses.'
            : 'Traditional North Indian Rasi Chart with fixed house positions. Houses rotate based on ascendant sign.'
          }
          <br />
          Hover over planets for details. Click houses to explore.
        </p>
      </div>
    </div>
  );
}

function BigCard({ title, highlight, line, color, emoji, degree, influence }: { 
  title: string; 
  highlight: string; 
  line: string; 
  color: string; 
  emoji: string;
  degree?: string;
  influence?: string;
}) {
  return (
    <motion.div 
      className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer relative overflow-hidden" 
      style={{ background: color, borderColor: '#E8DDEB' }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <div className="text-6xl">{emoji}</div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[#7A6F82] font-medium uppercase tracking-wide">{title}</div>
          <motion.div 
            className="text-3xl" 
            aria-hidden
            whileHover={{ scale: 1.3, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {emoji}
          </motion.div>
    </div>
        
        <div className="mb-3">
          <div className="font-serif text-xl text-[#2C2A32] mb-1">{highlight}</div>
          {degree && (
            <div className="text-xs text-[#A078A6] font-semibold bg-white/50 px-3 py-1 rounded-full inline-block">
              {degree}
            </div>
          )}
        </div>
        
        <p className="text-sm text-[#5C5364] leading-relaxed mb-3">{line}</p>
        
        {influence && (
          <div className="text-xs text-[#7A6F82] bg-white/40 px-3 py-2 rounded-lg">
            <strong className="text-[#A078A6]">Influences:</strong> {influence}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PlanetCard({ planet, isHighlighted, onHighlight }: { planet: any; isHighlighted: boolean; onHighlight: (key: string | null) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -2 }}
      onMouseEnter={() => onHighlight(planet.key)}
      onMouseLeave={() => onHighlight(null)}
    >
      <motion.div
        className={`h-full rounded-2xl p-5 border cursor-pointer transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-[#A078A6] ring-offset-2 ring-offset-[#FFF8FB] shadow-lg' : 'hover:shadow-md'
        }`}
        style={{ background: planet.color, borderColor: '#E8DDEB' }}
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs text-[#7A6F82] font-medium uppercase tracking-wide">{planet.tag}</div>
          <motion.div 
            className="text-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {planet.emoji}
          </motion.div>
        </div>
        
        <div className="font-serif text-lg mb-2 text-[#2C2A32] leading-tight">{planet.title}</div>
        <div className="text-xs text-[#A078A6] mb-3 font-semibold bg-white/40 px-2 py-1 rounded-full inline-block">
          {planet.position}
        </div>
        <p className="text-sm text-[#5C5364] leading-relaxed mb-4">{planet.blurb}</p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-[#E8DDEB]/50"
            >
              <div className="text-sm text-[#5C5364] mb-3 leading-relaxed">
                <strong className="text-[#A078A6] block mb-1">Astrological Meaning:</strong>
                <span>{planet.details}</span>
              </div>
              <div className="text-xs text-[#7A6F82] bg-white/50 rounded-lg p-3">
                <strong className="text-[#A078A6] block mb-1">Life Influence:</strong>
                <span>{planet.influence}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="mt-4 text-xs text-[#A078A6] text-center font-medium"
          whileHover={{ scale: 1.05 }}
        >
          {isExpanded ? '点击收起详情' : '点击展开详情'}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function YogaCard({ yoga, index }: { yoga: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      className="rounded-2xl p-6 bg-[#FFF9FC] border border-[#F1D7E3] cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs text-[#A078A6] mb-1">You are blessed with…</div>
        <div className="text-2xl">{yoga.emoji}</div>
      </div>
      <div className="font-serif text-lg text-[#2C2A32] mb-1">{yoga.title}</div>
      <div className="text-xs text-[#7A6F82] mb-2">{yoga.subtitle}</div>
      <p className="text-sm text-[#5C5364]">{yoga.desc}</p>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-[#F1D7E3]"
          >
            <div className="text-sm text-[#5C5364] mb-3 leading-relaxed">
              <strong className="text-[#A078A6]">Deep Insight:</strong> {yoga.details}
            </div>
            <div className="text-xs text-[#7A6F82] bg-[#FFF0DB] rounded-lg p-3">
              <strong>Life Influence:</strong> {yoga.influence}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-3 text-xs text-[#A078A6] text-center">
        {isExpanded ? '点击收起' : '点击展开详情'}
    </div>
    </motion.div>
  );
}

function getHouseDomain(house: number) {
  switch (house) {
    case 1: return '自我身份、外貌与第一印象';
    case 2: return '财富、价值观与物质安全感';
    case 3: return '沟通、学习与兄弟姐妹关系';
    case 4: return '家庭、根基与内心安全感';
    case 5: return '创意、爱情与子女';
    case 6: return '健康、工作与日常生活';
    case 7: return '婚姻、伙伴关系与合作';
    case 8: return '转化、共同资源与深度连接';
    case 9: return '智慧、高等教育与长途旅行';
    case 10: return '事业、社会地位与人生目标';
    case 11: return '朋友、社群与未来愿景';
    case 12: return '潜意识、灵性与内在世界';
    default: return '未知宫位';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart Mode (Deep Dive) • retains your professional grid-based implementation
// ─────────────────────────────────────────────────────────────────────────────
function ChartView() {
  const [chartStyle, setChartStyle] = useState<'south' | 'north'>('south');
  const [selectedGraha, setSelectedGraha] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-3 space-y-6">
        <LeftSidebarDark />
      </div>

      {/* Center */}
      <div className="col-span-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-[#101628] rounded-lg p-1">
            <button onClick={() => setChartStyle('south')} className={chartStyle === 'south' ? 'px-4 py-2 rounded-md bg-[#FFD700] text-[#0a0e1a]' : 'px-4 py-2 rounded-md text-[#A0A0A0] hover:text-[#E0E0E0]'}>
              South Indian
            </button>
            <button onClick={() => setChartStyle('north')} className={chartStyle === 'north' ? 'px-4 py-2 rounded-md bg-[#FFD700] text-[#0a0e1a]' : 'px-4 py-2 rounded-md text-[#A0A0A0] hover:text-[#E0E0E0]'}>
              North Indian
            </button>
          </div>
          <div className="text-sm text-[#A0A0A0]">D1 • D9 • D10</div>
        </div>

        {/* Chart */}
        <div className="flex items-center justify-center">
          {chartStyle === 'south' ? (
            <SouthIndianChartDeep
              selectedGraha={selectedGraha}
              setSelectedGraha={setSelectedGraha}
              hoveredHouse={hoveredHouse}
              setHoveredHouse={setHoveredHouse}
            />
          ) : (
            <NorthIndianChartDetailed
              selectedGraha={selectedGraha}
              setSelectedGraha={setSelectedGraha}
              hoveredHouse={hoveredHouse}
              setHoveredHouse={setHoveredHouse}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3">
        <RightSidebarDark />
      </div>
    </div>
  );
}

// Dark themed sidebars (reuse content with night palette)
function LeftSidebarDark() {
  return (
    <div className="p-6 space-y-8 rounded-2xl bg-[#101628] border border-white/10">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#FFD700] mb-1">{birthInfo.name}</h2>
            <div className="text-xs text-[#A0A0A0]">{birthInfo.nameLocal}</div>
          </div>
          <button className="text-[#FFD700]/80 hover:text-[#FFD700] transition-colors"><FiSettings size={18} /></button>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-[#A0A0A0]"><span>Birth Date</span><span className="text-[#E0E0E0]">{birthInfo.date}</span></div>
          <div className="flex justify-between text-[#A0A0A0]"><span>Birth Time</span><span className="text-[#E0E0E0]">{birthInfo.time}</span></div>
          <div className="flex justify-between text-[#A0A0A0]"><span>Birth Place</span><span className="text-[#E0E0E0]">{birthInfo.location}</span></div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#FFD700] mb-3">Planetary Positions</h3>
        <div className="space-y-1 text-xs text-[#E0E0E0]/90">
          {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((n) => (
            <div key={n} className="p-2 rounded bg-white/5 hover:bg-white/10 transition">{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightSidebarDark() {
  return (
    <div className="p-6 space-y-8 rounded-2xl bg-[#101628] border border-white/10">
      <div>
        <h3 className="text-sm font-semibold text-[#FFD700] mb-3">Vimshottari Dasha</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded bg-[#0a0e1a] border-l-4 border-[#FFD700]">Jupiter • 2010—2026</div>
          <div className="p-3 rounded bg-white/5">Saturn • 2021.05—2024.01</div>
          <div className="p-3 rounded bg-white/5">Mercury • 2024.01—2026.05</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#FFD700] mb-3">Key Yogas</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded bg-white/5">Budhaditya • Eloquence</div>
          <div className="p-3 rounded bg-white/5">Gaja Kesari • Grace</div>
        </div>
      </div>
    </div>
  );
}

function SouthIndianChartDeep({ selectedGraha, setSelectedGraha, hoveredHouse, setHoveredHouse }: any) {
  // 4×3 grid with glow lines (night palette)
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <svg viewBox="0 0 600 450" className="w-full max-w-4xl h-auto">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Vertical */}
      {[150, 300, 450].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={450} stroke="#00BFFF" strokeWidth="1" opacity="0.8" filter="url(#glow)" />
      ))}
      {/* Horizontal */}
      {[150, 300].map((y) => (
        <line key={y} x1={0} y1={y} x2={600} y2={y} stroke="#00BFFF" strokeWidth="1" opacity="0.8" filter="url(#glow)" />
      ))}
      {houses.map((num, idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const x = col * 150;
        const y = row * 150;
        return (
          <g key={num}>
            <rect x={x} y={y} width={150} height={150} fill={hoveredHouse === num ? 'rgba(0,191,255,0.08)' : 'transparent'} onMouseEnter={() => setHoveredHouse(num)} onMouseLeave={() => setHoveredHouse(null)} />
            <text x={x + 75} y={y + 30} textAnchor="middle" fill="#E0E0E0" fontSize="14" fontWeight="bold">{num}</text>
          </g>
        );
      })}
    </svg>
  );
}

function NorthIndianChartDetailed({ selectedGraha, setSelectedGraha, hoveredHouse, setHoveredHouse }: any) {
  // Basic diamond with house centers and a few sample placements
  const houseCenters = [
    { num: 1, x: 200, y: 110 },
    { num: 2, x: 250, y: 140 },
    { num: 3, x: 290, y: 180 },
    { num: 4, x: 320, y: 230 },
    { num: 5, x: 290, y: 280 },
    { num: 6, x: 250, y: 320 },
    { num: 7, x: 200, y: 350 },
    { num: 8, x: 150, y: 320 },
    { num: 9, x: 110, y: 280 },
    { num: 10, x: 80, y: 230 },
    { num: 11, x: 110, y: 180 },
    { num: 12, x: 150, y: 140 },
  ];
  const placements = [
    { symbol: '☉', house: 1, color: '#FFD700' },
    { symbol: '☽', house: 2, color: '#FFD700' },
    { symbol: '♄', house: 7, color: '#C0C0C0' },
    { symbol: '♀', house: 12, color: '#FFD700' },
  ];
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-2xl h-auto">
      <defs>
        <filter id="glowN"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Diamond frame */}
      <path d="M 200 50 L 350 200 L 200 350 L 50 200 Z" fill="none" stroke="#E3B37C" strokeWidth="2" filter="url(#glowN)" opacity="0.9" />
      {/* Inner cross */}
      <line x1="200" y1="50" x2="200" y2="350" stroke="#BA94FF" strokeWidth="1.5" opacity="0.6" />
      <line x1="50" y1="200" x2="350" y2="200" stroke="#BA94FF" strokeWidth="1.5" opacity="0.6" />

      {/* Houses hover rings + numbers */}
      {houseCenters.map((h) => (
        <g key={h.num} onMouseEnter={() => setHoveredHouse(h.num)} onMouseLeave={() => setHoveredHouse(null)}>
          <circle cx={h.x} cy={h.y} r={hoveredHouse === h.num ? 20 : 14} fill="none" stroke="#FFD8A8" strokeWidth={hoveredHouse === h.num ? 2 : 1} opacity={0.8} />
          <text x={h.x} y={h.y + 4} textAnchor="middle" fill="#E8C4D8" fontSize="10">{h.num}</text>
        </g>
      ))}

      {/* Planets */}
      {placements.map((p, i) => {
        const hc = houseCenters.find((h) => h.num === p.house)!;
        const active = selectedGraha === p.symbol;
        return (
          <g key={i} onClick={() => setSelectedGraha(active ? null : p.symbol)} className="cursor-pointer">
            {active && <circle cx={hc.x} cy={hc.y - 14} r={16} fill="none" stroke="#FFD700" strokeWidth={2} />}
            <text x={hc.x} y={hc.y - 10} textAnchor="middle" fill={p.color} fontSize="18" filter="url(#glowN)">{p.symbol}</text>
          </g>
        );
      })}
    </svg>
  );
}

function NorthIndianComingSoon() {
  return <div className="text-center text-[#A0A0A0] py-16">North Indian Chart (detailed) coming soon…</div>;
}

