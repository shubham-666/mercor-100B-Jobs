import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterOptions } from '../types/candidate';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableSkills: string[];
  availableLocations: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableSkills,
  availableLocations
}) => {
  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      experienceRange: [0, 20],
      skills: [],
      locations: [],
      sortBy: 'score',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || filters.skills.length > 0 || filters.locations.length > 0 || 
    filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
          >
            <X size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Name, role, skills..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience: {filters.experienceRange[0]}-{filters.experienceRange[1]} years
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="20"
              value={filters.experienceRange[0]}
              onChange={(e) => updateFilters({ 
                experienceRange: [parseInt(e.target.value), filters.experienceRange[1]]
              })}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="20"
              value={filters.experienceRange[1]}
              onChange={(e) => updateFilters({ 
                experienceRange: [filters.experienceRange[0], parseInt(e.target.value)]
              })}
              className="w-full"
            />
          </div>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <select
            multiple
            value={filters.skills}
            onChange={(e) => updateFilters({ 
              skills: Array.from(e.target.selectedOptions, option => option.value)
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size={3}
          >
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            multiple
            value={filters.locations}
            onChange={(e) => updateFilters({ 
              locations: Array.from(e.target.selectedOptions, option => option.value)
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size={3}
          >
            {availableLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="score">Score</option>
            <option value="experience">Experience</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Order:</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => updateFilters({ sortOrder: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};