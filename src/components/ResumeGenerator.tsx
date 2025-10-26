import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL, API_ENDPOINTS } from '../constants';
import api from '../services/api';

interface Skill {
  skill: string;
  weight: number;
}

interface SoftSkill {
  skill: string;
}

interface Skills {
  technical: Skill[];
  soft: SoftSkill[];
}

interface Project {
  title: string;
  desc: string;
  link: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  desc: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface ResumeFormData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  skills: Skills;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
}

interface ResumeResponse {
  message: string;
  status: number;
  results: {
    resume: string;
  };
}

interface ResumeGeneratorProps {
  onBack?: () => void;
}

const ResumeGenerator: React.FC<ResumeGeneratorProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ResumeFormData>({
    name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    role: '',
    tagline: '',
    bio: '',
    skills: {
      technical: [{ skill: '', weight: 5 }],
      soft: [{ skill: '' }]
    },
    projects: [],
    experience: [],
    education: [],
    email: user?.email || '',
    linkedin: '',
    github: '',
    twitter: ''
  });

  const generateResume = async () => {
    try {
      setIsGenerating(true);
      const response = await api.post(`/${API_ENDPOINTS.RESUME_GENERATE}`, formData);
      setGeneratedResume(response.data.results.resume);
    } catch (error) {
      console.error('Failed to generate resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addTechnicalSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: [...prev.skills.technical, { skill: '', weight: 5 }]
      }
    }));
  };

  const updateTechnicalSkill = (index: number, field: 'skill' | 'weight', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: prev.skills.technical.map((skill, i) => 
          i === index ? { ...skill, [field]: value } : skill
        )
      }
    }));
  };

  const removeTechnicalSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: prev.skills.technical.filter((_, i) => i !== index)
      }
    }));
  };

  const addSoftSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        soft: [...prev.skills.soft, { skill: '' }]
      }
    }));
  };

  const updateSoftSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        soft: prev.skills.soft.map((skill, i) => 
          i === index ? { ...skill, skill: value } : skill
        )
      }
    }));
  };

  const removeSoftSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        soft: prev.skills.soft.filter((_, i) => i !== index)
      }
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', desc: '', link: '' }]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', desc: '' }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
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
              <h1 className="text-3xl font-bold text-gray-900">AI Resume Generator</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Software Developer / AI Engineer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Building intelligent systems that scale humans"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief description about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
              {formData.skills.technical.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => updateTechnicalSkill(index, 'skill', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Skill name"
                  />
                  <select
                    value={skill.weight}
                    onChange={(e) => updateTechnicalSkill(index, 'weight', parseInt(e.target.value))}
                    className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                  <button
                    onClick={() => removeTechnicalSkill(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addTechnicalSkill}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Add Technical Skill
              </button>
            </div>

            {/* Soft Skills */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h3>
              {formData.skills.soft.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => updateSoftSkill(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Skill name"
                  />
                  <button
                    onClick={() => removeSoftSkill(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addSoftSkill}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Add Soft Skill
              </button>
            </div>

            {/* Projects */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
              {formData.projects.map((project, index) => (
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

            {/* Experience */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2023-2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={exp.desc}
                        onChange={(e) => updateExperience(index, 'desc', e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Job description"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Add Experience
              </button>
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., M.Tech CS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., IIT XYZ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2023"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeEducation(index)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    Remove Education
                  </button>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Add Education
              </button>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://x.com/yourusername"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={generateResume}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Resume'}
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

        {/* Generated Resume Display */}
        {generatedResume && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Resume</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LaTeX Code */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">LaTeX Code</h3>
                <pre className="text-green-400 text-sm overflow-auto max-h-96">
                  <code>{generatedResume}</code>
                </pre>
              </div>
              
              {/* Preview */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-gray-900 font-medium mb-3">Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-4 text-center text-gray-600">
                    <p className="text-sm">LaTeX Preview</p>
                    <p className="text-xs mt-2">Copy the LaTeX code and compile it to see the formatted resume</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeGenerator;
