'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { getAdminSummary } from "@/lib/api"
import { toast } from "sonner"

export function TotalActivationsCard() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any>({
    total: 0,
    monthlyGrowth: 0,
    active: 0,
    inactive: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await getAdminSummary()
        setData(res.totalActivations)
      } catch (err: any) {
        setError("Failed to load total activations data.")
        toast.error(err.response?.data?.message || "Failed to load total activations data.");
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!mounted) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Activations</CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-purple/20 to-electric-blue/20 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Activations</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          {data.total?.toLocaleString() ?? 0}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="h-4 w-4 text-electric-green" />
          <p className="text-sm text-electric-green font-medium">
            {data.monthlyGrowth ? `${data.monthlyGrowth > 0 ? '+' : ''}${data.monthlyGrowth}% from last month` : '0% from last month'}
          </p>
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Active: {data.active?.toLocaleString() ?? 0}</span>
          <span>Inactive: {data.inactive?.toLocaleString() ?? 0}</span>
        </div>
      </CardContent>
    </Card>
  )
}
