import React from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  ExternalLink, 
  Check, 
  X,
  Edit3
} from 'lucide-react';
import { Candidate } from '../types/candidate';
import { getExperienceLevel, getRoleCategory } from '../utils/scoring';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (id: string) => void;
  onScore: (id: string, score: number) => void;
  onAddNote: (id: string, note: string) => void;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  onScore,
  onAddNote,
  onViewDetails
}) => {
  const experienceLevel = getExperienceLevel(candidate.experience_years || 0);
  const roleCategory = getRoleCategory(candidate.current_role || '');
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
      candidate.selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.current_role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(candidate.score || 0)}`}>
              {candidate.score || 0}
            </span>
            <button
              onClick={() => onSelect(candidate.id)}
              className={`p-2 rounded-full transition-colors ${
                candidate.selected
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {candidate.selected ? <Check size={16} /> : <User size={16} />}
            </button>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{candidate.experience_years} years</span>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {experienceLevel}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
            {roleCategory}
          </span>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {(candidate.skills || []).slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {(candidate.skills || []).length > 5 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                +{(candidate.skills || []).length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Quick info */}
        <div className="mb-4 text-sm text-gray-600">
          <p className="truncate">
            <strong>Salary:</strong> {candidate.salary_expectation}
          </p>
          <p className="truncate">
            <strong>Available:</strong> {candidate.availability}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            max="100"
            value={candidate.score || 0}
            onChange={(e) => onScore(candidate.id, parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Score"
          />
          <button
            onClick={() => onViewDetails(candidate)}
            className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
          >
            <ExternalLink size={14} />
            <span>Details</span>
          </button>
          <button
            onClick={() => {
              const note = prompt('Add a note about this candidate:', candidate.notes);
              if (note !== null) onAddNote(candidate.id, note);
            }}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Edit3 size={14} />
          </button>
        </div>

        {/* Notes */}
        {candidate.notes && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Notes:</strong> {candidate.notes}
          </div>
        )}
      </div>
    </div>
  );
};