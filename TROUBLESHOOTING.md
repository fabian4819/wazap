# AI Chatbot Troubleshooting Guide

## Common Issues and Solutions

### Issue: "I apologize, but I encountered an error" in chatbot

This error indicates the Gemini API call failed. Check the following:

#### 1. Check Browser Console
Open your browser's Developer Tools (F12) and look at the Console tab for detailed error messages.

Common error messages you might see:

**"API key not valid"**
- Solution: Double-check your API key in `.env` file
- Make sure there are no extra spaces or quotes around the key
- Verify the key at https://makersuite.google.com/app/apikey

**"User location is not supported"**
- Solution: Gemini API might not be available in your region
- Try using a VPN to a supported region (US, UK, EU)
- Check current availability at https://ai.google.dev/available_regions

**"Resource has been exhausted" or "quota exceeded"**
- Solution: You've hit the free tier rate limit
- Wait a few minutes and try again
- Free tier: 60 requests per minute
- Consider upgrading to paid tier if needed

**"Candidate was blocked due to SAFETY"**
- Solution: Your question triggered content safety filters
- Rephrase your question in a different way
- Avoid sensitive or potentially harmful content

#### 2. Verify API Key Configuration

Check `.env` file:
```env
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

Make sure:
- ✅ No quotes around the key
- ✅ No spaces before or after
- ✅ Key starts with "AIzaSy"
- ✅ File is in the root directory

#### 3. Restart Development Server

After changing `.env`:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

Environment variables only load when the server starts!

#### 4. Test API Key Directly

You can test if your API key works by running this in browser console:

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'Hello' }]
    }]
  })
})
.then(r => r.json())
.then(console.log)
```

Or list all available models:
```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY')
.then(r => r.json())
.then(data => console.log('Available models:', data.models.map(m => m.name)))
```

Replace `YOUR_API_KEY` with your actual key.

Expected response: Should contain generated text
Error response: Will show specific error message

#### 5. Check Network Tab

In Developer Tools > Network tab:
1. Click the "Ask AI" button and send a message
2. Look for requests to `generativelanguage.googleapis.com`
3. Check the Status Code:
   - ✅ 200 = Success
   - ❌ 400 = Bad request (check message format)
   - ❌ 401 = Invalid API key
   - ❌ 403 = Permission denied
   - ❌ 429 = Rate limit exceeded

Click on the failed request to see detailed error message.

## Specific Error Solutions

### Error: "Failed to fetch"

**Possible causes:**
1. No internet connection
2. CORS issue (shouldn't happen with Gemini API)
3. Firewall blocking the request

**Solutions:**
- Check your internet connection
- Disable browser extensions (ad blockers, privacy tools)
- Try a different browser
- Check if your network/firewall blocks Google APIs

### Error: "Invalid argument"

**Cause:** Usually means the API request format is wrong

**Solution:**
- This is likely a code bug
- Check console for full error details
- Report the issue with console logs

### Chatbot sends messages but gets no response

**Symptoms:**
- Your message appears
- Loading spinner shows briefly
- Error message appears

**Debug steps:**
1. Open browser console
2. Send a message
3. Look for "AI Chatbot error details:" log
4. Share the error details for support

## Verify AI Features Are Enabled

Run this in browser console:
```javascript
// Check if API key is loaded
console.log('API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY)

// Should show your API key prefix (first 10 chars)
console.log('API Key prefix:', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10))
```

If it shows `undefined` or `"your_google"`, the API key isn't loaded properly.

## Model Information

The WaZap dashboard uses **Gemini 2.5 Flash** model:
- Latest stable version (released June 2025)
- Ultra-fast response times
- 1 million token context window
- Perfect for chatbot use case
- Advanced reasoning capabilities
- Multi-turn conversation support

## Rate Limits (Free Tier)

- **Requests per minute:** 15
- **Requests per day:** 1,500
- **Tokens per minute:** 1 million

If you hit these limits, the chatbot will show "quota exceeded" error.

**Tips to stay within limits:**
- Wait a few seconds between questions
- Keep conversations short
- Use insights/forecast features sparingly

## Getting Help

If you still have issues:

1. **Collect information:**
   - Browser console errors (screenshot)
   - Network tab response (screenshot)
   - Your browser name and version
   - Error message shown to user

2. **Check documentation:**
   - Google Gemini API docs: https://ai.google.dev/docs
   - WaZap AI_FEATURES.md

3. **Report the issue:**
   - Include all collected information
   - Describe what you were trying to do
   - Mention if it worked before

## Success Checklist

Before asking for help, verify:

- [ ] API key is valid and active
- [ ] API key is correctly set in `.env` file
- [ ] Development server was restarted after adding key
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests to Google APIs
- [ ] You're not hitting rate limits
- [ ] Your region supports Gemini API
- [ ] No browser extensions blocking requests

## Advanced Debugging

Enable verbose logging by updating `src/lib/ai-service.ts`:

```typescript
// Add this at the top of askAIChatbot function
console.log('AI Request:', { message, historyLength: history.length })
console.log('Context:', context)
```

This will help identify if the problem is with:
- Message formatting
- Context building
- API communication
- Response parsing

---

**Last Updated:** December 2024
