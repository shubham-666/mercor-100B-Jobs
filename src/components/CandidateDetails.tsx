import React from 'react';
import { X, ExternalLink, Mail, Phone, MapPin, Calendar, Star, Briefcase } from 'lucide-react';
import { Candidate } from '../types/candidate';
import { getExperienceLevel, getRoleCategory } from '../utils/scoring';

interface CandidateDetailsProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export const CandidateDetails: React.FC<CandidateDetailsProps> = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const experienceLevel = getExperienceLevel(candidate.experience_years || 0);
  const roleCategory = getRoleCategory(candidate.current_role || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-lg text-gray-600">{candidate.current_role}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {experienceLevel}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {roleCategory}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Score: {candidate.score || 0}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                  {candidate.email}
                </a>
              </div>
              {candidate.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>{candidate.experience_years} years experience</span>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              {candidate.linkedin && (
                <a
                  href={`https://${candidate.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <ExternalLink size={16} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {candidate.portfolio && (
                <a
                  href={`https://${candidate.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <ExternalLink size={16} />
                  <span>Portfolio/GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Details</h3>
            <div className="space-y-3">
              <div>
                <strong className="text-gray-700">Education:</strong>
                <p className="text-gray-600">{candidate.education}</p>
              </div>
              <div>
                <strong className="text-gray-700">Availability:</strong>
                <p className="text-gray-600">{candidate.availability}</p>
              </div>
              <div>
                <strong className="text-gray-700">Salary Expectation:</strong>
                <p className="text-gray-600">{candidate.salary_expectation}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(candidate.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Why Interested */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Why Interested</h3>
            <p className="text-gray-700 leading-relaxed">{candidate.why_interested}</p>
          </div>

          {/* Previous Experience */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Previous Experience</h3>
            <p className="text-gray-700 leading-relaxed">{candidate.previous_experience}</p>
          </div>

          {/* Notes */}
          {candidate.notes && (
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Notes</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-gray-700">{candidate.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};