"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Download, ArrowRight, Calendar, User, Key, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for key transfer logs
const transferLogs = [
  {
    id: "TXN001",
    timestamp: "2024-01-15 14:30:25",
    fromUser: "Admin",
    toDistributor: "TechGuard Solutions",
    distributorId: "ND001",
    keysTransferred: 500,
    status: "completed",
    transferType: "bulk",
    notes: "Monthly key allocation",
  },
  {
    id: "TXN002",
    timestamp: "2024-01-15 13:45:12",
    fromUser: "Admin",
    toDistributor: "SecureFamily Networks",
    distributorId: "ND002",
    keysTransferred: 300,
    status: "completed",
    transferType: "regular",
    notes: "Additional keys requested",
  },
  {
    id: "TXN003",
    timestamp: "2024-01-15 12:20:08",
    fromUser: "Admin",
    toDistributor: "KidSafe Technologies",
    distributorId: "ND003",
    keysTransferred: 750,
    status: "pending",
    transferType: "bulk",
    notes: "Quarterly allocation",
  },
  {
    id: "TXN004",
    timestamp: "2024-01-15 11:15:33",
    fromUser: "Admin",
    toDistributor: "ParentControl Systems",
    distributorId: "ND004",
    keysTransferred: 1000,
    status: "completed",
    transferType: "bulk",
    notes: "Large order fulfillment",
  },
  {
    id: "TXN005",
    timestamp: "2024-01-15 10:30:45",
    fromUser: "Admin",
    toDistributor: "FamilyShield Inc.",
    distributorId: "ND005",
    keysTransferred: 200,
    status: "failed",
    transferType: "regular",
    notes: "Insufficient inventory",
  },
  {
    id: "TXN006",
    timestamp: "2024-01-14 16:45:22",
    fromUser: "Admin",
    toDistributor: "TechGuard Solutions",
    distributorId: "ND001",
    keysTransferred: 150,
    status: "completed",
    transferType: "regular",
    notes: "Emergency allocation",
  },
  {
    id: "TXN007",
    timestamp: "2024-01-14 15:20:18",
    fromUser: "Admin",
    toDistributor: "SecureFamily Networks",
    distributorId: "ND002",
    keysTransferred: 400,
    status: "completed",
    transferType: "bulk",
    notes: "Weekly allocation",
  },
  {
    id: "TXN008",
    timestamp: "2024-01-14 14:10:55",
    fromUser: "Admin",
    toDistributor: "KidSafe Technologies",
    distributorId: "ND003",
    keysTransferred: 600,
    status: "pending",
    transferType: "bulk",
    notes: "Pending approval",
  },
  {
    id: "TXN009",
    timestamp: "2024-01-14 13:30:42",
    fromUser: "Admin",
    toDistributor: "ParentControl Systems",
    distributorId: "ND004",
    keysTransferred: 350,
    status: "completed",
    transferType: "regular",
    notes: "Standard allocation",
  },
  {
    id: "TXN010",
    timestamp: "2024-01-14 12:15:28",
    fromUser: "Admin",
    toDistributor: "FamilyShield Inc.",
    distributorId: "ND005",
    keysTransferred: 800,
    status: "completed",
    transferType: "bulk",
    notes: "Monthly bulk transfer",
  },
  {
    id: "TXN011",
    timestamp: "2024-01-14 11:45:15",
    fromUser: "Admin",
    toDistributor: "TechGuard Solutions",
    distributorId: "ND001",
    keysTransferred: 250,
    status: "pending",
    transferType: "regular",
    notes: "Awaiting confirmation",
  },
  {
    id: "TXN012",
    timestamp: "2024-01-14 10:20:33",
    fromUser: "Admin",
    toDistributor: "SecureFamily Networks",
    distributorId: "ND002",
    keysTransferred: 450,
    status: "completed",
    transferType: "bulk",
    notes: "Priority allocation",
  },
]

export function KeyTransferLogs() {
  const [sortColumn, setSortColumn] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedLogs = [...transferLogs].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = sortedLogs.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  return (
    <Card className="border-0 bg-white dark:bg-gray-900 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-electric-orange" />
            Key Transfer Logs
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-electric-orange to-electric-pink hover:opacity-90 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableHead className="w-[100px]">Transfer ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Timestamp
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Transfer Details
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Key className="h-4 w-4" />
                    Keys
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors">
                  <TableCell className="font-medium text-electric-purple">{log.id}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">From:</span>
                        <span className="font-medium text-electric-blue">{log.fromUser}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-electric-green">{log.toDistributor}</span>
                        <span className="text-xs text-gray-500">({log.distributorId})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                        {log.keysTransferred.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">keys</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{log.notes}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedLogs.length)} of {sortedLogs.length} entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={
                    currentPage === page
                      ? "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
                      : "border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
