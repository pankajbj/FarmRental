import React, { useState, useCallback } from 'react';
import Slider from 'react-slider';

/**
 * FarmFilterSidebar Component
 * Highly performant filter sidebar for farm search with debounced API calls
 */
const FarmFilterSidebar = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    acreageRange: [5, 500],
    waterAvailability: [],
    landSuitability: [],
    budgetRange: [0, 100000],
  });

  const [debounceTimer, setDebounceTimer] = useState(null);

  // Debounced filter application (400ms)
  const applyFiltersDebounced = useCallback((updatedFilters) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      onApplyFilters(updatedFilters);
    }, 400);

    setDebounceTimer(timer);
  }, [debounceTimer, onApplyFilters]);

  // Handle acreage range change
  const handleAcreageChange = (newRange) => {
    const updated = { ...filters, acreageRange: newRange };
    setFilters(updated);
    applyFiltersDebounced(updated);
  };

  // Handle water availability toggle
  const handleWaterAvailabilityChange = (option) => {
    const updated = {
      ...filters,
      waterAvailability: filters.waterAvailability.includes(option)
        ? filters.waterAvailability.filter(item => item !== option)
        : [...filters.waterAvailability, option]
    };
    setFilters(updated);
    applyFiltersDebounced(updated);
  };

  // Handle land suitability toggle
  const handleLandSuitabilityChange = (option) => {
    const updated = {
      ...filters,
      landSuitability: filters.landSuitability.includes(option)
        ? filters.landSuitability.filter(item => item !== option)
        : [...filters.landSuitability, option]
    };
    setFilters(updated);
    applyFiltersDebounced(updated);
  };

  // Handle budget range change
  const handleBudgetChange = (newRange) => {
    const updated = { ...filters, budgetRange: newRange };
    setFilters(updated);
    applyFiltersDebounced(updated);
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Farm Filters</h2>

      {/* Acreage Range Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">🌾</span> Acreage
        </h3>
        <Slider
          min={5}
          max={500}
          step={5}
          value={filters.acreageRange}
          onChange={handleAcreageChange}
          className="range-slider"
        />
        <p className="text-sm text-gray-600">
          {filters.acreageRange[0]} - {filters.acreageRange[1]} acres
        </p>
      </div>

      {/* Water Availability Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">💧</span> Water Availability
        </h3>
        <div className="space-y-2">
          {['Borewell', 'River/Canal', 'Rainfall'].map(option => (
            <label key={option} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.waterAvailability.includes(option)}
                onChange={() => handleWaterAvailabilityChange(option)}
                className="w-5 h-5 text-green-600 rounded"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Land Suitability Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">🚜</span> Land Suitability
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Organic', 'Livestock', 'Greenhouses', 'Cash Crops'].map(option => (
            <button
              key={option}
              onClick={() => handleLandSuitabilityChange(option)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.landSuitability.includes(option)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range Filter */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">💰</span> Monthly Budget
        </h3>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={filters.budgetRange}
          onChange={handleBudgetChange}
          className="range-slider"
        />
        <p className="text-sm text-gray-600">
          ₹{filters.budgetRange[0].toLocaleString()} - ₹{filters.budgetRange[1].toLocaleString()}
        </p>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={() => {
          const resetFilters = {
            acreageRange: [5, 500],
            waterAvailability: [],
            landSuitability: [],
            budgetRange: [0, 100000],
          };
          setFilters(resetFilters);
          onApplyFilters(resetFilters);
        }}
        className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FarmFilterSidebar;
