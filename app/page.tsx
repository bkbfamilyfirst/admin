'use client'
import { WelcomeCard } from "@/components/welcome-card"
import { TotalKeysCard } from "@/components/dashboard/total-keys-card"
import { TotalActivationsCard } from "@/components/dashboard/total-activations-card"
import { UsersPerRoleCard } from "@/components/dashboard/users-per-role-card"
import { KeyInventoryCard } from "@/components/dashboard/key-inventory-card"
import { GenerateKeysCard } from "@/components/dashboard/generate-keys-card"
import { KeyValidityCard } from "@/components/dashboard/key-validity-card"
import { DashboardProvider } from "@/components/dashboard/dashboard-context"
import { RoleListCard } from "@/components/dashboard/role-list-card"

export default function Home() {
  return (
    <DashboardProvider>
      <div className="responsive-container py-4 sm:py-8">
        <WelcomeCard />

        {/* First Row - Key Overview */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <TotalKeysCard />
          <TotalActivationsCard />
          <GenerateKeysCard />
        </div>

        {/* Second Row - Detailed Analytics */}
        <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <UsersPerRoleCard />
          <KeyInventoryCard />
        </div>
      
        {/* Third Row - Key Monitoring */}
        <div className="mt-4 sm:mt-6">
          <KeyValidityCard />
        </div>

        {/* Fourth Row - (Removed detailed role lists from homepage)
            UsersPerRoleCard now links to dedicated role list pages under /roles/[role]
        */}
      </div>
    </DashboardProvider>
  )
}
