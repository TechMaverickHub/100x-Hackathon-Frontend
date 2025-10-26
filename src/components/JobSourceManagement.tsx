import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

interface JobSource {
  pk: number;
  name: string;
  api_url: string;
  rss_url: string;
  created: string;
}

interface JobSourceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobSource[];
}

interface JobSourceFormData {
  name: string;
  api_url: string;
  rss_url: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  alert: boolean;
}

interface JobSourceManagementProps {
  onBack?: () => void;
}

const JobSourceManagement: React.FC<JobSourceManagementProps> = ({ onBack }) => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingJobSource, setEditingJobSource] = useState<JobSource | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    api_url: '',
    rss_url: ''
  });

  // Form state
  const [formData, setFormData] = useState<JobSourceFormData>({
    name: '',
    api_url: '',
    rss_url: '',
    frequency: 'daily',
    alert: true
  });

  const fetchJobSources = useCallback(async (page: number = 1, size: number = pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await api.get(`/${API_ENDPOINTS.JOB_SOURCE_LIST_FILTER}?${params}`);
      const data: JobSourceListResponse = response.data;
      
      setJobSources(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / size));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch job sources:', error);
      setErrorMessage('Failed to fetch job sources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pageSize, filters]);

  useEffect(() => {
    fetchJobSources();
  }, [fetchJobSources]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobSources(1, pageSize);
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      api_url: '',
      rss_url: ''
    });
    setCurrentPage(1);
    fetchJobSources(1, pageSize);
  };

  const handlePageChange = (page: number) => {
    fetchJobSources(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchJobSources(1, size);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCreateJobSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        name: formData.name,
        api_url: formData.api_url,
        rss_url: formData.rss_url
      };

      await api.post(`/${API_ENDPOINTS.JOB_SOURCE_CREATE}`, payload);
      setSuccessMessage('Job source created successfully!');
      setShowForm(false);
      resetForm();
      fetchJobSources(currentPage, pageSize);
    } catch (error) {
      console.error('Failed to create job source:', error);
      setErrorMessage('Failed to create job source. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditJobSource = async (jobSource: JobSource) => {
    setEditingJobSource(jobSource);
    setFormData({
      name: jobSource.name,
      api_url: jobSource.api_url,
      rss_url: jobSource.rss_url,
      frequency: 'daily', // Default value since it's not in the API response
      alert: true // Default value since it's not in the API response
    });
    setShowForm(true);
  };

  const handleUpdateJobSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobSource) return;

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        name: formData.name,
        api_url: formData.api_url,
        rss_url: formData.rss_url
      };

      await api.patch(`/${API_ENDPOINTS.JOB_SOURCE_UPDATE}/${editingJobSource.pk}`, payload);
      setSuccessMessage('Job source updated successfully!');
      setShowForm(false);
      setEditingJobSource(null);
      resetForm();
      fetchJobSources(currentPage, pageSize);
    } catch (error) {
      console.error('Failed to update job source:', error);
      setErrorMessage('Failed to update job source. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJobSource = async (jobSource: JobSource) => {
    if (!window.confirm(`Are you sure you want to delete "${jobSource.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/${API_ENDPOINTS.JOB_SOURCE_DELETE}/${jobSource.pk}`);
      setSuccessMessage('Job source deleted successfully!');
      fetchJobSources(currentPage, pageSize);
    } catch (error) {
      console.error('Failed to delete job source:', error);
      setErrorMessage('Failed to delete job source. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      api_url: '',
      rss_url: '',
      frequency: 'daily',
      alert: true
    });
    setEditingJobSource(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingJobSource(null);
    resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Source Management</h1>
              <p className="mt-2 text-gray-600">Manage job sources and their configurations</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                + Add Job Source
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  ← Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Job Source Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingJobSource ? 'Edit Job Source' : 'Add New Job Source'}
            </h2>
            <form onSubmit={editingJobSource ? handleUpdateJobSource : handleCreateJobSource} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job source name"
                  />
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleFormInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="api_url" className="block text-sm font-medium text-gray-700 mb-1">
                  API URL *
                </label>
                <input
                  type="url"
                  id="api_url"
                  name="api_url"
                  value={formData.api_url}
                  onChange={handleFormInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/api"
                />
              </div>
              <div>
                <label htmlFor="rss_url" className="block text-sm font-medium text-gray-700 mb-1">
                  RSS URL *
                </label>
                <input
                  type="url"
                  id="rss_url"
                  name="rss_url"
                  value={formData.rss_url}
                  onChange={handleFormInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/rss"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alert"
                  name="alert"
                  checked={formData.alert}
                  onChange={handleFormInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="alert" className="ml-2 block text-sm text-gray-900">
                  Enable alerts for this job source
                </label>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md"
                >
                  {saving ? 'Saving...' : (editingJobSource ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
              <input
                type="text"
                value={filters.api_url}
                onChange={(e) => handleFilterChange('api_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by API URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RSS URL</label>
              <input
                type="text"
                value={filters.rss_url}
                onChange={(e) => handleFilterChange('rss_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by RSS URL"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {jobSources.length} of {totalCount} job sources
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Page Size:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Sources Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading job sources...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        API URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RSS URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobSources.map((jobSource) => (
                      <tr key={jobSource.pk} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{jobSource.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={jobSource.api_url}>
                            {jobSource.api_url}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={jobSource.rss_url}>
                            {jobSource.rss_url}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(jobSource.created)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditJobSource(jobSource)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteJobSource(jobSource)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, currentPage - 2) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSourceManagement;
