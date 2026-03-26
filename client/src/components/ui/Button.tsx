import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
// cn removed - inline classes used

const ButtonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow hover:shadow-lg',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  outline: 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  'outline-primary': 'border border-blue-600 hover:border-blue-700 bg-white hover:bg-blue-50 text-blue-700',
  'outline-secondary': 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700',
  'outline-danger': 'border border-red-600 hover:border-red-700 bg-white hover:bg-red-50 text-red-700',
} as const

type ButtonVariant = keyof typeof ButtonVariants

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'lg'
  children: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, children, loading = false, disabled, fullWidth = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center'
    
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-5 py-2 text-sm'
    
    const widthClasses = fullWidth ? 'w-full' : 'inline-flex'
    
    return (
      <button
        className={`${baseClasses} ${ButtonVariants[variant]} ${sizeClasses} ${widthClasses} ${className || ''} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
