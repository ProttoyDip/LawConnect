import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  totalReports: number;
  resolvedReports: number;
  investigating: number;
  pending: number;
}

const COLORS = {
  category: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'],
  priority: {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  },
};

export default function AnalyticsCharts({
  byCategory,
  byPriority,
  totalReports,
  resolvedReports,
  investigating,
  pending,
}: AnalyticsChartsProps) {
  const statusChartRef = useRef<HTMLDivElement | null>(null);
  const priorityChartRef = useRef<HTMLDivElement | null>(null);
  const categoryChartRef = useRef<HTMLDivElement | null>(null);
  const [statusChartReady, setStatusChartReady] = useState(false);
  const [priorityChartReady, setPriorityChartReady] = useState(false);
  const [categoryChartReady, setCategoryChartReady] = useState(false);

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    const watch = (
      ref: MutableRefObject<HTMLDivElement | null>,
      setter: Dispatch<SetStateAction<boolean>>
    ) => {
      const element = ref.current;
      if (!element) {
        return;
      }
      const updateReady = () => {
        setter(element.clientWidth > 0 && element.clientHeight > 0);
      };
      updateReady();
      const observer = new ResizeObserver(updateReady);
      observer.observe(element);
      observers.push(observer);
    };

    watch(statusChartRef, setStatusChartReady);
    watch(priorityChartRef, setPriorityChartReady);
    watch(categoryChartRef, setCategoryChartReady);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Prepare category data for pie chart
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Prepare priority data for bar chart
  const priorityData = Object.entries(byPriority).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: COLORS.priority[name as keyof typeof COLORS.priority] || '#94a3b8',
  }));

  // Status distribution for pie chart
  const statusData = [
    { name: 'Resolved', value: resolvedReports, color: '#10b981' },
    { name: 'Investigating', value: investigating, color: '#3b82f6' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-slate-500">
            Count: <span className="font-medium text-slate-700 dark:text-slate-300">{payload[0].value}</span>
          </p>
          {totalReports > 0 && (
            <p className="text-sm text-slate-500">
              Percentage: <span className="font-medium text-slate-700 dark:text-slate-300">
                {((payload[0].value / totalReports) * 100).toFixed(1)}%
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="mb-0 font-semibold text-lg">Status Distribution</h4>
              <p className="text-sm text-slate-500 mb-0">Cases by current status</p>
            </div>
          </div>

          <div ref={statusChartRef} className="h-64 min-w-0">
            {statusData.length > 0 && statusChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {statusData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
                <p className="text-xs text-slate-500">{item.name}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Priority Distribution Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="mb-0 font-semibold text-lg">Priority Distribution</h4>
              <p className="text-sm text-slate-500 mb-0">Cases by priority level</p>
            </div>
          </div>

          <div ref={priorityChartRef} className="h-64 min-w-0">
            {priorityData.length > 0 && priorityChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <BarChart data={priorityData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 6, 6, 0]}
                    maxBarSize={32}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {Object.entries(COLORS.priority).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2"
      >
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="mb-0 font-semibold text-lg">Category Breakdown</h4>
              <p className="text-sm text-slate-500 mb-0">Distribution of reports by crime category</p>
            </div>
          </div>

          <div ref={categoryChartRef} className="h-72 min-w-0">
            {categoryData.length > 0 && categoryChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
                <BarChart data={categoryData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.category[index % COLORS.category.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS.category[index % COLORS.category.length] }} 
                />
                <span className="text-xs text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
