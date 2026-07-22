import { useState, useEffect } from 'react';

const CATEGORIES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Electric', 'Hybrid'];

export default function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  function handleChange(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : (key === 'minPrice' || key === 'maxPrice') ? Number(value) : value,
    }));
  }

  function handleReset() {
    setFilters({});
    onSearch({});
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="card p-4 mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-make-input"
            type="text"
            placeholder="Search by make (e.g. Toyota)..."
            value={filters.make ?? ''}
            onChange={(e) => handleChange('make', e.target.value)}
            className="input pl-9"
          />
        </div>
        <button
          id="toggle-filters-btn"
          onClick={() => setShowFilters((v) => !v)}
          className={`btn-secondary gap-1.5 ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
        </button>
        {hasFilters && (
          <button id="clear-filters-btn" onClick={handleReset} className="btn-secondary">Clear</button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 animate-slide-up">
          <div>
            <label className="label">Model</label>
            <input id="filter-model-input" type="text" placeholder="e.g. Camry" value={filters.model ?? ''} onChange={(e) => handleChange('model', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Category</label>
            <select id="filter-category-select" value={filters.category ?? ''} onChange={(e) => handleChange('category', e.target.value)} className="input">
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Min Price ($)</label>
            <input id="filter-min-price-input" type="number" placeholder="0" min={0} value={filters.minPrice ?? ''} onChange={(e) => handleChange('minPrice', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Max Price ($)</label>
            <input id="filter-max-price-input" type="number" placeholder="Any" min={0} value={filters.maxPrice ?? ''} onChange={(e) => handleChange('maxPrice', e.target.value)} className="input" />
          </div>
        </div>
      )}
    </div>
  );
}
