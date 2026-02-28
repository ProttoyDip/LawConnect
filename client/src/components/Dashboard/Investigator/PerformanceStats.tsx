import StatsCard from '../common/StatsCard';

interface PerformanceStatsProps {
  stats: {
    totalAssigned: number;
    completed: number;
    ongoing: number;
  };
}

const AssignedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  </svg>
);

const CompletedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
  </svg>
);

const OngoingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
  </svg>
);

export default function PerformanceStats({ stats }: PerformanceStatsProps) {
  return (
    <div className="row g-3">
      <div className="col-4">
        <StatsCard
          title="Assigned"
          value={stats.totalAssigned}
          icon={<AssignedIcon />}
          color="primary"
          delay={0}
        />
      </div>
      <div className="col-4">
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<CompletedIcon />}
          color="success"
          delay={1}
        />
      </div>
      <div className="col-4">
        <StatsCard
          title="Ongoing"
          value={stats.ongoing}
          icon={<OngoingIcon />}
          color="warning"
          delay={2}
        />
      </div>
    </div>
  );
}
