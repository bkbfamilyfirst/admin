import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

const validityData = [
  { period: "0-6 months", count: 2847, color: "from-electric-green to-electric-cyan", status: "safe" },
  { period: "6-12 months", count: 3456, color: "from-electric-blue to-electric-purple", status: "good" },
  { period: "12-18 months", count: 2134, color: "from-electric-orange to-electric-pink", status: "warning" },
  { period: "18-24 months", count: 508, color: "from-electric-pink to-electric-purple", status: "critical" },
]

export function KeyValidityCard() {
  const totalKeys = validityData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Monitor Key Validity (2-Year Expiry)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Validity Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-electric-blue" />
              <span>Expiry Timeline</span>
            </div>
            {validityData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.status === "safe" && <CheckCircle className="h-4 w-4 text-electric-green" />}
                    {item.status === "good" && <CheckCircle className="h-4 w-4 text-electric-blue" />}
                    {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-electric-orange" />}
                    {item.status === "critical" && <AlertTriangle className="h-4 w-4 text-electric-pink" />}
                    <span className="text-sm font-medium">{item.period}</span>
                  </div>
                  <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <Progress value={(item.count / totalKeys) * 100} className="h-2" />
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="space-y-4">
            <div className="text-sm font-medium">Summary Statistics</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-electric-green" />
                  <span className="text-xs font-medium">Valid Keys</span>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                  {(validityData[0].count + validityData[1].count).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-electric-orange" />
                  <span className="text-xs font-medium">Expiring Soon</span>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                  {(validityData[2].count + validityData[3].count).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Validity</span>
                <span className="text-lg font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                  14.2 months
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
