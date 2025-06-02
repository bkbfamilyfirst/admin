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
      <div className="mt-8 grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DistributorsTable />
        </div>
        <div className="xl:col-span-1">
          <KeyAssignmentCard />
        </div>
      </div>
    </div>
  )
}
