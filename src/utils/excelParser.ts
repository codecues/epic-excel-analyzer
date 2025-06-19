
import { TimesheetData, EpicData } from "@/pages/Index";

export const parseExcelData = (rawData: any[]) => {
  console.log('Starting to parse data:', rawData.length, 'entries');
  
  // Process the data efficiently for large datasets
  const processedData: TimesheetData[] = rawData.map(row => ({
    category: row.category || '',
    timeSpent: parseFloat(row.timeSpent?.toString() || '0'),
    capitalizable: row.capitalizable || '-',
    epicLink: row.epicLink || '-',
    issue: row.issue || ''
  }));

  // Group by epic (category) using Map for better performance
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
    
    // Only count as capitalizable if explicitly "Yes" (case insensitive)
    if (entry.capitalizable.toLowerCase() === 'yes') {
      epic.capitalizableHours += entry.timeSpent;
    }
    
    // For large datasets, we'll store references instead of full objects to avoid circular references
    epic.entries.push({
      category: entry.category,
      timeSpent: entry.timeSpent,
      capitalizable: entry.capitalizable,
      epicLink: entry.epicLink,
      issue: entry.issue
    });
  });

  const epicSummary = Array.from(epicMap.values());
  const totalHours = processedData.reduce((sum, entry) => sum + entry.timeSpent, 0);

  console.log('Parsed results:', {
    totalEntries: processedData.length,
    totalEpics: epicSummary.length,
    totalHours: totalHours
  });

  // For very large datasets, log summary instead of full data
  if (processedData.length > 100) {
    console.log('Large dataset detected. Epic summary:', epicSummary.map(epic => ({
      name: epic.epicName,
      hours: epic.totalHours,
      entries: epic.entries.length
    })));
  }

  return {
    processedData,
    epicSummary,
    totalHours
  };
};
