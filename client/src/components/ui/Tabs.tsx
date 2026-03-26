import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  label: string;
  key: string;
  content: ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [activeTab, setActiveTab] = useState(items[0]?.key);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex border-b dark:border-slate-700 mb-6">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === item.key
                ? 'border-navy-800 dark:border-navy-400 text-navy-800 dark:text-navy-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {items.find((item) => item.key === activeTab)?.content}
      </motion.div>
    </div>
  );
}

