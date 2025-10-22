/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 暮光女神配色方案
        twilight: {
          deep: '#1a1430',      // 深紫罗兰
          mystic: '#2d1b4e',    // 神秘紫
        },
        rose: {
          gold: '#E3B37C',      // 天体金
          pink: '#EAA5C8',      // 玫瑰粉
        },
        lavender: {
          light: '#BA94FF',     // 薰衣草紫
        },
        coral: {
          pink: '#FF9AA2',      // 珊瑚粉
        },
        text: {
          primary: '#FFF5F7',   // 温暖的白
          secondary: '#E8C4D8', // 柔和的粉白
          muted: '#B8A4C9',     // 淡紫灰
        },
        love: '#FFB3BA',        // 甜蜜粉
        magic: '#BA94FF',       // 魔法紫
        gold: '#FFD8A8',        // 暖金色
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      backgroundImage: {
        'twilight-gradient': 'linear-gradient(135deg, #1a1430 0%, #2d1b4e 50%, #1a1430 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255, 192, 203, 0.08) 0%, rgba(186, 148, 255, 0.05) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #E3B37C 0%, #EAA5C8 50%, #BA94FF 100%)',
        'cta-gradient': 'linear-gradient(135deg, #BA94FF 0%, #E3B37C 50%, #EAA5C8 100%)',
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 154, 162, 0.4)',
        'glow-purple': '0 0 20px rgba(186, 148, 255, 0.4)',
        'glow-gold': '0 0 20px rgba(255, 216, 168, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(186, 148, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 154, 162, 0.6)' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};


