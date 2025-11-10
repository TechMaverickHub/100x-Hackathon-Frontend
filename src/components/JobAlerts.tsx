import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

interface JobAlert {
  title: string;
  link: string;
  score: number;
  keywords_matched: string[];
}

interface JobAlertsResponse {
  message: string;
  status: number;
  results: JobAlert[];
}

interface JobAlertsProps {
  onBack?: () => void;
}

const JobAlerts: React.FC<JobAlertsProps> = ({ onBack }) => {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchJobAlerts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post<JobAlertsResponse>(`/${API_ENDPOINTS.JOB_SOURCE_GET_ALERTS}`, {});
      setAlerts(response.data.results || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch job alerts:', err);
      setError('Unable to fetch job alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
              <p className="mt-2 text-gray-600">
                Curated job matches generated from your selected job sources.
              </p>
              {lastUpdated && (
                <p className="mt-1 text-sm text-gray-500">
                  Last refreshed: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  ← Back to Dashboard
                </button>
              )}
              <button
                onClick={fetchJobAlerts}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Alerts'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.707a1 1 0 00-1.414-1.414L7 7.586 5.707 6.293a1 1 0 10-1.414 1.414L5.586 9l-1.293 1.293a1 1 0 001.414 1.414L7 10.414l2.293 2.293a1 1 0 001.414-1.414L8.414 9l2.293-2.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          {loading && alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-600">Fetching job alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="flex justify-center mb-4">
                <span className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">No job alerts yet</h2>
              <p className="mt-2 text-gray-600">
                Once new matches are found from your selected job sources, they will appear here.
              </p>
              <button
                onClick={fetchJobAlerts}
                disabled={loading}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
              >
                {loading ? 'Refreshing...' : 'Check Again'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <div key={`${alert.link}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alert.keywords_matched.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Match Score</p>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(alert.score)}</p>
                      </div>
                      <a
                        href={alert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        View Job
                        <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L14 5.414V13a1 1 0 11-2 0V5.414L9.707 7.707A1 1 0 018.293 6.293l4-4z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M3 11a1 1 0 011-1h3a1 1 0 110 2H5v5h10v-5h-2a1 1 0 110-2h3a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;

