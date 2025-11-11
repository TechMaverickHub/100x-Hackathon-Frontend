import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

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

  const LineChart: React.FC<{ data: UserRegistrationTrend }> = ({ data }) => {
    if (!data.dates.length || !data.counts.length) return null;

    const maxCount = Math.max(...data.counts);
    const chartWidth = 600;
    const chartHeight = 300;
    const padding = 40;
    const plotWidth = chartWidth - 2 * padding;
    const plotHeight = chartHeight - 2 * padding;

    const denominator = Math.max(data.dates.length - 1, 1);

    const points = data.dates.map((date, index) => {
      const x = padding + (index / denominator) * plotWidth;
      const y = padding + plotHeight - (data.counts[index] / maxCount) * plotHeight;
      return { x, y, count: data.counts[index] };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">User Registration Trend</h3>
        <svg width={chartWidth} height={chartHeight} className="border">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * plotHeight}
              x2={padding + plotWidth}
              y2={padding + ratio * plotHeight}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x={padding - 10}
              y={padding + ratio * plotHeight + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(maxCount * (1 - ratio))}
            </text>
          ))}

          {/* X-axis labels */}
          {data.dates.map((date, index) => {
            const x = padding + (index / denominator) * plotWidth;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {new Date(date).toLocaleDateString()}
              </text>
            );
          })}

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
                fontWeight="bold"
              >
                {point.count}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const BarChart: React.FC<{ data: SourcePopularity }> = ({ data }) => {
    if (!data.sources.length || !data.counts.length) return null;

    const maxCount = Math.max(...data.counts);
    const chartWidth = 600;
    const chartHeight = 300;
    const padding = 40;
    const plotWidth = chartWidth - 2 * padding;
    const plotHeight = chartHeight - 2 * padding;
    const barWidth = plotWidth / data.sources.length * 0.8;
    const barSpacing = plotWidth / data.sources.length;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Job Source Popularity</h3>
        <svg width={chartWidth} height={chartHeight} className="border">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * plotHeight}
              x2={padding + plotWidth}
              y2={padding + ratio * plotHeight}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x={padding - 10}
              y={padding + ratio * plotHeight + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(maxCount * (1 - ratio))}
            </text>
          ))}

          {/* Bars */}
          {data.sources.map((source, index) => {
            const barHeight = (data.counts[index] / maxCount) * plotHeight;
            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = padding + plotHeight - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#10b981"
                  rx={4}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="bold"
                >
                  {data.counts[index]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight - padding + 20})`}
                >
                  {source.length > 15 ? source.substring(0, 15) + '...' : source}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const MultiLineChart: React.FC<{ data: DailyAIUsage }> = ({ data }) => {
    if (!data.dates.length || !data.series.length) return null;

    const allValues = data.series.flatMap((series) => series.data);
    const maxCount = Math.max(...allValues, 0);
    const safeMaxCount = maxCount === 0 ? 1 : maxCount;
    const chartWidth = 1200;
    const chartHeight = 320;
    const padding = 50;
    const plotWidth = chartWidth - 2 * padding;
    const plotHeight = chartHeight - 2 * padding;
    const denominator = Math.max(data.dates.length - 1, 1);
    const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#6366f1', '#ec4899'];

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Daily AI Usage</h3>
          <p className="text-sm text-gray-500">
            Total calls: <span className="font-semibold text-gray-700">{data.total_calls}</span>
          </p>
        </div>
        <svg width={chartWidth} height={chartHeight} className="border rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * plotHeight}
              x2={padding + plotWidth}
              y2={padding + ratio * plotHeight}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x={padding - 12}
              y={padding + ratio * plotHeight + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(safeMaxCount * (1 - ratio))}
            </text>
          ))}

          {/* X-axis labels */}
          {data.dates.map((date, index) => {
            const x = padding + (index / denominator) * plotWidth;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {new Date(date).toLocaleDateString()}
              </text>
            );
          })}

          {/* Lines and data points */}
          {data.series.map((series, seriesIndex) => {
            const color = colorPalette[seriesIndex % colorPalette.length];
            const points = data.dates.map((date, index) => {
              const value = series.data[index] ?? 0;
              const x = padding + (index / denominator) * plotWidth;
              const y = padding + plotHeight - (value / safeMaxCount) * plotHeight;
              return { x, y, value };
            });

            const pathData = points
              .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
              .join(' ');

            return (
              <g key={series.label}>
                <path d={pathData} fill="none" stroke={color} strokeWidth={3} />
                {points.map((point, index) => (
                  <g key={`${series.label}-${index}`}>
                    <circle cx={point.x} cy={point.y} r={5} fill={color} stroke="white" strokeWidth={2} />
                    <text
                      x={point.x}
                      y={point.y - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#374151"
                      fontWeight="bold"
                    >
                      {point.value}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {data.series.map((series, index) => (
            <div key={series.label} className="flex items-center text-sm text-gray-600">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
              ></span>
              {series.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            {registrationTrend && (
              <LineChart data={registrationTrend} />
            )}

            {/* Source Popularity */}
            {sourcePopularity && (
              <BarChart data={sourcePopularity} />
            )}

            {/* Daily AI Usage */}
            {dailyAIUsage && (
              <div className="xl:col-span-2">
                <MultiLineChart data={dailyAIUsage} />
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Registration Summary</h3>
              {registrationTrend ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total registrations: <span className="font-semibold">{registrationTrend.counts.reduce((a, b) => a + b, 0)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date range: <span className="font-semibold">
                      {new Date(registrationTrend.dates[0]).toLocaleDateString()} - {new Date(registrationTrend.dates[registrationTrend.dates.length - 1]).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Peak day: <span className="font-semibold">
                      {new Date(registrationTrend.dates[registrationTrend.counts.indexOf(Math.max(...registrationTrend.counts))]).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No registration data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Source Summary</h3>
              {sourcePopularity ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total sources: <span className="font-semibold">{sourcePopularity.sources.length}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Most popular: <span className="font-semibold">
                      {sourcePopularity.sources[sourcePopularity.counts.indexOf(Math.max(...sourcePopularity.counts))]}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Users subscribed to most popular source: <span className="font-semibold">
                      {Math.max(...sourcePopularity.counts)}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No source data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">AI Usage Summary</h3>
              {dailyAIUsage ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total AI calls: <span className="font-semibold">{dailyAIUsage.total_calls}</span>
                  </p>
                  <p className="text-sm text-gray-600">Breakdown by tool:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(dailyAIUsage.totals_by_type).map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
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
