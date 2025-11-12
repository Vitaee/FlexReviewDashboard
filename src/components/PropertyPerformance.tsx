import type { ListingPerformance } from '../types/review';

interface PropertyPerformanceProps {
  listings: ListingPerformance[];
}

const PropertyPerformance = ({ listings }: PropertyPerformanceProps) => {
  if (!listings.length) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Property performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Highest to lowest based on the current filters
          </p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {listings.map((listing) => (
          <article key={listing.listingId} className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{listing.propertyName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{listing.location}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {listing.reviewCount} reviews | Last {new Date(listing.lastReviewDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Avg. rating</p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {listing.avgRating5 === null || listing.avgRating5 === undefined
                    ? 'N/A'
                    : listing.avgRating5.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 text-xs text-slate-500 dark:text-slate-400 md:grid-cols-2">
              <ChannelStack channelMix={listing.channelMix} />
              <CategoryStack
                label="Cleanliness"
                score={listing.categoryAverages.cleanliness}
                trendLabel="Ops"
              />
              <CategoryStack label='Communication' score={listing.categoryAverages.communication} trendLabel="CX" />
              <CategoryStack label='Value' score={listing.categoryAverages.value} trendLabel="Pricing" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const ChannelStack = ({
  channelMix,
}: {
  channelMix: ListingPerformance['channelMix'];
}) => {
  const total = Object.values(channelMix).reduce((sum, value) => sum + value, 0) || 1;
  const entries = Object.entries(channelMix).filter(([, value]) => value > 0);
  if (!entries.length) return null;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Channel mix</p>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {entries.map(([channel, value]) => (
          <span
            key={channel}
            className={`h-full ${channelColor(channel)} text-transparent`}
            style={{ width: `${(value / total) * 100}%` }}
          >
            {channel}
          </span>
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        {entries.map(([channel, value]) => (
          <span key={channel}>
            {channel.toUpperCase()} - {value}
          </span>
        ))}
      </div>
    </div>
  );
};

const CategoryStack = ({
  label,
  score,
  trendLabel,
}: {
  label: string;
  score: number | null;
  trendLabel: string;
}) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
      {score === null || score === undefined ? 'N/A' : score.toFixed(1)}
    </p>
    <p className="text-[11px] text-slate-400 dark:text-slate-500">{trendLabel} metric</p>
  </div>
);

const channelColor = (channel: string) => {
  switch (channel) {
    case 'airbnb':
      return 'bg-indigo-400';
    case 'booking':
      return 'bg-emerald-400';
    case 'direct':
      return 'bg-slate-400';
    case 'vrbo':
      return 'bg-violet-400';
    case 'google':
      return 'bg-amber-400';
    default:
      return 'bg-slate-300';
  }
};

export default PropertyPerformance;
