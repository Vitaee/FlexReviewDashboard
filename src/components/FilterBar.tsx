import { REVIEW_CATEGORY_LABELS } from '../utils/reviewMetrics';
import {
  selectAvailableFilters,
  selectFilters,
  useReviewStore,
} from '../store/reviews';

const FilterBar = () => {
  const filters = useReviewStore(selectFilters);
  const available = useReviewStore(selectAvailableFilters);
  const setFilter = useReviewStore((state) => state.setFilter);
  const resetFilters = useReviewStore((state) => state.resetFilters);

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-sm shadow-slate-900/5 lg:p-6 dark:bg-slate-900/70 dark:shadow-black/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">Filters</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Slice reviews by channel, sentiment, and recency
          </p>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
        >
          Reset all
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <FilterSelect
          label="Channel"
          value={filters.channel}
          onChange={(value) => setFilter('channel', value as typeof filters.channel)}
          options={['all', ...(available?.channels ?? [])]}
        />
        <FilterSelect
          label="Review type"
          value={filters.reviewType}
          onChange={(value) => setFilter('reviewType', value as typeof filters.reviewType)}
          options={['all', ...(available?.reviewTypes ?? [])]}
        />
        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={(value) => setFilter('category', value as typeof filters.category)}
          options={['all', ...(available?.categories ?? [])]}
          labels={REVIEW_CATEGORY_LABELS}
        />
        <FilterSelect
          label="Time range"
          value={filters.timeRange}
          onChange={(value) => setFilter('timeRange', value as typeof filters.timeRange)}
          options={['all', '30d', '60d', '90d']}
          labels={{
            all: 'All time',
            '30d': 'Last 30d',
            '60d': 'Last 60d',
            '90d': 'Last 90d',
          }}
        />
        <FilterSelect
          label="Sort"
          value={filters.sortBy}
          onChange={(value) => setFilter('sortBy', value as typeof filters.sortBy)}
          options={['recent', 'oldest', 'highest', 'lowest']}
          labels={{
            recent: 'Most recent',
            oldest: 'Oldest first',
            highest: 'Top rated',
            lowest: 'Lowest rated',
          }}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Minimum rating
          </span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating}
              onChange={(event) => setFilter('minRating', Number(event.target.value))}
              className="w-full accent-indigo-600"
            />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
              {filters.minRating.toFixed(1)}
            </span>
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Search
          </span>
          <input
            type="search"
            value={filters.searchTerm}
            onChange={(event) => setFilter('searchTerm', event.target.value)}
            placeholder="Search guest, property, keyword..."
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={filters.showApprovedOnly}
          onChange={(event) => setFilter('showApprovedOnly', event.target.checked)}
          className="size-4 accent-indigo-600"
        />
        Show only approved reviews
      </label>
    </section>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}

const FilterSelect = ({ label, value, onChange, options, labels = {} }: FilterSelectProps) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4.5 6 8l4-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  </label>
);

export default FilterBar;
