'use client'
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsStats } from "@/components/reports/reports-stats"
import { KeyTransferLogs } from "@/components/reports/key-transfer-logs"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { useState } from "react"

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    distributorId: '',
    status: '',
    search: '',
  });

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="responsive-container py-4 sm:py-8">
      <ReportsHeader />

      {/* Stats Overview */}
      <div className="mt-8">
        <ReportsStats />
      </div>

      {/* Filters */}
      <div className="mt-8">
        <ReportsFilters onApplyFilters={handleApplyFilters} />
      </div>

      {/* Key Transfer Logs */}
      <div className="mt-8">
        <KeyTransferLogs filters={filters} />
      </div>
    </div>
  )
}
