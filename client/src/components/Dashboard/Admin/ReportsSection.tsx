import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import toast from 'react-hot-toast';
import { Download, FileText, CheckCircle, Archive } from 'lucide-react';

interface ReportsSectionProps {
  analytics: {
    total_reports: number;
    resolved_reports: number;
    closed_reports: number;
  };
}

export default function ReportsSection({ analytics }: ReportsSectionProps) {
  const handleDownload = (type: string) => {
    toast.success(`${type} report download started!`);
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="mb-0 font-semibold text-lg">Reports & Analytics</h4>
          <p className="text-sm text-slate-500 mb-0">Download detailed reports for your records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.total_reports}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => handleDownload('Total')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>

        {/* Resolved Cases */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Resolved Cases</p>
              <p className="text-3xl font-bold text-emerald-600">{analytics.resolved_reports}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => handleDownload('Resolved')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>

        {/* Closed Cases */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Closed Cases</p>
              <p className="text-3xl font-bold text-slate-600 dark:text-slate-300">{analytics.closed_reports}</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => handleDownload('Closed')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </motion.div>

        {/* Analytics Summary */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-100 dark:border-violet-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Analytics Summary</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {analytics.total_reports > 0 
                  ? `${((analytics.resolved_reports / analytics.total_reports) * 100).toFixed(0)}%`
                  : '0%'} 
                <span className="text-sm font-normal text-slate-500 ml-1">resolved</span>
              </p>
            </div>
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => handleDownload('Analytics')}
          >
            <Download className="w-4 h-4 mr-2" />
            Full Report
          </Button>
        </motion.div>
      </div>
    </GlassCard>
  );
}
