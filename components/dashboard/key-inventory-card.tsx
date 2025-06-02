import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, ArrowRight, ArrowLeft, Archive } from "lucide-react"

export function KeyInventoryCard() {
  const totalGenerated = 15000
  const transferred = 12847
  const remaining = totalGenerated - transferred
  const transferPercentage = (transferred / totalGenerated) * 100

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
            Key Inventory
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Generated */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                <Archive className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">Total Generated</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              {totalGenerated.toLocaleString()}
            </span>
          </div>

          {/* Transfer Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Transfer Progress</span>
              <span>{transferPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={transferPercentage} className="h-3" />
          </div>

          {/* Transferred vs Remaining */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-electric-green" />
                <span className="text-sm font-medium">Transferred</span>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                {transferred.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeft className="h-4 w-4 text-electric-orange" />
                <span className="text-sm font-medium">Remaining</span>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                {remaining.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
