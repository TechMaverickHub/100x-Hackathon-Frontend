import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface SkillsGapResult {
  matched_skills: string[];
  missing_skills: string[];
  gap_score: number;
  match_percent: number;
  summary: string;
  comparative_insight: {
    average_match_percent_for_role: number;
    market_position: string;
    insight: string;
  };
  trend_insight: {
    emerging_skills: string[];
    high_demand_skills: string[];
    insight: string;
  };
  visual_summary: {
    show_progress_bar: boolean;
    color_code: string;
    label: string;
  };
}

interface Course {
  title: string;
  platform: string;
  link: string;
}

interface Blog {
  title: string;
  description: string;
  link: string;
}

interface Repository {
  title: string;
  description: string;
  link: string;
}

interface Project {
  title: string;
  description: string;
}

interface CareerLevel {
  current_level: string;
  target_level: string;
  insight: string;
}

interface CareerRecommendationResult {
  career_paths: string[];
  career_level: CareerLevel;
  recommended_courses: Course[];
  recommended_blogs: Blog[];
  recommended_repos: Repository[];
  recommended_projects: Project[];
  advice: string;
  next_steps: string[];
}

interface CareerCoachingProps {
  onBack?: () => void;
}

const CareerCoaching: React.FC<CareerCoachingProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [skillsGapResult, setSkillsGapResult] = useState<SkillsGapResult | null>(null);
  const [careerRecommendation, setCareerRecommendation] = useState<CareerRecommendationResult | null>(null);
  const [isAnalyzingSkills, setIsAnalyzingSkills] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<'skills' | 'career' | null>(null);

  const analyzeSkillsGap = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    try {
      setIsAnalyzingSkills(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_SKILLS_GAP}`, {
        job_description: jobDescription
      });
      
      setSkillsGapResult(response.data.results);
      setActiveAnalysis('skills');
      setCareerRecommendation(null);
    } catch (error) {
      console.error('Failed to analyze skills gap:', error);
      alert('Failed to analyze skills gap. Please try again.');
    } finally {
      setIsAnalyzingSkills(false);
    }
  };

  const generateCareerRecommendations = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    try {
      setIsGeneratingRecommendations(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_CAREER_RECOMMENDATION}`, {
        job_description: jobDescription
      });
      
      setCareerRecommendation(response.data.results);
      setActiveAnalysis('career');
      setSkillsGapResult(null);
    } catch (error) {
      console.error('Failed to generate career recommendations:', error);
      alert('Failed to generate career recommendations. Please try again.');
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const getVisualSummaryColor = (colorCode: string) => {
    switch (colorCode.toLowerCase()) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getVisualSummaryBgColor = (colorCode: string) => {
    switch (colorCode.toLowerCase()) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'danger':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getVisualSummaryBarColor = (colorCode: string) => {
    switch (colorCode.toLowerCase()) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Career Coaching</h1>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Setup Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Analysis Setup</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste the job description here..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={analyzeSkillsGap}
                disabled={isAnalyzingSkills || !jobDescription.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                {isAnalyzingSkills ? 'Analyzing Skills...' : 'Analyze Skills Gap'}
              </button>
              
              <button
                onClick={generateCareerRecommendations}
                disabled={isGeneratingRecommendations || !jobDescription.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                {isGeneratingRecommendations ? 'Generating...' : 'Get Career Recommendations'}
              </button>
            </div>
          </div>
        </div>

        {/* Skills Gap Analysis Results */}
        {activeAnalysis === 'skills' && skillsGapResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Gap Analysis</h2>
            
            {/* Visual Summary */}
            <div className={`${getVisualSummaryBgColor(skillsGapResult.visual_summary.color_code)} rounded-lg p-6 text-center mb-6`}>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Skill Match</div>
                <div className={`text-4xl font-bold ${getVisualSummaryColor(skillsGapResult.visual_summary.color_code)} mb-2`}>
                  {skillsGapResult.match_percent}%
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {skillsGapResult.summary}
                </p>
              </div>
              
              {/* Progress Bar */}
              {skillsGapResult.visual_summary.show_progress_bar && (
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${getVisualSummaryBarColor(skillsGapResult.visual_summary.color_code)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${skillsGapResult.match_percent}%` }}
                  ></div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {skillsGapResult.visual_summary.label}
              </p>
            </div>

            {/* Summary and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Comparative Insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">📊 Market Position</h4>
                <div className="space-y-2">
                  <p className="text-blue-700 text-sm">
                    <strong>Your Match:</strong> {skillsGapResult.match_percent}%
                  </p>
                  <p className="text-blue-700 text-sm">
                    <strong>Average for Role:</strong> {skillsGapResult.comparative_insight.average_match_percent_for_role}%
                  </p>
                  <p className="text-blue-700 text-sm">
                    <strong>Position:</strong> {skillsGapResult.comparative_insight.market_position}
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    {skillsGapResult.comparative_insight.insight}
                  </p>
                </div>
              </div>

              {/* Trend Insight */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">📈 Market Trends</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-purple-700 text-sm font-medium mb-1">Emerging Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {skillsGapResult.trend_insight.emerging_skills.map((skill, index) => (
                        <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-purple-700 text-sm font-medium mb-1">High Demand:</p>
                    <div className="flex flex-wrap gap-1">
                      {skillsGapResult.trend_insight.high_demand_skills.map((skill, index) => (
                        <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-purple-700 text-sm mt-2">
                    {skillsGapResult.trend_insight.insight}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  ✅ Matched Skills ({skillsGapResult.matched_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsGapResult.matched_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">
                  ❌ Missing Skills ({skillsGapResult.missing_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsGapResult.missing_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career Recommendations Results */}
        {activeAnalysis === 'career' && careerRecommendation && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Recommendations</h2>
            
            {/* Career Level Analysis */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Career Level Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Current Level</h4>
                  <p className="text-blue-600 font-semibold">{careerRecommendation.career_level.current_level}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Target Level</h4>
                  <p className="text-green-600 font-semibold">{careerRecommendation.career_level.target_level}</p>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Insight</h4>
                <p className="text-gray-700">{careerRecommendation.career_level.insight}</p>
              </div>
            </div>

            {/* Career Paths */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Recommended Career Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerRecommendation.career_paths.map((path, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium text-blue-900">{path}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Next Steps</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {careerRecommendation.next_steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </span>
                      <span className="text-green-800">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Recommended Courses</h3>
              <div className="space-y-4">
                {careerRecommendation.recommended_courses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{course.platform}</p>
                      </div>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        View Course
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Blogs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Recommended Blogs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerRecommendation.recommended_blogs.map((blog, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">{blog.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{blog.description}</p>
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read Blog →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Repositories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Recommended Repositories</h3>
              <div className="space-y-4">
                {careerRecommendation.recommended_repos.map((repo, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{repo.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                      </div>
                      <a
                        href={repo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        View Repo
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Projects */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Recommended Projects</h3>
              <div className="space-y-4">
                {careerRecommendation.recommended_projects.map((project, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900 mb-2">{project.title}</h4>
                        <p className="text-purple-700 text-sm">{project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Advice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">💡 Career Advice</h3>
              <p className="text-yellow-700">{careerRecommendation.advice}</p>
            </div>
          </div>
        )}

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
  );
};

export default CareerCoaching;
