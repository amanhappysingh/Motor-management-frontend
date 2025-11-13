import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface GroupedColumn {
  label: string;
  children?: {
    id?: string;
    label: string;
    accesor: string;
    className?: string;
  }[];
  accesor: string;
  className?: string;
  render?: (row: any) => React.ReactNode;
}

interface DynamicTableProps {
  groupedColumns: GroupedColumn[];
  rows: Record<string, any>[];
  totalCount: number;
  isLoading: boolean;
  ischildren : boolean;
  headerComponent?: React.ReactNode;
  cb: (args: { page: number; rowsPerPage: number }) => void;
}

export default function TableNew({
  groupedColumns,
  totalCount,
  ischildren = true,
  rows,
  isLoading = false,
  headerComponent,
  cb,
}: DynamicTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    cb({ page, rowsPerPage });
  }, [page, rowsPerPage]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, totalCount);

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Header Section */}
      {headerComponent && (
        <div className="p-4 bg-white border-b border-gray-200">
          {headerComponent}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto" style={{ minHeight: "60vh", maxHeight: "70vh" }}>
        <table className="w-full">
          {/* Top Header (Grouped) */}
          <thead className="sticky top-0 z-10">
            <tr className={`relative bg-gray-100`}>
              {groupedColumns.map((group, i) => (
                 ischildren ? <th
                  key={i}
                  colSpan={group.children ? group.children.length : 1}
                  className="bg-gray-100  text-gray-800 font-semibold text-sm py-3 px-4 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap uppercase tracking-wide"
                  style={{
                    position : group.children ? undefined : "sticky",
                    top :  group.children ? "0px" : "20px",
                    borderBottom: group.children ? "2px solid #D1D5DB" : ""
                  }}
                >
                  {group.label}
                </th> : <th
                  key={i}
                  colSpan={group.children ? group.children.length : 1}
                  className="bg-gray-100  text-gray-800 font-semibold text-sm py-3 px-4 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap uppercase tracking-wide"
                  style={{
                  
                    borderBottom: group.children ? "2px solid #D1D5DB" : ""
                  }}
                >
                  {group.label}
                </th> 
              ))}
            </tr>

            {/* Sub Header (Children) */}
            <tr>
              {groupedColumns.map((group, i) =>
                group.children?.length ? (
                  group.children.map((child) => (
                    <th
                      key={child.id}
                      className="bg-gray-100 text-gray-800 font-medium text-xs py-2 px-3 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                    >
                      {child.label}
                    </th>
                  ))
                ) : (
                  <th
                    key={i}
                    className={`bg-gray-100 border-r border-gray-200 `}
                  />
                )
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={groupedColumns.reduce(
                    (acc, group) => acc + (group.children?.length || 1),
                    0
                  )}
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-600 font-medium">Loading Data...</p>
                  </div>
                </td>
              </tr>
            ) : rows?.length ? (
              rows.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  {groupedColumns.flatMap((group) =>
                    group.children
                      ? group?.children?.map((child) => (
                          <td
                            key={child.id}
                            className={`${child?.className ? row[child?.className] : ""} text-gray-700 text-sm py-3 px-4 text-center border-r border-gray-100 last:border-r-0`}
                          >
                            {row[child?.accesor] ?? "-"}
                            
                          </td>
                        ))
                      : [
                          <td
                            key={group.label}
                            className={`${group?.className || ""}  text-gray-700 text-sm py-3 px-4 text-center border-r border-gray-100 last:border-r-0`}
                          >
                           
                            {group.render ? group.render(row) : (row[group?.accesor] ?? "-")}
                          </td>,
                        ]
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={groupedColumns.reduce(
                    (acc, group) => acc + (group.children?.length || 1),
                    0
                  )}
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-700 text-lg font-semibold">No Data Found</p>
                    <p className="text-gray-500 text-sm">There are no records to display</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:flex items-center justify-between">
        <div className="flex justify-between sm:justify-start w-full sm:w-full items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-700">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <p className="text-sm text-gray-700">
            {startIndex}–{endIndex} of {totalCount}
          </p>
        </div>

        <div className="flex whitespace-nowrap items-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-700 px-2">
            Page {page + 1} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}