import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL, API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface CoverLetterFormData {
  job_description: string;
  tone: string;
}

interface CoverLetterResponse {
  message: string;
  status: number;
  results: {
    cover_letter: string;
  };
}

interface CoverLetterWriterProps {
  onBack?: () => void;
}

const CoverLetterWriter: React.FC<CoverLetterWriterProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState<CoverLetterFormData>({
    job_description: '',
    tone: 'Professional'
  });

  const toneOptions = [
    'Professional',
    'Friendly',
    'Confident',
    'Creative',
    'Concise'
  ];

  const generateCoverLetter = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post(`/${API_ENDPOINTS.COVER_LETTER_GENERATE}`, formData);
      setGeneratedCoverLetter(response.data.results.cover_letter);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Convert markdown to HTML for rich text copying
      const formattedText = generatedCoverLetter
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      
      // Create a temporary div to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedText;
      
      // Copy as HTML to preserve formatting
      const clipboardData = new ClipboardItem({
        'text/html': new Blob([formattedText], { type: 'text/html' }),
        'text/plain': new Blob([generatedCoverLetter], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardData]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: copy as plain text
      try {
        await navigator.clipboard.writeText(generatedCoverLetter);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = generatedCoverLetter;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const downloadCoverLetter = () => {
    // Convert markdown to HTML for formatted download
    const formattedText = generatedCoverLetter
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    const blob = new Blob([formattedText], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
              <h1 className="text-3xl font-bold text-gray-900">Cover Letter Writer</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Cover Letter</h2>
          
          <div className="space-y-6">
            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={formData.job_description}
                onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                rows={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste the job description here..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Copy and paste the complete job description from the job posting.
              </p>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose the tone that best matches the company culture and your personality.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            {/* Simple Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Not satisfied with the current output?</strong> You can modify your information and generate a new cover letter.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateCoverLetter}
                disabled={isGenerating || !formData.job_description.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Generated Cover Letter Display */}
        {generatedCoverLetter && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Generated Cover Letter</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    copySuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copySuccess ? '✓ Copied!' : 'Copy Cover Letter'}
                </button>
                <button
                  onClick={downloadCoverLetter}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                >
                  Download .html
                </button>
              </div>
            </div>
            
            {/* Cover Letter Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Raw Text */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Raw Text</h3>
                  <span className="text-gray-400 text-sm">
                    {generatedCoverLetter.split('\n').length} lines
                  </span>
                </div>
                <pre className="text-green-400 text-sm overflow-auto max-h-96 bg-black rounded p-3">
                  <code>{generatedCoverLetter}</code>
                </pre>
              </div>
              
              {/* Preview */}
              <div className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-gray-900 font-medium">Preview</h3>
                  <span className="text-gray-400 text-sm">
                    Formatted view
                  </span>
                </div>
                <div className="bg-gray-50 rounded p-3 max-h-96 overflow-auto">
                  <div 
                    className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: generatedCoverLetter
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterWriter;
