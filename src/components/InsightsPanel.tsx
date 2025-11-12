import type { ReviewCategoryKey, ReviewChannel } from '../types/review';

interface InsightsPanelProps {
  categoryHealth: Record<ReviewCategoryKey, number | null>;
  channelBreakdown: Record<ReviewChannel, number>;
  issueLeaderboard: Array<{ label: string; count: number }>;
  tagHighlights: Array<{ label: string; count: number }>;
}

const channelLabels: Record<ReviewChannel, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  vrbo: 'Vrbo',
  google: 'Google',
};

const InsightsPanel = ({
  categoryHealth,
  channelBreakdown,
  issueLeaderboard,
  tagHighlights,
}: InsightsPanelProps) => {
  const totalChannelReviews = Object.values(channelBreakdown).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <section className="rounded-3xl bg-slate-900/90 p-6 text-white shadow-lg shadow-slate-900/40">
      <h2 className="text-base font-semibold tracking-wide text-slate-200">
        Channel mix & signals
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Understand which channels drive the most reviews and what guests mention repeatedly.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Channel split</p>
          <div className="mt-3 space-y-2">
            {Object.entries(channelBreakdown).map(([channel, count]) => {
              if (!count) return null;
              const percentage = totalChannelReviews
                ? Math.round((count / totalChannelReviews) * 100)
                : 0;
              return (
                <div key={channel} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-slate-300">{channelLabels[channel as ReviewChannel]}</span>
                  <div className="h-2.5 flex-1 rounded-full bg-slate-700">
                    <span
                      className="block h-full rounded-full bg-indigo-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-slate-300">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Category health</p>
          <div className="mt-3 grid gap-2">
            {Object.entries(categoryHealth).map(([key, score]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-semibold">{score ?? 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        <Leaderboard title="Recurring issues" entries={issueLeaderboard} color="rose" />
        <Leaderboard title="Guest highlights" entries={tagHighlights} color="emerald" />
      </div>
    </section>
  );
};

const Leaderboard = ({
  title,
  entries,
  color,
}: {
  title: string;
  entries: Array<{ label: string; count: number }>;
  color: 'rose' | 'emerald';
}) => {
  if (!entries.length) {
    return (
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-2 text-sm text-slate-500">No signals yet</p>
      </div>
    );
  }

  const colorClasses =
    color === 'rose'
      ? 'bg-rose-500/10 text-rose-200 border-rose-500/40'
      : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40';

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <div className="mt-3 space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.label}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm ${colorClasses}`}
          >
            <span>{entry.label}</span>
            <span className="font-semibold">{entry.count}x</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
