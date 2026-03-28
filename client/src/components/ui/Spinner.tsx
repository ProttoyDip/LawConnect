interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'navy';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const colorClasses = {
  default: 'border-navy-800 dark:border-slate-200',
  navy: 'border-navy-800 dark:border-navy-400',
};

export function Spinner({ className = '', size = 'md', color = 'default' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-4 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

