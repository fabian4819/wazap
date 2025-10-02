import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { historyApi } from '@/lib/api'
import type { DailyData, WeeklyData, RecentActivity } from '@/lib/api'

export function History() {
  const [timeRange, setTimeRange] = useState('7days')
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [bestPerformance, setBestPerformance] = useState({ date: '', energy: 0, efficiency: 0 })
  const [avgDailyOutput, setAvgDailyOutput] = useState({ avgEnergy: 0, avgSteps: 0 })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true)
        const [
          daily7Days,
          weekly,
          performance,
          avgOutput,
          recent
        ] = await Promise.all([
          historyApi.getDailyEnergy7Days(),
          historyApi.getWeeklyEnergy(),
          historyApi.getBestPerformance(),
          historyApi.getAverageDailyOutput(),
          historyApi.getRecentActivity()
        ])

        setDailyData(daily7Days)
        setWeeklyData(weekly)
        setBestPerformance(performance)
        setAvgDailyOutput(avgOutput)
        setRecentActivity(recent)
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoryData()
  }, [timeRange])

  const currentData = dailyData.length > 0 ? dailyData : []
  const totalEnergy = currentData.reduce((sum, day) => sum + day.energy, 0)
  const avgEfficiency = currentData.length > 0
    ? currentData.reduce((sum, day) => sum + day.efficiency, 0) / currentData.length
    : 0
  const totalSteps = currentData.reduce((sum, day) => sum + day.steps, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">History</h2>
          <p className="text-muted-foreground">
            Historical energy generation data and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {['7days', '30days', '90days', '1year'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === '7days' && 'Last 7 Days'}
            {range === '30days' && 'Last 30 Days'}
            {range === '90days' && 'Last 90 Days'}
            {range === '1year' && 'Last Year'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Energy Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergy.toFixed(1)} mWh</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSteps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-3.4%</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Energy Generation</CardTitle>
            <CardDescription>Energy generated per day over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value} mWh`, 'Energy']}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Weekly energy generation comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} mWh`, 'Energy']} />
                <Bar dataKey="energy" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy Generation Efficiency</CardTitle>
          <CardDescription>System efficiency percentage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={currentData.length > 0 ? [85, 100] : [0, 100]} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}%`, 'Efficiency']}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ fill: '#ff7300' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Best Performance Day</p>
                <p className="text-sm text-green-600">
                  {loading ? 'Loading...' : bestPerformance.date ? `${new Date(bestPerformance.date).toLocaleDateString()} - ${bestPerformance.energy?.toFixed(1) || 0} mWh` : 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">Most Efficient Day</p>
                <p className="text-sm text-blue-600">
                  {loading ? 'Loading...' : bestPerformance.date ? `${new Date(bestPerformance.date).toLocaleDateString()} - ${bestPerformance.efficiency?.toFixed(1) || 0}%` : 'N/A'}
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p className="font-medium text-orange-800">Average Daily Output</p>
                <p className="text-sm text-orange-600">
                  {loading ? 'Loading...' : `${avgDailyOutput.avgEnergy?.toFixed(1) || 0} mWh per day`}
                </p>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-700">Good</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentActivity.length > 0 ? (
              recentActivity.slice(-5).reverse().map((day, index) => (
                <div key={day.date || index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{day.steps?.toLocaleString() || 0} steps</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{day.energy?.toFixed(1) || 0} mWh</p>
                    <p className="text-sm text-muted-foreground">{day.efficiency?.toFixed(1) || 0}% eff.</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}