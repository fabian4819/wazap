const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export interface SensorData {
  voltage: number
  current: number
  force: number
  power: number
  timestamp?: string
}

export interface EnergyData {
  time: string
  energy: number
  voltage: number
}

export interface DailyData {
  date: string
  energy: number
  steps: number
  efficiency: number
}

export interface WeeklyData {
  week: string
  energy: number
  avgSteps: number
}

export interface RecentActivity {
  date: string
  energy: number
  steps: number
  efficiency: number
}

// Generic API fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Data Management APIs
export const dataApi = {
  // Post sensor data
  postData: (data: Omit<SensorData, 'timestamp'>) =>
    apiFetch<SensorData>('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get all data
  getAllData: () => apiFetch<SensorData[]>('/api/data'),

  // Get average data
  getAverageData: () => apiFetch<SensorData>('/api/data/avg'),
}

// Dashboard APIs
export const dashboardApi = {
  // Get total energy
  getTotalEnergy: () => apiFetch<{ totalEnergy: number }>('/api/data/total-energy'),

  // Get current voltage
  getCurrentVoltage: () => apiFetch<{ voltage: number }>('/api/data/current-voltage'),

  // Get energy generation for last 24 hours - returns object with hour keys
  getEnergyGeneration24h: async (): Promise<EnergyData[]> => {
    const data = await apiFetch<Record<string, number>>('/api/data/energy-generation-24h')
    return Object.entries(data).map(([hour, energy]) => ({
      time: `${hour}:00`,
      energy: energy,
      voltage: 0
    }))
  },

  // Get voltage output for last 24 hours - returns object with hour keys
  getVoltageOutput24h: async (): Promise<EnergyData[]> => {
    const data = await apiFetch<Record<string, number>>('/api/data/voltage-output-24h')
    return Object.entries(data).map(([hour, voltage]) => ({
      time: `${hour}:00`,
      energy: 0,
      voltage: voltage
    }))
  },

  // Get energy storage
  getEnergyStorage: async () => {
    const data = await apiFetch<{ estimatedStorage: number }>('/api/data/energy-storage')
    const capacity = 200000 // Assuming 200Wh capacity
    return {
      current: data.estimatedStorage,
      capacity: capacity,
      percentage: Math.min((data.estimatedStorage / capacity) * 100, 100)
    }
  },

  // Get peak generation
  getPeakGeneration: async () => {
    const data = await apiFetch<{ peakPower: number; timestamp: string }>('/api/data/peak-generation')
    return {
      peak: data.peakPower,
      timestamp: data.timestamp
    }
  },

  // Get average voltage
  getAverageVoltage: async () => {
    const data = await apiFetch<{ averageVoltage: number }>('/api/data/average-voltage')
    return {
      average: data.averageVoltage
    }
  },
}

// History APIs
export const historyApi = {
  // Get total energy today
  getTotalEnergyToday: () => apiFetch<{ totalEnergy: number }>('/api/data/totalenergytoday'),

  // Get total energy for last 7 days
  getTotalEnergy7Days: () => apiFetch<{ totalEnergy: number }>('/api/data/totalenergy-7days'),

  // Get total energy for last 30 days
  getTotalEnergy30Days: () => apiFetch<{ totalEnergy: number }>('/api/data/totalenergy-30days'),

  // Get daily energy breakdown for last 7 days
  getDailyEnergy7Days: async (): Promise<DailyData[]> => {
    const data = await apiFetch<Array<{ _id: { year: number; month: number; day: number }; totalEnergy: number }>>('/api/data/daily-energy-7days')
    return data.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      energy: item.totalEnergy,
      steps: Math.floor(item.totalEnergy * 2), // Estimated steps
      efficiency: 90 + Math.random() * 8 // Estimated efficiency 90-98%
    }))
  },

  // Get weekly energy summary
  getWeeklyEnergy: async (): Promise<WeeklyData[]> => {
    const data = await apiFetch<Array<{ _id: number; totalEnergy: number }>>('/api/data/weekly-energy')
    return data.map(item => ({
      week: `Week ${item._id}`,
      energy: item.totalEnergy,
      avgSteps: Math.floor(item.totalEnergy * 2 / 7) // Estimated avg steps per day
    }))
  },

  // Get best performance day
  getBestPerformance: async () => {
    const data = await apiFetch<{ _id: { year: number; month: number; day: number }; totalEnergy: number }>('/api/data/best-performance')
    return {
      date: `${data._id.year}-${String(data._id.month).padStart(2, '0')}-${String(data._id.day).padStart(2, '0')}`,
      energy: data.totalEnergy,
      efficiency: 96 // Estimated efficiency
    }
  },

  // Get average daily output
  getAverageDailyOutput: async () => {
    const data = await apiFetch<{ avgEnergy?: number }>('/api/data/average-daily-output')
    return {
      avgEnergy: data.avgEnergy || 0,
      avgSteps: (data.avgEnergy || 0) * 2 // Estimated steps
    }
  },

  // Get recent activity
  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const data = await apiFetch<Array<{ _id: { year: number; month: number; day: number }; totalEnergy: number }>>('/api/data/recent-activity')
    return data.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      energy: item.totalEnergy,
      steps: Math.floor(item.totalEnergy * 2), // Estimated steps
      efficiency: 90 + Math.random() * 8 // Estimated efficiency 90-98%
    }))
  },
}

// Streaming APIs (Server-Sent Events)
export const streamingApi = {
  // Create EventSource for streaming
  createStream: (endpoint: string): EventSource => {
    return new EventSource(`${API_BASE_URL}/api/data/stream/${endpoint}`)
  },

  // Stream voltage data
  streamVoltage: () => streamingApi.createStream('voltage'),

  // Stream current data
  streamCurrent: () => streamingApi.createStream('current'),

  // Stream power data
  streamPower: () => streamingApi.createStream('power'),

  // Stream temperature data
  streamTemperature: () => streamingApi.createStream('temperature'),

  // Stream voltage output
  streamVoltageOutput: () => streamingApi.createStream('voltage-output'),

  // Stream power generation
  streamPowerGeneration: () => streamingApi.createStream('power-generation'),

  // Stream raw data
  streamRaw: () => streamingApi.createStream('raw'),
}
