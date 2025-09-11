"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Edit, MoreHorizontal, Shield, Trash2, UserCheck, UserX, Eye, KeyRound, ArrowUpDown, Ban } from "lucide-react"
import { NationalDistributor, deactivateNationalDistributor, blockNationalDistributor, deleteNationalDistributor, editNationalDistributor } from "@/lib/api"
import { toast } from "sonner"

interface DistributorsTableProps {
  distributors: NationalDistributor[]
  onEdit: (distributor: NationalDistributor) => void
  onDelete: (distributor: NationalDistributor) => void
  onStatusChange: (distributorId: string, newStatus: string) => void
  onRefreshData: () => void
}

const ITEMS_PER_PAGE = 5

export function DistributorsTable({ distributors, onEdit, onDelete, onStatusChange, onRefreshData }: DistributorsTableProps) {
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const sortedDistributors = [...distributors].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedDistributors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedDistributors = sortedDistributors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-gradient-to-r from-electric-green to-electric-cyan text-white">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-electric-orange border-electric-orange">
            Inactive
          </Badge>
        )
      case "blocked":
        return <Badge className="bg-gradient-to-r from-electric-pink to-electric-red text-white">Blocked</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusActions = (distributor: NationalDistributor) => {
    const actions = []

    const handleStatusUpdate = async (ndId: string, newStatus: string) => {
      try {
        let response;
        if (newStatus === "inactive") {
          response = await deactivateNationalDistributor(ndId);
        } else if (newStatus === "blocked") {
          response = await blockNationalDistributor(ndId);
        } else if (newStatus === "active") {
          response = await editNationalDistributor(ndId, { status: newStatus });
        }

        if (response) {
          toast.error(response.message || `Distributor status updated to ${newStatus}.`);
          onStatusChange(ndId, newStatus); // Update local state for immediate UI reflection
          onRefreshData(); // Refresh data from server to ensure consistency
        }
      } catch (error: any) {
        console.error(`Failed to update distributor status to ${newStatus}:`, error);
        toast.error(error.response?.data?.message || `Failed to update distributor status to ${newStatus}.`);
      }
    };

    if (distributor.status !== "active") {
      actions.push(
        <DropdownMenuItem
          key="activate"
          onClick={() => handleStatusUpdate(distributor.id, "active")}
          className="flex items-center gap-2 text-electric-green"
        >
          <UserCheck className="h-4 w-4" /> Activate
        </DropdownMenuItem>,
      )
    }

    if (distributor.status !== "inactive") {
      actions.push(
        <DropdownMenuItem
          key="deactivate"
          onClick={() => handleStatusUpdate(distributor.id, "inactive")}
          className="flex items-center gap-2 text-electric-orange"
        >
          <UserX className="h-4 w-4" /> Deactivate
        </DropdownMenuItem>,
      )
    }

    if (distributor.status !== "blocked") {
      actions.push(
        <DropdownMenuItem
          key="block"
          onClick={() => handleStatusUpdate(distributor.id, "blocked")}
          className="flex items-center gap-2 text-electric-red"
        >
          <Ban className="h-4 w-4" /> Block
        </DropdownMenuItem>,
      )
    }

    return actions
  }

  const handleDeleteClick = async (distributor: NationalDistributor) => {
    try {
      await deleteNationalDistributor(distributor.id);
      toast.error(distributor.name + " deleted successfully.");
      onDelete(distributor); // Update local state for immediate UI reflection
      onRefreshData(); // Refresh data from server to ensure consistency
    } catch (error: any) {
      console.error("Failed to delete national distributor:", error);
      toast.error(error.response?.data?.message || `Failed to delete ${distributor.name}.`)
    }
  };

  return (
    <Card className="border-0 bg-white dark:bg-gray-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
          <Shield className="h-5 w-5 text-electric-purple" />
          National Distributors ({distributors.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="space-y-3 p-4">
            {paginatedDistributors.map((distributor) => (
              <div
                key={distributor.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-electric-purple">{distributor.id}</span>
                    {getStatusBadge(distributor.status)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-electric-purple">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[100]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(distributor)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {getStatusActions(distributor)}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(distributor)}
                        className="flex items-center gap-2 text-electric-red"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Distributor Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{distributor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{distributor.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{distributor.location}</p>
                </div>

                {/* Key Usage */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Usage</span>
                    <span className="text-sm font-bold text-electric-purple">
                      {distributor.usedKeys} / {distributor.assignedKeys}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-electric-purple to-electric-blue h-2 rounded-full"
                      style={{
                        width:
                          distributor.assignedKeys > 0
                            ? `${(distributor.usedKeys / distributor.assignedKeys) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Activated: {distributor.usedKeys}</span>
                    <span>Balance: {distributor.balance}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-electric-blue border-electric-blue hover:bg-electric-blue/10"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-electric-green to-electric-cyan hover:opacity-90 text-white"
                  >
                    <KeyRound className="h-4 w-4 mr-1" />
                    Assign Keys
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Keys Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDistributors.map((distributor) => (
                  <TableRow
                    key={distributor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors"
                  >
                    <TableCell className="font-medium">{distributor.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{distributor.name}</div>
                        <div className="text-xs text-gray-500">{distributor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{distributor.location}</TableCell>
                    <TableCell>{getStatusBadge(distributor.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          {distributor.usedKeys} / {distributor.assignedKeys}
                        </span>
                        <span className="text-xs text-electric-purple">Balance: {distributor.balance}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-electric-green opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <KeyRound className="h-4 w-4" />
                          <span className="sr-only">Assign Keys</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-electric-purple">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[100]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(distributor)} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {getStatusActions(distributor)}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(distributor)}
                              className="flex items-center gap-2 text-electric-red"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, distributors.length)} of {distributors.length}{" "}
                distributors
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {distributors.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-electric-purple/10 to-electric-blue/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-electric-purple/50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No distributors found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first national distributor.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
