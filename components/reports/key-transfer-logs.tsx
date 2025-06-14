"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Download, ArrowRight, Calendar, User, Key, ChevronLeft, ChevronRight } from "lucide-react"
import { KeyTransferLog, getKeyTransferLogs, exportKeyTransferLogs } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { format } from 'date-fns'

interface KeyTransferLogsProps {
  filters: {
    startDate: string;
    endDate: string;
    distributorId: string;
    status: string;
    search: string;
  };
}

export function KeyTransferLogs({ filters }: KeyTransferLogsProps) {
  const [transferLogs, setTransferLogs] = useState<KeyTransferLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalEntries, setTotalEntries] = useState(0)
  const [sortColumn, setSortColumn] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Changed to 10 based on the provided backend response

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getKeyTransferLogs(currentPage, itemsPerPage, sortColumn, sortDirection, filters.search, filters.startDate, filters.endDate, filters.distributorId, filters.status)
      setTransferLogs(response.logs)
      setTotalEntries(response.total)
    } catch (err: any) {
      setError("Failed to load key transfer logs.")
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load key transfer logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, sortColumn, sortDirection, filters.search, filters.startDate, filters.endDate, filters.distributorId, filters.status]);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handleExportClick = async () => {
    try {
      await exportKeyTransferLogs(filters);
      toast({
        title: "Success",
        description: "Key transfer logs exported successfully.",
      });
    } catch (err: any) {
      console.error("Error exporting key transfer logs:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to export key transfer logs.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalEntries / itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (loading) return <div className="p-4">Loading transfer logs...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

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
              onClick={handleExportClick}
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
              {transferLogs.map((log) => (
                <TableRow key={log.transferId} className="hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors">
                  <TableCell className="font-medium text-electric-purple">{log.transferId}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{format(new Date(log.timestamp), 'MM/dd/yyyy')}</div>
                      <div className="text-gray-500">{format(new Date(log.timestamp), 'h:mm:ss a')}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">From:</span>
                        <span className="font-medium text-electric-blue">{log.from?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-electric-green">{log.to?.name || 'N/A'}</span>
                        <span className="text-xs text-gray-500">({log.to?.id || 'N/A'})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                        {log.count.toLocaleString()}
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
        {totalEntries > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {currentPage * itemsPerPage - itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
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
                    onClick={() => goToPage(page as number)}
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
        )}

        {/* Empty State */}
        {transferLogs.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-electric-orange/10 to-electric-pink/10 rounded-full flex items-center justify-center mb-4">
              <ArrowUpDown className="h-12 w-12 text-electric-orange/50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No transfer logs found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              There are no key transfer activities to display at the moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
