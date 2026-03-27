import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export default function Stepper({ steps, currentStep, onNext, onPrevious, onComplete }: StepperProps) {
  const canGoNext = currentStep < steps.length - 1;
  const canGoBack = currentStep > 0;

  return (
    <div className="w-full">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex-1 flex items-center space-x-2">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <motion.div
                key={`step-${index}`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: index === currentStep ? 1.2 : 1, 
                  opacity: index <= currentStep ? 1 : 0.4 
                }}
                className="relative"
              >
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border-4 transition-all duration-300
                  ${index === currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 shadow-indigo-500/25' 
                    : index < currentStep 
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-emerald-500/25' 
                      : 'bg-white/10 border-white/30'
                  }
                `}>
                  <Circle className="w-5 h-5 text-white/90" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-1/2 -translate-y-1/2 left-12 w-16 h-1 rounded-full
                    ${index < currentStep ? 'bg-emerald-500' : 'bg-white/20'}
                  `} />
                )}
              </motion.div>
              {index < steps.length - 1 && <div />}
            </div>
          ))}
        </div>
        
        {/* Step Info */}
        <div className="text-right ml-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-1">
            Step {currentStep + 1}
          </div>
          <div className="text-white/70 font-medium">
            {steps[currentStep]?.title}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
            ${canGoBack 
              ? 'bg-white/20 border border-white/30 hover:bg-white/30 text-white hover:shadow-xl hover:-translate-y-0.5' 
              : 'bg-white/10 border border-white/20 text-white/50 cursor-not-allowed opacity-50'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="text-sm text-white/60 font-medium">
            {currentStep + 1} of {steps.length}
          </div>
          
          {canGoNext ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-1 transition-all duration-200"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-200"
            >
              Complete
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

