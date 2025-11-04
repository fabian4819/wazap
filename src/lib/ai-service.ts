import { geminiModel, isAIEnabled } from './gemini'
import { dashboardApi, historyApi } from './api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface EnergyForecast {
  timestamp: string
  predictedEnergy: number
  confidence: number
}

export interface AIInsight {
  title: string
  description: string
  type: 'positive' | 'neutral' | 'warning'
  priority: number
}

export interface AnomalyAlert {
  id: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
  message: string
  metric: string
  value: number
  expected: number
}

/**
 * AI Chatbot Service - Answer questions about energy data
 */
export async function askAIChatbot(message: string, history: ChatMessage[] = []): Promise<string> {
  if (!isAIEnabled() || !geminiModel) {
    return 'AI features are currently disabled. Please configure your Gemini API key in the environment variables.'
  }

  try {
    // Fetch current energy data to provide context
    const [energyData24h, totalToday, avgVoltage] = await Promise.all([
      dashboardApi.getEnergyGeneration24h().catch(() => []),
      historyApi.getTotalEnergyToday().catch(() => ({ totalEnergy: 0 })),
      dashboardApi.getAverageVoltage().catch(() => ({ average: 0 }))
    ])

    // Build context for the AI
    const context = `You are an AI assistant for the WaZap Energy Harvesting System, which converts footsteps into electrical energy using piezoelectric sensors.

Current System Data:
- Total Energy Today: ${totalToday.totalEnergy} mWh
- Average Voltage: ${avgVoltage.average} V
- 24h Energy Data Points: ${energyData24h.length} readings
- Recent Energy: ${energyData24h.slice(-5).map((d: any) => `${d.energy}mWh at ${d.time}`).join(', ')}

Your role is to help users understand their energy generation data, answer questions about system performance, and provide insights. Be concise and helpful.`

    // Build conversation history - convert 'assistant' to 'model' for Gemini API
    const conversationHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const chat = geminiModel.startChat({
      history: conversationHistory.length > 0 ? conversationHistory : undefined
    })

    // Send message with context prepended for first message
    const messageWithContext = history.length === 0
      ? `${context}\n\nUser question: ${message}`
      : message

    const result = await chat.sendMessage(messageWithContext)
    const response = result.response
    return response.text()
  } catch (error: any) {
    console.error('AI Chatbot error details:', {
      message: error?.message,
      status: error?.status,
      error: error
    })

    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      return 'Invalid API key. Please check your Gemini API key configuration.'
    }
    if (error?.message?.includes('quota')) {
      return 'API quota exceeded. Please try again later.'
    }
    if (error?.message?.includes('blocked')) {
      return 'Content was blocked by safety filters. Please rephrase your question.'
    }

    return `Error: ${error?.message || 'Unknown error occurred'}. Please check the console for details.`
  }
}

/**
 * Energy Forecasting Service - Predict future energy generation
 */
export async function forecastEnergy(hours: number = 24): Promise<EnergyForecast[]> {
  if (!isAIEnabled() || !geminiModel) {
    // Return mock data if AI is disabled
    return generateMockForecast(hours)
  }

  try {
    // Get historical data
    const dailyEnergy = await historyApi.getDailyEnergy7Days()

    const prompt = `Based on this 7-day energy generation history for a piezoelectric energy harvesting system:
${dailyEnergy.map((d: any) => `${d.date}: ${d.energy} mWh`).join('\n')}

Analyze the pattern and predict energy generation for the next ${hours} hours in JSON format:
[{"hour": 0, "energy": 0.5, "confidence": 0.85}, ...]

Consider:
- Typical daily patterns (higher during work hours)
- Weekend vs weekday differences
- Recent trends

Respond ONLY with valid JSON array, no additional text.`

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const predictions = JSON.parse(jsonMatch[0])
      const now = new Date()

      return predictions.slice(0, hours).map((p: any, i: number) => ({
        timestamp: new Date(now.getTime() + i * 3600000).toISOString(),
        predictedEnergy: p.energy || 0,
        confidence: p.confidence || 0.5
      }))
    }
  } catch (error) {
    console.error('Energy forecast error:', error)
  }

  return generateMockForecast(hours)
}

function generateMockForecast(hours: number): EnergyForecast[] {
  const now = new Date()
  const forecast: EnergyForecast[] = []

  for (let i = 0; i < hours; i++) {
    const hour = (now.getHours() + i) % 24
    // Higher energy during work hours (8am-6pm)
    const baseEnergy = hour >= 8 && hour <= 18 ? 0.8 : 0.3
    const randomVariation = Math.random() * 0.2

    forecast.push({
      timestamp: new Date(now.getTime() + i * 3600000).toISOString(),
      predictedEnergy: baseEnergy + randomVariation,
      confidence: 0.7
    })
  }

  return forecast
}

