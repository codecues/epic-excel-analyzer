
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseExcelData } from "@/utils/excelParser";
import { TimesheetData, EpicData } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataProcessed: (data: TimesheetData[], epics: EpicData[], total: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed }) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Size:', file.size);

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log('Raw Excel data:', jsonData);
          
          // Process the Excel data to extract timesheet entries
          const processedRows = [];
          let currentCategory = '';
          
          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            
            // Skip empty rows
            if (!row || row.length === 0) continue;
            
            // Check if this row starts a new category (epic)
            if (row[0] && typeof row[0] === 'string' && row[0].includes('[') && row[0].includes(']')) {
              currentCategory = row[0].trim();
              continue;
            }
            
            // Check if this is a data row (has "Billable" and time data)
            if (row[0] === 'Billable' && row[1] && !isNaN(parseFloat(row[1]))) {
              processedRows.push({
                category: currentCategory,
                timeSpent: parseFloat(row[1]) || 0,
                capitalizable: row[2] || '-',
                epicLink: row[3] || '-',
                issue: row[4] || ''
              });
            }
          }
          
          console.log('Processed rows:', processedRows);
          
          if (processedRows.length === 0) {
            throw new Error('No valid timesheet data found in the file');
          }
          
          const { processedData, epicSummary, totalHours } = parseExcelData(processedRows);
          
          console.log('Final parsed data:', { processedData, epicSummary, totalHours });
          
          onDataProcessed(processedData, epicSummary, totalHours);
          
          toast({
            title: "File uploaded successfully!",
            description: `Processed ${processedData.length} entries across ${epicSummary.length} epics. Total: ${totalHours.toFixed(2)} hours.`,
          });
        } catch (parseError) {
          console.error('Error parsing Excel data:', parseError);
          toast({
            title: "Error parsing Excel file",
            description: "Please check that your file follows the expected format.",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        toast({
          title: "Error reading file",
          description: "Failed to read the uploaded file.",
          variant: "destructive",
        });
      };
      
      reader.readAsArrayBuffer(file);
      
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
          Upload an Excel file (.xlsx, .xls) with timesheet data. 
          The file should contain epic categories followed by billable entries with columns: Type, Time Spent (Hours), Capitalizable, Epic Link, and Issue.
        </AlertDescription>
      </Alert>
    </div>
  );
};
