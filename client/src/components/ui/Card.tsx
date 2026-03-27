import { ReactNode } from 'react'

const Card = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={`rounded-lg border bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700 ${className}`}>
    {children}
  </div>
)

Card.Content = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

Card.Header = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 pt-0 ${className}`}>
    {children}
  </div>
)

Card.Title = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <h3 className={`font-semibold leading-none tracking-tight text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
)

Card.Description = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
)

Card.Footer = ({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
)

export { Card }
