import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PortfolioBuilder from './PortfolioBuilder';
import ResumeGenerator from './ResumeGenerator';
import CoverLetterWriter from './CoverLetterWriter';
import ResumeOptimizer from './ResumeOptimizer';
import MockInterview from './MockInterview';
import CareerCoaching from './CareerCoaching';
import ProfileEdit from './ProfileEdit';
import JobSourceSelection from './JobSourceSelection';
import JobAlerts from './JobAlerts';
import SubscriptionPage from './SubscriptionPage';
import AICallListFilter from './AICallListFilter';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

type DashboardView =
  | 'dashboard'
  | 'portfolio-builder'
  | 'resume-generator'
  | 'cover-letter-writer'
  | 'resume-optimizer'
  | 'mock-interview'
  | 'career-coaching'
  | 'profile-edit'
  | 'job-source-selection'
  | 'job-alerts'
  | 'subscription'
  | 'ai-call-list';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const lastLoginDate = user?.last_login ? new Date(user.last_login) : null;
  const lastLoginDisplay = lastLoginDate
    ? lastLoginDate.toLocaleString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.ANALYTICS_CREDIT_REMAINING);
        setCreditsRemaining(response.data.results.credits_remaining);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  const dashboardSections: Array<{
    title: string;
    description: string;
    actions: Array<{
      view: DashboardView;
      title: string;
      subtitle: string;
      iconBg: string;
      buttonClass: string;
      buttonLabel: string;
      icon: React.ReactNode;
    }>;
  }> = [
    {
      title: 'Create & Optimize',
      description: 'Craft polished career assets with guided AI tools.',
      actions: [
        {
          view: 'portfolio-builder',
          title: 'AI Portfolio Builder',
          subtitle: 'Generate a personal site in minutes.',
          iconBg: 'bg-indigo-500',
          buttonClass: 'text-indigo-600 hover:text-indigo-500',
          buttonLabel: 'Create Portfolio',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
        },
        {
          view: 'resume-generator',
          title: 'AI Resume Generator',
          subtitle: 'Build a standout resume from scratch.',
          iconBg: 'bg-green-500',
          buttonClass: 'text-green-600 hover:text-green-500',
          buttonLabel: 'Generate Resume',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
        },
        {
          view: 'cover-letter-writer',
          title: 'Cover Letter Writer',
          subtitle: 'Personalize every application with ease.',
          iconBg: 'bg-purple-500',
          buttonClass: 'text-purple-600 hover:text-purple-500',
          buttonLabel: 'Write Cover Letter',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ),
        },
        {
          view: 'resume-optimizer',
          title: 'Resume Optimizer',
          subtitle: 'Enhance and benchmark your resume instantly.',
          iconBg: 'bg-orange-500',
          buttonClass: 'text-orange-600 hover:text-orange-500',
          buttonLabel: 'Optimize Resume',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Prepare & Apply',
      description: 'Practice interviews, explore roles, and tailor your search.',
      actions: [
        {
          view: 'mock-interview',
          title: 'Mock Interview',
          subtitle: 'Sharpen your responses with simulated sessions.',
          iconBg: 'bg-red-500',
          buttonClass: 'text-red-600 hover:text-red-500',
          buttonLabel: 'Start Interview',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
        },
        {
          view: 'career-coaching',
          title: 'Career Coaching',
          subtitle: 'Identify strengths and plan your growth roadmap.',
          iconBg: 'bg-purple-500',
          buttonClass: 'text-purple-600 hover:text-purple-500',
          buttonLabel: 'Start Coaching',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
        },
        {
          view: 'job-alerts',
          title: 'Recommended Jobs',
          subtitle: 'Fetch AI-curated roles tailored to you.',
          iconBg: 'bg-yellow-500',
          buttonClass: 'text-yellow-600 hover:text-yellow-500',
          buttonLabel: 'Find Opportunities',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          ),
        },
        {
          view: 'job-source-selection',
          title: 'Job Source Preferences',
          subtitle: 'Fine-tune where we scout opportunities.',
          iconBg: 'bg-teal-500',
          buttonClass: 'text-teal-600 hover:text-teal-500',
          buttonLabel: 'Manage Sources',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Manage & Insights',
      description: 'Keep your profile current and track your usage.',
      actions: [
        {
          view: 'profile-edit',
          title: 'Profile & Settings',
          subtitle: 'Update personal details and professional info.',
          iconBg: 'bg-blue-500',
          buttonClass: 'text-blue-600 hover:text-blue-500',
          buttonLabel: 'Edit Profile',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m-.75-9.053a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
            </svg>
          ),
        },
        {
          view: 'subscription',
          title: 'Subscription Plans',
          subtitle: 'Explore premium features and upgrades.',
          iconBg: 'bg-purple-500',
          buttonClass: 'text-purple-600 hover:text-purple-500',
          buttonLabel: 'View Plans',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          view: 'ai-call-list',
          title: 'AI Call History',
          subtitle: 'Review past AI activity and usage.',
          iconBg: 'bg-indigo-500',
          buttonClass: 'text-indigo-600 hover:text-indigo-500',
          buttonLabel: 'View History',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
      ],
    },
  ];

  if (currentView === 'portfolio-builder') {
    return <PortfolioBuilder onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'resume-generator') {
    return <ResumeGenerator onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'cover-letter-writer') {
    return <CoverLetterWriter onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'resume-optimizer') {
    return <ResumeOptimizer onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'mock-interview') {
    return <MockInterview onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'career-coaching') {
    return <CareerCoaching onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'profile-edit') {
    return <ProfileEdit onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'job-source-selection') {
    return <JobSourceSelection onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'job-alerts') {
    return <JobAlerts onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'subscription') {
    return <SubscriptionPage onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'ai-call-list') {
    return <AICallListFilter onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">PortfolioAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              {creditsRemaining !== null && (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Credits: {creditsRemaining}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-700">
                Welcome, {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={() => setCurrentView('profile-edit')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Portfolio Dashboard</h2>
            
            {/* Quick Actions Sections */}
            <div className="space-y-10 mb-8">
              {dashboardSections.map((section) => (
                <section key={section.title}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.actions.map((action) => (
                      <div
                        key={action.view}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">{action.title}</h4>
                              <p className="mt-1 text-sm text-gray-500">{action.subtitle}</p>
                            </div>
                          </div>
                          <div className="mt-6">
                            <button
                              onClick={() => setCurrentView(action.view)}
                              className={`inline-flex items-center gap-1 font-semibold ${action.buttonClass}`}
                            >
                              {action.buttonLabel}
                              <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                <div className="mt-5">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {lastLoginDate
                                    ? 'You logged in to PortfolioAI successfully.'
                                    : 'Last login information is not available.'}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {lastLoginDate && (
                                  <time dateTime={user?.last_login ?? undefined}>{lastLoginDisplay}</time>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
