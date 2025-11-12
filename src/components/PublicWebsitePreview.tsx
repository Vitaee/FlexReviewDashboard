import type { NormalizedReview } from '../types/review';

interface PublicWebsitePreviewProps {
  approvedReviews: NormalizedReview[];
  loading?: boolean;
  error?: string;
}

const PublicWebsitePreview = ({ approvedReviews, loading, error }: PublicWebsitePreviewProps) => {
  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading approved reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Website review section</h2>
        <p className="mt-2 text-sm text-rose-500">Unable to load approved reviews: {error}</p>
      </section>
    );
  }

  if (!approvedReviews.length) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Website review section</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Select reviews in the dashboard to curate what appears on theflex.global
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Nothing selected yet
        </div>
      </section>
    );
  }

  const grouped = approvedReviews.reduce<Record<string, NormalizedReview[]>>((acc, review) => {
    if (!acc[review.listingId]) acc[review.listingId] = [];
    acc[review.listingId].push(review);
    return acc;
  }, {});

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5 dark:bg-slate-900/70 dark:shadow-black/40">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Website review section</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        This preview mirrors the hero layout on The Flex property detail page.
      </p>
      <div className="mt-6 space-y-8">
        {Object.entries(grouped).map(([listingId, reviews]) => (
          <PropertyPreview key={listingId} reviews={reviews} />
        ))}
      </div>
    </section>
  );
};

const PropertyPreview = ({ reviews }: { reviews: NormalizedReview[] }) => {
  const property = reviews[0];
  const ratingValues = reviews
    .map((review) => review.rating5)
    .filter((value): value is number => value !== null && value !== undefined);
  const avgRating = ratingValues.length
    ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length
    : null;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 shadow dark:border-slate-800">
      <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
        <div className="relative bg-slate-900 p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 opacity-90" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">The Flex</p>
            <h3 className="mt-2 text-2xl font-semibold">{property.propertyName}</h3>
            <p className="text-sm text-slate-200">{property.location}</p>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-4xl font-semibold">
                {avgRating === null ? 'N/A' : avgRating.toFixed(1)}
              </p>
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-200">Guest rating</p>
                <p className="text-sm text-slate-200">
                  {reviews.length} curated review{reviews.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-6 dark:bg-slate-900">
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">{review.guestName}</p>
                  <p>{review.submittedDateLabel}</p>
                </div>
                {review.publicReview && (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{review.publicReview}</p>
                )}
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {review.channel.toUpperCase()} | {review.stayLength} nights
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PublicWebsitePreview;
