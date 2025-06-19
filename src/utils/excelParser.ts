
import { TimesheetData, EpicData } from "@/pages/Index";

export const parseExcelData = (rawData: any[]) => {
  console.log('Starting to parse data:', rawData);
  
  // Process the data
  const processedData: TimesheetData[] = rawData.map(row => ({
    category: row.category || '',
    timeSpent: parseFloat(row.timeSpent?.toString() || '0'),
    capitalizable: row.capitalizable || '-',
    epicLink: row.epicLink || '-',
    issue: row.issue || ''
  }));

  // Group by epic (category)
  const epicMap = new Map<string, EpicData>();
  
  processedData.forEach(entry => {
    const epicName = entry.category;
    
    if (!epicMap.has(epicName)) {
      epicMap.set(epicName, {
        epicName,
        totalHours: 0,
        capitalizableHours: 0,
        entries: []
      });
    }
    
    const epic = epicMap.get(epicName)!;
    epic.totalHours += entry.timeSpent;
    
    if (entry.capitalizable.toLowerCase() === 'yes') {
      epic.capitalizableHours += entry.timeSpent;
    }
    
    epic.entries.push(entry);
  });

  const epicSummary = Array.from(epicMap.values());
  const totalHours = processedData.reduce((sum, entry) => sum + entry.timeSpent, 0);

  console.log('Parsed results:', {
    processedData,
    epicSummary,
    totalHours
  });

  return {
    processedData,
    epicSummary,
    totalHours
  };
};
