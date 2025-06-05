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

const userRoles = [
  { role: "Admin", count: 3, icon: Crown, color: "from-electric-purple to-electric-pink" },
  { role: "National Distributors", count: 24, icon: Shield, color: "from-electric-blue to-electric-cyan" },
  { role: "State Supervisor", count: 156, icon: UserCheck, color: "from-electric-green to-electric-blue" },
  { role: "Distributor", count: 8945, icon: Users, color: "from-electric-orange to-electric-pink" },
  { role: "Retailer", count: 12034, icon: Store, color: "from-electric-yellow to-electric-orange" }
]

export function UsersPerRoleCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
          {userRoles.map((role, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 bg-gradient-to-r ${role.color}`}>
                  <role.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {role.role}
                </span>
              </div>
              <div className={`text-xl font-bold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                {role.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
