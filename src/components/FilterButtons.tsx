import React, { useState } from "react";
import { Filter } from "lucide-react";

type Options = {
  label: string;
  value: string;
};

export default function FilterButtons({ options = [] }: { options: Options[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterSelect = (val: string) => {
    setSelectedFilter(val);
    setIsFilterOpen(false);
    console.log(`Filter selected: ${val}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 cursor-pointer transition-colors "
        >
          <Filter size={20} />
          <span>Filter {selectedFilter ? `(${selectedFilter})` : ""}</span>
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[100]">
            <div className="py-1 max-h-64 overflow-y-auto">
              {options?.map((itm) => (
                <button
                  key={itm.value}
                  onClick={() => handleFilterSelect(itm.value)}
                  className={`w-full text-left cursor-pointer px-4 py-2 hover:bg-blue-100 transition-colors ${
                    selectedFilter === itm.value
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {itm.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
