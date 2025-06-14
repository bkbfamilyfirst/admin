"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getVisiblePages = () => {
    const pagesToShow = 5; // Total number of page buttons to display (including 1, ..., totalPages)
    const half = Math.floor(pagesToShow / 2);
    let startPage = Math.max(2, currentPage - half);
    let endPage = Math.min(totalPages - 1, currentPage + half);

    if (currentPage - half < 2) {
      endPage = Math.min(totalPages - 1, pagesToShow - 1);
    }
    if (currentPage + half > totalPages - 1) {
      startPage = Math.max(2, totalPages - pagesToShow + 2);
    }

    const pages: (number | string)[] = [];

    // Always add the first page
    pages.push(1);

    // Add leading ellipsis if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in the calculated range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add trailing ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always add the last page (if not the same as the first and not already added)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <Button variant="ghost" size="sm" disabled className="w-9 h-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "w-9 h-9",
                  currentPage === page
                    ? "bg-gradient-to-r from-electric-purple to-electric-blue text-white"
                    : "text-electric-purple hover:bg-electric-purple/10",
                )}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10 disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
