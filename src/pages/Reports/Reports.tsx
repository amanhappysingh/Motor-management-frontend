import React, { useState } from "react";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../utils/http"; // ✅ your axios instance
import { URL } from "../../utils/urls"; // ✅ base URL file
import TableNew from "../../components/TableNew"; // ✅ your custom table component

interface Report {
  id: string;
  motorName: string;
  status: string;
  date: string;
  customer: string;
}

const MotorReports: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const statuses = ["In", "Overhauling", "Trial", "Fault", "Available", "Out"];

  // ✅ API Fetch function
  const fetchReports = async (): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (dateFrom) params.append("from", dateFrom?.split("-")?.reverse().join("-"));
    if (dateTo) params.append("to", dateTo?.split("-")?.reverse().join("-"));
    const res = await Api.get({ url: `${URL.motorsAll}?${params.toString()}` });
    return res?.data?.data || [];
  };

  // ✅ React Query Hook
  const {
    data: reports = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["motorReports", statusFilter, dateFrom, dateTo],
    queryFn: fetchReports,
    enabled: false, // disable auto fetch — manual trigger on search
  });

  const handleSearch = () => {
    refetch();
  };

   const baseMotorColumns = [
    { label: "Serial No", accesor: "serial_no", className : "whitespace-nowrap" },
    { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap" },
    { label: "RPM", accesor: "rpm" },
    { label: "Frame", accesor: "frame" },
    { label: "AMP", accesor: "amp" },
    { label: "KW", accesor: "kw" },
    { label: "Voltage", accesor: "voltage" },
    { label: "Mounting", accesor: "mounting", className : "whitespace-nowrap" },
    { label: "Make", accesor: "make", className : "whitespace-nowrap" },
    { label: "Bearing No (DE)", accesor: "bearing_de" },
    { label: "Bearing No (NDE)", accesor: "bearing_nde" },
    { label: "Current Status", accesor: "current_status" },
   
  ];

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 font-poppins p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Motor Reports</h1>
          <p className="text-gray-500 text-sm mt-2">
            Search motor reports by status and date range.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isLoading || isFetching}
                className={`w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-blue-600 transition ${
                  isLoading || isFetching ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading || isFetching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Reports ({reports.length})
            </h3>
            <button className="flex items-center gap-2 text-sm bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition">
              <Download size={16} />
              Export
            </button>
          </div>

          {isLoading || isFetching ? (
            <div className="p-12 text-center text-gray-500 flex justify-center items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Fetching reports...
            </div>
          ) : reports?.length > 0 ? 
            <TableNew ischildren={false} cb={({ page, rowsPerPage }) => {
          console.log("Pagination →", page, rowsPerPage);
        }} groupedColumns={baseMotorColumns} totalCount={reports?.length ?? 0} rows={reports?.length ? reports : []} isLoading={isLoading} />
           : (
            <div className="p-12 text-center text-gray-500 text-sm">
              No reports found. Please adjust filters and search again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotorReports;
