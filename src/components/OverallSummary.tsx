
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Clock, FolderOpen } from "lucide-react";

interface OverallSummaryProps {
  totalHours: number;
  epicCount: number;
}

export const OverallSummary: React.FC<OverallSummaryProps> = ({ totalHours, epicCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Hours Logged</p>
              <p className="text-3xl font-bold">{totalHours.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Epics</p>
              <p className="text-3xl font-bold">{epicCount}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FolderOpen className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Hours per Epic</p>
              <p className="text-3xl font-bold">
                {epicCount > 0 ? (totalHours / epicCount).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
