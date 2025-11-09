// AI提示词生成器 - 基于印度占星学（Vedic Astrology）生成配偶外貌画像提示词
// 根据传统占星学：第7宫主配偶，金星主美丽，Navamsa提供详细信息

export interface AstrologicalData {
  sunSign?: string;
  moonSign?: string;
  venusSign?: string;
  venusNakshatra?: string; // 金星的星宿（Nakshatra）
  marsSign?: string;
  risingSign?: string;
  seventhHouse?: {
    number?: number;
    sign?: string;
    lord?: string;
    planets?: Array<{name: string; sign: string}>;
  };
  navamsa?: {
    seventhHouse?: {
      sign?: string;
      lord?: string;
      planets?: Array<{name: string; sign: string}>;
    };
  };
}

export interface AIPromptConfig {
  style: 'realistic' | 'artistic' | 'mystical' | 'romantic';
  quality: 'standard' | 'high' | 'ultra';
  mood: 'serious' | 'playful' | 'mysterious' | 'warm';
}

// 个性特征映射（用于AI提示词生成）
const personalityTraits = {
  'Aries': {
    traits: ['bold', 'confident', 'energetic', 'passionate'],
    style: 'bold and confident energy',
    colors: 'warm tones with red and gold accents'
  },
  'Taurus': {
    traits: ['stable', 'sensual', 'grounded', 'patient'],
    style: 'natural beauty and sensual aura',
    colors: 'warm earth tones with golden highlights'
  },
  'Gemini': {
    traits: ['expressive', 'intelligent', 'youthful', 'communicative'],
    style: 'bright and intelligent energy',
    colors: 'light tones with yellow and silver highlights'
  },
  'Cancer': {
    traits: ['nurturing', 'gentle', 'caring', 'emotional'],
    style: 'nurturing appearance with soft beauty',
    colors: 'cool tones with silver and white accents'
  },
  'Leo': {
    traits: ['regal', 'charismatic', 'confident', 'generous'],
    style: 'royal appearance with charismatic presence',
    colors: 'golden tones with orange and gold accents'
  },
  'Virgo': {
    traits: ['refined', 'sophisticated', 'elegant', 'detail-oriented'],
    style: 'sophisticated beauty with clean look',
    colors: 'muted tones with beige and green accents'
  },
  'Libra': {
    traits: ['harmonious', 'balanced', 'graceful', 'charming'],
    style: 'classic beauty with harmonious features',
    colors: 'pastel tones with pink and blue accents'
  },
  'Scorpio': {
    traits: ['intense', 'magnetic', 'mysterious', 'passionate'],
    style: 'magnetic presence with intense beauty',
    colors: 'deep tones with burgundy and black accents'
  },
  'Sagittarius': {
    traits: ['adventurous', 'optimistic', 'free-spirited', 'cheerful'],
    style: 'free-spirited appearance with cheerful energy',
    colors: 'bright tones with purple and turquoise accents'
  },
  'Capricorn': {
    traits: ['dignified', 'mature', 'professional', 'responsible'],
    style: 'professional appearance with dignified presence',
    colors: 'neutral tones with navy and gray accents'
  },
  'Aquarius': {
    traits: ['unique', 'distinctive', 'innovative', 'independent'],
    style: 'unconventional beauty with distinctive look',
    colors: 'electric tones with blue and silver accents'
  },
  'Pisces': {
    traits: ['dreamy', 'mystical', 'gentle', 'intuitive'],
    style: 'ethereal beauty with dreamy appearance',
    colors: 'watery tones with sea green and lavender accents'
  }
};

