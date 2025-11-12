import { useEffect } from 'react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import DashboardHeader from './components/DashboardHeader';
import FilterBar from './components/FilterBar';
import PropertyPerformance from './components/PropertyPerformance';
import ReviewTable from './components/ReviewTable';
import InsightsPanel from './components/InsightsPanel';
import PublicWebsitePreview from './components/PublicWebsitePreview';
import { useDashboardData } from './hooks/useDashboardData';
import {
  selectPublicError,
  selectPublicLoading,
  selectPublicReviews,
  useReviewStore,
} from './store/reviews';
import { useTheme } from './hooks/useTheme';

function App() {
  const fetchReviews = useReviewStore((state) => state.fetchReviews);
  const fetchApprovedReviews = useReviewStore((state) => state.fetchApprovedReviews);
  const loading = useReviewStore((state) => state.loading);
  const error = useReviewStore((state) => state.error);
  const publicReviews = useReviewStore(selectPublicReviews);
  const publicLoading = useReviewStore(selectPublicLoading);
  const publicError = useReviewStore(selectPublicError);
  const toggleApproval = useReviewStore((state) => state.toggleApproval);
  const { theme, toggleTheme } = useTheme();
  const {
    filteredReviews,
    approvedReviews,
    propertyPerformance,
    channelBreakdown,
    categoryHealth,
    issueLeaderboard,
    tagHighlights,
    totals,
    generatedAt,
  } = useDashboardData();

  useEffect(() => {
    fetchReviews();
    fetchApprovedReviews();
  }, [fetchReviews, fetchApprovedReviews]);

  const previewReviews = publicReviews.length ? publicReviews : approvedReviews;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section id="dashboard">
          <DashboardHeader totals={totals} generatedAt={generatedAt} />
        </section>
        <section id="filters">
          <FilterBar />
        </section>
        <section id="properties">
          <PropertyPerformance listings={propertyPerformance} />
        </section>
        <section id="insights" className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ReviewTable
            reviews={filteredReviews}
            onToggleApproval={toggleApproval}
            loading={loading}
            error={error}
          />
          <InsightsPanel
            categoryHealth={categoryHealth}
            channelBreakdown={channelBreakdown}
            issueLeaderboard={issueLeaderboard}
            tagHighlights={tagHighlights}
          />
        </section>
        <section id="public">
          <PublicWebsitePreview
            approvedReviews={previewReviews}
            loading={publicLoading}
            error={publicError}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
