"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, RefreshCw, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getNationalDistributors, NationalDistributor } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface ReportsFiltersProps {
  onApplyFilters: (filters: { startDate: string, endDate: string, distributorId: string, status: string, search: string }) => void;
}

export function ReportsFilters({ onApplyFilters }: ReportsFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [distributorId, setDistributorId] = useState("all")
  const [status, setStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [distributors, setDistributors] = useState<NationalDistributor[]>([])
  const [loadingDistributors, setLoadingDistributors] = useState(true)

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const data = await getNationalDistributors()
        setDistributors(data)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load distributors.",
          variant: "destructive",
        });
      } finally {
        setLoadingDistributors(false)
      }
    }
    fetchDistributors()
  }, [])

  const updateActiveFilters = () => {
    const newActiveFilters: string[] = [];
    if (dateRange !== "all") newActiveFilters.push(`Date: ${dateRange}`);
    if (startDate && endDate && dateRange === "custom") newActiveFilters.push(`Custom Date: ${startDate} to ${endDate}`);
    if (distributorId !== "all") {
      const selectedNd = distributors.find(nd => nd.id === distributorId);
      if (selectedNd) newActiveFilters.push(`Distributor: ${selectedNd.name}`);
    }
    if (status !== "all") newActiveFilters.push(`Status: ${status}`);
    if (searchQuery) newActiveFilters.push(`Search: ${searchQuery}`);
    setActiveFilters(newActiveFilters);
  };

  useEffect(() => {
    updateActiveFilters();
  }, [dateRange, startDate, endDate, distributorId, status, searchQuery, distributors]);

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith("Date:")) {
      setDateRange("all");
      setStartDate("");
      setEndDate("");
    } else if (filterToRemove.startsWith("Custom Date:")) {
      setDateRange("all");
    } else if (filterToRemove.startsWith("Distributor:")) {
      setDistributorId("all");
    } else if (filterToRemove.startsWith("Status:")) {
      setStatus("all");
    } else if (filterToRemove.startsWith("Search:")) {
      setSearchQuery("");
    }
    handleApplyClick();
  };

  const handleApplyClick = () => {
    let finalStartDate = '';
    let finalEndDate = '';

    const today = new Date();

    switch (dateRange) {
      case "today":
        finalStartDate = format(startOfDay(today), 'yyyy-MM-dd');
        finalEndDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
      case "7days":
        finalStartDate = format(subDays(today, 6), 'yyyy-MM-dd'); // Last 7 days including today
        finalEndDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
      case "30days":
        finalStartDate = format(subDays(today, 29), 'yyyy-MM-dd'); // Last 30 days including today
        finalEndDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
      case "90days":
        finalStartDate = format(subDays(today, 89), 'yyyy-MM-dd'); // Last 90 days including today
        finalEndDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
      case "custom":
        finalStartDate = startDate;
        finalEndDate = endDate;
        break;
      default:
        // "all" or any other case, keep dates empty
        break;
    }

    onApplyFilters({
      startDate: finalStartDate,
      endDate: finalEndDate,
      distributorId: distributorId === "all" ? '': distributorId,
      status: status === "all" ? '': status,
      search: searchQuery,
    });
  };

  const handleResetClick = () => {
    setDateRange("all");
    setStartDate("");
    setEndDate("");
    setDistributorId("all");
    setStatus("all");
    setSearchQuery("");
    onApplyFilters({
      startDate: '',
      endDate: '',
      distributorId: '',
      status: '',
      search: '',
    });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-electric-blue" />
          <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Filter Reports
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Select
              value={dateRange}
              onValueChange={(value) => {
                setDateRange(value);
                if (value !== "custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
            >
              <SelectTrigger id="dateRange" className="border-electric-blue/30">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20"
              />
            </div>
          )}
          {dateRange === "custom" && (
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20"
              />
            </div>
          )}

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="distributor">Distributor</Label>
            <Select
              value={distributorId}
              onValueChange={(value) => setDistributorId(value)}
              disabled={loadingDistributors}
            >
              <SelectTrigger id="distributor" className="border-electric-purple/30">
                <SelectValue placeholder="All distributors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distributors</SelectItem>
                {distributors.map((distributor) => (
                  <SelectItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="status">Transfer Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger id="status" className="border-electric-green/30">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search transfers..."
                className="pl-8 border-electric-orange/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Active Filters</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetClick}
                className="text-electric-red hover:text-electric-red/80"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  className="bg-gradient-to-r from-electric-blue to-electric-purple text-white"
                >
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="ml-2 hover:text-white/70">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleApplyClick} className="bg-gradient-to-r from-electric-blue to-electric-purple hover:opacity-90">
            <Search className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleResetClick}
            className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
