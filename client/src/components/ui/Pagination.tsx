import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  className
}: PaginationProps) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...', ...range);
    } else {
      rangeWithDots.push(...range);
    }

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(...range.slice(-2));
    }

    return [1, ...rangeWithDots.filter(p => p !== 1 && p !== totalPages && p !== '...'), totalPages].filter(Boolean);
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex items-center justify-center gap-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-xl',
        className
      )}
    >
      {/* Info */}
      {totalItems && (
        <div className="hidden md:block text-white/70 text-sm mr-4 font-medium">
          Page {currentPage} of {Math.ceil(totalPages)} • {totalItems} total results
        </div>
      )}

      {/* Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 p-0 rounded-xl border-white/30 hover:border-indigo-400 shadow-lg"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        page === '...' ? (
          <motion.div
            key={`dots-${index}`}
            className="px-3 py-2 text-white/50 font-medium"
          >
            ...
          </motion.div>
        ) : (
          <motion.button
            key={`page-${page}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Number(page))}
            className={cn(
              'relative h-10 w-10 rounded-xl font-semibold shadow-lg border-2 transition-all duration-200 flex items-center justify-center',
              currentPage === page
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-indigo-500/25 shadow-lg'
                : hoveredPage === page
                  ? 'bg-white/20 border-white/30 text-white hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:-translate-y-0.5'
            )}
            onMouseEnter={() => setHoveredPage(Number(page))}
            onMouseLeave={() => setHoveredPage(null)}
          >
            {page}
          </motion.button>
        )
      ))}

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 p-0 rounded-xl border-white/30 hover:border-indigo-400 shadow-lg"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

