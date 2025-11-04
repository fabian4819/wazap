import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface DataPoint {
  timestamp: string
  voltage: number
  current: number
  power: number
  force: number
}

interface StreamingContextType {
  isStreaming: boolean
  realtimeData: DataPoint[]
  currentReading: DataPoint
  startStreaming: () => void
  pauseStreaming: () => void
  stopStreaming: () => void
}

const StreamingContext = createContext<StreamingContextType | undefined>(undefined)

export function StreamingProvider({ children }: { children: ReactNode }) {
  // Restore streaming state from localStorage
  const [isStreaming, setIsStreaming] = useState(() => {
    const saved = localStorage.getItem('isStreaming')
    return saved === 'true'
  })
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([])
  const [currentReading, setCurrentReading] = useState<DataPoint>({
    timestamp: new Date().toISOString(),
    voltage: 0,
    current: 0,
    power: 0,
    force: 0
  })

  // Save streaming state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isStreaming', String(isStreaming))
  }, [isStreaming])

  // Global EventSource that persists across page navigation
  useEffect(() => {
    let eventSource: EventSource | null = null

    if (isStreaming) {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      eventSource = new EventSource(`${API_BASE_URL}/api/data/stream/raw`)

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const dataArray = Array.isArray(data) ? data : [data]
          const latestData = dataArray[dataArray.length - 1]

          if (latestData) {
            const newReading: DataPoint = {
              timestamp: latestData.timestamp || new Date().toISOString(),
              voltage: latestData.voltage || 0,
              current: latestData.current || 0,
              power: latestData.power || 0,
              force: latestData.force || 0
            }

            setCurrentReading(newReading)

            setRealtimeData(prev => {
              const updated = [...prev, {
                ...newReading,
                timestamp: new Date(newReading.timestamp).toLocaleTimeString()
              }]
              return updated.slice(-20) // Keep last 20 data points
            })
          }
        } catch (error) {
          console.error('Error parsing stream data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        eventSource?.close()
        setIsStreaming(false)
      }
    }

    // Cleanup when streaming stops
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [isStreaming])

  // Note: We DO NOT stop streaming on page refresh
  // The state persists via localStorage and streaming resumes automatically

  const startStreaming = () => setIsStreaming(true)
  const pauseStreaming = () => setIsStreaming(false)
  const stopStreaming = () => {
    setIsStreaming(false)
    setRealtimeData([])
  }

  return (
    <StreamingContext.Provider
      value={{
        isStreaming,
        realtimeData,
        currentReading,
        startStreaming,
        pauseStreaming,
        stopStreaming
      }}
    >
      {children}
    </StreamingContext.Provider>
  )
}

export function useStreaming() {
  const context = useContext(StreamingContext)
  if (context === undefined) {
    throw new Error('useStreaming must be used within a StreamingProvider')
  }
  return context
}
