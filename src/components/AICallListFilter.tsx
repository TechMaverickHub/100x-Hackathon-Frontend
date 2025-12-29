import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

interface ApiCall {
  pk: number;
  generation_type: string;
  content: string;
  created: string;
}

interface ApiCallListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiCall[];
}

interface FilterState {
  generation_type: string;
}

interface AICallListFilterProps {
  onBack: () => void;
}

const AICallListFilter: React.FC<AICallListFilterProps> = ({ onBack }) => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    generation_type: ''
  });

  const generationTypes = [
    "Cover Letter",
    "Interview Questions",
    "Interview Answers",
    "Portfolio From Resume",
    "Portfolio From QNA",
    "Resume",
    "Resume Score",
    "Resume Keyword Gap",
    "Resume Auto Rewrite",
    "Resume Skills Gap",
    "Resume Career Recommendation",
    "Job Recommendation"
  ];

  const fetchApiCalls = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        ...(filters.generation_type && { generation_type: filters.generation_type })
      });

      const response = await api.get(`${API_ENDPOINTS.ANALYTICS_API_CALL_LIST_FILTER}?${params}`);
      const data: ApiCallListResponse = response.data;
      
      setApiCalls(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (error) {
      console.error('Error fetching API calls:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchApiCalls();
  }, [fetchApiCalls]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      generation_type: ''
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getGenerationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Cover Letter': 'bg-blue-100 text-blue-800',
      'Interview Questions': 'bg-green-100 text-green-800',
      'Interview Answers': 'bg-purple-100 text-purple-800',
      'Portfolio From Resume': 'bg-yellow-100 text-yellow-800',
      'Portfolio From QNA': 'bg-orange-100 text-orange-800',
      'Resume': 'bg-red-100 text-red-800',
      'Resume Score': 'bg-indigo-100 text-indigo-800',
      'Resume Keyword Gap': 'bg-pink-100 text-pink-800',
      'Resume Auto Rewrite': 'bg-teal-100 text-teal-800',
      'Resume Skills Gap': 'bg-cyan-100 text-cyan-800',
      'Resume Career Recommendation': 'bg-emerald-100 text-emerald-800',
      'Job Recommendation': 'bg-lime-100 text-lime-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

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
              <h1 className="text-3xl font-bold text-gray-900">AI Call History</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Filter AI Calls
              </h2>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="generation_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Generation Type
                  </label>
                  <select
                    id="generation_type"
                    value={filters.generation_type}
                    onChange={(e) => handleFilterChange('generation_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {generationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => fetchApiCalls()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Search
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {apiCalls.length} of {totalCount} results
                    </p>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Content Preview
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {apiCalls.map((call) => (
                          <tr key={call.pk} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{call.pk}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGenerationTypeColor(call.generation_type)}`}>
                                {call.generation_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                              <div className="truncate">
                                {truncateContent(call.content)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(call.created)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Show:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-700">per page</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AICallListFilter;
