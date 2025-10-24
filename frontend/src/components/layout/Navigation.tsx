'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-twilight-deep/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-3 group"
        >
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            🌟
          </motion.span>
          <div>
            <div className="text-lg font-serif text-white group-hover:text-pink-300 transition">AstroSoul</div>
            <div className="text-[10px] text-purple-300 tracking-wider uppercase">Find Your Path</div>
          </div>
        </button>

        {/* Center: Main Dual Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="relative pb-1 group"
          >
            <div className={`flex items-center gap-2 transition-all ${
              pathname === '/dashboard' 
                ? 'text-white font-semibold' 
                : 'text-purple-300 hover:text-white'
            }`}>
              <span className="text-sm">🌙</span>
              <span className="text-sm">My Soul</span>
            </div>
            {pathname === '/dashboard' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            {pathname !== '/dashboard' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300/0 group-hover:bg-purple-300/50 transition-colors" />
            )}
          </button>
          
          <button 
            onClick={() => router.push('/report/spouse')}
            className="relative pb-1 group"
          >
            <div className={`flex items-center gap-2 transition-all ${
              pathname === '/report/spouse' 
                ? 'text-white font-semibold' 
                : 'text-purple-300 hover:text-white'
            }`}>
              <motion.span 
                className="text-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                💕
              </motion.span>
              <span className="text-sm">My Soulmate</span>
            </div>
            {pathname === '/report/spouse' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            {pathname !== '/report/spouse' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300/0 group-hover:bg-purple-300/50 transition-colors" />
            )}
          </button>
        </div>
        
        {/* Right: Secondary Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/birth-info')}
            className="text-xs text-purple-300 hover:text-white transition hidden lg:block"
          >
            Birth Info
          </button>
          <button 
            onClick={() => router.push('/pricing')}
            className="text-xs text-purple-300 hover:text-white transition hidden lg:block"
          >
            Pricing
          </button>
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm hover:shadow-lg transition">
            X
          </button>
        </div>
      </div>
    </nav>
  );
}
