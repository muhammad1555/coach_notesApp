import React from 'react';

const FilterBar = ({ searchTerm, setSearchTerm, filterType, setFilterType, sortBy, setSortBy }) => {
  const filterOptions = [
    { value: 'all', label: 'All Players' },
    { value: 'missing-notes', label: 'Missing Notes (30+ days)' },
    { value: 'recent-notes', label: 'Recent Notes' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'recent-note', label: 'Recent Note' },
    { value: 'oldest-note', label: 'Oldest Note' },
    { value: 'position', label: 'Position' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-base font-semibold text-gray-900">Filter & Search</h2>
        {(searchTerm || filterType !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by status</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