// 印度占星学中12星座对应的配偶外貌特征
const spouseAppearanceTraits = {
  'Aries': {
    // 第7宫在白羊座：配偶外貌特征
    facialFeatures: ['strong jawline', 'prominent features', 'athletic build', 'sharp eyes'],
    complexion: 'fair to wheatish',
    build: 'medium to tall, athletic',
    style: 'bold and confident appearance',
    colors: 'warm skin tones, red and gold accents'
  },
  'Taurus': {
    facialFeatures: ['round face', 'full lips', 'beautiful eyes', 'smooth skin'],
    complexion: 'fair and glowing',
    build: 'medium height, well-proportioned',
    style: 'natural beauty, sensual features',
    colors: 'warm earth tones, golden complexion'
  },
  'Gemini': {
    facialFeatures: ['expressive eyes', 'sharp features', 'youthful appearance', 'animated expression'],
    complexion: 'fair to medium',
    build: 'slim to medium, graceful',
    style: 'bright and intelligent look',
    colors: 'light tones, yellow and silver highlights'
  },
  'Cancer': {
    facialFeatures: ['round face', 'soft features', 'gentle eyes', 'caring expression'],
    complexion: 'fair and pale',
    build: 'medium height, curvy',
    style: 'nurturing appearance, soft beauty',
    colors: 'cool tones, silver and white'
  },
  'Leo': {
    facialFeatures: ['regal features', 'commanding presence', 'bright eyes', 'strong bone structure'],
    complexion: 'golden fair',
    build: 'tall and majestic',
    style: 'royal appearance, charismatic',
    colors: 'golden tones, orange and gold'
  },
  'Virgo': {
    facialFeatures: ['refined features', 'neat appearance', 'expressive eyes', 'delicate features'],
    complexion: 'fair and clear',
    build: 'slim and elegant',
    style: 'sophisticated beauty, clean look',
    colors: 'muted tones, beige and green'
  },
  'Libra': {
    facialFeatures: ['perfect symmetry', 'beautiful features', 'graceful eyes', 'balanced proportions'],
    complexion: 'fair and radiant',
    build: 'well-proportioned, graceful',
    style: 'classic beauty, harmonious features',
    colors: 'pastel tones, pink and blue'
  },
  'Scorpio': {
    facialFeatures: ['intense eyes', 'magnetic gaze', 'sharp features', 'mysterious look'],
    complexion: 'wheatish to dark',
    build: 'medium to tall, strong',
    style: 'magnetic presence, intense beauty',
    colors: 'deep tones, burgundy and black'
  },
  'Sagittarius': {
    facialFeatures: ['open expression', 'bright eyes', 'optimistic look', 'adventurous spirit'],
    complexion: 'fair to medium',
    build: 'tall and athletic',
    style: 'free-spirited appearance, cheerful',
    colors: 'bright tones, purple and turquoise'
  },
  'Capricorn': {
    facialFeatures: ['classic features', 'serious expression', 'strong structure', 'mature look'],
    complexion: 'wheatish to fair',
    build: 'medium height, sturdy',
    style: 'professional appearance, dignified',
    colors: 'neutral tones, navy and gray'
  },
  'Aquarius': {
    facialFeatures: ['unique features', 'distinctive look', 'bright eyes', 'modern appeal'],
    complexion: 'fair to medium',
    build: 'tall and slim',
    style: 'unconventional beauty, distinctive',
    colors: 'electric tones, blue and silver'
  },
  'Pisces': {
    facialFeatures: ['dreamy eyes', 'soft features', 'gentle expression', 'mystical look'],
    complexion: 'fair and pale',
    build: 'medium height, delicate',
    style: 'ethereal beauty, dreamy appearance',
    colors: 'watery tones, sea green and lavender'
  }
};

// 行星对配偶外貌的影响（印度占星学传统）
const planetInfluences = {
  'Sun': {
    appearance: 'golden complexion, regal features, strong presence',
    build: 'tall and commanding'
  },
  'Moon': {
    appearance: 'fair complexion, round face, gentle features',
    build: 'medium height, curvy'
  },
  'Venus': {
    appearance: 'beautiful features, attractive, charming',
    build: 'well-proportioned, graceful'
  },
  'Mars': {
    appearance: 'strong features, athletic build, energetic',
    build: 'medium to tall, muscular'
  },
  'Jupiter': {
    appearance: 'dignified features, wise appearance, fair',
    build: 'tall and well-built'
  },
  'Saturn': {
    appearance: 'serious features, mature look, dark complexion',
    build: 'tall and thin'
  },
  'Mercury': {
    appearance: 'youthful features, intelligent look, fair',
    build: 'slim and graceful'
  },
  'Rahu': {
    appearance: 'unconventional beauty, unique features',
    build: 'tall and distinctive'
  },
  'Ketu': {
    appearance: 'mystical appearance, spiritual look',
    build: 'slim and delicate'
  }
};

