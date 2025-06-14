'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import { getKeyValidityTimeline } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function KeyValidityCard() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await getKeyValidityTimeline()
        setData(res)
      } catch (error: any) {
        setError("Failed to load key validity data.")
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load key validity data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!mounted) return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-pulse">
      <CardHeader>
        <CardTitle className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  )
  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  const timeline = data.timeline || {}
  const summary = data.summary || {}
  const total = Object.values(timeline).reduce((sum: number, v: any) => sum + (typeof v === 'number' ? v : 0), 0)

  const periods = [
    { label: '0-6 months', key: '0-6', color: 'from-electric-green to-electric-cyan', icon: <CheckCircle className="h-4 w-4 text-electric-green" /> },
    { label: '6-12 months', key: '6-12', color: 'from-electric-blue to-electric-purple', icon: <CheckCircle className="h-4 w-4 text-electric-blue" /> },
    { label: '12-18 months', key: '12-18', color: 'from-electric-orange to-electric-pink', icon: <AlertTriangle className="h-4 w-4 text-electric-orange" /> },
    { label: '18-24 months', key: '18-24', color: 'from-electric-pink to-electric-purple', icon: <AlertTriangle className="h-4 w-4 text-electric-pink" /> },
  ]

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
            {periods.map((item, idx) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {timeline[item.key]?.toLocaleString() ?? 0}
                  </span>
                </div>
                <Progress value={total > 0 ? (timeline[item.key] / total) * 100 : 0} className="h-2" />
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
                  {summary.validKeys?.toLocaleString() ?? 0}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-electric-orange" />
                  <span className="text-xs font-medium">Expiring Soon</span>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                  {summary.expiringSoon?.toLocaleString() ?? 0}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-electric-blue" />
                <span className="text-xs font-medium">Average Validity (months)</span>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                {summary.averageValidity?.toFixed(1) ?? 0}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



