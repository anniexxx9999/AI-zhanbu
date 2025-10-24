// AI提示词生成器 - 基于占星学数据生成个性化的AI画像提示词

export interface AstrologicalData {
  sunSign?: string;
  moonSign?: string;
  venusSign?: string;
  marsSign?: string;
  risingSign?: string;
  seventhHouse?: any;
  navamsa?: any;
}

export interface AIPromptConfig {
  style: 'realistic' | 'artistic' | 'mystical' | 'romantic';
  quality: 'standard' | 'high' | 'ultra';
  mood: 'serious' | 'playful' | 'mysterious' | 'warm';
}

const personalityTraits = {
  'Aries': {
    traits: ['bold', 'confident', 'adventurous', 'passionate'],
    style: 'dynamic energy, strong presence',
    colors: 'warm tones, red and gold accents'
  },
  'Taurus': {
    traits: ['gentle', 'sensual', 'artistic', 'grounded'],
    style: 'natural beauty, earthy elegance',
    colors: 'earth tones, green and brown'
  },
  'Gemini': {
    traits: ['intelligent', 'witty', 'communicative', 'curious'],
    style: 'bright expression, animated features',
    colors: 'vibrant colors, yellow and silver'
  },
  'Cancer': {
    traits: ['nurturing', 'intuitive', 'emotional', 'caring'],
    style: 'soft features, gentle expression',
    colors: 'cool tones, silver and white'
  },
  'Leo': {
    traits: ['charismatic', 'passionate', 'creative', 'dramatic'],
    style: 'regal presence, commanding aura',
    colors: 'golden tones, orange and gold'
  },
  'Virgo': {
    traits: ['refined', 'analytical', 'caring', 'precise'],
    style: 'clean beauty, sophisticated look',
    colors: 'muted tones, beige and green'
  },
  'Libra': {
    traits: ['harmonious', 'beautiful', 'diplomatic', 'balanced'],
    style: 'perfect symmetry, graceful features',
    colors: 'pastel tones, pink and blue'
  },
  'Scorpio': {
    traits: ['mysterious', 'intense', 'magnetic', 'transformative'],
    style: 'penetrating gaze, magnetic presence',
    colors: 'deep tones, burgundy and black'
  },
  'Sagittarius': {
    traits: ['philosophical', 'adventurous', 'optimistic', 'free-spirited'],
    style: 'open expression, adventurous spirit',
    colors: 'bright tones, purple and turquoise'
  },
  'Capricorn': {
    traits: ['ambitious', 'sophisticated', 'reliable', 'disciplined'],
    style: 'classic beauty, professional aura',
    colors: 'neutral tones, navy and gray'
  },
  'Aquarius': {
    traits: ['unique', 'innovative', 'humanitarian', 'independent'],
    style: 'distinctive features, modern appeal',
    colors: 'electric tones, blue and silver'
  },
  'Pisces': {
    traits: ['dreamy', 'compassionate', 'artistic', 'intuitive'],
    style: 'ethereal beauty, mystical aura',
    colors: 'watery tones, sea green and lavender'
  }
};

const stylePrompts = {
  realistic: [
    'photorealistic portrait',
    'professional photography',
    'high resolution',
    'detailed facial features'
  ],
  artistic: [
    'artistic portrait',
    'painterly style',
    'creative interpretation',
    'artistic lighting'
  ],
  mystical: [
    'mystical portrait',
    'ethereal beauty',
    'cosmic energy',
    'spiritual aura'
  ],
  romantic: [
    'romantic portrait',
    'soft lighting',
    'dreamy atmosphere',
    'intimate mood'
  ]
};

const qualitySettings = {
  standard: '8k resolution, professional quality',
  high: '16k resolution, ultra-high quality, photorealistic',
  ultra: '32k resolution, masterpiece quality, hyperrealistic'
};

export function generateSoulmatePrompt(
  astroData: AstrologicalData,
  config: AIPromptConfig = {
    style: 'mystical',
    quality: 'high',
    mood: 'mysterious'
  }
): string {
  const venusSign = astroData.venusSign || 'Libra';
  const sunSign = astroData.sunSign || 'Leo';
  const moonSign = astroData.moonSign || 'Pisces';
  const risingSign = astroData.risingSign || 'Scorpio';
  
  // 获取主要特征
  const venusTraits = personalityTraits[venusSign as keyof typeof personalityTraits] || personalityTraits.Libra;
  const sunTraits = personalityTraits[sunSign as keyof typeof personalityTraits] || personalityTraits.Leo;
  const moonTraits = personalityTraits[moonSign as keyof typeof personalityTraits] || personalityTraits.Pisces;
  
  // 构建基础提示词
  let prompt = `A beautiful soulmate portrait, `;
  
  // 添加个性特征
  prompt += `${venusTraits.traits.join(', ')}, `;
  prompt += `${venusTraits.style}, `;
  
  // 添加风格元素
  const styleElements = stylePrompts[config.style];
  prompt += `${styleElements.join(', ')}, `;
  
  // 添加占星学元素
  prompt += `cosmic ${venusTraits.colors}, `;
  prompt += `${sunSign} energy, ${moonSign} emotional depth, `;
  prompt += `${risingSign} first impression, `;
  
  // 添加氛围描述
  prompt += `ethereal glow, starlight in eyes, `;
  prompt += `mystical cosmic background, `;
  prompt += `soft romantic lighting, `;
  prompt += `dreamy atmosphere, `;
  
  // 添加质量设置
  prompt += `${qualitySettings[config.quality]}, `;
  
  // 添加技术参数
  prompt += `professional photography, `;
  prompt += `perfect composition, `;
  prompt += `cinematic lighting, `;
  prompt += `magical realism style`;
  
  return prompt;
}

export function generateMultiplePrompts(astroData: AstrologicalData): string[] {
  const configs: AIPromptConfig[] = [
    { style: 'mystical', quality: 'high', mood: 'mysterious' },
    { style: 'romantic', quality: 'high', mood: 'warm' },
    { style: 'artistic', quality: 'ultra', mood: 'playful' },
    { style: 'realistic', quality: 'high', mood: 'serious' }
  ];
  
  return configs.map(config => generateSoulmatePrompt(astroData, config));
}

export function getAstrologicalInsights(astroData: AstrologicalData): string {
  const venusSign = astroData.venusSign || 'Libra';
  const venusTraits = personalityTraits[venusSign as keyof typeof personalityTraits] || personalityTraits.Libra;
  
  return `基于你的${venusSign}金星配置，你的理想伴侣具有${venusTraits.traits.join('、')}的特质。${venusTraits.style}，散发着${venusTraits.colors}的魅力。`;
}