// 27个Nakshatra（星宿）对配偶外貌的影响（印度占星学传统）
// 金星所在的Nakshatra会显著影响配偶的外貌特征
const nakshatraInfluences: Record<string, {
  appearance: string[];
  complexion: string;
  build: string;
  specialFeatures: string[];
}> = {
  'Ashwini': {
    appearance: ['youthful features', 'bright eyes', 'energetic look', 'quick movements'],
    complexion: 'fair to golden',
    build: 'slim and athletic',
    specialFeatures: ['expressive face', 'animated expressions']
  },
  'Bharani': {
    appearance: ['intense eyes', 'strong features', 'passionate look', 'magnetic presence'],
    complexion: 'wheatish to fair',
    build: 'medium height, well-built',
    specialFeatures: ['deep gaze', 'commanding presence']
  },
  'Krittika': {
    appearance: ['sharp features', 'bright eyes', 'confident look', 'regal bearing'],
    complexion: 'fair and glowing',
    build: 'tall and majestic',
    specialFeatures: ['strong bone structure', 'piercing eyes']
  },
  'Rohini': {
    appearance: ['beautiful features', 'round face', 'full lips', 'charming eyes'],
    complexion: 'fair and radiant',
    build: 'well-proportioned, graceful',
    specialFeatures: ['sensual beauty', 'magnetic charm']
  },
  'Mrigashira': {
    appearance: ['expressive eyes', 'youthful features', 'curious look', 'animated face'],
    complexion: 'fair to medium',
    build: 'slim and graceful',
    specialFeatures: ['bright smile', 'intelligent expression']
  },
  'Ardra': {
    appearance: ['intense features', 'deep eyes', 'mysterious look', 'strong presence'],
    complexion: 'wheatish to dark',
    build: 'medium to tall, strong',
    specialFeatures: ['penetrating gaze', 'transformative beauty']
  },
  'Punarvasu': {
    appearance: ['gentle features', 'kind eyes', 'nurturing look', 'soft beauty'],
    complexion: 'fair and pale',
    build: 'medium height, curvy',
    specialFeatures: ['warm smile', 'caring expression']
  },
  'Pushya': {
    appearance: ['dignified features', 'wise eyes', 'mature look', 'noble bearing'],
    complexion: 'fair to golden',
    build: 'medium height, well-built',
    specialFeatures: ['serene expression', 'authoritative presence']
  },
  'Ashlesha': {
    appearance: ['magnetic eyes', 'sharp features', 'intense look', 'mysterious beauty'],
    complexion: 'wheatish to fair',
    build: 'slim and elegant',
    specialFeatures: ['hypnotic gaze', 'alluring presence']
  },
  'Magha': {
    appearance: ['regal features', 'commanding eyes', 'royal look', 'majestic presence'],
    complexion: 'golden fair',
    build: 'tall and majestic',
    specialFeatures: ['noble bearing', 'charismatic appearance']
  },
  'Purva Phalguni': {
    appearance: ['beautiful features', 'charming eyes', 'romantic look', 'sensual beauty'],
    complexion: 'fair and glowing',
    build: 'well-proportioned, attractive',
    specialFeatures: ['magnetic charm', 'alluring presence']
  },
  'Uttara Phalguni': {
    appearance: ['balanced features', 'kind eyes', 'harmonious look', 'classic beauty'],
    complexion: 'fair and radiant',
    build: 'well-proportioned, graceful',
    specialFeatures: ['perfect symmetry', 'elegant appearance']
  },
  'Hasta': {
    appearance: ['skilled hands', 'expressive eyes', 'artistic look', 'creative features'],
    complexion: 'fair to medium',
    build: 'slim and elegant',
    specialFeatures: ['artistic beauty', 'expressive face']
  },
  'Chitra': {
    appearance: ['striking features', 'bright eyes', 'distinctive look', 'unique beauty'],
    complexion: 'fair to golden',
    build: 'well-proportioned, attractive',
    specialFeatures: ['perfect features', 'magnetic presence']
  },
  'Swati': {
    appearance: ['gentle features', 'soft eyes', 'peaceful look', 'delicate beauty'],
    complexion: 'fair and pale',
    build: 'slim and graceful',
    specialFeatures: ['ethereal beauty', 'refined appearance']
  },
  'Vishakha': {
    appearance: ['determined features', 'bright eyes', 'ambitious look', 'strong presence'],
    complexion: 'fair to wheatish',
    build: 'medium height, well-built',
    specialFeatures: ['intense gaze', 'commanding features']
  },
  'Anuradha': {
    appearance: ['radiant features', 'bright eyes', 'charming look', 'magnetic beauty'],
    complexion: 'fair and glowing',
    build: 'well-proportioned, attractive',
    specialFeatures: ['luminous skin', 'attractive presence']
  },
  'Jyeshta': {
    appearance: ['mature features', 'deep eyes', 'wise look', 'dignified presence'],
    complexion: 'wheatish to fair',
    build: 'medium height, sturdy',
    specialFeatures: ['authoritative appearance', 'serious expression']
  },
  'Mula': {
    appearance: ['intense features', 'penetrating eyes', 'transformative look', 'mysterious beauty'],
    complexion: 'wheatish to dark',
    build: 'medium to tall, strong',
    specialFeatures: ['deep gaze', 'powerful presence']
  },
  'Purva Ashadha': {
    appearance: ['confident features', 'bright eyes', 'adventurous look', 'charismatic presence'],
    complexion: 'fair to golden',
    build: 'tall and athletic',
    specialFeatures: ['bold appearance', 'energetic look']
  },
  'Uttara Ashadha': {
    appearance: ['dignified features', 'noble eyes', 'victorious look', 'majestic presence'],
    complexion: 'fair and radiant',
    build: 'tall and well-built',
    specialFeatures: ['regal bearing', 'commanding appearance']
  },
  'Shravana': {
    appearance: ['intelligent features', 'listening eyes', 'wise look', 'scholarly presence'],
    complexion: 'fair to medium',
    build: 'medium height, elegant',
    specialFeatures: ['thoughtful expression', 'refined features']
  },
  'Dhanishta': {
    appearance: ['musical features', 'rhythmic beauty', 'artistic look', 'creative presence'],
    complexion: 'fair to wheatish',
    build: 'well-proportioned, graceful',
    specialFeatures: ['harmonious features', 'artistic beauty']
  },
  'Shatabhisha': {
    appearance: ['mystical features', 'deep eyes', 'spiritual look', 'ethereal beauty'],
    complexion: 'fair and pale',
    build: 'slim and delicate',
    specialFeatures: ['otherworldly appearance', 'mysterious charm']
  },
  'Purva Bhadrapada': {
    appearance: ['intense features', 'transformative eyes', 'spiritual look', 'mystical presence'],
    complexion: 'wheatish to fair',
    build: 'medium height, strong',
    specialFeatures: ['penetrating gaze', 'spiritual beauty']
  },
  'Uttara Bhadrapada': {
    appearance: ['serene features', 'calm eyes', 'peaceful look', 'spiritual beauty'],
    complexion: 'fair and pale',
    build: 'medium height, graceful',
    specialFeatures: ['gentle expression', 'mystical appearance']
  },
  'Revati': {
    appearance: ['gentle features', 'dreamy eyes', 'nurturing look', 'ethereal beauty'],
    complexion: 'fair and pale',
    build: 'slim and delicate',
    specialFeatures: ['soft beauty', 'mystical charm']
  }
};

