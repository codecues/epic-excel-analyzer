
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EpicData } from "@/pages/Index";
import { Clock, TrendingUp, CheckCircle, Download } from "lucide-react";
import * as XLSX from 'xlsx';

interface EpicSummaryProps {
  epicData: EpicData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const EpicSummary: React.FC<EpicSummaryProps> = ({ epicData }) => {
  const chartData = epicData.map(epic => ({
    name: epic.epicName.replace(/\[.*?\]\s*/, '').substring(0, 30) + '...',
    totalHours: epic.totalHours,
    capitalizableHours: epic.capitalizableHours,
    fullName: epic.epicName
  }));

  const pieData = epicData.map((epic, index) => ({
    name: epic.epicName.replace(/\[.*?\]\s*/, '').substring(0, 20) + '...',
    value: epic.totalHours,
    fullName: epic.epicName
  }));

  const totalCapitalizable = epicData.reduce((sum, epic) => sum + epic.capitalizableHours, 0);
  const totalHours = epicData.reduce((sum, epic) => sum + epic.totalHours, 0);

  const exportToExcel = () => {
    const exportData = epicData.map(epic => ({
      'Epic Name': epic.epicName,
      'Total Hours': epic.totalHours.toFixed(2),
      'Capitalizable Hours': epic.capitalizableHours.toFixed(2),
      'Number of Entries': epic.entries.length,
      'Status': epic.capitalizableHours > 0 ? 'Capitalizable' : 'Non-Capitalizable'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Epic Summary');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `epic-summary-${date}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Capitalizable Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalCapitalizable.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Epics Count</p>
                <p className="text-2xl font-bold text-gray-900">{epicData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hours by Epic</CardTitle>
            <CardDescription>Total and capitalizable hours breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value, payload) => {
                    const item = chartData.find(d => d.name === value);
                    return item ? item.fullName : value;
                  }}
                />
                <Bar dataKey="totalHours" fill="#3b82f6" name="Total Hours" />
                <Bar dataKey="capitalizableHours" fill="#10b981" name="Capitalizable Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>Percentage of time spent on each epic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 1).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} hours`,
                    props.payload.fullName
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Epic Details Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Epic Summary Table</CardTitle>
              <CardDescription>Detailed breakdown of each epic</CardDescription>
            </div>
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Epic</th>
                  <th className="text-right p-2 font-medium">Total Hours</th>
                  <th className="text-right p-2 font-medium">Capitalizable Hours</th>
                  <th className="text-right p-2 font-medium">Entries</th>
                  <th className="text-center p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {epicData.map((epic, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-2">
                      <div className="font-medium text-sm">{epic.epicName}</div>
                    </td>
                    <td className="text-right p-2 font-mono">{epic.totalHours.toFixed(2)}</td>
                    <td className="text-right p-2 font-mono">{epic.capitalizableHours.toFixed(2)}</td>
                    <td className="text-right p-2">{epic.entries.length}</td>
                    <td className="text-center p-2">
                      <Badge variant={epic.capitalizableHours > 0 ? "default" : "secondary"}>
                        {epic.capitalizableHours > 0 ? "Capitalizable" : "Non-Capitalizable"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
