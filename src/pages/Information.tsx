import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Cpu,
  Wifi,
  Battery,
  Gauge,
  Info,
  Users,
  Target,
  Lightbulb,
  Wrench
} from 'lucide-react'

export function Information() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Information</h2>
        <p className="text-muted-foreground">
          Learn about WaZap (Walk & Zap) - Smart Grid Energy Management System
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              WaZap - Walk & Zap Energy Harvesting System
            </CardTitle>
            <CardDescription>
              Revolutionary piezoelectric energy generation technology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              WaZap is an innovative smart grid energy management system that harnesses kinetic energy from human movement
              using advanced piezoelectric technology. Every step generates electrical energy that is captured, stored,
              and monitored through our intelligent dashboard system.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Sustainable Energy</Badge>
              <Badge variant="outline">IoT Integration</Badge>
              <Badge variant="outline">Real-time Monitoring</Badge>
              <Badge variant="outline">Smart Grid Ready</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Project Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Primary Goals</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Harvest kinetic energy from footsteps</li>
                <li>Convert mechanical energy to electrical power</li>
                <li>Store and manage generated energy efficiently</li>
                <li>Provide real-time monitoring and analytics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Secondary Goals</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Integrate with smart grid infrastructure</li>
                <li>Enable remote monitoring via IoT</li>
                <li>Promote sustainable energy practices</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium text-sm">Kinetic Energy Capture</p>
                  <p className="text-xs text-muted-foreground">Piezoelectric sensors convert footstep pressure into electrical energy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium text-sm">Signal Processing</p>
                  <p className="text-xs text-muted-foreground">STM32 microcontroller processes and conditions the electrical signals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium text-sm">Data Transmission</p>
                  <p className="text-xs text-muted-foreground">WiFi module sends data to cloud API for monitoring and analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <p className="font-medium text-sm">Visualization</p>
                  <p className="text-xs text-muted-foreground">Dashboard provides real-time monitoring and historical analytics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-600" />
            System Components
          </CardTitle>
          <CardDescription>
            Technical specifications and hardware components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Piezoelectric Sensor</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>Ceramic Piezoelectric</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voltage Range:</span>
                  <span>0-5V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sensitivity:</span>
                  <span>High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span>&lt;1ms</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">STM32 Microcontroller</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span>STM32F4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clock Speed:</span>
                  <span>168MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ADC Resolution:</span>
                  <span>12-bit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sampling Rate:</span>
                  <span>1kHz</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">WiFi Module</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>ESP32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span>802.11 b/g/n</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Range:</span>
                  <span>100m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Rate:</span>
                  <span>1 Hz</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium">Energy Storage</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>Supercapacitor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>1F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voltage:</span>
                  <span>5.5V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span>95%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-red-600" />
                <h3 className="font-medium">Dashboard Interface</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framework:</span>
                  <span>React + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Styling:</span>
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Components:</span>
                  <span>ShadCN UI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charts:</span>
                  <span>Recharts</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium">API & Backend</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span>HTTP/HTTPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>JSON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updates:</span>
                  <span>Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span>Cloud Database</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Features & Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Real-time energy monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Historical data analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Wireless data transmission</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Interactive dashboard visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">System health monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Dark/Light theme support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Mobile responsive design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Data export capabilities</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications & Use Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">Smart Buildings</h4>
                <p className="text-xs text-muted-foreground">Energy harvesting from foot traffic in offices, malls, and public buildings</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Walkways & Sidewalks</h4>
                <p className="text-xs text-muted-foreground">Urban energy generation from pedestrian movement</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Sports Facilities</h4>
                <p className="text-xs text-muted-foreground">Gyms, tracks, and recreational areas energy harvesting</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Transportation Hubs</h4>
                <p className="text-xs text-muted-foreground">Airports, train stations, and bus terminals</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Educational Institutions</h4>
                <p className="text-xs text-muted-foreground">Schools and universities for sustainable energy education</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Team & Development</CardTitle>
          <CardDescription>Capstone project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium">Development Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project Start:</span>
                  <span>January 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hardware Development:</span>
                  <span>Q1 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Software Development:</span>
                  <span>Q2 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integration & Testing:</span>
                  <span>Q3 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Presentation:</span>
                  <span>December 2024</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">ShadCN UI</Badge>
                <Badge variant="outline">Recharts</Badge>
                <Badge variant="outline">STM32</Badge>
                <Badge variant="outline">ESP32</Badge>
                <Badge variant="outline">Vite</Badge>
                <Badge variant="outline">Node.js</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}