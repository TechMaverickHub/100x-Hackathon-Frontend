import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
} from 'recharts';

interface UserRegistrationTrend {
  dates: string[];
  counts: number[];
}

interface SourcePopularity {
  sources: string[];
  counts: number[];
}

interface AIUsageSeries {
  label: string;
  data: number[];
}

interface DailyAIUsage {
  dates: string[];
  series: AIUsageSeries[];
  total_calls: number;
  totals_by_type: Record<string, number>;
}

interface AnalyticsDashboardProps {
  onBack: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [registrationTrend, setRegistrationTrend] = useState<UserRegistrationTrend | null>(null);
  const [sourcePopularity, setSourcePopularity] = useState<SourcePopularity | null>(null);
  const [dailyAIUsage, setDailyAIUsage] = useState<DailyAIUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendResponse, popularityResponse, aiUsageResponse] = await Promise.all([
          api.get(API_ENDPOINTS.ANALYTICS_USER_REGISTRATION_TREND),
          api.get(API_ENDPOINTS.ANALYTICS_SOURCE_POPULARITY),
          api.get(API_ENDPOINTS.ANALYTICS_DAILY_AI_USAGE)
        ]);
        
        setRegistrationTrend(trendResponse.data.results);
        setSourcePopularity(popularityResponse.data.results);
        setDailyAIUsage(aiUsageResponse.data.results);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#6366f1', '#ec4899'];

  const formatDateLabel = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

  const registrationTrendData = useMemo(() => {
    if (!registrationTrend) return [];
    return registrationTrend.dates.map((date, index) => ({
      date,
      label: formatDateLabel(date),
      count: registrationTrend.counts[index] ?? 0,
    }));
  }, [registrationTrend]);

  const sourcePopularityData = useMemo(() => {
    if (!sourcePopularity) return [];
    return sourcePopularity.sources.map((source, index) => ({
      name: source,
      label: source.length > 15 ? `${source.substring(0, 15)}…` : source,
      count: sourcePopularity.counts[index] ?? 0,
    }));
  }, [sourcePopularity]);

  const aiUsageChartData = useMemo(() => {
    if (!dailyAIUsage) return [];
    return dailyAIUsage.dates.map((date, index) => {
      const entry: Record<string, number | string> = {
        date,
        label: formatDateLabel(date),
      };
      dailyAIUsage.series.forEach((series) => {
        entry[series.label] = series.data[index] ?? 0;
      });
      return entry;
    });
  }, [dailyAIUsage]);

  const totalsByTypeEntries = useMemo(() => {
    if (!dailyAIUsage) return [];
    return Object.entries(dailyAIUsage.totals_by_type);
  }, [dailyAIUsage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* User Registration Trend */}
            {registrationTrendData.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Registration Trend</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    Total: {registrationTrendData.reduce((sum, item) => sum + item.count, 0)}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsLineChart data={registrationTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6b7280" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: number) => [`${value} registrations`, 'Registrations']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Registrations"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Source Popularity */}
            {sourcePopularityData.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Job Source Popularity</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                    Sources: {sourcePopularityData.length}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsBarChart
                    data={sourcePopularityData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                    barCategoryGap="25%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      stroke="#6b7280"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis stroke="#6b7280" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                      formatter={(value: number) => [`${value} users`, 'Job Source']}
                      labelFormatter={(value) => {
                        const match = sourcePopularityData.find((item) => item.label === value);
                        return match ? match.name : value;
                      }}
                    />
                    <Bar dataKey="count" name="Job Source" radius={[10, 10, 0, 0]}>
                      {sourcePopularityData.map((_, index) => (
                        <Cell key={index} fill={colorPalette[index % colorPalette.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Daily AI Usage */}
            {dailyAIUsage && aiUsageChartData.length > 0 && (
              <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Daily AI Usage</h3>
                    <p className="text-sm text-gray-500">Understand how your users are engaging with AI-powered tools.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                      Total Calls: {dailyAIUsage.total_calls}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium">
                      Tools: {dailyAIUsage.series.length}
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={360}>
                  <RechartsLineChart data={aiUsageChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6b7280" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }}
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: number, key: string) => [`${value} calls`, key]}
                    />
                    {dailyAIUsage.series.map((series, index) => (
                      <Line
                        key={series.label}
                        type="monotone"
                        dataKey={series.label}
                        name={series.label}
                        stroke={colorPalette[index % colorPalette.length]}
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    ))}
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Registration Summary</h3>
                {registrationTrend && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    {registrationTrend.dates.length} days
                  </span>
                )}
              </div>
              {registrationTrend ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-blue-50/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Total Registrations</p>
                    <p className="mt-1 text-2xl font-semibold text-blue-900">
                      {registrationTrend.counts.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-50/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Peak Day</p>
                    <p className="mt-1 text-sm font-medium text-indigo-900">
                      {new Date(
                        registrationTrend.dates[registrationTrend.counts.indexOf(Math.max(...registrationTrend.counts))]
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Date Range</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {new Date(registrationTrend.dates[0]).toLocaleDateString()} –{' '}
                      {new Date(registrationTrend.dates[registrationTrend.dates.length - 1]).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No registration data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Source Summary</h3>
                {sourcePopularity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                    {sourcePopularity.sources.length} sources
                  </span>
                )}
              </div>
              {sourcePopularity ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-xl bg-emerald-50/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Most Popular</p>
                    <p className="mt-1 text-sm font-medium text-emerald-900">
                      {sourcePopularity.sources[sourcePopularity.counts.indexOf(Math.max(...sourcePopularity.counts))]}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {Math.max(...sourcePopularity.counts)} subscribed users
                    </p>
                  </div>
                  <div className="rounded-xl bg-teal-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-teal-600 font-semibold">Average Subscribers</p>
                    <p className="mt-1 text-2xl font-semibold text-teal-900">
                      {Math.round(
                        sourcePopularity.counts.reduce((a, b) => a + b, 0) / sourcePopularity.counts.length
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No source data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Usage Summary</h3>
                {dailyAIUsage && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                    Last {dailyAIUsage.dates.length} days
                  </span>
                )}
              </div>
              {dailyAIUsage && totalsByTypeEntries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {totalsByTypeEntries.map(([label, value], index) => (
                    <div
                      key={label}
                      className="rounded-xl border border-gray-100 p-4 flex items-center justify-between bg-gradient-to-r from-white via-white to-gray-50"
                    >
                      <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="text-xl font-semibold text-gray-900">{value}</p>
                      </div>
                      <span
                        className="inline-flex w-10 h-10 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: `${colorPalette[index % colorPalette.length]}20`,
                          color: colorPalette[index % colorPalette.length],
                        }}
                      >
                        {Math.round((value / dailyAIUsage.total_calls) * 100) || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No AI usage data available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
