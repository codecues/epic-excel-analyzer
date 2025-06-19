
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseExcelData } from "@/utils/excelParser";
import { TimesheetData, EpicData } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onDataProcessed: (data: TimesheetData[], epics: EpicData[], total: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed }) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name);

    try {
      // For demo purposes, we'll parse the sample data
      // In a real implementation, you'd read the Excel file
      const sampleData = [
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 6, capitalizable: "No", epicLink: "INSZ-11612", issue: "[INSZ-11732] Clover Call Center History load" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 2, capitalizable: "No", epicLink: "INSZ-11612", issue: "[INSZ-11732] Clover Call Center History load" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 2, capitalizable: "-", epicLink: "-", issue: "[INSZ-11651] Call center history load - Jan month load" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 4, capitalizable: "-", epicLink: "-", issue: "[INSZ-11746] call center data validation in clover UAT" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 4, capitalizable: "-", epicLink: "-", issue: "[INSZ-11651] Call center history load - Jan month load" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 6, capitalizable: "-", epicLink: "-", issue: "[INSZ-11651] Call center history load - Jan month load" },
        { category: "[INSZ-11612] Call Centre History Data Load", timeSpent: 4, capitalizable: "-", epicLink: "-", issue: "[INSZ-11746] call center data validation in clover UAT" },
        { category: "[INSZ-8245] Sprint Ceremonies", timeSpent: 3, capitalizable: "Yes", epicLink: "INSZ-8245", issue: "[INSZ-11865] PO Meeting for Sprint 9" },
        { category: "[INSZ-8245] Sprint Ceremonies", timeSpent: 1, capitalizable: "-", epicLink: "-", issue: "[INSZ-12030] Insitz Plus-Demo & Retrospective" },
        { category: "[INSZ-8245] Sprint Ceremonies", timeSpent: 2, capitalizable: "-", epicLink: "-", issue: "[INSZ-12029] Demo and retro" }
      ];

      const { processedData, epicSummary, totalHours } = parseExcelData(sampleData);
      
      console.log('Parsed data:', { processedData, epicSummary, totalHours });
      
      onDataProcessed(processedData, epicSummary, totalHours);
      
      toast({
        title: "File uploaded successfully!",
        description: `Processed ${processedData.length} entries across ${epicSummary.length} epics.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
    }
  }, [onDataProcessed, toast]);

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
        <Label htmlFor="excel-file" className="text-sm font-medium">
          Select Excel File
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <Button size="icon" variant="outline" className="shrink-0">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Alert className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload an Excel file (.xlsx, .xls) or CSV file with timesheet data. 
          The file should contain columns: Category, Time Spent (Hours), Capitalizable, Epic Link, and Issue.
        </AlertDescription>
      </Alert>
    </div>
  );
};
