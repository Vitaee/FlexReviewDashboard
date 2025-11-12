import type { ReviewTotals } from '../types/review';
import { formatDistanceToNowStrict } from '../utils/time';

interface DashboardHeaderProps {
  totals?: ReviewTotals;
  generatedAt?: string;
}

const DashboardHeader = ({ totals, generatedAt }: DashboardHeaderProps) => {
  const sinceUpdate = generatedAt ? formatDistanceToNowStrict(generatedAt) : 'n/a';

  return (
    <header className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-900 p-8 text-white shadow-lg shadow-indigo-800/30 dark:from-slate-900 dark:via-slate-900 dark:to-black dark:shadow-indigo-900/50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">The Flex</p>
          <h1 className="mt-2 text-3xl font-semibold">Reviews Intelligence</h1>
          <p className="mt-3 max-w-xl text-base text-indigo-100/90">
            Monitor every guest touchpoint, surface recurring issues, and hand-pick the stories that
            should appear on the public site.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center text-slate-900 sm:grid-cols-4">
          <StatPill label="Total reviews" value={totals?.reviews ?? 0} />
          <StatPill label="Avg. rating" value={totals?.avgRating5 ? totals.avgRating5.toFixed(1) : 'N/A'} />
          <StatPill label="Properties" value={totals?.properties ?? 0} />
          <StatPill label="Channels" value={totals?.channels ?? 0} />
        </div>
      </div>
      <p className="mt-6 text-sm text-indigo-100/80">Last refreshed {sinceUpdate}</p>
    </header>
  );
};

const StatPill = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm shadow-black/5 dark:bg-white/10 dark:text-white">
    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-200">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default DashboardHeader;
