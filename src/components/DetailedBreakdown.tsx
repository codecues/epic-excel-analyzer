
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimesheetData } from "@/pages/Index";

interface DetailedBreakdownProps {
  data: TimesheetData[];
}

const ITEMS_PER_PAGE = 50;

export const DetailedBreakdown: React.FC<DetailedBreakdownProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { paginatedData, totalPages, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data.length);
    const paginatedData = data.slice(startIndex, endIndex);
    
    return { paginatedData, totalPages, startIndex, endIndex };
  }, [data, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      {/* Pagination info */}
      {data.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {startIndex + 1}-{endIndex} of {data.length} entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="text-right font-semibold">Time Spent (Hours)</TableHead>
              <TableHead className="text-center font-semibold">Capitalizable</TableHead>
              <TableHead className="text-center font-semibold">Epic Link</TableHead>
              <TableHead className="font-semibold">Issue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={startIndex + index} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={row.category}>
                    {row.category}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {row.timeSpent.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={
                      row.capitalizable.toLowerCase() === 'yes' 
                        ? "default" 
                        : row.capitalizable.toLowerCase() === 'no' 
                          ? "destructive" 
                          : "secondary"
                    }
                  >
                    {row.capitalizable}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {row.epicLink}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="truncate" title={row.issue}>
                    {row.issue}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom pagination */}
      {data.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
