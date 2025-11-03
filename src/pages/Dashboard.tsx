import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Battery,
  Zap,
  TrendingUp,
  Users,
  Power,
  Gauge
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { dashboardApi } from '@/lib/api'
import type { EnergyData } from '@/lib/api'

export function Dashboard() {
  const [totalEnergy, setTotalEnergy] = useState(0)
  const [currentVoltage, setCurrentVoltage] = useState(0)
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [voltageData, setVoltageData] = useState<EnergyData[]>([])
  const [energyStorage, setEnergyStorage] = useState({ current: 0, capacity: 0, percentage: 0 })
  const [peakGeneration, setPeakGeneration] = useState({ peak: 0, timestamp: '' })
  const [averageVoltage, setAverageVoltage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [
          totalEnergyRes,
          currentVoltageRes,
          energyGen24h,
          voltageOut24h,
          storage,
          peak,
          avgVoltage
        ] = await Promise.all([
          dashboardApi.getTotalEnergy(),
          dashboardApi.getCurrentVoltage(),
          dashboardApi.getEnergyGeneration24h(),
          dashboardApi.getVoltageOutput24h(),
          dashboardApi.getEnergyStorage(),
          dashboardApi.getPeakGeneration(),
          dashboardApi.getAverageVoltage()
        ])

        setTotalEnergy(totalEnergyRes.totalEnergy)
        setCurrentVoltage(currentVoltageRes.voltage)
        setEnergyData(energyGen24h)
        setVoltageData(voltageOut24h)
        setEnergyStorage(storage)
        setPeakGeneration(peak)
        setAverageVoltage(avgVoltage.average)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: 'Total Energy Generated',
      value: loading ? '...' : `${totalEnergy.toFixed(1)} mWh`,
      change: '+12.5%',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Current Voltage',
      value: loading ? '...' : `${currentVoltage.toFixed(1)}V`,
      change: '+2.1%',
      icon: Gauge,
      color: 'text-blue-600'
    },
    {
      title: 'Active Steps Today',
      value: '12,847',
      change: '+18.2%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'System Efficiency',
      value: '94.2%',
      change: '+0.5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time energy generation and system monitoring
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Power className="w-3 h-3 mr-1" />
            Online
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Battery className="w-3 h-3 mr-1" />
            98% Health
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Energy Generation</CardTitle>
            <CardDescription>
              Piezoelectric energy output over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData.length > 0 ? energyData : [{ time: '00:00', energy: 0, voltage: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value} ${name === 'energy' ? 'mWh' : 'V'}`, name === 'energy' ? 'Energy' : 'Voltage']}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Voltage Output</CardTitle>
            <CardDescription>
              Real-time voltage measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={voltageData.length > 0 ? voltageData : [{ time: '00:00', energy: 0, voltage: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}V`, 'Voltage']} />
                <Line
                  type="monotone"
                  dataKey="voltage"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d' }}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">STM32 Connection</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Connected</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">WiFi Module</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Online</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Piezoelectric Sensor</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Data Transmission</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Stable</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Current Charge</span>
              <span className="font-medium">{loading ? '...' : `${energyStorage.percentage}%`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${energyStorage.percentage}%` }}></div>
            </div>
            <div className="text-xs text-muted-foreground">
              {loading ? 'Loading...' : `${energyStorage.current?.toFixed(1) || 0} / ${energyStorage.capacity?.toFixed(1) || 0} mWh`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Peak Generation</span>
              <span className="font-medium">{loading ? '...' : `${peakGeneration.peak?.toFixed(1) || 0} mWh`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Average Voltage</span>
              <span className="font-medium">{loading ? '...' : `${averageVoltage?.toFixed(1) || 0}V`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Peak Time</span>
              <span className="font-medium">{loading ? '...' : peakGeneration.timestamp ? new Date(peakGeneration.timestamp).toLocaleTimeString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Data Points</span>
              <span className="font-medium">{energyData.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}