import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

/**
 * Get or create Anthropic client instance
 */
export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error(
        'ANTHROPIC_API_KEY not configured. Please add it to nextjs-app/.env.local'
      );
    }

    client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: false, // Server-side only
    });
  }

  return client;
}

/**
 * Analyze health data using Claude AI
 */
export async function analyzeHealthData(
  query: string,
  context: {
    healthData: any;
    focusAreas?: string[];
    dateRange?: { start: string; end: string };
  }
): Promise<{
  analysis: string;
  metadata: {
    model: string;
    timestamp: string;
    dataPoints: number;
  };
}> {
  const client = getAnthropicClient();

  // Build system prompt with medical knowledge
  const systemPrompt = buildSystemPrompt(context);

  // Build user message with health data
  const userMessage = buildUserMessage(query, context);

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const analysis =
      message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate analysis';

    return {
      analysis,
      metadata: {
        model: 'claude-3-5-sonnet-20241022',
        timestamp: new Date().toISOString(),
        dataPoints: countDataPoints(context.healthData)
      }
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build system prompt with medical context
 */
function buildSystemPrompt(context: any): string {
  const { focusAreas, dateRange } = context;

  let prompt = `You are a health data analysis assistant with access to comprehensive medical knowledge bases and reasoning frameworks.

Your role is to help users understand their health data through:
1. Trend analysis and pattern recognition
2. Correlation detection between health metrics
3. Risk assessment based on clinical guidelines
4. Lab result interpretation with reference ranges
5. Symptom analysis and potential causes
6. Medication adherence evaluation

Available analysis capabilities:
- Biochemical lab interpretation (cholesterol, blood sugar, liver function, kidney function, etc.)
- Vital signs analysis (blood pressure, heart rate, BMI trends)
- Women's health tracking (menstrual cycles, pregnancy monitoring, menopause symptoms)
- Preventive care screening status
- Medication interaction checking
- Radiation dose tracking

**Analysis Principles:**
- Identify trends and patterns over time
- Flag significant changes or abnormalities
- Correlate related metrics (e.g., weight and blood pressure)
- Provide actionable insights
- Include clear visualization recommendations
- Always note limitations and recommend professional consultation for diagnosis
- Use clear, non-alarmist language
- Respect data privacy (all data stays local)
`;

  if (focusAreas && focusAreas.length > 0) {
    prompt += `\n**Focus Areas:** ${focusAreas.join(', ')}`;
  }

  if (dateRange) {
    prompt += `\n**Analysis Period:** ${dateRange.start} to ${dateRange.end}`;
  }

  prompt += `\n**Important:** You are analyzing personal health data. Do not provide medical diagnoses. Always include a disclaimer that this analysis is for informational purposes only and does not replace professional medical advice.`;

  return prompt;
}

/**
 * Build user message with query and health data
 */
function buildUserMessage(query: string, context: any): string {
  const { healthData } = context;

  let message = `User Query: ${query}\n\n`;

  // Add profile information
  if (healthData.profile) {
    message += `**User Profile:**\n`;
    if (healthData.profile.basic_info) {
      message += `- Age: ${healthData.profile.calculated?.age_years || 'Unknown'} years\n`;
      message += `- Height: ${healthData.profile.basic_info.height || 'Unknown'} cm\n`;
      message += `- Weight: ${healthData.profile.basic_info.weight || 'Unknown'} kg\n`;
      message += `- BMI: ${healthData.profile.calculated?.bmi?.toFixed(1) || 'Unknown'}\n`;
    }
    message += `\n`;
  }

  // Add weight history if available
  if (healthData.profile?.history && healthData.profile.history.length > 0) {
    message += `**Weight History** (${healthData.profile.history.length} records):\n`;
    const recent = healthData.profile.history.slice(-5);
    recent.forEach((record: any) => {
      message += `- ${record.date}: ${record.weight} kg (BMI: ${record.bmi.toFixed(1)})\n`;
    });
    message += `\n`;
  }

  // Add lab results
  if (healthData.labResults && healthData.labResults.length > 0) {
    message += `**Lab Results** (${healthData.labResults.length} tests):\n`;
    healthData.labResults.slice(-3).forEach((lab: any) => {
      message += `\n${lab.type} (${lab.date}):\n`;
      const abnormalItems = lab.items?.filter((item: any) => item.is_abnormal) || [];
      if (abnormalItems.length > 0) {
        message += `Abnormal findings (${abnormalItems.length}):\n`;
        abnormalItems.forEach((item: any) => {
          message += `  - ${item.name}: ${item.value} ${item.unit} (Ref: ${item.min_ref}-${item.max_ref}) ${item.abnormal_marker}\n`;
        });
      }
    });
    message += `\n`;
  }

  // Add allergies
  if (healthData.allergies?.allergies && healthData.allergies.allergies.length > 0) {
    message += `**Known Allergies** (${healthData.allergies.allergies.length}):\n`;
    healthData.allergies.allergies.forEach((allergy: any) => {
      message += `- ${allergy.allergen} (${allergy.category}, Severity: ${allergy.severity}/4)\n`;
    });
    message += `\n`;
  }

  // Add medications if available
  if (healthData.medications && healthData.medications.length > 0) {
    message += `**Current Medications** (${healthData.medications.length}):\n`;
    healthData.medications.slice(-5).forEach((med: any) => {
      message += `- ${med.name}: ${med.dosage}\n`;
    });
    message += `\n`;
  }

  // Add cycle tracking data for women
  if (healthData.cycleTracker?.cycles && healthData.cycleTracker.cycles.length > 0) {
    message += `**Menstrual Cycle Tracking**:\n`;
    message += `- Total cycles tracked: ${healthData.cycleTracker.statistics?.total_cycles_tracked}\n`;
    message += `- Average cycle length: ${healthData.cycleTracker.statistics?.average_cycle_length || 'N/A'} days\n`;
    message += `- Average period length: ${healthData.cycleTracker.statistics?.average_period_length || 'N/A'} days\n`;
    message += `\n`;
  }

  message += `\nPlease analyze this health data and provide insights related to the user's query.`;

  return message;
}

/**
 * Count total data points for metadata
 */
function countDataPoints(healthData: any): number {
  let count = 0;

  if (healthData.profile?.history) count += healthData.profile.history.length;
  if (healthData.labResults) {
    healthData.labResults.forEach((lab: any) => {
      if (lab.items) count += lab.items.length;
    });
  }
  if (healthData.allergies?.allergies) count += healthData.allergies.allergies.length;
  if (healthData.cycleTracker?.cycles) count += healthData.cycleTracker.cycles.length;
  if (healthData.vaccinations?.vaccination_records) count += healthData.vaccinations.vaccination_records.length;

  return count;
}
