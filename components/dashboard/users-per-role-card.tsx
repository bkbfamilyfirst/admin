"use client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Users,
  UserCheck,
  Shield,
  Crown,
  Store
} from "lucide-react"
import { getAdminSummary } from "@/lib/api"
import { toast } from "sonner"

const roleMap = [
  { key: "admin", label: "Admin", icon: Crown, color: "from-electric-purple to-electric-pink" },
  { key: "nd", label: "National Distributors", icon: Shield, color: "from-electric-blue to-electric-cyan" },
  { key: "ss", label: "State Supervisor", icon: UserCheck, color: "from-electric-green to-electric-blue" },
  { key: "db", label: "Distributor", icon: Users, color: "from-electric-orange to-electric-pink" },
  { key: "retailer", label: "Retailer", icon: Store, color: "from-electric-yellow to-electric-orange" },
]

export function UsersPerRoleCard() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any>({
    roles: [],
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await getAdminSummary()
        const rolesData = [
          { name: "Admin", count: res.admin || 0 },
          { name: "National Distributors", count: res.nd || 0 },
          { name: "State Supervisor", count: res.ss || 0 },
          { name: "Distributor", count: res.db || 0 },
          { name: "Retailer", count: res.retailer || 0 },
        ];
        const totalUsers = rolesData.reduce((sum, role) => sum + role.count, 0);
        setData({ roles: rolesData, total: totalUsers });
      } catch (err: any) {
        setError("Failed to load users per role data.")
        toast.error(err.response?.data?.message || "Failed to load users per role data.");
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
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Users Per Role</CardTitle>
          <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push('/roles') }}
      className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
            Total Users per Role
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.roles?.map((role: any) => {
            const roleConfig = roleMap.find(item => item.label === role.name);
            const IconComponent = roleConfig?.icon;
            const roleKey = roleConfig?.key || '';
            return (
              <div
                key={role.name}
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); roleKey && router.push(`/roles/${roleKey}`) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); roleKey && router.push(`/roles/${roleKey}`) } }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 bg-gradient-to-r ${roleConfig?.color}`}>
                    {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{role.name}</span>
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${roleConfig?.color} bg-clip-text text-transparent`}>
                  {role.count?.toLocaleString() ?? 0}
                </span>
              </div>
            );
          })}
          {/* <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</span>
              <span className="text-lg font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">{data.total?.toLocaleString() ?? 0}</span>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
