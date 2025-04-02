
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DownloadCloud, RefreshCw } from "lucide-react";

interface ExportReportProps {
  onExport: () => void;
}

export const ExportReport = ({ onExport }: ExportReportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // In a real implementation, this would fetch data and generate a CSV/PDF
      // Simulating a delay for the download process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a sample CSV content (in a real app, this would be dynamic)
      const csvContent = [
        "Date,Views,Wishlists,Orders,Revenue",
        "2023-06-01,120,15,5,25000",
        "2023-06-02,135,18,7,35000",
        "2023-06-03,110,12,4,20000"
      ].join("\n");
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onExport();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button 
      onClick={handleExport} 
      className="flex items-center gap-2"
      disabled={isExporting}
    >
      {isExporting ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <DownloadCloud className="h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export Report"}
    </Button>
  );
};
