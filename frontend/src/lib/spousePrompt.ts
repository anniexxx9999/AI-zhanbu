export interface SpousePromptInput {
  seventhHouseSign: string;
  seventhLord: string;
  seventhLordSign: string;
  seventhLordNakshatra: string;
  planetsInSeventhHouse: string[];
  daraKarakaPlanet: string;
  d9LagnaSign: string;
}

export interface SpousePromptBreakdown {
  physique: string[];
  features: string[];
  aura: string[];
  maturity: string[];
}

export interface SpousePromptResult {
  prompt: string;
  breakdown: SpousePromptBreakdown;
}

const SIGN_PHYSIQUE: Record<string, string> = {
  Aries: 'athletic frame with confident posture and defined muscles',
  Leo: 'broad-shouldered, regal stance with a radiant presence',
  Sagittarius: 'tall, well-proportioned body with long limbs and an adventurous vibe',
  Taurus: 'grounded, sensual build with strong neck and steady posture',
  Virgo: 'slender, refined silhouette with meticulous grooming',
  Capricorn: 'lean, structured build with mature, enduring stamina',
  Gemini: 'lithe, agile body language with expressive gestures',
  Libra: 'balanced proportions, graceful movements and natural symmetry',
  Aquarius: 'elongated limbs, unique style and futuristic elegance',
  Cancer: 'soft, rounded lines with a comforting presence',
  Scorpio: 'magnetic intensity, sculpted physique and penetrating gaze',
  Pisces: 'fluid, artistic movement with dreamy softness',
};

const PLANET_FEATURES: Record<string, string> = {
  Sun: 'dignified bone structure, bright eyes and warm golden undertone',
  Moon: 'round luminous eyes, gentle features and porcelain skin',
  Mars: 'sharp cheekbones, confident gaze and a hint of warrior energy',
  Mercury: 'expressive youthful face, playful smile and articulate eyes',
  Jupiter: 'generous smile, wise eyes and an expansive cheerful glow',
  Venus: 'harmonious facial symmetry, plush lips and captivating beauty mark',
  Saturn: 'defined jawline, deep-set eyes and timeless mature appeal',
  Rahu: 'unconventional magnetic allure with striking contrasts',
  Ketu: 'mystical gaze, ethereal facial structure and subtle charisma',
};

const PLANET_AURA: Record<string, string> = {
  Sun: 'radiates confidence, leadership and noble warmth',
  Moon: 'carries nurturing softness and emotional depth',
  Mars: 'emits fierce courage and forward-moving passion',
  Mercury: 'feels witty, curious and quick on their feet',
  Jupiter: 'glows with optimism, wisdom and protective kindness',
  Venus: 'exudes artistry, romance and refined grace',
  Saturn: 'holds grounding maturity, resilience and integrity',
  Rahu: 'projects enigmatic glamour and boundary-pushing charisma',
  Ketu: 'channels spiritual detachment and contemplative calm',
};

const NAKSHATRA_IMPRINT: Record<string, string> = {
  Ashwini: 'quick, youthful energy with sparkling vitality',
  Bharani: 'intense magnetism with transformative allure',
  Rohini: 'artistic sensuality and fertile creative charm',
  Mrigashirsha: 'deer-like grace with curious playful eyes',
  Ardra: 'stormy mystery with electric emotional presence',
  Punarvasu: 'gentle resilience and nurturing embrace',
  Pushya: 'protective warmth with traditional grace',
  Ashlesha: 'serpentine mesmerising aura and hypnotic eyes',
  Magha: 'royal bearing with ancestral pride',
  PurvaPhalguni: 'festive charisma and inviting smile',
  UttaraPhalguni: 'stately composure and dependable aura',
  Hasta: 'skilled hands and communicative expression',
  Chitra: 'artistic features with jewel-like sparkle',
  Swati: 'airy elegance, flexible movement and free-spirited glow',
  Vishakha: 'determined radiance with celebratory glamour',
  Anuradha: 'loyal heart with magnetic devotion',
  Jyeshtha: 'commanding mystique with protective power',
  Mula: 'rooted intensity with truth-seeking eyes',
  PurvaAshadha: 'victorious confidence with luminous aura',
  UttaraAshadha: 'noble strength and disciplined beauty',
  Shravana: 'attentive poise with melodic expression',
  Dhanishta: 'rhythmic grace and sparkling vitality',
  Shatabhisha: 'futuristic allure and healing presence',
  PurvaBhadrapada: 'esoteric magnetism and visionary gaze',
  UttaraBhadrapada: 'quiet depth with oceanic calm',
  Revati: 'compassionate sweetness and dreamy elegance',
};

