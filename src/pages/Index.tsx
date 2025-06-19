
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { EpicSummary } from "@/components/EpicSummary";
import { DetailedBreakdown } from "@/components/DetailedBreakdown";
import { OverallSummary } from "@/components/OverallSummary";
import { BarChart3, FileSpreadsheet, TrendingUp } from "lucide-react";

export interface TimesheetData {
  category: string;
  timeSpent: number;
  capitalizable: string;
  epicLink: string;
  issue: string;
}

export interface EpicData {
  epicName: string;
  totalHours: number;
  capitalizableHours: number;
  entries: TimesheetData[];
}

const Index = () => {
  const [timesheetData, setTimesheetData] = useState<TimesheetData[]>([]);
  const [epicData, setEpicData] = useState<EpicData[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);

  const handleDataProcessed = (data: TimesheetData[], epics: EpicData[], total: number) => {
    console.log('Processing data:', { data, epics, total });
    setTimesheetData(data);
    setEpicData(epics);
    setTotalHours(total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FileSpreadsheet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Excel Data Analyzer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your timesheet data and get epic-level insights with detailed analysis
          </p>
        </div>

        {/* File Upload */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Upload Timesheet Data
            </CardTitle>
            <CardDescription>
              Upload your Excel file containing detailed timesheet information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onDataProcessed={handleDataProcessed} />
          </CardContent>
        </Card>

        {/* Results */}
        {epicData.length > 0 && (
          <div className="space-y-8">
            {/* Overall Summary */}
            <OverallSummary totalHours={totalHours} epicCount={epicData.length} />
            
            {/* Epic Level Summary */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Epic Level Summary
                </CardTitle>
                <CardDescription>
                  Time distribution and analysis by epic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EpicSummary epicData={epicData} />
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
                <CardDescription>
                  Complete timesheet data with all entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DetailedBreakdown data={timesheetData} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {epicData.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <FileSpreadsheet className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to analyze your data</h3>
            <p className="text-gray-500">Upload an Excel file to get started with epic-level insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
