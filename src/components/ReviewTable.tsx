import type { NormalizedReview } from '../types/review';

interface ReviewTableProps {
  reviews: NormalizedReview[];
  onToggleApproval: (id: string) => void;
  loading: boolean;
  error?: string;
}

const ReviewTable = ({ reviews, onToggleApproval, loading, error }: ReviewTableProps) => {
  if (loading) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm text-red-600">Unable to load reviews: {error}</p>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">No reviews match the current filters.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {reviews.map((review) => {
        const isApproved = review.isApproved;
        return (
          <article
            key={review.id}
            className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {review.channel.toUpperCase()}
              </span>
              <span>{review.submittedDateLabel}</span>
              <span>|</span>
              <span>{review.reviewType === 'guest-to-host' ? 'Guest -> Host' : 'Host -> Guest'}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{review.propertyName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{review.location}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {review.guestName} | {review.stayLength} nights
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Rating</p>
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                    {review.rating5 === null || review.rating5 === undefined
                      ? 'N/A'
                      : review.rating5.toFixed(1)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleApproval(review.id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    isApproved
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400'
                      : 'border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100'
                  }`}
                >
                  {isApproved ? 'Approved for web' : 'Approve for web'}
                </button>
              </div>
            </div>
            {review.publicReview && (
              <p className="mt-4 text-base text-slate-800 dark:text-slate-200">{review.publicReview}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {review.tags.map((tag, index) => (
                <span
                  key={`${review.id}-tag-${index}`}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                >
                  {tag}
                </span>
              ))}
              {review.issues.map((issue, index) => (
                <span
                  key={`${review.id}-issue-${index}`}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                >
                  {issue}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              {review.categories.map((category) => (
                <span
                  key={category.key}
                  className="rounded-2xl bg-slate-100 px-3 py-1 font-medium dark:bg-slate-800 dark:text-slate-200"
                >
                  {category.label}:{' '}
                  {category.score5 === null || category.score5 === undefined
                    ? 'N/A'
                    : category.score5.toFixed(1)}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default ReviewTable;
