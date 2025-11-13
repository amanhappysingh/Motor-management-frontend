import React, { useState } from "react";
import { FileChartLine, FileDown, FileSpreadsheet } from "lucide-react";

export default function ExportButtons() {
  const [open, setOpen] = useState(false);

  const handleExportExcel = () => {
    alert("Exporting Excel...");
    setOpen(false);
  };

  const handleExportPDF = () => {
    alert("Exporting PDF...");
    setOpen(false);
  };

  return (
    <div className="relative w-fit">
      
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 cursor-pointer transition-colors "
      >
        <FileChartLine size={20} />
        <span>Export</span>
      </button>

      {open && (
        <div className="absolute -right-10 mt-2 w-44 bg-white  border border-gray-200 rounded-sm z-[100]">
          <button
            onClick={handleExportExcel}
            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <FileSpreadsheet size={18} className="text-green-500" />
            Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 border-t border-gray-100"
          >
            <FileDown size={18} className="text-red-500" />
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
