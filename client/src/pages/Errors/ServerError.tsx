import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AlertTriangle className="w-24 h-24 text-red-600 dark:text-red-400 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-red-900 dark:text-red-400 mb-2">
          500
        </h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Server Error
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          Something went wrong on our end. Please try again later.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