const D9_AURA: Record<string, string> = {
  Aries: 'bold, athletic confidence that matures into inspiring leadership',
  Taurus: 'sensual reliability with earthy, soothing warmth',
  Gemini: 'forever-curious mind that keeps the partnership playful',
  Cancer: 'protective devotion and emotionally intelligent maturity',
  Leo: 'radiant magnetism that thrives in the spotlight together',
  Virgo: 'graceful service and mindful attention to shared growth',
  Libra: 'diplomatic elegance that seeks harmony and beauty',
  Scorpio: 'transformative passion that deepens intimacy over time',
  Sagittarius: 'expansive optimism that fuels shared adventures',
  Capricorn: 'strategic ambition, building legacy with patience',
  Aquarius: 'visionary partnership focused on ideals and progress',
  Pisces: 'soulful tenderness and spiritual devotion to love',
};

function uniquePush(target: string[], value?: string) {
  if (!value) return;
  if (!target.includes(value)) {
    target.push(value);
  }
}

export function generateSpouseImagePrompt(input: SpousePromptInput): SpousePromptResult {
  const breakdown: SpousePromptBreakdown = {
    physique: [],
    features: [],
    aura: [],
    maturity: [],
  };

  const basePhysique = SIGN_PHYSIQUE[input.seventhHouseSign];
  uniquePush(
    breakdown.physique,
    basePhysique
      ? `Seventh house in ${input.seventhHouseSign} suggests ${basePhysique}`
      : undefined,
  );

  const refinement = SIGN_PHYSIQUE[input.seventhLordSign];
  uniquePush(
    breakdown.physique,
    refinement
      ? `Seventh lord in ${input.seventhLordSign} refines the frame with ${refinement}`
      : undefined,
  );

  const nakshatraImprint = NAKSHATRA_IMPRINT[input.seventhLordNakshatra];
  uniquePush(
    breakdown.aura,
    nakshatraImprint
      ? `Nakshatra ${input.seventhLordNakshatra} adds ${nakshatraImprint}`
      : undefined,
  );

  const sculptors = input.planetsInSeventhHouse
    .map((planet) => PLANET_FEATURES[planet])
    .filter(Boolean);

  if (sculptors.length > 0) {
    breakdown.features.push(
      `Planets in the seventh house sculpt facial traits: ${sculptors.join(', ')}`,
    );
  } else {
    const lordFeature = PLANET_FEATURES[input.seventhLord];
    uniquePush(
      breakdown.features,
      lordFeature
        ? `Seventh lord ${input.seventhLord} shapes the face with ${lordFeature}`
        : undefined,
    );
  }

  const dkAura = PLANET_AURA[input.daraKarakaPlanet];
  uniquePush(
    breakdown.aura,
    dkAura ? `Dara Karaka ${input.daraKarakaPlanet} infuses the soul aura: ${dkAura}` : undefined,
  );

  const d9Maturity = D9_AURA[input.d9LagnaSign];
  uniquePush(
    breakdown.maturity,
    d9Maturity ? `Navamsa rising in ${input.d9LagnaSign} matures into ${d9Maturity}` : undefined,
  );

  const promptParts: string[] = [
    'Ultra detailed portrait of the querent\'s future spouse, 4k digital painting, cinematic lighting, ethereal vedic astrology inspired composition, front view, soft focus background',
  ];

  if (basePhysique) {
    promptParts.push(`body language shows ${basePhysique}`);
  }

  if (refinement && refinement !== basePhysique) {
    promptParts.push(`silhouette refined by ${refinement}`);
  }

  if (sculptors.length > 0) {
    promptParts.push(`facial structure combines ${sculptors.join(', ')}`);
  } else {
    const lordFeature = PLANET_FEATURES[input.seventhLord];
    if (lordFeature) {
      promptParts.push(`facial highlights inspired by ${input.seventhLord}: ${lordFeature}`);
    }
  }

  if (nakshatraImprint) {
    promptParts.push(`movement aura of ${nakshatraImprint}`);
  }

  if (dkAura) {
    promptParts.push(`overall energy ${dkAura}`);
  }

  if (d9Maturity) {
    promptParts.push(`mature charm evolves into ${d9Maturity}`);
  }

  promptParts.push('intricate jewellery, cosmic motifs, gentle smile, romantic atmosphere --ar 2:3 --style raw');

  return {
    prompt: promptParts.join(', '),
    breakdown,
  };
}

