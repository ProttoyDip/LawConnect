import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react' // If available, else use SVG

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

interface ModalProps {
  show: boolean
  onHide: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  centered?: boolean
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ show, onHide, title, size = 'md', className = '', centered = true, children, footer }: ModalProps) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  if (!show) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onHide} />
        
        <div className={cn('relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full', sizeClasses[size], centered ? 'sm:items-center' : '', className)}>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                {title && (
                  <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                    {title}
                  </h3>
                )}
                <div>{children}</div>
              </div>
            </div>
          </div>
          
          {footer && (
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {footer}
            </div>
          )}
          
          <button
            onClick={onHide}
            className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

