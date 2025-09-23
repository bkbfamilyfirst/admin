"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyRound, Send, History, ArrowRight } from "lucide-react"
import { getNationalDistributors, NationalDistributor, transferKeysToNationalDistributor, getNdAssignments, Assignment } from "@/lib/api"
import { toast } from "sonner"
import { formatDistanceToNowStrict } from 'date-fns'
import { Pagination } from "@/components/ui/pagination"
import { Calendar as CalendarIcon, Search as SearchIcon, X as XIcon, Filter as FilterIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 3;

export function KeyAssignmentCard() {
  const [selectedDistributor, setSelectedDistributor] = useState("")
  const [keyCount, setKeyCount] = useState("100")
  const [distributors, setDistributors] = useState<NationalDistributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([])
  const [totalAssignments, setTotalAssignments] = useState(0);

  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecentAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const formattedStartDate = filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : '';
      const formattedEndDate = filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : '';
      const response = await getNdAssignments(currentPage, ITEMS_PER_PAGE, formattedStartDate, formattedEndDate, filterSearchQuery);
      setRecentAssignments(response.assignments);
      setTotalAssignments(response.total);
    } catch (err: any) {
      console.error("Failed to load recent assignments:", err);
  toast.error(err.response?.data?.message || "Failed to load recent assignments.")
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStartDate, filterEndDate, filterSearchQuery]);

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1); // Reset to first page on new filter application
    fetchRecentAssignments();
  }, [fetchRecentAssignments]);

  const handleResetFilters = useCallback(() => {
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setFilterSearchQuery("");
    setCurrentPage(1); // Reset to first page
    fetchRecentAssignments();
  }, [fetchRecentAssignments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNationalDistributors()
        setDistributors(data)
        if (data.length > 0) {
          setSelectedDistributor(data[0].id) // Select the first distributor by default
        }
      } catch (err) {
        setError("Failed to load distributors for key assignment.")
      }
    }

    fetchData()
    fetchRecentAssignments()
  }, [fetchRecentAssignments])

  if (loading) {
    return (
      <Card className="border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 shadow-md animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  const handleAssignKeys = async () => {
    if (!selectedDistributor || !keyCount) {
  toast.error("Please select a distributor and enter the number of keys.")
      return;
    }

    const keys = Number(keyCount);
    if (isNaN(keys) || keys <= 0) {
  toast.error("Please enter a valid number of keys (greater than 0).")
      return;
    }

    setIsAssigning(true);
    try {
      const response = await transferKeysToNationalDistributor(selectedDistributor, keys);
  toast.success(response.message || "Keys transferred successfully!")
      setKeyCount("0"); // Reset key count
    } catch (err: any) {
      console.error("Error assigning keys:", err);
  toast.error(err.response?.data?.message || "Failed to transfer keys.")
    } finally {
      setIsAssigning(false);
      // After a successful assignment, refresh recent assignments and go to the first page
      setCurrentPage(1);
      fetchRecentAssignments();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5 text-electric-purple" />
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Assign Keys
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="distributor">Select Distributor</Label>
            <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
              <SelectTrigger id="distributor" className="border-electric-purple/30">
                <SelectValue placeholder="Select distributor" />
              </SelectTrigger>
              <SelectContent>
                {distributors.map((distributor) => (
                  <SelectItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyCount">Number of Keys</Label>
            <Input
              id="keyCount"
              type="number"
              value={keyCount}
              onChange={(e) => setKeyCount(e.target.value)}
              className="border-electric-purple/30"
            />
          </div>
          <Button
            onClick={handleAssignKeys}
            disabled={isAssigning || !selectedDistributor || Number(keyCount) <= 0}
            className="w-full bg-gradient-to-r from-electric-purple to-electric-blue hover:opacity-90"
          >
            <Send className="mr-2 h-4 w-4" />
            {isAssigning ? "Assigning..." : "Assign Keys"}
          </Button>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg shadow-2xl hover:shadow-electric-green/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-electric-green" />
            <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
              Recent Assignments
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Filter Section */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-electric-green/30",
                      !filterStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterStartDate ? format(filterStartDate, "PPP") : <span className="text-gray-500">Start Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]">
                  <Calendar
                    mode="single"
                    selected={filterStartDate}
                    onSelect={setFilterStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-electric-green/30",
                      !filterEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterEndDate ? format(filterEndDate, "PPP") : <span className="text-gray-500">End Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]">
                  <Calendar
                    mode="single"
                    selected={filterEndDate}
                    onSelect={setFilterEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                className="pl-8 border-electric-green/30"
                value={filterSearchQuery}
                onChange={(e) => setFilterSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-electric-green to-electric-cyan hover:opacity-90"
              >
                <FilterIcon className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full border-electric-green/30 text-electric-green hover:bg-electric-green/10"
              >
                <XIcon className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {recentAssignments.length > 0 ? (
            recentAssignments.map((assignment) => (
              <div
                key={assignment.transferId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-200 dark:bg-gray-800/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex flex-col">
                  <span className="font-semibold text-base text-gray-800">{assignment.to?.name || 'N/A'}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNowStrict(new Date(assignment.date), { addSuffix: true })}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-electric-green">{assignment.count}</span>
                  <ArrowRight className="h-5 w-5 text-electric-green" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent assignments found.
            </div>
          )}
          {totalAssignments > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalAssignments / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
