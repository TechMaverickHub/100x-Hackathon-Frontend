import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL, API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface ResumeOptimizerFormData {
  job_description: string;
  tone: string;
}

interface ScoreResponse {
  message: string;
  status: number;
  results: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
}

interface KeywordsResponse {
  message: string;
  status: number;
  results: {
    matched_keywords: string[];
    missing_keywords: string[];
  };
}

interface AutoRewriteResponse {
  message: string;
  status: number;
  results: {
    original_text: string;
    enhanced_text: string;
    suggested_keywords_added: string[];
  };
}

interface ResumeOptimizerProps {
  onBack?: () => void;
}

const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ResumeOptimizerFormData>({
    job_description: '',
    tone: 'Professional'
  });
  const [activeTab, setActiveTab] = useState<'score' | 'keywords' | 'rewrite'>('score');
  const [isLoading, setIsLoading] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreResponse['results'] | null>(null);
  const [keywordsData, setKeywordsData] = useState<KeywordsResponse['results'] | null>(null);
  const [rewriteData, setRewriteData] = useState<AutoRewriteResponse['results'] | null>(null);

  const toneOptions = [
    'Professional',
    'Friendly',
    'Confident',
    'Creative',
    'Concise'
  ];

  const getScore = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_SCORE}`, {
        job_description: formData.job_description
      });
      setScoreData(response.data.results);
    } catch (error) {
      console.error('Failed to get resume score:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getKeywords = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_KEYWORDS}`, {
        job_description: formData.job_description
      });
      setKeywordsData(response.data.results);
    } catch (error) {
      console.error('Failed to analyze keywords:', error);
      alert('Failed to analyze keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const autoRewrite = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_AUTO_REWRITE}`, {
        job_description: formData.job_description,
        tone: formData.tone
      });
      setRewriteData(response.data.results);
    } catch (error) {
      console.error('Failed to rewrite resume:', error);
      alert('Failed to rewrite resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Resume Optimizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.first_name} {user?.last_name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimize Your Resume</h2>
          
          {/* Form */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={formData.job_description}
                onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste the job description here..."
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('score')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'score'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resume Score
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'keywords'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Keyword Analysis
            </button>
            <button
              onClick={() => setActiveTab('rewrite')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rewrite'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Auto Rewrite
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Resume Score Tab */}
            {activeTab === 'score' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resume Score Analysis</h3>
                  <button
                    onClick={getScore}
                    disabled={isLoading || !formData.job_description.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {isLoading ? 'Analyzing...' : 'Get Score'}
                  </button>
                </div>

                {scoreData && (
                  <div className="space-y-6">
                    {/* Score Display */}
                    <div className={`${getScoreBgColor(scoreData.score)} rounded-lg p-6 text-center`}>
                      <div className={`text-4xl font-bold ${getScoreColor(scoreData.score)} mb-2`}>
                        {scoreData.score}/100
                      </div>
                      <p className="text-gray-600">Resume Match Score</p>
                    </div>

                    {/* Strengths */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3">✅ Strengths</h4>
                      <ul className="space-y-2">
                        {scoreData.strengths.map((strength, index) => (
                          <li key={index} className="text-green-700 flex items-start">
                            <span className="mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-3">⚠️ Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {scoreData.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-red-700 flex items-start">
                            <span className="mr-2">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Keyword Analysis</h3>
                  <button
                    onClick={getKeywords}
                    disabled={isLoading || !formData.job_description.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Keywords'}
                  </button>
                </div>

                {keywordsData && (
                  <div className="space-y-6">
                    {/* Matched Keywords */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3">
                        ✅ Matched Keywords ({keywordsData.matched_keywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {keywordsData.matched_keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-3">
                        ❌ Missing Keywords ({keywordsData.missing_keywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {keywordsData.missing_keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auto Rewrite Tab */}
            {activeTab === 'rewrite' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Auto Rewrite Resume</h3>
                  <button
                    onClick={autoRewrite}
                    disabled={isLoading || !formData.job_description.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {isLoading ? 'Rewriting...' : 'Rewrite Resume'}
                  </button>
                </div>

                {/* Tone Selection for Auto Rewrite */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {toneOptions.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the tone for the rewritten resume.
                  </p>
                </div>

                {rewriteData && (
                  <div className="space-y-6">
                    {/* Suggested Keywords Added */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        🔧 Keywords Added ({rewriteData.suggested_keywords_added.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rewriteData.suggested_keywords_added.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Original vs Enhanced */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Original */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">Original Resume</h4>
                          <button
                            onClick={() => copyToClipboard(rewriteData.original_text)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="bg-white rounded p-3 max-h-96 overflow-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {rewriteData.original_text}
                          </pre>
                        </div>
                      </div>

                      {/* Enhanced */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">Enhanced Resume</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(rewriteData.enhanced_text)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => downloadText(rewriteData.enhanced_text, 'enhanced-resume.txt')}
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        <div className="bg-white rounded p-3 max-h-96 overflow-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {rewriteData.enhanced_text}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Back Button */}
          {onBack && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