/**
 * AI Insights Generation - Generate actionable insights from data
 */
export async function generateInsights(): Promise<AIInsight[]> {
  if (!isAIEnabled() || !geminiModel) {
    return getMockInsights()
  }

  try {
    const [dailyEnergy, totalToday, avgVoltage] = await Promise.all([
      historyApi.getDailyEnergy7Days().catch(() => []),
      historyApi.getTotalEnergyToday().catch(() => ({ totalEnergy: 0 })),
      dashboardApi.getAverageVoltage().catch(() => ({ average: 0 }))
    ])

    const prompt = `Analyze this energy harvesting system data and provide 3-5 actionable insights in JSON format:

Today's Total: ${totalToday.totalEnergy} mWh
Average Voltage: ${avgVoltage.average} V
7-day History: ${dailyEnergy.map((d: any) => `${d.date}: ${d.energy}mWh`).join(', ')}

Provide insights as JSON array:
[{
  "title": "Short insight title",
  "description": "Brief explanation and recommendation",
  "type": "positive" | "neutral" | "warning",
  "priority": 1-10
}, ...]

Focus on: performance trends, efficiency opportunities, unusual patterns, and actionable recommendations.
Respond ONLY with valid JSON array, no additional text.`

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()

    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Insights generation error:', error)
  }

  return getMockInsights()
}

function getMockInsights(): AIInsight[] {
  return [
    {
      title: 'Strong Morning Performance',
      description: 'Energy generation peaks between 8-10 AM. Consider optimizing sensor placement for morning foot traffic.',
      type: 'positive',
      priority: 8
    },
    {
      title: 'Voltage Stability Good',
      description: 'System voltage remains stable around 3.5V. No calibration needed.',
      type: 'positive',
      priority: 5
    },
    {
      title: 'Weekend Drop Normal',
      description: 'Energy generation drops 40% on weekends due to reduced foot traffic. This is expected behavior.',
      type: 'neutral',
      priority: 3
    }
  ]
}

/**
 * Anomaly Detection - Detect unusual patterns in sensor data
 */
export async function detectAnomalies(recentData: any[]): Promise<AnomalyAlert[]> {
  const alerts: AnomalyAlert[] = []

  if (recentData.length === 0) return alerts

  try {
    // Calculate statistics
    const voltages = recentData.map(d => d.voltage || 0)
    const energies = recentData.map(d => d.energy || 0)

    const avgVoltage = voltages.reduce((a, b) => a + b, 0) / voltages.length
    const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length

    const latestVoltage = voltages[voltages.length - 1]
    const latestEnergy = energies[energies.length - 1]

    // Voltage anomaly detection
    if (latestVoltage < avgVoltage * 0.5) {
      alerts.push({
        id: `anomaly-${Date.now()}-voltage`,
        timestamp: new Date(),
        severity: 'high',
        message: 'Voltage dropped significantly below average. Check sensor connections.',
        metric: 'voltage',
        value: latestVoltage,
        expected: avgVoltage
      })
    } else if (latestVoltage < avgVoltage * 0.7) {
      alerts.push({
        id: `anomaly-${Date.now()}-voltage-low`,
        timestamp: new Date(),
        severity: 'medium',
        message: 'Voltage is lower than typical. Monitor system performance.',
        metric: 'voltage',
        value: latestVoltage,
        expected: avgVoltage
      })
    }

    // Energy anomaly detection
    if (latestEnergy < avgEnergy * 0.3 && avgEnergy > 0.1) {
      alerts.push({
        id: `anomaly-${Date.now()}-energy`,
        timestamp: new Date(),
        severity: 'medium',
        message: 'Energy generation significantly lower than expected.',
        metric: 'energy',
        value: latestEnergy,
        expected: avgEnergy
      })
    }

    // Zero output detection
    if (latestVoltage === 0 && latestEnergy === 0) {
      alerts.push({
        id: `anomaly-${Date.now()}-zero`,
        timestamp: new Date(),
        severity: 'high',
        message: 'No energy generation detected. System may be offline.',
        metric: 'system',
        value: 0,
        expected: avgEnergy
      })
    }
  } catch (error) {
    console.error('Anomaly detection error:', error)
  }

  return alerts
}
