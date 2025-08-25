import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { port: string } }
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const port = params.port;
    
    const response = await fetch(`${apiUrl}/download/${port}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    // Copy relevant headers from the backend response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-disposition' || 
          key.toLowerCase() === 'content-type') {
        headers.set(key, value);
      }
    });

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
} 