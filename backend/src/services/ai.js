import Anthropic from '@anthropic-ai/sdk';

/**
 * Get or create Anthropic client instance
 * @returns {Anthropic} - Anthropic client
 */
function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

/**
 * Generate motivation letter using Claude AI
 * @param {Object} params - Letter generation parameters
 * @returns {Promise<Object>} - Generated letters
 */
export async function generateMotivationLetter(params) {
  try {
    const anthropic = getAnthropicClient();
    const { resumeText, jobPosting, company, position, personalNotes, tone } = params;

    const prompt = `You are a professional motivation letter (cover letter) writer. Generate THREE different versions of a motivation letter for a job application.

**Job Details:**
Company: ${company}
Position: ${position}

**Job Posting:**
${jobPosting}

${resumeText ? `**Candidate's Resume:**\n${resumeText}\n` : ''}

${personalNotes ? `**Personal Notes from Candidate:**\n${personalNotes}\n` : ''}

**Instructions:**
1. Generate 3 complete motivation letters with different tones:
   - Professional: Formal, traditional business style
   - Friendly: Warm and personable but still professional
   - Enthusiastic: Energetic and passionate

2. Each letter should:
   - Be well-structured with proper paragraphs
   - Start with a strong opening
   - Highlight relevant experience and skills
   - Show genuine interest in the company and role
   - Include specific examples from the resume (if provided)
   - Be approximately 250-350 words
   - End with a call to action

3. Also provide customization tips for the candidate

**IMPORTANT:**
- Return ONLY valid JSON in a single line (minified, no formatting/indentation)
- Use \\n escape sequences for line breaks inside letter content strings
- Do not include any text before or after the JSON
- The JSON should be compact on a single line

Please provide your response in this EXACT JSON format (but on ONE line):
{"professional":{"content":"Letter text with \\n for line breaks...","tone":"Professional"},"friendly":{"content":"Letter text with \\n for line breaks...","tone":"Friendly"},"enthusiastic":{"content":"Letter text with \\n for line breaks...","tone":"Enthusiastic"},"customizationTips":["Tip 1...","Tip 2...","Tip 3..."]}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract JSON from response
    const responseText = message.content[0].text;

    // Try to find JSON in the response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    let jsonString = jsonMatch[0];

    // Clean up the JSON string by properly escaping newlines within string values
    // This regex finds strings (content between quotes) and replaces actual newlines with \n
    jsonString = jsonString.replace(/"([^"]*?)"/g, (match, content) => {
      // Escape special characters within the string content
      const escaped = content
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\r/g, '\\r')   // Escape carriage returns
        .replace(/\t/g, '\\t')   // Escape tabs
        .replace(/"/g, '\\"');   // Escape quotes
      return `"${escaped}"`;
    });

    // Try parsing the JSON
    let letters;
    try {
      letters = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.log('First 300 chars of cleaned JSON:', jsonString.substring(0, 300));
      throw new Error(`Could not parse AI response: ${parseError.message}`);
    }

    // Validate response structure
    if (!letters.professional || !letters.friendly || !letters.enthusiastic) {
      throw new Error('Invalid letter structure from AI');
    }

    return {
      success: true,
      data: letters,
      metadata: {
        model: message.model,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('AI Letter Generation Error:', error);

    if (error.message.includes('API key') || error.message.includes('authentication')) {
      throw new Error('AI service configuration error. Please contact support.');
    }

    if (error.message.includes('parse') || error.message.includes('JSON')) {
      throw new Error('We received an unexpected response from our AI service. Please try again.');
    }

    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      throw new Error('Our service is currently at capacity. Please try again in a few moments.');
    }

    if (error.message.includes('timeout')) {
      throw new Error('The request took too long to process. Please try again with shorter inputs.');
    }

    // Default error message
    throw new Error('Unable to generate your motivation letter at this time. Please try again.');
  }
}
