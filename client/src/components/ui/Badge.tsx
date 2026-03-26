// cn removed - inline classes used

const BadgeVariants = {
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
} as const

type BadgeVariant = keyof typeof BadgeVariants

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = 'secondary', className = '', children }: BadgeProps) {
  return (
    <span 
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${BadgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

