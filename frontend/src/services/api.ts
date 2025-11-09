const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const resolveDefaultBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  // 在浏览器中，使用相对路径让Next.js rewrite处理
  // 这样可以避免代理问题和CORS问题
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // 服务端渲染时使用完整URL（使用127.0.0.1避免代理问题）
  return 'http://127.0.0.1:3001/api';
};

export interface BirthInfo {
  name: string;
  date: string;
  time: string;
  city: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
  message?: string;
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  house: number;
  sign: string;
  signSymbol: string;
  zodiacSignName?: string;
  zodiacSignLord?: string;
  localizedName?: string;
  degree: number;
  minute: number;
  second: number;
  retrograde: boolean;
  speed: number;
  nakshatra?: {
    number: number;
    name: string;
    pada: number;
    vimsottariLord: string;
  };
}

export interface House {
  number: number;
  name: string;
  nameEn: string;
  sanskrit: string;
  sign: string;
  signSymbol: string;
  lord: string;
  lordPlacement: string;
  lordStrength: string;
  planets: PlanetPosition[];
}

export interface Aspect {
  from: string;
  to: string;
  type: string;
  orb: number;
  strength: number;
  description: string;
}

export interface ChartData {
  birthInfo: BirthInfo;
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  lagna: number;
  lagnaDetails?: {
    longitude: number;
    sign: string;
    signSymbol: string;
    degree: number;
    minute: number;
    second: number;
  };
  moonSign: string;
  sunSign: string;
  risingSign: string;
  chartType?: string;
  ayanamsa?: string;
  timestamp: string;
  analysis?: {
    lifeEnergy: {
      strongest: Array<{
        planet: string;
        emoji: string;
        power: string;
        score: number;
        desc: string;
      }>;
      weakest: {
        planet: string;
        emoji: string;
        lesson: string;
        score: number;
        desc: string;
      };
    };
    dashaData?: {
      timeline: Array<{
        planet: string;
        start: number;
        end: number;
        color: string;
        theme: string;
        isCurrent?: boolean;
      }>;
      currentDasha: {
        major: {
          planet: string;
          period: string;
          theme: string;
        };
        minor: {
          planet: string;
          period: string;
          focus: string;
        };
        strategy: string;
      };
    };
    coreTrinity: {
      lagna: {
        sign: string;
        emoji: string;
        mask: string;
        desc: string;
      };
      moon: {
        sign: string;
        emoji: string;
        need: string;
        desc: string;
      };
      sun: {
        sign: string;
        emoji: string;
        fuel: string;
        desc: string;
      };
    };
    cosmicToolkit: {
      colors: string[];
      gem: string;
      gemPlanet: string;
      mantra: string;
      activities: string[];
      luckyDay: string;
      element: string;
    };
    houseAnalyses?: Array<{
      house: number;
      name: string;
      nameEn: string;
      sanskrit: string;
      emoji: string;
      rating: number;
      sign: string;
      lord: string;
      lordPlacement: string;
      lordStrength: string;
      professionalAnalysis?: string;
      advantages?: string[];
      challenges?: string[];
      judgment?: {
        type: string;
        icon: string;
        label: string;
        reason: string;
      };
      keyPeriods?: Array<{
        name: string;
        years: string;
        description: string;
      }>;
      actionAdvice?: {
        leverage: string[];
        cope: string[];
      };
      remedies?: {
        gemstone: string;
        day: string;
        mantra: string;
      };
    }>;
  };
}

class ApiClient {
  private baseURL?: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL ? stripTrailingSlash(baseURL) : undefined;
  }

  private getBaseURL(): string {
    if (!this.baseURL) {
      this.baseURL = resolveDefaultBaseUrl();
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[AstroSoul API] base URL resolved to', this.baseURL);
      }
    }
    return this.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseURL = this.getBaseURL();
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseURL}${sanitizedEndpoint}`;

    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      cache: 'no-store',
    };

    const requestOptions = { ...defaultOptions, ...options };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(
        `[AstroSoul API] ${requestOptions.method ?? 'GET'} ${url}`,
        requestOptions
      );
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async calculateChart(birthInfo: BirthInfo): Promise<ApiResponse<ChartData>> {
    return this.request('/astrology/chart', {
      method: 'POST',
      body: JSON.stringify(birthInfo),
    });
  }

  async generateAIImage(prompt: string, options?: {
    width?: number;
    height?: number;
    seed?: number;
    use_pre_llm?: boolean;
  }): Promise<ApiResponse<{ imageUrl: string; imageUrls: string[]; taskId: string }>> {
    return this.request('/ai/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        ...options
      }),
    });
  }

  async generateSpouseReport(chartData: ChartData, birthInfo: BirthInfo): Promise<ApiResponse<{
    fullContent: string;
    sections: {
      introduction: string;
      personality: string;
      appearance: string;
      meeting: string;
      relationship: string;
      conclusion: string;
    };
    keyData: {
      risingSign: string;
      sunSign: string;
      moonSign: string;
      seventhHouse: {
        sign: string;
        lord: string;
        planets: Array<{ name: string; sign: string }>;
      };
      venus: {
        sign: string;
        house: number;
        nakshatra?: string;
      } | null;
      jupiter: {
        sign: string;
        house: number;
      } | null;
    };
    birthInfo: BirthInfo;
    metadata: {
      wordCount: number;
      generatedAt: string;
    };
  }>> {
    return this.request('/report/spouse', {
      method: 'POST',
      body: JSON.stringify({
        chartData,
        birthInfo
      }),
    });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL);

export const astrologyAPI = {
  calculateChart: (birthInfo: BirthInfo) => apiClient.calculateChart(birthInfo),
  generateAIImage: (prompt: string, options?: {
    width?: number;
    height?: number;
    seed?: number;
    use_pre_llm?: boolean;
  }) => apiClient.generateAIImage(prompt, options),
  generateSpouseReport: (chartData: ChartData, birthInfo: BirthInfo) => 
    apiClient.generateSpouseReport(chartData, birthInfo),
};

export default astrologyAPI;
