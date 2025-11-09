import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 3001;

function proxyRequest(body: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    
    const options = {
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/ai/generate-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode || 500, data: jsonData });
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await proxyRequest(body);
    
    if (result.status !== 200) {
      return NextResponse.json(
        { success: false, error: result.data.error || 'Internal server error' },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

