import React from 'react';
import { Users, Download, MessageCircle } from 'lucide-react';
import { Candidate } from '../types/candidate';

interface SelectedTeamProps {
  selectedCandidates: Candidate[];
  onGenerateReport: () => void;
}

export const SelectedTeam: React.FC<SelectedTeamProps> = ({ 
  selectedCandidates, 
  onGenerateReport 
}) => {
  const totalScore = selectedCandidates.reduce((sum, candidate) => sum + (candidate.score || 0), 0);
  const averageScore = selectedCandidates.length > 0 ? totalScore / selectedCandidates.length : 0;

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('engineer') || roleLower.includes('developer')) return 'bg-blue-100 text-blue-800';
    if (roleLower.includes('manager') || roleLower.includes('director')) return 'bg-purple-100 text-purple-800';
    if (roleLower.includes('product')) return 'bg-green-100 text-green-800';
    if (roleLower.includes('design')) return 'bg-pink-100 text-pink-800';
    if (roleLower.includes('data')) return 'bg-orange-100 text-orange-800';
    if (roleLower.includes('sales')) return 'bg-red-100 text-red-800';
    if (roleLower.includes('marketing')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users size={24} className="text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Your Selected Team</h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {selectedCandidates.length}/5
          </span>
        </div>
        {selectedCandidates.length > 0 && (
          <button
            onClick={onGenerateReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Generate Report</span>
          </button>
        )}
      </div>

      {selectedCandidates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No candidates selected yet</p>
          <p className="text-sm">Click the user icon on candidate cards to select them</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{selectedCandidates.length}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {new Set(selectedCandidates.map(c => c.gender)).size}
              </div>
              <div className="text-sm text-gray-600">Gender Groups</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(selectedCandidates.map(c => c.location?.split(',')[1]?.trim())).size}
              </div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
          </div>

          {/* Selected Candidates List */}
          <div className="space-y-3">
            {selectedCandidates
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((candidate, index) => (
              <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(candidate.current_role || '')}`}>
                        {candidate.current_role}
                      </span>
                      <span className="text-sm text-gray-600">{candidate.experience_years} years</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">#{index + 1}</div>
                  <div className="text-sm text-gray-600">Score: {candidate.score}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedCandidates.length < 5 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  You need to select {5 - selectedCandidates.length} more candidate(s) to complete your team
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};