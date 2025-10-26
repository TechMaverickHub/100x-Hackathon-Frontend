import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface Question {
  text: string;
  type: string;
  context: string;
}

interface QuestionFeedback {
  question: string;
  answer: string;
  feedback: string;
}

interface InterviewScore {
  overall_score: number;
  strengths: string[];
  areas_to_improve: string[];
  recommendations: string[];
  questions_feedback: QuestionFeedback[];
}

interface MockInterviewProps {
  onBack?: () => void;
}

const MockInterview: React.FC<MockInterviewProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [questionType, setQuestionType] = useState('Technical');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewScore, setInterviewScore] = useState<InterviewScore | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);

  const questionTypes = ['Technical', 'Behavioral', 'Mixed'];

  const generateQuestions = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    try {
      setIsGeneratingQuestions(true);
      const response = await api.post(`/${API_ENDPOINTS.INTERVIEW_GENERATE_QUESTIONS}`, {
        job_description: jobDescription,
        question_type: questionType
      });
      
      const generatedQuestions = response.data.results.questions;
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(''));
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setInterviewScore(null);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const evaluateAnswers = async () => {
    if (answers.some(answer => !answer.trim())) {
      alert('Please answer all questions before evaluating');
      return;
    }

    try {
      setIsEvaluating(true);
      
      // Prepare questions with answers
      const questionsWithAnswers = questions.map((question, index) => ({
        text: question.text,
        type: question.type,
        context: question.context,
        answer: answers[index]
      }));

      const response = await api.post(`/${API_ENDPOINTS.INTERVIEW_ANSWER_QUESTIONS}`, {
        questions: questionsWithAnswers,
        job_description: jobDescription
      });
      
      setInterviewScore(response.data.results.interview_score);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to evaluate answers:', error);
      alert('Failed to evaluate answers. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const updateAnswer = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
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
              <h1 className="text-3xl font-bold text-gray-900">Mock Interview Practice</h1>
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
        {!showResults && (
          <>
            {/* Setup Section */}
            {questions.length === 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Setup</h2>
                
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {questionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={generateQuestions}
                    disabled={isGeneratingQuestions || !jobDescription.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    {isGeneratingQuestions ? 'Generating Questions...' : 'Generate Interview Questions'}
                  </button>
                </div>
              </div>
            )}

            {/* Interview Section */}
            {questions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Card */}
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{currentQuestionIndex + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {questions[currentQuestionIndex]?.text}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {questions[currentQuestionIndex]?.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {questions[currentQuestionIndex]?.context}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => updateAnswer(currentQuestionIndex, e.target.value)}
                    rows={8}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Type your answer here..."
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        onClick={evaluateAnswers}
                        disabled={isEvaluating || answers.some(answer => !answer.trim())}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                      >
                        {isEvaluating ? 'Evaluating...' : 'Submit & Evaluate'}
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                      >
                        Next
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Results Section */}
        {showResults && interviewScore && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Interview Results</h2>
              <button
                onClick={() => {
                  setShowResults(false);
                  setQuestions([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setInterviewScore(null);
                  setShowQuestionFeedback(false);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
              >
                Start New Interview
              </button>
            </div>

            {/* Overall Score */}
            <div className={`${getScoreBgColor(interviewScore.overall_score)} rounded-lg p-6 text-center mb-6`}>
              <div className={`text-4xl font-bold ${getScoreColor(interviewScore.overall_score)} mb-2`}>
                {formatScore(interviewScore.overall_score)}%
              </div>
              <p className="text-gray-600">Overall Interview Score</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">✅ Strengths</h4>
                <ul className="space-y-2">
                  {interviewScore.strengths.map((strength, index) => (
                    <li key={index} className="text-green-700 flex items-start">
                      <span className="mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">⚠️ Areas for Improvement</h4>
                <ul className="space-y-2">
                  {interviewScore.areas_to_improve.map((area, index) => (
                    <li key={index} className="text-red-700 flex items-start">
                      <span className="mr-2">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Recommendations</h4>
              <ul className="space-y-2">
                {interviewScore.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-blue-700 flex items-start">
                    <span className="mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            {/* Question Feedback Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Detailed Question Feedback</h3>
                <button
                  onClick={() => setShowQuestionFeedback(!showQuestionFeedback)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                  {showQuestionFeedback ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showQuestionFeedback && (
                <div className="space-y-4">
                  {interviewScore.questions_feedback.map((feedback, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {feedback.question}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-700 mb-1">Your Answer:</h5>
                        <p className="text-gray-600 bg-white p-3 rounded border text-sm">
                          {feedback.answer}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Feedback:</h5>
                        <p className="text-gray-800 bg-yellow-50 p-3 rounded border text-sm">
                          {feedback.feedback}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default MockInterview;
