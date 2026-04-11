import StatsCard from '../common/StatsCard';
import { Users, FileText, Search, CheckCircle } from 'lucide-react';

interface OverviewCardsProps {
  analytics: {
    total_users: number;
    total_reports: number;
    investigating: number;
    closed_reports: number;
  };
}

export default function OverviewCards({ analytics }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Users"
        value={analytics.total_users}
        icon={<Users className="w-6 h-6" />}
        color="primary"
        delay={0}
      />
      <StatsCard
        title="Total Cases"
        value={analytics.total_reports}
        icon={<FileText className="w-6 h-6" />}
        color="info"
        delay={1}
      />
      <StatsCard
        title="Active Investigations"
        value={analytics.investigating}
        icon={<Search className="w-6 h-6" />}
        color="warning"
        delay={2}
      />
      <StatsCard
        title="Reports Filed"
        value={analytics.closed_reports}
        icon={<CheckCircle className="w-6 h-6" />}
        color="success"
        delay={3}
      />
    </div>
  );
}
