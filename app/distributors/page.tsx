import { DistributorsHeader } from "@/components/distributors/distributors-header"
import { DistributorsTable } from "@/components/distributors/distributors-table"
import { DistributorsStats } from "@/components/distributors/distributors-stats"
import { KeyAssignmentCard } from "@/components/distributors/key-assignment-card"

export default function DistributorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DistributorsHeader />

      {/* Stats Overview */}
      <div className="mt-8">
        <DistributorsStats />
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DistributorsTable />
        </div>
        <div>
          <KeyAssignmentCard />
        </div>
      </div>
    </div>
  )
}
