import React, { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  Wrench,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  RefreshCcwDot,
} from "lucide-react";
import { Api } from "../utils/http";
import { URL } from "../utils/urls";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";

const todayData = {
  in: 50,
  overhauling: 22,
  trial: 23,
  out: 120,
  fault: 5,
  available: 10,
};

type DayData = {
  in: number;
  overhauling: number;
  out: number;
  available: number;
  trial: number;
  fault: number;

};

type WeeklyApiResponse = {
  monday?: DayData;
  tuesday?: DayData;
  wednesday?: DayData;
  thursday?: DayData;
  friday?: DayData;
  saturday?: DayData;
  sunday?: DayData;
};

type MonthData = {
  in: number;
  overhauling: number;
  out: number;
  available: number;
  trial: number;
  fault: number;
};

type MonthlyApiResponse = {
  january?: MonthData;
  february?: MonthData;
  march?: MonthData;
  april?: MonthData;
  may?: MonthData;
  june?: MonthData;
  july?: MonthData;
  august?: MonthData;
  september?: MonthData;
  october?: MonthData;
  november?: MonthData;
  december?: MonthData;
};

type MonthlyChartData = {
  month: string;
  ewsIn: number;
  overhauling: number;
  trial: number;
  out: number;
  fault: number;
}[];

type WeeklyChartData = {
  day: string;
  ewsIn: number;
  overhauling: number;
  trial: number;
  out: number;
  fault: number;
}[];

