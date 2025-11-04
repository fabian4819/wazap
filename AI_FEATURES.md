# WaZap AI Features Documentation

## Overview
WaZap Dashboard now includes powerful AI features powered by Google Gemini to help you understand and optimize your energy harvesting system.

## AI Features

### 1. AI Chatbot
**Location:** Available on all pages via floating "Ask AI" button (bottom-right corner)

**What it does:**
- Answer questions about your energy data in natural language
- Provide insights about system performance
- Help understand trends and patterns

**Example Questions:**
- "How much energy did I generate today?"
- "What time is my peak energy generation?"
- "Is my system performing well?"
- "Show me weekly trends"

### 2. Energy Forecasting
**Location:** Dashboard page (bottom section)

**What it does:**
- Predicts future energy generation using AI and historical patterns
- Shows confidence levels for predictions
- Helps plan energy usage

**Features:**
- 12, 24, or 48-hour forecasts
- Average predicted energy display
- Interactive chart visualization

### 3. AI-Powered Insights
**Location:** Dashboard and History pages

**What it does:**
- Analyzes your data to generate actionable recommendations
- Identifies performance trends
- Suggests optimization opportunities

**Insight Types:**
- **Positive:** Good performance indicators
- **Neutral:** Informational observations
- **Warning:** Areas needing attention

### 4. Anomaly Detection & Alerts
**Location:** Dashboard page

**What it does:**
- Continuously monitors sensor data for unusual patterns
- Detects potential system issues before they become problems
- Alerts you to performance degradation

**Detection Capabilities:**
- Voltage drops
- Energy generation anomalies
- System offline detection
- Performance degradation alerts

## Setup Instructions

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Edit the `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.wazap.biz.id
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your Google Gemini API key.

### 3. Restart Development Server

If the dev server is running, restart it to load the new environment variables:

```bash
npm run dev
```

## Usage Tips

### Chatbot Best Practices
- Ask specific questions about your data
- Use natural language (no need for technical jargon)
- The chatbot has access to your real-time energy data

### Understanding Forecasts
- Green confidence levels (>70%) indicate reliable predictions
- Forecasts are based on historical patterns
- Best used for short-term planning (12-24 hours)

### Acting on Insights
- High-priority insights appear at the top
- Refresh insights to get latest recommendations
- Insights update based on your most recent data

### Monitoring Anomalies
- Check the Dashboard regularly for anomaly alerts
- High-severity alerts require immediate attention
- Dismiss alerts once addressed

## AI Feature States

**Enabled:** When Gemini API key is configured, all AI features are fully functional.

**Disabled:** Without API key, the system shows:
- Warning message in chatbot
- Mock data for forecasts (for demonstration)
- Basic anomaly detection (rule-based, no AI)
- Mock insights (for demonstration)

## Technical Details

### AI Model
- **Model:** Google Gemini 2.5 Flash (Stable)
- **Version:** Latest stable release (June 2025)
- **Capabilities:** Advanced text generation, analysis, pattern recognition, conversational AI
- **Context window:** Up to 1 million tokens
- **Optimized for:** Fast responses, multi-turn conversations, complex reasoning
- **Why 2.5 Flash?** Perfect balance of speed, cost, and capability for real-time chatbot

### Configuration
```typescript
{
  model: 'gemini-2.5-flash',
  temperature: 0.7,    // Balanced creativity
  topP: 0.95,         // Nucleus sampling
  topK: 64,           // Token selection
  maxOutputTokens: 1024 // Response length limit
}
```

## Privacy & Data

- All AI processing uses Google Gemini API
- Energy data is sent to Google's servers for analysis
- No personal information is shared
- API calls are logged for debugging
- You can disable AI features by removing the API key
- Data is only sent when you actively use AI features

## Troubleshooting

### "AI features are disabled" message
**Solution:** Check that your `VITE_GEMINI_API_KEY` is set in `.env` file and restart the dev server.

### Chatbot showing "I encountered an error"
**This is the most common issue!**

**Quick fix:**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for detailed error message
4. See `TROUBLESHOOTING.md` for specific solutions

**Common causes:**
- Invalid or expired API key
- Region not supported by Gemini API
- Rate limits exceeded
- Network/firewall issues

**Solution:** Read the detailed `TROUBLESHOOTING.md` guide for step-by-step debugging.

### Slow AI responses
**Cause:** Gemini 1.5 Flash usually responds in 1-3 seconds, but can be slower under load.
**Solution:** This is normal. Wait for the response.

### Forecast showing mock data
**Cause:** AI features are disabled or API call failed.
**Solution:** Enable AI features by configuring the API key.

## API Costs

Google Gemini API pricing (as of 2024):
- Free tier: 60 requests per minute
- Paid tier: Pay-as-you-go

Estimated usage for WaZap:
- Chatbot: ~1-10 requests per session
- Insights: ~1 request per page load
- Forecast: ~1 request per hour selection

**Recommendation:** The free tier should be sufficient for most users.

## Future Enhancements

Planned AI features:
- Voice-activated chatbot
- Automated email reports
- Predictive maintenance alerts
- Energy optimization recommendations
- Pattern recognition for footfall analysis

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify API key configuration
4. Contact support at [your-support-email]

---

**Last Updated:** December 2024
**Version:** 1.0.0
