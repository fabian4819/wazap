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

const energyData = [
  { time: '00:00', energy: 0.5, voltage: 2.1 },
  { time: '04:00', energy: 0.3, voltage: 1.8 },
  { time: '08:00', energy: 2.1, voltage: 3.2 },
  { time: '12:00', energy: 3.5, voltage: 4.1 },
  { time: '16:00', energy: 4.2, voltage: 4.8 },
  { time: '20:00', energy: 2.8, voltage: 3.6 },
  { time: '24:00', energy: 1.2, voltage: 2.4 },
]

const stats = [
  {
    title: 'Total Energy Generated',
    value: '47.3 mWh',
    change: '+12.5%',
    icon: Zap,
    color: 'text-green-600'
  },
  {
    title: 'Current Voltage',
    value: '3.8V',
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

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time energy generation and system monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Energy Generation</CardTitle>
            <CardDescription>
              Piezoelectric energy output over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={energyData}>
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
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Voltage Output</CardTitle>
            <CardDescription>
              Real-time voltage measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={energyData}>
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
              <span className="font-medium">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="text-xs text-muted-foreground">
              Estimated full charge in 2.3 hours
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
              <span className="font-medium">4.2 mWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Average Voltage</span>
              <span className="font-medium">3.2V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Uptime</span>
              <span className="font-medium">23h 47m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Data Points</span>
              <span className="font-medium">1,428</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}