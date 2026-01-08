import { NextRequest, NextResponse } from 'next/server';
import { analyzeHealthData } from '@/lib/anthropic';
import { readAllHealthData } from '@/lib/data-reader';
import { generateAndSaveReport, generateHTMLReport, listReports } from '@/lib/report-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, focusAreas, dateRange } = body;

    // Validate query
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // Load health data
    const healthData = await readAllHealthData();

    // Analyze with Claude
    const analysisResult = await analyzeHealthData(query, {
      healthData,
      focusAreas,
      dateRange
    });

    // Generate report content
    const htmlContent = generateHTMLReport(analysisResult.analysis, healthData, {
      reportId: Date.now().toString(),
      generatedAt: analysisResult.metadata.timestamp,
      dateRange,
      dataPoints: analysisResult.metadata.dataPoints
    });

    // Save report
    const savedPaths = await generateAndSaveReport({
      html: htmlContent,
      json: {
        metadata: analysisResult.metadata,
        analysis: analysisResult.analysis,
        query
      },
      metadata: {
        reportId: Date.now().toString(),
        generatedAt: analysisResult.metadata.timestamp,
        dateRange,
        dataPoints: analysisResult.metadata.dataPoints
      }
    });

    return NextResponse.json({
      success: true,
      reportId: Date.now().toString(),
      paths: savedPaths,
      metadata: analysisResult.metadata
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Report generation failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await listReports();

    return NextResponse.json({
      success: true,
      reports: reports.map(r => ({
        filename: r.filename,
        createdAt: r.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list reports'
      },
      { status: 500 }
    );
  }
}
