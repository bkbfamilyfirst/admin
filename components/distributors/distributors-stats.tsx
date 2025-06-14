'use client'
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, UserX, Key, Activity } from "lucide-react"
import { getAdminSummary } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function DistributorsStats() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await getAdminSummary()
        setData(res)
      } catch (err: any) {
        setError("Failed to load distributor stats.")
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load distributor stats.",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => (
          <Card key={i} className="overflow-hidden border-0 bg-white dark:bg-gray-900 animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  // Only nd is available, so show that. Others fallback to 0 or N/A.
  const stats = [
    {
      title: "Active ND",
      value: data.nd?.toLocaleString() ?? 0,
      change: "-", // No change data
      icon: UserCheck,
      color: "from-electric-green to-electric-cyan",
    },
    {
      title: "Inactive ND",
      value: "N/A",
      change: "-",
      icon: UserX,
      color: "from-electric-orange to-electric-pink",
    },
    {
      title: "Keys Assigned",
      value: data.totalKeys?.total?.toLocaleString() ?? 0,
      change: "-",
      icon: Key,
      color: "from-electric-purple to-electric-blue",
    },
    {
      title: "Activation Rate",
      value: data.totalActivations && data.totalKeys && data.totalKeys.total > 0 ? `${Math.round((data.totalActivations.total / data.totalKeys.total) * 100)}%` : "0%",
      change: "-",
      icon: Activity,
      color: "from-electric-blue to-electric-cyan",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`text-sm font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.change}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
