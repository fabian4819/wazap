import { useState, useEffect } from 'react'
import { TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { forecastEnergy, type EnergyForecast } from '@/lib/ai-service'

export function EnergyForecast() {
  const [forecast, setForecast] = useState<EnergyForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState(24)

  useEffect(() => {
    loadForecast()
  }, [hours])

  const loadForecast = async () => {
    setLoading(true)
    try {
      const data = await forecastEnergy(hours)
      setForecast(data)
    } catch (error) {
      console.error('Failed to load forecast:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = forecast.map(f => ({
    time: new Date(f.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }),
    energy: f.predictedEnergy,
    confidence: f.confidence * 100
  }))

  const avgForecast = forecast.length > 0
    ? (forecast.reduce((sum, f) => sum + f.predictedEnergy, 0) / forecast.length).toFixed(2)
    : '0'

  const avgConfidence = forecast.length > 0
    ? (forecast.reduce((sum, f) => sum + f.confidence, 0) / forecast.length * 100).toFixed(0)
    : '0'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Energy Forecast
        </CardTitle>
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="text-sm border border-input rounded-lg px-2 py-1 bg-background"
        >
          <option value={12}>12 hours</option>
          <option value={24}>24 hours</option>
          <option value={48}>48 hours</option>
        </select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Predicted Energy</p>
                <p className="text-2xl font-bold">{avgForecast} mWh</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                <p className="text-2xl font-bold">{avgConfidence}%</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  label={{ value: 'mWh', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Predicted Energy (mWh)"
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              AI-powered forecast based on historical patterns and trends
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
