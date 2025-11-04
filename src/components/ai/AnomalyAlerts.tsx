import { useState, useEffect } from 'react'
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { detectAnomalies, type AnomalyAlert } from '@/lib/ai-service'
import { dashboardApi } from '@/lib/api'

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAnomalies()
    // Check for anomalies every 5 minutes
    const interval = setInterval(checkAnomalies, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const checkAnomalies = async () => {
    try {
      const data = await dashboardApi.getEnergyGeneration24h()
      const detectedAlerts = await detectAnomalies(data)
      setAlerts(detectedAlerts)
    } catch (error) {
      console.error('Failed to check anomalies:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-5 w-5" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  if (loading) {
    return null
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            System Healthy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No anomalies detected. All systems operating normally.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Anomaly Alerts
          <Badge variant="destructive" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
            >
              <div className={`mt-0.5 ${getSeverityColor(alert.severity)}`}>
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Current: {alert.value.toFixed(2)}</span>
                  <span>Expected: {alert.expected.toFixed(2)}</span>
                  <span>{alert.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
