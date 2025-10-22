'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Planet {
  name: string;
  symbol: string;
  sign: string;
  degree: string;
  house: number;
  nakshatra: string;
  karaka?: string;
}

interface ChartData {
  planets: Planet[];
  houses: { [key: number]: Planet[] };
}

interface NorthIndianChartProps {
  data?: ChartData;
}

export default function NorthIndianChart({ data }: NorthIndianChartProps) {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);

  // 模拟数据（如果没有传入真实数据）
  const defaultData: ChartData = {
    planets: [
      { name: '太阳', symbol: '☉', sign: '♏', degree: '4°26\'', house: 6, nakshatra: '房宿', karaka: '' },
      { name: '月亮', symbol: '☽', sign: '♑', degree: '27°46\'', house: 8, nakshatra: '虚宿', karaka: 'Ak' },
      { name: '火星', symbol: '♂', sign: '♏', degree: '14°23\'', house: 6, nakshatra: '房宿' },
      { name: '水星', symbol: '☿', sign: '♎', degree: '15°2\'', house: 5, nakshatra: '六宿', karaka: 'Bk' },
      { name: '木星', symbol: '♃', sign: '♎', degree: '8°22\'', house: 5, nakshatra: '六宿', karaka: 'Pk' },
      { name: '金星', symbol: '♀', sign: '♎', degree: '20°33\'', house: 5, nakshatra: '氐宿', karaka: 'Amk' },
      { name: '土星', symbol: '♄', sign: '♒', degree: '0°21\'', house: 9, nakshatra: '虚宿', karaka: 'Dk' },
      { name: '北交点', symbol: '⛢', sign: '♏', degree: '9°18\'', house: 6, nakshatra: '房宿' },
      { name: '南交点', symbol: '⛢', sign: '♉', degree: '9°18\'', house: 12, nakshatra: '昴宿' },
    ],
    houses: {},
  };

  // 组织行星到宫位
  const chartData = data || defaultData;
  const houseGroups: { [key: number]: Planet[] } = {};
  chartData.planets.forEach(planet => {
    if (!houseGroups[planet.house]) {
      houseGroups[planet.house] = [];
    }
    houseGroups[planet.house].push(planet);
  });

  const housePositions = [
    { house: 1, x: 50, y: 0, label: '1宫(♊)' },
    { house: 2, x: 75, y: 0, label: '2宫(♋)' },
    { house: 3, x: 100, y: 25, label: '3宫(♋)' },
    { house: 4, x: 100, y: 50, label: '4宫(♍)' },
    { house: 5, x: 100, y: 75, label: '5宫(♎)' },
    { house: 6, x: 75, y: 100, label: '6宫(♏)' },
    { house: 7, x: 50, y: 100, label: '7宫(♐)' },
    { house: 8, x: 25, y: 100, label: '8宫(♑)' },
    { house: 9, x: 0, y: 75, label: '9宫(♒)' },
    { house: 10, x: 0, y: 50, label: '10宫(♓)' },
    { house: 11, x: 0, y: 25, label: '11宫(♈)' },
    { house: 12, x: 25, y: 0, label: '12宫(♉)' },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* SVG Chart */}
      <svg viewBox="0 0 600 600" className="w-full h-auto">
        {/* 菱形外框 */}
        <motion.path
          d="M 300 50 L 550 300 L 300 550 L 50 300 Z"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* 内部十字线 */}
        <line x1="300" y1="50" x2="300" y2="550" stroke="rgba(227, 179, 124, 0.3)" strokeWidth="1" />
        <line x1="50" y1="300" x2="550" y2="300" stroke="rgba(227, 179, 124, 0.3)" strokeWidth="1" />

        {/* 对角线 */}
        <line x1="50" y1="300" x2="550" y2="300" stroke="rgba(227, 179, 124, 0.3)" strokeWidth="1" />
        <line x1="300" y1="50" x2="300" y2="550" stroke="rgba(227, 179, 124, 0.3)" strokeWidth="1" />

        {/* 渐变定义 */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3B37C" />
            <stop offset="50%" stopColor="#EAA5C8" />
            <stop offset="100%" stopColor="#BA94FF" />
          </linearGradient>
        </defs>

        {/* 12个宫位区域 */}
        {housePositions.map((pos, i) => {
          const planets = houseGroups[pos.house] || [];
          const isHovered = hoveredHouse === pos.house;

          return (
            <g key={pos.house}>
              {/* 宫位标签 */}
              <motion.text
                x={pos.x === 0 ? 80 : pos.x === 100 ? 520 : pos.x === 50 ? 300 : pos.x < 50 ? 150 : 450}
                y={pos.y === 0 ? 80 : pos.y === 100 ? 520 : pos.y === 50 ? 300 : pos.y < 50 ? 150 : 450}
                fill={isHovered ? '#EAA5C8' : '#B8A4C9'}
                fontSize="12"
                textAnchor="middle"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredHouse(pos.house)}
                onMouseLeave={() => setHoveredHouse(null)}
              >
                {pos.house}
              </motion.text>

              {/* 宫位内的行星 */}
              {planets.map((planet, idx) => (
                <motion.g
                  key={`${pos.house}-${idx}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  onMouseEnter={() => setHoveredPlanet(planet)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                  className="cursor-pointer"
                >
                  <text
                    x={pos.x === 0 ? 100 + idx * 25 : pos.x === 100 ? 500 - idx * 25 : pos.x === 50 ? 280 + idx * 20 : pos.x < 50 ? 120 + idx * 25 : 480 - idx * 25}
                    y={pos.y === 0 ? 100 + idx * 20 : pos.y === 100 ? 500 - idx * 20 : pos.y === 50 ? 320 + idx * 20 : pos.y < 50 ? 120 + idx * 20 : 480 - idx * 20}
                    fill={hoveredPlanet === planet ? '#FFD8A8' : '#E3B37C'}
                    fontSize="20"
                    textAnchor="middle"
                    className="transition-all"
                  >
                    {planet.symbol}
                  </text>
                  {planet.karaka && (
                    <text
                      x={pos.x === 0 ? 100 + idx * 25 : pos.x === 100 ? 500 - idx * 25 : pos.x === 50 ? 280 + idx * 20 : pos.x < 50 ? 120 + idx * 25 : 480 - idx * 25}
                      y={pos.y === 0 ? 115 + idx * 20 : pos.y === 100 ? 485 - idx * 20 : pos.y === 50 ? 305 + idx * 20 : pos.y < 50 ? 105 + idx * 20 : 465 - idx * 20}
                      fill="#BA94FF"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      [{planet.karaka}]
                    </text>
                  )}
                </motion.g>
              ))}
            </g>
          );
        })}

        {/* 中心点 */}
        <circle cx="300" cy="300" r="4" fill="#FFD8A8" />
        <text x="300" y="315" fill="#FFF5F7" fontSize="10" textAnchor="middle">
          中心
        </text>
      </svg>

      {/* 悬停信息卡片 */}
      {hoveredPlanet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 glass-card p-4 max-w-xs"
        >
          <h4 className="text-lg font-display gradient-text mb-2">
            {hoveredPlanet.symbol} {hoveredPlanet.name}
          </h4>
          <div className="text-sm text-text-secondary space-y-1">
            <p>星座: {hoveredPlanet.sign}</p>
            <p>度数: {hoveredPlanet.degree}</p>
            <p>宫位: 第{hoveredPlanet.house}宫</p>
            <p>星宿: {hoveredPlanet.nakshatra}</p>
            {hoveredPlanet.karaka && (
              <p className="text-rose-gold">Karaka: {hoveredPlanet.karaka}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}



