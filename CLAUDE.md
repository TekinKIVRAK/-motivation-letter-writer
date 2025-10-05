# Claude AI Integration Documentation

Complete guide to understanding and working with Claude AI in the Motivation Letter Writer application.

## Table of Contents
- [Overview](#overview)
- [API Configuration](#api-configuration)
- [How It Works](#how-it-works)
- [Prompt Engineering](#prompt-engineering)
- [Model Selection](#model-selection)
- [Token Management](#token-management)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Cost Optimization](#cost-optimization)
- [Troubleshooting](#troubleshooting)

## Overview

This application uses Anthropic's Claude AI to generate personalized motivation letters. Claude is a large language model that excels at understanding context and generating human-like text.

### Why Claude?

- **Quality**: Produces high-quality, contextual content
- **Safety**: Built with constitutional AI for safer outputs
- **Flexibility**: Handles various tones and styles
- **Reliability**: Consistent performance
- **Context Window**: Large context for processing resumes and job postings

## API Configuration

### Getting Started

1. **Create Account**: https://console.anthropic.com/
2. **Get API Key**: Navigate to API Keys section
3. **Add Credits**: Required for API usage
4. **Store Securely**: Never commit keys to version control

### Environment Setup

```env
# .env file in backend directory
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### SDK Installation

```bash
npm install @anthropic-ai/sdk
```

### SDK Initialization

```javascript
// backend/src/services/ai.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

## How It Works

### Request Flow

```
User Input → Backend API → Claude AI → Response Processing → User Output
```

### Detailed Process

1. **Input Collection**
   - Resume text (PDF/DOC parsed)
   - Job posting/description
   - Company & position info
   - Personal notes
   - Tone preference

2. **Prompt Construction**
   - Structured prompt template
   - Context injection
   - Tone specification
   - Output format instructions

3. **API Request**
   - Send to Claude API
   - Model: claude-3-haiku-20240307
   - Max tokens: 4096
   - Temperature: 0.7

4. **Response Processing**
   - Extract JSON from response
   - Parse and validate
   - Clean up formatting
   - Return to frontend

### Code Example

```javascript
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
```

## Prompt Engineering

### Current Prompt Structure

Our prompt is carefully structured to:
1. Define Claude's role
2. Provide job context
3. Include resume data
4. Add personal notes
5. Specify output format
6. Request specific tones

### Prompt Template

```javascript
const prompt = `You are a professional motivation letter (cover letter) writer.
Generate THREE different versions of a motivation letter for a job application.

**Job Details:**
Company: ${company}
Position: ${position}

**Job Posting:**
${jobPosting}

**Candidate's Resume:**
${resumeText}

**Personal Notes from Candidate:**
${personalNotes}

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
   - Include specific examples from the resume
   - Be approximately 250-350 words
   - End with a call to action

3. Also provide customization tips for the candidate

**Output Format:**
Return ONLY valid JSON:
{
  "professional": {"content": "...", "tone": "Professional"},
  "friendly": {"content": "...", "tone": "Friendly"},
  "enthusiastic": {"content": "...", "tone": "Enthusiastic"},
  "customizationTips": ["Tip 1...", "Tip 2...", "Tip 3..."]
}`;
```

### Why This Prompt Works

1. **Clear Role Definition**: "You are a professional motivation letter writer"
2. **Structured Context**: Organized sections for different inputs
3. **Specific Instructions**: Detailed requirements for each tone
4. **Format Constraints**: Word count, structure, and style guidelines
5. **JSON Output**: Structured response for easy parsing
6. **Examples**: Shows what to include (resume details, job posting)

### Prompt Optimization Tips

```javascript
// Good: Specific and clear
"Generate a 300-word professional motivation letter"

// Bad: Vague
"Write a good cover letter"

// Good: Structured output
"Return JSON with keys: professional, friendly, enthusiastic"

// Bad: Unstructured
"Give me some versions"
```

## Model Selection

### Available Models

| Model | Speed | Cost | Quality | Use Case |
|-------|-------|------|---------|----------|
| claude-3-haiku | Fast | Low | Good | Current (Production) |
| claude-3-sonnet | Medium | Medium | Better | Alternative |
| claude-3-opus | Slow | High | Best | Premium option |

### Current Model

```javascript
model: 'claude-3-haiku-20240307'
```

**Why Haiku?**
- ✅ Fast response times (1-2 seconds)
- ✅ Cost-effective for high volume
- ✅ Sufficient quality for motivation letters
- ✅ Large context window (200K tokens)

### Switching Models

```javascript
// For higher quality (at higher cost)
model: 'claude-3-sonnet-20240229'

// For best quality (premium)
model: 'claude-3-opus-20240229'
```

## Token Management

### Understanding Tokens

- **Input Tokens**: Prompt + user data
- **Output Tokens**: Generated response
- **Total Tokens**: Input + Output

### Current Configuration

```javascript
max_tokens: 4096  // Maximum output tokens
temperature: 0.7  // Creativity level (0-1)
```

### Token Usage Breakdown

**Typical Request:**
- Prompt structure: ~500 tokens
- Resume text: ~1,000-2,000 tokens
- Job posting: ~500-1,000 tokens
- Personal notes: ~200-500 tokens
- **Total Input**: ~2,200-4,000 tokens

**Response:**
- 3 letters × ~400 words each: ~3,000 tokens
- Customization tips: ~200 tokens
- **Total Output**: ~3,200 tokens

**Total per request**: ~5,200-7,200 tokens

### Cost Calculation

**Haiku Pricing** (as of 2024):
- Input: $0.25 per million tokens
- Output: $1.25 per million tokens

**Example Cost per Request:**
```
Input:  4,000 tokens × $0.25 / 1M = $0.001
Output: 3,200 tokens × $1.25 / 1M = $0.004
Total: ~$0.005 per letter generation
```

**Monthly Estimates:**
- 100 requests: ~$0.50
- 1,000 requests: ~$5.00
- 10,000 requests: ~$50.00

### Optimizing Token Usage

```javascript
// 1. Trim unnecessary whitespace
resumeText = resumeText.trim().replace(/\n{3,}/g, '\n\n');

// 2. Limit resume length
const MAX_RESUME_LENGTH = 5000; // characters
resumeText = resumeText.substring(0, MAX_RESUME_LENGTH);

// 3. Reduce output tokens if needed
max_tokens: 3072  // Instead of 4096
```

## Error Handling

### Common Errors

```javascript
// 1. Authentication Error
if (error.message.includes('API key')) {
  throw new Error('AI service configuration error. Please contact support.');
}

// 2. Rate Limit Error
if (error.message.includes('rate limit')) {
  throw new Error('Our service is currently at capacity. Please try again in a few moments.');
}

// 3. Parse Error
if (error.message.includes('parse') || error.message.includes('JSON')) {
  throw new Error('We received an unexpected response from our AI service. Please try again.');
}

// 4. Timeout Error
if (error.message.includes('timeout')) {
  throw new Error('The request took too long to process. Please try again with shorter inputs.');
}
```

### Implementation

```javascript
export async function generateMotivationLetter(params) {
  try {
    const message = await anthropic.messages.create({...});

    // Parse and validate response
    const letters = JSON.parse(responseText);

    if (!letters.professional || !letters.friendly || !letters.enthusiastic) {
      throw new Error('Invalid letter structure from AI');
    }

    return { success: true, data: letters };

  } catch (error) {
    // User-friendly error handling
    console.error('AI Letter Generation Error:', error);

    if (error.message.includes('API key')) {
      throw new Error('AI service configuration error.');
    }

    throw new Error('Unable to generate your motivation letter at this time.');
  }
}
```

## Best Practices

### 1. Prompt Design

```javascript
// ✅ Good: Clear and specific
const prompt = `Generate 3 motivation letters with these exact tones: Professional, Friendly, Enthusiastic. Each should be 250-350 words.`;

// ❌ Bad: Vague and open-ended
const prompt = `Write some cover letters`;
```

### 2. Input Validation

```javascript
// Validate inputs before sending to API
if (!jobPosting || jobPosting.length < 50) {
  throw new Error('Job description too short');
}

if (resumeText && resumeText.length > 10000) {
  resumeText = resumeText.substring(0, 10000);
}
```

### 3. Response Parsing

```javascript
// Robust JSON extraction
let jsonMatch = responseText.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('Could not parse AI response');
}

// Clean and escape properly
jsonString = jsonString.replace(/"([^"]*?)"/g, (match, content) => {
  const escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `"${escaped}"`;
});
```

### 4. Caching Strategy

```javascript
// Cache frequent requests (optional)
const cache = new Map();

async function generateWithCache(params) {
  const cacheKey = JSON.stringify(params);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await generateMotivationLetter(params);
  cache.set(cacheKey, result);

  return result;
}
```

### 5. Rate Limiting

```javascript
// Simple rate limiter
const rateLimiter = {
  requests: [],
  limit: 10, // requests per minute

  async check() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 60000);

    if (this.requests.length >= this.limit) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    this.requests.push(now);
  }
};
```

## Cost Optimization

### 1. Reduce Token Usage

```javascript
// Summarize resume instead of full text
async function summarizeResume(fullText) {
  // Extract key sections only
  const sections = ['experience', 'education', 'skills'];
  return extractRelevantSections(fullText, sections);
}
```

### 2. Optimize Model Choice

```javascript
// Use Haiku for most requests
const DEFAULT_MODEL = 'claude-3-haiku-20240307';

// Upgrade to Sonnet for premium users only
const PREMIUM_MODEL = 'claude-3-sonnet-20240229';
```

### 3. Batch Processing

```javascript
// If generating multiple letters, batch them
async function generateBatch(requests) {
  // Combine prompts efficiently
  // Share common context
  // Reduce redundant tokens
}
```

### 4. Monitor Usage

```javascript
// Track token usage
const usage = {
  totalRequests: 0,
  totalTokens: 0,
  totalCost: 0
};

function trackUsage(inputTokens, outputTokens) {
  usage.totalRequests++;
  usage.totalTokens += (inputTokens + outputTokens);
  usage.totalCost += calculateCost(inputTokens, outputTokens);

  console.log('Usage:', usage);
}
```

## Troubleshooting

### Issue: "API key not working"

**Solutions:**
1. Verify key starts with `sk-ant-`
2. Check key is active in Anthropic console
3. Ensure account has credits
4. Restart server after updating .env

### Issue: "Response parsing fails"

**Solutions:**
1. Log raw response for debugging
2. Check for unexpected characters
3. Validate JSON structure
4. Handle edge cases in content

```javascript
console.log('Raw response:', responseText.substring(0, 500));
```

### Issue: "Slow response times"

**Solutions:**
1. Reduce max_tokens
2. Shorten input prompts
3. Use Haiku model (faster)
4. Implement timeout handling

### Issue: "High costs"

**Solutions:**
1. Monitor token usage
2. Set budget alerts
3. Implement caching
4. Optimize prompts
5. Use Haiku instead of Sonnet/Opus

## Testing Claude Integration

### Manual Testing

```javascript
// Test with minimal input
const testParams = {
  resumeText: 'Software Engineer with 5 years experience',
  jobPosting: 'Looking for Senior Developer',
  company: 'Test Corp',
  position: 'Senior Developer',
  personalNotes: 'Passionate about coding',
  tone: 'professional'
};

const result = await generateMotivationLetter(testParams);
console.log(result);
```

### Automated Testing

```javascript
// Unit test example
describe('Claude AI Integration', () => {
  it('should generate 3 letter versions', async () => {
    const result = await generateMotivationLetter(testParams);

    expect(result.success).toBe(true);
    expect(result.data.professional).toBeDefined();
    expect(result.data.friendly).toBeDefined();
    expect(result.data.enthusiastic).toBeDefined();
  });
});
```

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Model Comparison](https://docs.anthropic.com/claude/docs/models-overview)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [API Pricing](https://www.anthropic.com/pricing)
- [Best Practices](https://docs.anthropic.com/claude/docs/best-practices)

## Updates & Maintenance

### Monitor for Updates

- Check Anthropic blog for model updates
- Review pricing changes
- Test new models when available
- Update SDK regularly

```bash
npm update @anthropic-ai/sdk
```

### Version Migration

When upgrading models:
1. Test in development first
2. Compare output quality
3. Monitor token usage
4. Check costs
5. Update documentation

---

**Claude AI Integration Complete!** 🤖 Your application is powered by state-of-the-art AI technology.
