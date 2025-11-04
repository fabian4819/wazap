import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY || API_KEY === 'your_google_gemini_api_key_here') {
  console.warn('Gemini API key not configured. AI features will be disabled.')
}

const genAI = API_KEY && API_KEY !== 'your_google_gemini_api_key_here' ? new GoogleGenerativeAI(API_KEY) : null

// Use gemini-2.5-flash - latest stable model (as of 2025)
export const geminiModel = genAI ? genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1024,
  }
}) : null

export const isAIEnabled = (): boolean => {
  return genAI !== null && API_KEY !== 'your_google_gemini_api_key_here'
}
