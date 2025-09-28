import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Square,
  Wifi,
  Database,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint {
  timestamp: string
  voltage: number
  current: number
  power: number
  temperature: number
}

export function DataStreaming() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([])
  const [currentReading, setCurrentReading] = useState<DataPoint>({
    timestamp: new Date().toISOString(),
    voltage: 0,
    current: 0,
    power: 0,
    temperature: 25.0
  })

  const generateRandomData = (): DataPoint => ({
    timestamp: new Date().toISOString(),
    voltage: 2.5 + Math.random() * 2.0,
    current: 0.5 + Math.random() * 1.5,
    power: (2.5 + Math.random() * 2.0) * (0.5 + Math.random() * 1.5),
    temperature: 24.0 + Math.random() * 3.0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isStreaming) {
      interval = setInterval(() => {
        const newData = generateRandomData()
        setCurrentReading(newData)

        setRealtimeData(prev => {
          const updated = [...prev, { ...newData, timestamp: new Date().toLocaleTimeString() }]
          return updated.slice(-20)
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStreaming])

  const handleStartStreaming = () => {
    setIsStreaming(true)
  }

  const handlePauseStreaming = () => {
    setIsStreaming(false)
  }

  const handleStopStreaming = () => {
    setIsStreaming(false)
    setRealtimeData([])
  }

  const connectionStatus = {
    stm32: isStreaming ? 'connected' : 'disconnected',
    wifi: isStreaming ? 'connected' : 'disconnected',
    api: isStreaming ? 'connected' : 'disconnected'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Streaming</h2>
          <p className="text-muted-foreground">
            Real-time data from piezoelectric sensors and STM32 microcontroller
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartStreaming}
            disabled={isStreaming}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
          <Button
            variant="outline"
            onClick={handlePauseStreaming}
            disabled={!isStreaming}
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
          <Button
            variant="outline"
            onClick={handleStopStreaming}
            disabled={!isStreaming && realtimeData.length === 0}
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">STM32 Connection</CardTitle>
            <Wifi className={`h-4 w-4 ${connectionStatus.stm32 === 'connected' ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {connectionStatus.stm32 === 'connected' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={connectionStatus.stm32 === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus.stm32 === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Microcontroller status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WiFi Module</CardTitle>
            <Activity className={`h-4 w-4 ${connectionStatus.wifi === 'connected' ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {connectionStatus.wifi === 'connected' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={connectionStatus.wifi === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus.wifi === 'connected' ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Wireless communication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Connection</CardTitle>
            <Database className={`h-4 w-4 ${connectionStatus.api === 'connected' ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {connectionStatus.api === 'connected' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={connectionStatus.api === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus.api === 'connected' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Data transmission
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReading.voltage.toFixed(2)}V</div>
            <p className="text-xs text-muted-foreground">
              Real-time measurement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReading.current.toFixed(2)}mA</div>
            <p className="text-xs text-muted-foreground">
              Flow measurement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReading.power.toFixed(2)}mW</div>
            <p className="text-xs text-muted-foreground">
              Generated power
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReading.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">
              System temperature
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voltage Output</CardTitle>
            <CardDescription>Real-time voltage measurements from piezoelectric sensor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, 5]} />
                <Tooltip formatter={(value) => [`${value}V`, 'Voltage']} />
                <Line
                  type="monotone"
                  dataKey="voltage"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Power Generation</CardTitle>
            <CardDescription>Real-time power output calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}mW`, 'Power']} />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sampling Rate</p>
              <p className="text-2xl font-bold">1 Hz</p>
              <p className="text-xs text-muted-foreground">Data points per second</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Buffer Size</p>
              <p className="text-2xl font-bold">20</p>
              <p className="text-xs text-muted-foreground">Data points displayed</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Data Points</p>
              <p className="text-2xl font-bold">{realtimeData.length}</p>
              <p className="text-xs text-muted-foreground">Currently in buffer</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Streaming Status</p>
              <Badge variant={isStreaming ? 'default' : 'secondary'}>
                {isStreaming ? 'Active' : 'Inactive'}
              </Badge>
              <p className="text-xs text-muted-foreground">Current state</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {realtimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Data Stream</CardTitle>
            <CardDescription>Latest sensor readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {realtimeData.slice().reverse().map((reading, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded text-sm">
                    <span className="font-mono">{reading.timestamp}</span>
                    <div className="flex gap-4">
                      <span>V: {reading.voltage.toFixed(2)}V</span>
                      <span>I: {reading.current.toFixed(2)}mA</span>
                      <span>P: {reading.power.toFixed(2)}mW</span>
                      <span>T: {reading.temperature.toFixed(1)}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}