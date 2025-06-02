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
import { Edit, MoreHorizontal, Shield, Trash2, UserCheck, UserX, Eye, KeyRound, ArrowUpDown } from "lucide-react"

// Sample data for distributors
const distributors = [
  {
    id: "ND001",
    name: "TechGuard Solutions",
    location: "New York, USA",
    contact: "John Smith",
    email: "john@techguard.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    keysAssigned: 2500,
    keysActivated: 2100,
    balance: 400,
  },
  {
    id: "ND002",
    name: "SecureFamily Networks",
    location: "London, UK",
    contact: "Emma Johnson",
    email: "emma@securefamily.com",
    phone: "+44 20 1234 5678",
    status: "active",
    keysAssigned: 1800,
    keysActivated: 1650,
    balance: 150,
  },
  {
    id: "ND003",
    name: "KidSafe Technologies",
    location: "Sydney, Australia",
    contact: "Michael Wong",
    email: "michael@kidsafe.com",
    phone: "+61 2 9876 5432",
    status: "inactive",
    keysAssigned: 1200,
    keysActivated: 950,
    balance: 250,
  },
  {
    id: "ND004",
    name: "ParentControl Systems",
    location: "Toronto, Canada",
    contact: "Sarah Miller",
    email: "sarah@parentcontrol.com",
    phone: "+1 (416) 987-6543",
    status: "active",
    keysAssigned: 3000,
    keysActivated: 2750,
    balance: 250,
  },
  {
    id: "ND005",
    name: "FamilyShield Inc.",
    location: "Berlin, Germany",
    contact: "Hans Schmidt",
    email: "hans@familyshield.com",
    phone: "+49 30 1234 5678",
    status: "blocked",
    keysAssigned: 1500,
    keysActivated: 1200,
    balance: 300,
  },
]

export function DistributorsTable() {
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
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

  return (
    <Card className="border-0 bg-white dark:bg-gray-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent flex items-center gap-2">
          <Shield className="h-5 w-5 text-electric-purple" />
          National Distributors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="space-y-3 p-4">
            {sortedDistributors.map((distributor) => (
              <div
                key={distributor.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-electric-purple">{distributor.id}</span>
                    {distributor.status === "active" && (
                      <Badge className="bg-gradient-to-r from-electric-green to-electric-cyan text-white text-xs">
                        Active
                      </Badge>
                    )}
                    {distributor.status === "inactive" && (
                      <Badge variant="outline" className="text-electric-orange border-electric-orange text-xs">
                        Inactive
                      </Badge>
                    )}
                    {distributor.status === "blocked" && (
                      <Badge className="bg-gradient-to-r from-electric-pink to-electric-red text-white text-xs">
                        Blocked
                      </Badge>
                    )}
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
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {distributor.status === "active" ? (
                        <DropdownMenuItem className="flex items-center gap-2 text-electric-orange">
                          <UserX className="h-4 w-4" /> Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="flex items-center gap-2 text-electric-green">
                          <UserCheck className="h-4 w-4" /> Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 text-electric-red">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Distributor Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{distributor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{distributor.contact}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{distributor.location}</p>
                </div>

                {/* Key Usage */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Usage</span>
                    <span className="text-sm font-bold text-electric-purple">
                      {distributor.keysActivated} / {distributor.keysAssigned}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-electric-purple to-electric-blue h-2 rounded-full"
                      style={{ width: `${(distributor.keysActivated / distributor.keysAssigned) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Activated: {distributor.keysActivated}</span>
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
                {sortedDistributors.map((distributor) => (
                  <TableRow
                    key={distributor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors"
                  >
                    <TableCell className="font-medium">{distributor.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{distributor.name}</div>
                        <div className="text-xs text-gray-500">{distributor.contact}</div>
                      </div>
                    </TableCell>
                    <TableCell>{distributor.location}</TableCell>
                    <TableCell>
                      {distributor.status === "active" && (
                        <Badge className="bg-gradient-to-r from-electric-green to-electric-cyan text-white">
                          Active
                        </Badge>
                      )}
                      {distributor.status === "inactive" && (
                        <Badge variant="outline" className="text-electric-orange border-electric-orange">
                          Inactive
                        </Badge>
                      )}
                      {distributor.status === "blocked" && (
                        <Badge className="bg-gradient-to-r from-electric-pink to-electric-red text-white">
                          Blocked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          {distributor.keysActivated} / {distributor.keysAssigned}
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
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {distributor.status === "active" ? (
                              <DropdownMenuItem className="flex items-center gap-2 text-electric-orange">
                                <UserX className="h-4 w-4" /> Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="flex items-center gap-2 text-electric-green">
                                <UserCheck className="h-4 w-4" /> Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 text-electric-red">
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
      </CardContent>
    </Card>
  )
}
