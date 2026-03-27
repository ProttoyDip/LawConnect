import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter,
  X 
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'status' | 'category' | 'priority';
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  statusOptions: FilterOption[];
  categoryOptions: FilterOption[];
  priorityOptions: FilterOption[];
  className?: string;
}

export default function SearchFilter({
  onSearch,
  onFilterChange,
  statusOptions,
  categoryOptions,
  priorityOptions,
  className
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const toggleFilter = useCallback((type: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[type] || [];
      const newFilters = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const newActive = { ...prev, [type]: newFilters };
      if (newFilters.length === 0) {
        delete newActive[type];
      }
      
      onFilterChange(newActive);
      return newActive;
    });
  }, [onFilterChange]);

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
    setShowFilters(false);
  };

  const filterCount = Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0);

  const allOptions = [...statusOptions, ...categoryOptions, ...priorityOptions];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl', className)}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports by title, location..."
          className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 text-lg"
        />
        {searchQuery && (
          <motion.button
            type="button"
            whileHover={{ scale: 0.95 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white"
            onClick={() => {
              setSearchQuery('');
              onSearch('');
            }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </form>

      {/* Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white/90 font-medium mb-6 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Filter className="w-4 h-4" />
        Filters ({filterCount})
      </motion.button>

      {/* Active Filters Chips */}
      <AnimatePresence>
        {filterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {Object.entries(activeFilters).map(([type, values]) =>
              values.map(value => (
                <Badge 
                  key={`${type}-${value}`} 
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white/90 group hover:bg-white/30 transition-all"
                >
                  {value}
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleFilter(type, value)}
                    className="ml-1 p-0.5 -mr-1 group-hover:opacity-100 opacity-0 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </Badge>
              ))
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white font-medium"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10"
          >
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" /> Status
              </h4>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFilter('status', option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-white/10 border border-transparent hover:border-white/30',
                      activeFilters.status?.includes(option.value) && 'bg-indigo-500/20 border-indigo-500/50 !font-semibold shadow-lg'
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', activeFilters.status?.includes(option.value) ? 'bg-indigo-400' : 'bg-white/30')} />
                    <span className="text-white/90">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" /> Category
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categoryOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFilter('category', option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-white/10 border border-transparent hover:border-white/30',
                      activeFilters.category?.includes(option.value) && 'bg-indigo-500/20 border-indigo-500/50 !font-semibold shadow-lg'
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', activeFilters.category?.includes(option.value) ? 'bg-indigo-400' : 'bg-white/30')} />
                    <span className="text-white/90">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" /> Priority
              </h4>
              <div className="space-y-2">
                {priorityOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFilter('priority', option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-white/10 border border-transparent hover:border-white/30',
                      activeFilters.priority?.includes(option.value) && 'bg-indigo-500/20 border-indigo-500/50 !font-semibold shadow-lg'
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', activeFilters.priority?.includes(option.value) ? 'bg-indigo-400' : 'bg-white/30')} />
                    <span className="text-white/90">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

