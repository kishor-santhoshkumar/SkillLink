import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, Star, X } from 'lucide-react';
import { searchWorkers, getAvailableTrades } from '../../services/api';
import WorkerCard from '../../components/WorkerCard';

const SearchWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    trade: '',
    location: '',
    min_experience: '',
    availability: '',
    own_tools: undefined,
    own_vehicle: undefined,
    min_rating: '',
    limit: 50,
  });

  useEffect(() => {
    loadTrades();
    performSearch();
  }, []);

  const loadTrades = async () => {
    try {
      const data = await getAvailableTrades();
      setTrades(data);
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      // Clean filters - remove empty values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await searchWorkers(cleanFilters);
      setWorkers(data);
    } catch (error) {
      console.error('Error searching workers:', error);
      alert('Failed to search workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const clearFilters = () => {
    setFilters({
      trade: '',
      location: '',
      min_experience: '',
      availability: '',
      own_tools: undefined,
      own_vehicle: undefined,
      min_rating: '',
      limit: 50,
    });
    setTimeout(() => performSearch(), 100);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== undefined).length - 1; // -1 for limit

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">Search Workers</h1>
        <p className="text-slate-600">Find skilled workers for your projects</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Search by location (city, district, state)..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors relative"
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#2563EB] text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1F3A5F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1F3A5F]">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-[#2563EB] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Trade */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade
              </label>
              <select
                value={filters.trade}
                onChange={(e) => handleFilterChange('trade', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">All Trades</option>
                {trades.map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Min. Experience (years)
              </label>
              <input
                type="number"
                value={filters.min_experience}
                onChange={(e) => handleFilterChange('min_experience', e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="e.g., 5"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="weekends">Weekends</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Min. Rating
              </label>
              <select
                value={filters.min_rating}
                onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Own Tools */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Own Tools
              </label>
              <select
                value={filters.own_tools === undefined ? '' : filters.own_tools}
                onChange={(e) => handleFilterChange('own_tools', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Own Vehicle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Own Vehicle
              </label>
              <select
                value={filters.own_vehicle === undefined ? '' : filters.own_vehicle}
                onChange={(e) => handleFilterChange('own_vehicle', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-slate-600">
          {loading ? 'Searching...' : `Found ${workers.length} worker${workers.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Searching for workers...</p>
          </div>
        </div>
      ) : workers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No workers found</h3>
          <p className="text-slate-500 mb-4">
            Try adjusting your filters or search criteria
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1F3A5F] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWorkers;
