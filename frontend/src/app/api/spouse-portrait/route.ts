import { NextResponse } from 'next/server';
import {
  extractPromptInput,
  generateSpouseImagePrompt,
  PromptInputExtraction,
  SpousePromptInput,
  SpousePromptResult,
} from '@/lib/spousePrompt';

interface BirthPayload {
  name?: string;
  date?: string;
  time?: string;
  city?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
    timezone?: number;
  };
}

interface AstrologyApiResponse {
  data?: any;
  [key: string]: any;
}

function parseBirthDateTime(date?: string, time?: string) {
  if (!date || !time) return null;
  const [hour = '0', minute = '0'] = time.split(':');
  const isoString = `${date}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return {
    date: parsed,
    components: {
      year: parsed.getUTCFullYear(),
      month: parsed.getUTCMonth() + 1,
      day: parsed.getUTCDate(),
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
    },
  };
}

async function callAstrologyApi(payload: BirthPayload, parsedDate: ReturnType<typeof parseBirthDateTime>) {
  const baseUrl = process.env.ASTROLOGY_API_URL;
  const apiKey = process.env.ASTROLOGY_API_KEY;

  if (!baseUrl || !apiKey || !parsedDate) {
    return {
      astrologyData: null,
      warnings: ['Astrology API not fully configured. Falling back to template interpretation.'],
    };
  }

  try {
    const body = {
      day: parsedDate.components.day,
      month: parsedDate.components.month,
      year: parsedDate.components.year,
      hour: parsedDate.components.hour,
      minute: parsedDate.components.minute,
      latitude: payload.coordinates?.latitude,
      longitude: payload.coordinates?.longitude,
      place: payload.city,
      timezone: payload.coordinates?.timezone,
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        astrologyData: null,
        warnings: [`Astrology API responded with ${response.status}: ${text}`],
      };
    }

    const data: AstrologyApiResponse = await response.json();
    return { astrologyData: data, warnings: [] as string[] };
  } catch (error) {
    return {
      astrologyData: null,
      warnings: [`Astrology API request failed: ${(error as Error).message}`],
    };
  }
}

function extractImageUrl(data: any): string | null {
  if (!data) return null;
  if (Array.isArray(data.data) && data.data[0]?.url) {
    return data.data[0].url as string;
  }
  if (Array.isArray(data.output) && typeof data.output[0] === 'string') {
    return data.output[0];
  }
  if (typeof data.image_url === 'string') {
    return data.image_url;
  }
  if (typeof data.url === 'string') {
    return data.url;
  }
  return null;
}

async function callImageApi(prompt: string, birthName?: string) {
  const baseUrl = process.env.IMAGE_MODEL_API_URL;
  const apiKey = process.env.IMAGE_MODEL_API_KEY;

  if (!baseUrl || !apiKey) {
    return {
      imageUrl: null,
      warnings: ['Image generation API not configured. Returning prompt only.'],
    };
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        user: birthName,
        size: '1024x1536',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        imageUrl: null,
        warnings: [`Image API responded with ${response.status}: ${text}`],
      };
    }

    const data = await response.json();
    const imageUrl = extractImageUrl(data);
    if (!imageUrl) {
      return {
        imageUrl: null,
        warnings: ['Image API response did not include a usable image URL.'],
      };
    }

    return { imageUrl, warnings: [] as string[] };
  } catch (error) {
    return {
      imageUrl: null,
      warnings: [`Image API request failed: ${(error as Error).message}`],
    };
  }
}

function buildAstrologySummary(input: SpousePromptInput): Record<string, string | string[]> {
  return {
    seventhHouseSign: input.seventhHouseSign,
    seventhLord: input.seventhLord,
    seventhLordSign: input.seventhLordSign,
    seventhLordNakshatra: input.seventhLordNakshatra,
    planetsInSeventhHouse: input.planetsInSeventhHouse,
    daraKarakaPlanet: input.daraKarakaPlanet,
    d9LagnaSign: input.d9LagnaSign,
  };
}

export async function POST(request: Request) {
  try {
    const body: BirthPayload = await request.json();

    if (!body.date || !body.time || !body.city) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time and city are necessary.' },
        { status: 400 },
      );
    }

    const parsed = parseBirthDateTime(body.date, body.time);

    const { astrologyData, warnings: astrologyWarnings } = await callAstrologyApi(body, parsed);

    const promptInputExtraction: PromptInputExtraction = extractPromptInput(
      astrologyData?.data ?? astrologyData,
    );

    const promptResult: SpousePromptResult = generateSpouseImagePrompt(promptInputExtraction.input);

    const { imageUrl, warnings: imageWarnings } = await callImageApi(
      promptResult.prompt,
      body.name,
    );

    const warnings = [
      ...astrologyWarnings,
      ...promptInputExtraction.warnings,
      ...imageWarnings,
    ].filter(Boolean);

    return NextResponse.json({
      prompt: promptResult.prompt,
      breakdown: promptResult.breakdown,
      astrologySummary: buildAstrologySummary(promptInputExtraction.input),
      imageUrl,
      warnings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate spouse portrait.',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
