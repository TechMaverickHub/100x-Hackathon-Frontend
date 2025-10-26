import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

interface JobSource {
  pk: number;
  name: string;
}

interface UserJobSourceSelection {
  id: number;
  name: string;
}

interface JobSourceSelectionItem {
  source: number;
  frequency: string;
  alert: boolean;
}

interface JobSourceSelectionProps {
  onBack?: () => void;
}

const JobSourceSelection: React.FC<JobSourceSelectionProps> = ({ onBack }) => {
  const [allJobSources, setAllJobSources] = useState<JobSource[]>([]);
  const [userSelections, setUserSelections] = useState<UserJobSourceSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selections, setSelections] = useState<{ [key: number]: JobSourceSelectionItem }>({});
  const [localSelections, setLocalSelections] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchJobSources();
    fetchUserSelections();
  }, []);

  const fetchJobSources = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/${API_ENDPOINTS.JOB_SOURCE_LIST}`);
      if (response.data.results) {
        setAllJobSources(response.data.results);
        // Initialize selections with default values
        const initialSelections: { [key: number]: JobSourceSelectionItem } = {};
        response.data.results.forEach((source: JobSource) => {
          initialSelections[source.pk] = {
            source: source.pk,
            frequency: 'daily',
            alert: true
          };
        });
        setSelections(initialSelections);
      }
    } catch (error) {
      console.error('Failed to fetch job sources:', error);
      setErrorMessage('Failed to load job sources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSelections = async () => {
    try {
      const response = await api.get(`/${API_ENDPOINTS.JOB_SOURCE_USER_SELECTION}`);
      if (response.data.results) {
        setUserSelections(response.data.results);
        // Initialize local selections with user's current preferences
        const selectedIds = new Set<number>(response.data.results.map((selection: UserJobSourceSelection) => Number(selection.id)));
        setLocalSelections(selectedIds);
        // Update selections with user's current preferences
        const updatedSelections: { [key: number]: JobSourceSelectionItem } = {};
        response.data.results.forEach((selection: UserJobSourceSelection) => {
          const id = Number(selection.id);
          updatedSelections[id] = {
            source: id,
            frequency: 'daily', // Default frequency since it's not in the API response
            alert: true // Default alert since it's not in the API response
          };
        });
        setSelections(prev => ({ ...prev, ...updatedSelections }));
      }
    } catch (error) {
      console.error('Failed to fetch user selections:', error);
      // Don't show error for this as it's not critical
    }
  };

  const handleSourceToggle = (sourceId: number) => {
    setLocalSelections(prev => {
      const newSelections = new Set(prev);
      if (newSelections.has(sourceId)) {
        newSelections.delete(sourceId);
      } else {
        newSelections.add(sourceId);
      }
      return newSelections;
    });

    setSelections(prev => ({
      ...prev,
      [sourceId]: {
        ...prev[sourceId],
        source: sourceId
      }
    }));
  };

  const handleFrequencyChange = (sourceId: number, frequency: string) => {
    setSelections(prev => ({
      ...prev,
      [sourceId]: {
        ...prev[sourceId],
        frequency
      }
    }));
  };

  const handleAlertToggle = (sourceId: number) => {
    setSelections(prev => ({
      ...prev,
      [sourceId]: {
        ...prev[sourceId],
        alert: !prev[sourceId].alert
      }
    }));
  };

  const handleSaveSelections = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Convert only selected sources to array format expected by API
      const selectionsArray = Array.from(localSelections).map(sourceId => ({
        source: sourceId,
        frequency: selections[sourceId]?.frequency || 'daily',
        alert: selections[sourceId]?.alert !== false
      }));

      await api.post(`/${API_ENDPOINTS.JOB_SOURCE_UPDATE_SELECTION}`, selectionsArray);
      setSuccessMessage('Job source preferences updated successfully!');
      // Refresh user selections after successful save
      await fetchUserSelections();
    } catch (error) {
      console.error('Failed to update job source selections:', error);
      setErrorMessage('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isSourceSelected = (sourceId: number) => {
    return localSelections.has(sourceId);
  };

  const getSelectedCount = () => {
    return localSelections.size;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Source Preferences</h1>
              <p className="mt-2 text-gray-600">Select your preferred job sources and configure notification settings</p>
            </div>
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

        {/* Selection Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Selection</h2>
              <p className="text-sm text-gray-600">
                {getSelectedCount()} job source{getSelectedCount() !== 1 ? 's' : ''} selected
              </p>
            </div>
            <button
              onClick={handleSaveSelections}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Job Sources Checklist */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading job sources...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {allJobSources.map((jobSource) => (
                <div key={jobSource.pk} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`source-${jobSource.pk}`}
                        checked={isSourceSelected(jobSource.pk)}
                        onChange={() => handleSourceToggle(jobSource.pk)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    {/* Job Source Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor={`source-${jobSource.pk}`}
                            className="text-lg font-medium text-gray-900 cursor-pointer"
                          >
                            {jobSource.name}
                          </label>
                        </div>
                      </div>

                      {/* Configuration Options */}
                      {isSourceSelected(jobSource.pk) && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Frequency Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Frequency
                            </label>
                            <select
                              value={selections[jobSource.pk]?.frequency || 'daily'}
                              onChange={(e) => handleFrequencyChange(jobSource.pk, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="once">Once</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>

                          {/* Alert Toggle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notifications
                            </label>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`alert-${jobSource.pk}`}
                                checked={selections[jobSource.pk]?.alert || false}
                                onChange={() => handleAlertToggle(jobSource.pk)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`alert-${jobSource.pk}`}
                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                              >
                                Enable alerts for new jobs
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How it works</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Select the job sources you want to monitor</li>
                  <li>Choose how frequently you want to receive updates</li>
                  <li>Enable alerts to get notified about new job postings</li>
                  <li>Your preferences will be saved and applied automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSourceSelection;