export interface PromptInputExtraction {
  input: SpousePromptInput;
  warnings: string[];
}

const DEFAULT_INPUT: SpousePromptInput = {
  seventhHouseSign: 'Libra',
  seventhLord: 'Venus',
  seventhLordSign: 'Taurus',
  seventhLordNakshatra: 'Rohini',
  planetsInSeventhHouse: ['Venus'],
  daraKarakaPlanet: 'Venus',
  d9LagnaSign: 'Libra',
};

export function extractPromptInput(raw: any): PromptInputExtraction {
  if (!raw || typeof raw !== 'object') {
    return { input: { ...DEFAULT_INPUT }, warnings: ['Astrology data missing, fallback defaults applied.'] };
  }

  const warnings: string[] = [];

  const seventhHouse =
    raw.seventh_house ||
    raw['seventh-house'] ||
    raw.houses?.find((house: any) => house.house === 7) ||
    raw.houses?.['7'] ||
    raw.house ||
    raw.houseDetails?.find?.((house: any) => house.number === 7) ||
    raw.houseDetails?.['7'] ||
    raw?.chart?.houses?.find?.((house: any) => house.house === 7);

  const navamsa =
    raw.navamsa ||
    raw.divisional_charts?.find?.((chart: any) => chart.name?.toLowerCase?.() === 'd9') ||
    raw.divisionalCharts?.find?.((chart: any) =>
      chart.id?.toLowerCase?.() === 'd9' || chart.name?.toLowerCase?.() === 'navamsa',
    ) ||
    raw.d9;

  const daraKaraka = raw.dara_karaka || raw.darakarka || raw.atmakaraka_details?.dara_karaka;

  const extractSign = (value: any): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    return value.sign || value.rashi || value.zodiac || value.name;
  };

  const seventhHouseSign = extractSign(seventhHouse) || raw.seventh_house_sign || raw.house7_sign;
  const seventhLord = raw.seventh_lord || raw['7th_lord'] || raw.seventhHouseLord || raw.house7_lord;
  const seventhLordSign = extractSign(
    raw.seventh_lord_sign || raw['7th_lord_sign'] || raw.seventhLordSign || raw.house7_lord_sign,
  );
  const seventhLordNakshatra =
    raw.seventh_lord_nakshatra ||
    raw['7th_lord_nakshatra'] ||
    raw.seventhLordNakshatra ||
    raw.house7_lord_nakshatra ||
    seventhHouse?.nakshatra;

  const planetsInSeventhHouse =
    raw.planets_in_seventh_house ||
    raw['planets-7th-house'] ||
    raw.planets?.filter?.((planet: any) => planet.house === 7).map?.((planet: any) => planet.name) ||
    seventhHouse?.planets ||
    [];

  const d9LagnaSign = extractSign(
    navamsa?.lagna ||
      navamsa?.ascendant ||
      navamsa?.ascendant_sign ||
      navamsa?.asc ||
      raw.d9_lagna ||
      raw.navamsa_lagna,
  );

  const resolvedInput: SpousePromptInput = {
    seventhHouseSign: seventhHouseSign || DEFAULT_INPUT.seventhHouseSign,
    seventhLord: typeof seventhLord === 'string' ? seventhLord : DEFAULT_INPUT.seventhLord,
    seventhLordSign: seventhLordSign || DEFAULT_INPUT.seventhLordSign,
    seventhLordNakshatra:
      (typeof seventhLordNakshatra === 'string' && seventhLordNakshatra) ||
      DEFAULT_INPUT.seventhLordNakshatra,
    planetsInSeventhHouse: Array.isArray(planetsInSeventhHouse)
      ? planetsInSeventhHouse.map((planet) => (typeof planet === 'string' ? planet : planet?.name)).filter(Boolean)
      : DEFAULT_INPUT.planetsInSeventhHouse,
    daraKarakaPlanet:
      (typeof daraKaraka === 'string' && daraKaraka) || raw.daraKaraka || DEFAULT_INPUT.daraKarakaPlanet,
    d9LagnaSign: d9LagnaSign || DEFAULT_INPUT.d9LagnaSign,
  };

  Object.entries(resolvedInput).forEach(([key, value]) => {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    ) {
      warnings.push(`Missing value for ${key}, fallback used.`);
    }
  });

  if (warnings.length === 0) {
    // Add subtle confirmation for logging clarity when data is complete.
    warnings.push('Astrology data parsed successfully.');
  }

  return { input: resolvedInput, warnings };
}
