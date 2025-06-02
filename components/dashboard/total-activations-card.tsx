import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, AlertTriangle } from "lucide-react"

export function TotalActivationsCard() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-cyan/10 to-electric-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-electric-cyan/30 to-electric-green/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Activations</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-cyan to-electric-green shadow-lg">
          <Activity className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
          8,945
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-electric-blue" />
              <span>Expiring Soon (30 days)</span>
            </div>
            <span className="font-medium text-electric-orange">234</span>
          </div>
          <Progress value={75} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Valid: 8,711</span>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-electric-orange" />
              <span>Expiring: 234</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