export default function Dashboard() {
  const [year, setYear] = useState("2025");
  const navigate = useNavigate()

  const getDashboard = async () => {
    const res = await Api.get({ url: URL.motorDashobard });
    return res?.data?.data;
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  console.log(dashboardData, "fasdfkjhasdjfgkjshfksadfj");

  /**
   * ✅ Converts backend weekly response into recharts-friendly format
   */
   const convertWeeklyData = (
    apiData?: WeeklyApiResponse
  ): WeeklyChartData => {
    const dayMap: Record<keyof WeeklyApiResponse, string> = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    return (Object.keys(dayMap) as (keyof WeeklyApiResponse)[]).map(
      (dayKey) => ({
        day: dayMap[dayKey],
        ewsIn: apiData?.[dayKey]?.in ?? 0,
        overhauling: apiData?.[dayKey]?.overhauling ?? 0,
        trial: apiData?.[dayKey]?.trial ?? 0,
        out: apiData?.[dayKey]?.out ?? 0,
        fault: apiData?.[dayKey]?.fault ?? 0,
        available: apiData?.[dayKey]?.available ?? 0,
      })
    );
  };

  const convertMonthlyData = (
  apiData?: MonthlyApiResponse
): MonthlyChartData => {
  const monthMap: Record<keyof MonthlyApiResponse, string> = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };

  return (Object.keys(monthMap) as (keyof MonthlyApiResponse)[]).map(
    (monthKey) => ({
      month: monthMap[monthKey],
      ewsIn: apiData?.[monthKey]?.in ?? 0,
      overhauling: apiData?.[monthKey]?.overhauling ?? 0,
      trial: apiData?.[monthKey]?.trial ?? 0,
      out: apiData?.[monthKey]?.out ?? 0,
      fault: apiData?.[monthKey]?.fault ?? 0,
      available: apiData?.[monthKey]?.available ?? 0,
    })
  );
};

  

  const pieData = [
    { name: "EWS IN", value: dashboardData?.today?.in, color: "#3b82f6" },
    {
      name: "Overhauling",
      value: dashboardData?.today?.overhauling,
      color: "#f59e0b",
    },
    { name: "Trial", value: dashboardData?.today?.trial, color: "#8b5cf6" },
    { name: "Out", value: dashboardData?.today?.out, color: "#10b981" },
    { name: "Fault", value: dashboardData?.today?.fault, color: "#ef4444" },
    { name: "Available", value: dashboardData?.today?.available, color: "#ef0102" },
  ];

  // ✅ Loading Skeleton View
  if (isLoading) {
    return (
      <div className="p-6 w-full h-full overflow-y-auto space-y-8">
        {/* Header Skeleton */}
        <div>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={20} />
        </div>

        {/* Card Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <Skeleton variant="rectangular" height={80} />
              <div className="mt-4 space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <Skeleton variant="text" width="50%" height={30} />
            <Skeleton variant="rectangular" height={280} />
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <Skeleton variant="text" width="50%" height={30} />
            <Skeleton variant="rectangular" height={280} />
          </div>
        </div>

        {/* Bar Chart Skeleton */}
        <div className="bg-white p-6 rounded-xl border">
          <Skeleton variant="text" width="50%" height={30} />
          <Skeleton variant="rectangular" height={320} />
        </div>

        {/* Summary Skeletons */}
        <div className="bg-white p-6 rounded-xl border grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-4">
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="30%" height={40} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Real Dashboard View
  return (
    <div className="h-full overflow-y-auto  w-full bg-gradient-to-br bg-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-700">
            Motor Maintenance Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time monitoring and analytics
          </p>
        </div>
      </div>

      <div className=" mx-auto bg-blue-50 p-6">
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div onClick={() => navigate('/all-motors/all-in-motors')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div  className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Activity className="text-blue-600" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-gray-700">
                {dashboardData?.overall.in}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">EWS IN</p>
          </div>

          <div onClick={() => navigate('/all-motors/all-available-motors')} className="bg-white block lg:hidden p-6 rounded-xl shadow-sm border border-gray-100">
            <div  className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-gray-700">
                {dashboardData?.overall.available}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">Available</p>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-emerald-50 rounded-lg mb-3">
                  <Wrench className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-4xl font-bold text-gray-700 mb-1">
                  {dashboardData?.overall.overhauling +
                    dashboardData?.overall.trial}
                </h2>
                <p className="text-gray-600 text-sm font-medium">Maintenance</p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div onClick={() => navigate('/all-motors/all-overhauling-motors')} className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <RefreshCw className="text-amber-600" size={20} />
                    <p className="text-2xl font-bold text-gray-700">
                      {dashboardData?.overall.overhauling}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">
                    Overhauling
                  </p>
                </div>

                <div onClick={() => navigate('/all-motors/all-trail-motors')} className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <RefreshCcwDot className="text-purple-600" size={20} />
                    <p className="text-2xl font-bold text-gray-700">
                      {dashboardData?.overall.trial}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Trial</p>
                </div>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/all-motors/all-available-motors')} className="bg-white hidden lg:block p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-gray-700">
                {dashboardData?.overall.available}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">Available</p>
          </div>

          <div onClick={() => navigate('/all-motors/all-fault-motors')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-gray-700">
                {dashboardData?.overall.fault}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">Fault</p>
          </div>

          <div onClick={() => navigate('/all-motors/all-out-motors')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-gray-700">
                {dashboardData?.overall.out}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">Out</p>
          </div>
        </div>

        {/* LINE + PIE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 w-full">
  {/* Weekly Trend Analysis */}
  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
      Weekly Trend Analysis
    </h3>
    <div className="w-full overflow-x-auto">
      <div className="min-w-[320px] sm:min-w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={convertWeeklyData(dashboardData?.current_week)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line dataKey="ewsIn" stroke="#3b82f6" strokeWidth={2} name="EWS IN" />
            <Line dataKey="overhauling" stroke="#f59e0b" strokeWidth={2} name="Overhauling" />
            <Line dataKey="trial" stroke="#8b5cf6" strokeWidth={2} name="Trial" />
            <Line dataKey="out" stroke="#10b981" strokeWidth={2} name="Out" />
            <Line dataKey="available" stroke="#10b081" strokeWidth={2} name="Available" />
            <Line dataKey="fault" stroke="#ef4444" strokeWidth={2} name="Fault" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>

  {/* Today's Status Distribution */}
  <div className="bg-white p-2 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
      Today's Status Distribution
    </h3>
    <div className="flex justify-center w-full overflow-x-auto">
      <div className="min-w-[300px] p-5 sm:min-w-full">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              outerRadius={110}
              dataKey="value"
              label={(entry) => `${entry.name}: ${entry.value}`}
              labelLine={{ stroke: "#9ca3af" }}
            >
              {pieData.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>


        {/* MONTH BAR */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Monthly Performance Overview
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={convertMonthlyData(dashboardData?.current_year)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis allowDecimals={false} stroke="#6b7280" tick={{ fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="ewsIn"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="EWS IN"
              />
              <Bar
                dataKey="overhauling"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="Overhauling"
              />
              <Bar
                dataKey="trial"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Trial"
              />
              <Bar
                dataKey="available"
                fill="#e4e4e4"
                radius={[4, 4, 0, 0]}
                name="available"
              />
              <Bar
                dataKey="out"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Out"
              />
              <Bar
                dataKey="fault"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Fault"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      
      </div>
    </div>
  );
}
