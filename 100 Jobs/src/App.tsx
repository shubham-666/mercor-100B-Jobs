import React, { useState, useEffect, useMemo } from 'react';
import { Users, FileText, TrendingUp, Search } from 'lucide-react';
import { Candidate, FilterOptions } from './types/candidate';
import { mockCandidates } from './data/mockCandidates';
import { calculateCandidateScore } from './utils/scoring';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetails } from './components/CandidateDetails';
import { FilterPanel } from './components/FilterPanel';
import { DiversityPanel } from './components/DiversityPanel';
import { SelectedTeam } from './components/SelectedTeam';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    experienceRange: [0, 20],
    skills: [],
    locations: [],
    sortBy: 'score',
    sortOrder: 'desc'
  });
  const [activeTab, setActiveTab] = useState<'candidates' | 'team' | 'diversity'>('candidates');

  // Initialize candidates with calculated scores
  useEffect(() => {
    const candidatesWithScores = mockCandidates.map(candidate => ({
      ...candidate,
      score: calculateCandidateScore(candidate)
    }));
    setCandidates(candidatesWithScores);
  }, []);

  // Get available filter options
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    candidates.forEach(candidate => {
      candidate.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [candidates]);

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    candidates.forEach(candidate => {
      if (candidate.location) {
        locations.add(candidate.location);
      }
    });
    return Array.from(locations).sort();
  }, [candidates]);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          candidate.name,
          candidate.current_role,
          candidate.location,
          ...(candidate.skills || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Experience range filter
      const experience = candidate.experience_years || 0;
      if (experience < filters.experienceRange[0] || experience > filters.experienceRange[1]) {
        return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasRequiredSkill = filters.skills.some(skill => 
          candidate.skills?.includes(skill)
        );
        if (!hasRequiredSkill) {
          return false;
        }
      }

      // Location filter
      if (filters.locations.length > 0) {
        if (!candidate.location || !filters.locations.includes(candidate.location)) {
          return false;
        }
      }

      return true;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'experience':
          aValue = a.experience_years || 0;
          bValue = b.experience_years || 0;
          break;
        case 'score':
        default:
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [candidates, filters]);

  const selectedCandidates = candidates.filter(candidate => candidate.selected);

  const handleSelectCandidate = (id: string) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === id) {
        // Don't allow selecting more than 5 candidates
        const currentlySelected = prev.filter(c => c.selected).length;
        if (!candidate.selected && currentlySelected >= 5) {
          alert('You can only select up to 5 candidates for your team.');
          return candidate;
        }
        return { ...candidate, selected: !candidate.selected };
      }
      return candidate;
    }));
  };

  const handleScoreCandidate = (id: string, score: number) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === id ? { ...candidate, score: Math.max(0, Math.min(100, score)) } : candidate
    ));
  };

  const handleAddNote = (id: string, note: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === id ? { ...candidate, notes: note } : candidate
    ));
  };

  const handleGenerateReport = () => {
    if (selectedCandidates.length === 0) {
      alert('Please select some candidates first.');
      return;
    }

    const report = selectedCandidates.map((candidate, index) => ({
      rank: index + 1,
      name: candidate.name,
      role: candidate.current_role,
      score: candidate.score,
      experience: candidate.experience_years,
      key_skills: candidate.skills?.slice(0, 3).join(', '),
      justification: `Strong candidate with ${candidate.experience_years} years of experience. Key strengths: ${candidate.skills?.slice(0, 2).join(', ')}. ${candidate.notes || 'No additional notes.'}`
    }));

    console.log('Hiring Report:', report);
    
    // Create downloadable report
    const reportText = [
      '100B JOBS - HIRING REPORT',
      '=' .repeat(40),
      `Generated: ${new Date().toLocaleDateString()}`,
      `Total Candidates Reviewed: ${candidates.length}`,
      `Selected for Team: ${selectedCandidates.length}`,
      '',
      'SELECTED TEAM MEMBERS:',
      '-'.repeat(25),
      ...report.map(member => 
        `${member.rank}. ${member.name}\n   Role: ${member.role}\n   Score: ${member.score}\n   Experience: ${member.experience} years\n   Key Skills: ${member.key_skills}\n   Justification: ${member.justification}\n`
      )
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiring-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'candidates' as const, label: 'Candidates', icon: Users, count: filteredCandidates.length },
    { id: 'team' as const, label: 'Selected Team', icon: FileText, count: selectedCandidates.length },
    { id: 'diversity' as const, label: 'Diversity', icon: TrendingUp, count: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">100B Jobs</h1>
                <p className="text-sm text-gray-600">Hiring Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{candidates.length}</span> candidates reviewed
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{selectedCandidates.length}</span>/5 selected
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'candidates' && (
          <>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              availableSkills={availableSkills}
              availableLocations={availableLocations}
            />
            
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={handleSelectCandidate}
                    onScore={handleScoreCandidate}
                    onAddNote={handleAddNote}
                    onViewDetails={setSelectedCandidate}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'team' && (
          <SelectedTeam
            selectedCandidates={selectedCandidates}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {activeTab === 'diversity' && (
          <DiversityPanel
            selectedCandidates={selectedCandidates}
            allCandidates={candidates}
          />
        )}
      </main>

      {/* Candidate Details Modal */}
      <CandidateDetails
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}

export default App;