import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL, API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface UserProfile {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: {
    pk: number;
    name: string;
  };
  linkedin_url: string | null;
  github_url: string | null;
  resume_file: string | null;
}

interface PortfolioResponse {
  message: string;
  status: number;
  results: {
    html: string;
  };
}

interface QnAFormData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  skills: string[];
  projects: Array<{
    title: string;
    desc: string;
    link: string;
  }>;
  email: string;
  linkedin: string;
  github: string;
}

interface PortfolioBuilderProps {
  onBack?: () => void;
}

const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ onBack }) => {
  const { user, accessToken } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resume' | 'qna' | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qnaFormData, setQnaFormData] = useState<QnAFormData>({
    name: '',
    role: '',
    tagline: '',
    bio: '',
    skills: [],
    projects: [],
    email: '',
    linkedin: '',
    github: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${API_ENDPOINTS.USER_ME}`);
      setUserProfile(response.data.results);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFromResume = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post(`/${API_ENDPOINTS.PORTFOLIO_GENERATE_FROM_RESUME}`);
      setGeneratedHtml(response.data.results.html);
    } catch (error) {
      console.error('Failed to generate portfolio from resume:', error);
      alert('Failed to generate portfolio from resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromQnA = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post(`/${API_ENDPOINTS.PORTFOLIO_GENERATE_FROM_QNA}`, qnaFormData);
      setGeneratedHtml(response.data.results.html);
    } catch (error) {
      console.error('Failed to generate portfolio from Q&A:', error);
      alert('Failed to generate portfolio from Q&A. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addSkill = () => {
    setQnaFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setQnaFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setQnaFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setQnaFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', desc: '', link: '' }]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setQnaFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setQnaFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">AI Portfolio Builder</h1>
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
          {!activeTab && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Portfolio Generation Method</h2>
              <p className="text-gray-600 mb-8">Select how you'd like to generate your portfolio</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate from Resume</h3>
                  <p className="text-gray-600 mb-4">AI will analyze your resume and create a professional portfolio automatically</p>
                  {userProfile?.resume_file ? (
                    <button
                      onClick={() => setActiveTab('resume')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Use Resume
                    </button>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-sm text-yellow-800">
                        No resume file found. Please upload a resume first.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate from Q&A</h3>
                  <p className="text-gray-600 mb-4">Answer questions to create a custom portfolio tailored to your needs</p>
                  <button
                    onClick={() => setActiveTab('qna')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Start Q&A Process
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Portfolio from Resume</h2>
              <p className="text-gray-600 mb-6">
                Your resume file has been detected. Click the button below to generate your portfolio automatically.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800 text-sm">
                    AI will analyze your resume and create a professional portfolio with sections for about, skills, projects, and contact information.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={generateFromResume}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Generate Portfolio'}
                </button>
                <button
                  onClick={() => setActiveTab(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Back to Options
                </button>
              </div>
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={qnaFormData.name}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={qnaFormData.role}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Software Developer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={qnaFormData.tagline}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Building intelligent systems that scale humans"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={qnaFormData.bio}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  {qnaFormData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Skill name"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Add Skill
                  </button>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                  {qnaFormData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Project title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                          <input
                            type="url"
                            value={project.link}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Project URL"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={project.desc}
                            onChange={(e) => updateProject(index, 'desc', e.target.value)}
                            rows={2}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Project description"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                      >
                        Remove Project
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Add Project
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={qnaFormData.email}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={qnaFormData.linkedin}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={qnaFormData.github}
                    onChange={(e) => setQnaFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={generateFromQnA}
                  disabled={isGenerating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Generate Portfolio'}
                </button>
                <button
                  onClick={() => setActiveTab(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Back to Options
                </button>
              </div>
            </div>
          )}

          {/* Generated HTML Display */}
          {generatedHtml && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Portfolio</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* HTML Code */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">HTML Code</h3>
                  <pre className="text-green-400 text-sm overflow-auto max-h-96">
                    <code>{generatedHtml}</code>
                  </pre>
                </div>
                
                {/* Preview */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-gray-900 font-medium mb-3">Preview</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      srcDoc={generatedHtml}
                      className="w-full h-96"
                      title="Portfolio Preview"
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

export default PortfolioBuilder;
