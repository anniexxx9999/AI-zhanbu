const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const resolveDefaultBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL);
  }

  if (typeof window !== 'undefined') {
    const current = new URL(window.location.href);
    const hostname = current.hostname;
    const port = current.port;
    const devHostnames = new Set(['localhost', '127.0.0.1']);
    const devPorts = new Set(['', '3000', '3002', '3003', '4173', '5173', '5174', '5175']);

    if (devHostnames.has(hostname) && devPorts.has(port)) {
      const backendPort = process.env.NEXT_PUBLIC_DEV_BACKEND_PORT || '3001';
      return `${current.protocol}//${hostname}:${backendPort}/api`;
    }

    return `${stripTrailingSlash(current.origin)}/api`;
  }

  return 'http://localhost:3001/api';
};

export interface BirthInfo {
  name: string;
  date: string;
  time: string;
  city: string;
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
    return this.request('/api/astrology/chart', {
      method: 'POST',
      body: JSON.stringify(birthInfo),
    });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL);

export const astrologyAPI = {
  calculateChart: (birthInfo: BirthInfo) => apiClient.calculateChart(birthInfo),
};

export default astrologyAPI;
