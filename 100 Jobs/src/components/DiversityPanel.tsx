import React from 'react';
import { Users, TrendingUp, BarChart3 } from 'lucide-react';
import { DiversityMetrics, Candidate } from '../types/candidate';

interface DiversityPanelProps {
  selectedCandidates: Candidate[];
  allCandidates: Candidate[];
}

export const DiversityPanel: React.FC<DiversityPanelProps> = ({ 
  selectedCandidates, 
  allCandidates 
}) => {
  const calculateMetrics = (candidates: Candidate[]): DiversityMetrics => {
    const metrics: DiversityMetrics = {
      gender: {},
      experienceLevel: {},
      location: {}
    };

    candidates.forEach(candidate => {
      // Gender diversity
      const gender = candidate.gender || 'Unknown';
      metrics.gender[gender] = (metrics.gender[gender] || 0) + 1;

      // Experience level diversity
      const exp = candidate.experience_years || 0;
      let level = 'Junior (0-2 years)';
      if (exp > 10) level = 'Principal/Executive (10+ years)';
      else if (exp > 5) level = 'Senior (6-10 years)';
      else if (exp > 2) level = 'Mid-level (3-5 years)';
      
      metrics.experienceLevel[level] = (metrics.experienceLevel[level] || 0) + 1;

      // Location diversity
      const location = candidate.location?.split(',')[1]?.trim() || 'Unknown';
      metrics.location[location] = (metrics.location[location] || 0) + 1;
    });

    return metrics;
  };

  const selectedMetrics = calculateMetrics(selectedCandidates);
  const totalMetrics = calculateMetrics(allCandidates);

  const MetricCard = ({ 
    title, 
    icon, 
    data, 
    totalData, 
    colorClass 
  }: { 
    title: string;
    icon: React.ReactNode;
    data: Record<string, number>;
    totalData: Record<string, number>;
    colorClass: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => {
          const percentage = selectedCandidates.length > 0 ? (value / selectedCandidates.length * 100) : 0;
          const totalPercentage = totalData[key] ? (totalData[key] / allCandidates.length * 100) : 0;
          
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{key}</span>
                <span className="font-medium">{value} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Pool average: {totalPercentage.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp size={24} className="text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Diversity Metrics</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {selectedCandidates.length}/5 Selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Gender Diversity"
          icon={<Users size={20} className="text-white" />}
          data={selectedMetrics.gender}
          totalData={totalMetrics.gender}
          colorClass="bg-purple-500"
        />
        
        <MetricCard
          title="Experience Level"
          icon={<BarChart3 size={20} className="text-white" />}
          data={selectedMetrics.experienceLevel}
          totalData={totalMetrics.experienceLevel}
          colorClass="bg-green-500"
        />
        
        <MetricCard
          title="Geographic Distribution"
          icon={<Users size={20} className="text-white" />}
          data={selectedMetrics.location}
          totalData={totalMetrics.location}
          colorClass="bg-orange-500"
        />
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Diversity Recommendations</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {selectedCandidates.length < 5 && (
            <li>• You have {5 - selectedCandidates.length} more positions to fill</li>
          )}
          {Object.keys(selectedMetrics.gender).length === 1 && (
            <li>• Consider adding candidates of different genders for better diversity</li>
          )}
          {Object.keys(selectedMetrics.experienceLevel).length < 3 && (
            <li>• Mix of experience levels (junior, mid, senior) can strengthen the team</li>
          )}
          {Object.keys(selectedMetrics.location).length === 1 && (
            <li>• Geographic diversity can bring different perspectives and market insights</li>
          )}
        </ul>
      </div>
    </div>
  );
};