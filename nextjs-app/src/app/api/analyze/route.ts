import { NextRequest, NextResponse } from 'next/server';
import { analyzeHealthData } from '@/lib/anthropic';
import { readAllHealthData } from '@/lib/data-reader';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, focusAreas, dateRange } = body;

    // Validate query
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Load health data
    const healthData = await readAllHealthData();

    // Analyze with Claude
    const result = await analyzeHealthData(query, {
      healthData,
      focusAreas,
      dateRange
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Analysis API error:', error);

    // Provide user-friendly error messages
    let errorMessage = 'Analysis failed';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        errorMessage = 'API Key not configured. Please add ANTHROPIC_API_KEY to .env.local';
        statusCode = 500;
      } else if (error.message.includes('Analysis failed')) {
        errorMessage = error.message;
        statusCode = 500;
      } else {
        errorMessage = `Analysis error: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: statusCode }
    );
  }
}