const stylePrompts = {
  realistic: [
    'photorealistic portrait',
    'professional photography',
    'high resolution',
    'detailed facial features',
    'natural lighting',
    'sharp focus',
    'lifelike appearance',
    'realistic skin texture'
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

/**
 * 根据印度占星学传统生成配偶外貌提示词
 * 
 * 印度占星学分析配偶外貌的优先级：
 * 1. 第7宫（Kalatra Bhava）- 婚姻宫，最重要
 *    - 第7宫的星座决定配偶的基本外貌特征
 *    - 第7宫主星（7th house lord）的位置和状态
 *    - 第7宫内的行星会显著影响外貌
 * 
 * 2. 金星（Shukra）- 婚姻和美丽的天然指示星（Karaka）
 *    - 金星所在的星座
 *    - 金星的状态（入庙、落陷、友宫等）
 * 
 * 3. Navamsa（D9九分盘）- 提供更详细的配偶信息
 *    - Navamsa中的第7宫
 *    - Navamsa中第7宫主星的位置
 * 
 * 4. 第7宫主星所在的位置
 *    - 第7宫主星所在的星座
 *    - 第7宫主星所在的宫位
 */
export function generateSoulmatePrompt(
  astroData: AstrologicalData,
  config: AIPromptConfig = {
    style: 'realistic', // 默认改为写实风格
    quality: 'high',
    mood: 'mysterious'
  },
  userGender?: 'male' | 'female' // 用户性别，用于确定配偶性别
): string {
  // 根据用户性别确定配偶性别
  const spouseGender = userGender === 'female' ? 'male' : userGender === 'male' ? 'female' : undefined;
  
  // ========== 第一步：确定主要分析因素（按优先级） ==========
  
  // 1. 第7宫信息（最高优先级）
  const seventhHouseSign = astroData.seventhHouse?.sign;
  const seventhHouseLord = astroData.seventhHouse?.lord;
  const seventhHousePlanets = astroData.seventhHouse?.planets || [];
  
  // 2. 金星信息（婚姻指示星）
  const venusSign = astroData.venusSign || 'Libra';
  const venusNakshatra = astroData.venusNakshatra; // 金星的星宿
  
  // 3. Navamsa第7宫信息（如果可用）
  const navamsaSeventhSign = astroData.navamsa?.seventhHouse?.sign;
  const navamsaSeventhLord = astroData.navamsa?.seventhHouse?.lord;
  const navamsaSeventhPlanets = astroData.navamsa?.seventhHouse?.planets || [];
  
  // ========== 第二步：根据第7宫星座确定基础外貌特征 ==========
  // 第7宫的星座是判断配偶外貌最重要的因素
  const primarySign = seventhHouseSign || navamsaSeventhSign || venusSign;
  const appearanceTraits = spouseAppearanceTraits[primarySign as keyof typeof spouseAppearanceTraits] 
    || spouseAppearanceTraits['Libra'];
  
  // ========== 第三步：分析第7宫内的行星影响 ==========
  const planetModifiers: string[] = [];
  
  // 如果第7宫内有行星，这些行星会显著影响配偶外貌
  if (seventhHousePlanets.length > 0) {
    seventhHousePlanets.forEach(planet => {
      const planetInfluence = planetInfluences[planet.name as keyof typeof planetInfluences];
      if (planetInfluence) {
        planetModifiers.push(planetInfluence.appearance);
      }
    });
  }
  
  // Navamsa第7宫内的行星也很重要
  if (navamsaSeventhPlanets.length > 0) {
    navamsaSeventhPlanets.forEach(planet => {
      const planetInfluence = planetInfluences[planet.name as keyof typeof planetInfluences];
      if (planetInfluence) {
        planetModifiers.push(planetInfluence.appearance);
      }
    });
  }
  
  // ========== 第四步：构建提示词 ==========
  const parts: string[] = [];
  
  // 1. 核心主体 - 明确指定性别和单人肖像
  if (spouseGender) {
    parts.push(`A beautiful ${spouseGender} soulmate portrait`, 'single person', 'one person only');
  } else {
    parts.push('A beautiful soulmate portrait', 'single person', 'one person only');
  }
  
  // 2. 写实风格要求
  if (config.style === 'realistic') {
    parts.push('photorealistic', 'professional photography', 'lifelike', 'natural appearance');
  } else {
    const styleElements = stylePrompts[config.style];
    parts.push(...styleElements.slice(0, 2));
  }
  
  // 3. 外貌特征（基于第7宫星座）- 这是最重要的
  parts.push(...appearanceTraits.facialFeatures.slice(0, 3)); // 取前3个特征
  parts.push(appearanceTraits.complexion);
  parts.push(appearanceTraits.build);
  parts.push(appearanceTraits.style);
  
  // 4. 行星影响（如果有行星在第7宫）
  if (planetModifiers.length > 0) {
    // 取前2个最重要的行星影响
    parts.push(...planetModifiers.slice(0, 2));
  }
  
  // 5. 颜色和氛围
  if (config.style === 'realistic') {
    parts.push(`natural ${appearanceTraits.colors}`);
  } else {
    parts.push(`mystical ${appearanceTraits.colors}`);
  }
  
  // 6. 金星的影响（作为补充，因为金星是婚姻指示星）
  if (venusSign && venusSign !== primarySign) {
    const venusTraits = personalityTraits[venusSign as keyof typeof personalityTraits];
    if (venusTraits) {
      // 添加金星的魅力特质
      parts.push(venusTraits.traits[0]); // 只取第一个特质，避免过长
    }
  }
  
  // 6.5. 金星的Nakshatra（星宿）影响 - 非常重要！
  // 在印度占星学中，金星所在的Nakshatra会显著影响配偶的外貌特征
  if (venusNakshatra) {
    // 尝试匹配Nakshatra名称（支持不同格式）
    const normalizedNakshatra = venusNakshatra.trim();
    // 尝试直接匹配
    let nakshatraInfluence = nakshatraInfluences[normalizedNakshatra];
    
    // 如果直接匹配失败，尝试不区分大小写匹配
    if (!nakshatraInfluence) {
      const matchingKey = Object.keys(nakshatraInfluences).find(
        key => key.toLowerCase() === normalizedNakshatra.toLowerCase()
      );
      if (matchingKey) {
        nakshatraInfluence = nakshatraInfluences[matchingKey];
      }
    }
    
    if (nakshatraInfluence) {
      // 添加Nakshatra特有的外貌特征（取前2个最重要的）
      parts.push(...nakshatraInfluence.appearance.slice(0, 2));
      // 如果Nakshatra的肤色与第7宫不同，可以补充
      if (nakshatraInfluence.complexion && nakshatraInfluence.complexion !== appearanceTraits.complexion) {
        parts.push(nakshatraInfluence.complexion);
      }
      // 添加特殊特征（取第一个）
      if (nakshatraInfluence.specialFeatures.length > 0) {
        parts.push(nakshatraInfluence.specialFeatures[0]);
      }
    }
  }
  
  // 7. 技术质量
  if (config.style === 'realistic') {
    parts.push('high detail', 'sharp focus', 'natural skin texture', 'realistic lighting');
  }
  
  // 8. 构图和氛围
  if (config.style === 'realistic') {
    parts.push('professional studio lighting', 'neutral background', 'portrait composition');
  } else {
    parts.push('ethereal glow', 'mystical background', 'soft lighting');
  }
  
  // 9. 质量设置
  if (config.quality === 'high') {
    parts.push('ultra high quality', '8k resolution');
  }
  
  // ========== 第五步：组合并限制长度 ==========
  let prompt = parts.join(', ');
  
  // 如果超过800字符，截断
  if (prompt.length > 800) {
    prompt = prompt.substring(0, 797) + '...';
  }
  
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
