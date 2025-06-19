
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TimesheetData } from "@/pages/Index";

interface DetailedBreakdownProps {
  data: TimesheetData[];
}

export const DetailedBreakdown: React.FC<DetailedBreakdownProps> = ({ data }) => {
  return (
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
          {data.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
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
  );
};
