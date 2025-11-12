import { useMemo } from 'react';
import { REVIEW_CATEGORY_KEYS, summarizeListings, deriveTotals } from '../utils/reviewMetrics';
import { selectFilters, selectReviews, selectLastGeneratedAt, useReviewStore } from '../store/reviews';
import type { NormalizedReview, ReviewCategoryKey, ReviewChannel, ReviewTotals } from '../types/review';

const timeRangeToDays: Record<string, number> = {
  '30d': 30,
  '60d': 60,
  '90d': 90,
};

type LeaderboardEntry = { label: string; count: number };

const sortReviews = (reviews: NormalizedReview[], sortBy: string) => {
  const sorted = [...reviews];
  switch (sortBy) {
    case 'highest':
      return sorted.sort((a, b) => (b.rating5 ?? 0) - (a.rating5 ?? 0));
    case 'lowest':
      return sorted.sort((a, b) => (a.rating5 ?? 0) - (b.rating5 ?? 0));
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      );
    case 'recent':
    default:
      return sorted.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
  }
};

export const useDashboardData = () => {
  const reviews = useReviewStore(selectReviews);
  const filters = useReviewStore(selectFilters);
  const generatedAt = useReviewStore(selectLastGeneratedAt);

  const data = useMemo(() => {
    const now = Date.now();
    const filtered = reviews.filter((review) => {
      if (filters.channel !== 'all' && review.channel !== filters.channel) return false;
      if (filters.reviewType !== 'all' && review.reviewType !== filters.reviewType) return false;
      if (filters.category !== 'all') {
        const matchesCategory = review.categories.some((category) => category.key === filters.category);
        if (!matchesCategory) return false;
      }
      if (filters.minRating > 0 && (review.rating5 ?? 0) < filters.minRating) return false;
      if (filters.timeRange !== 'all') {
        const maxDays = timeRangeToDays[filters.timeRange];
        const diffInDays = (now - new Date(review.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays > maxDays) return false;
      }
      if (filters.showApprovedOnly && !review.isApproved) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const haystack = `${review.propertyName} ${review.guestName} ${review.publicReview}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    const sorted = sortReviews(filtered, filters.sortBy);

    const approvedReviews = reviews.filter((review) => review.isApproved);

    const channelBreakdown = sorted.reduce<Record<ReviewChannel, number>>(
      (acc, review) => {
        acc[review.channel] += 1;
        return acc;
      },
      { airbnb: 0, booking: 0, direct: 0, vrbo: 0, google: 0 },
    );

    const categoryHealth = REVIEW_CATEGORY_KEYS.reduce<Record<ReviewCategoryKey, number | null>>(
      (acc, key) => {
        const scores = sorted
          .map((review) => review.categories.find((category) => category.key === key)?.score5)
          .filter((value): value is number => value !== undefined && value !== null);
        acc[key] = scores.length
          ? Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 10) / 10
          : null;
        return acc;
      },
      {} as Record<ReviewCategoryKey, number | null>,
    );

    const issueCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    reviews.forEach((review) => {
      review.issues.forEach((issue) => {
        issueCounts[issue] = (issueCounts[issue] ?? 0) + 1;
      });
      review.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });
    });

    const toLeaderboard = (input: Record<string, number>): LeaderboardEntry[] =>
      Object.entries(input)
        .map(([label, count]) => ({ label, count }))
        .filter((entry) => entry.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    const totals: ReviewTotals = deriveTotals(reviews);

    return {
      filteredReviews: sorted,
      approvedReviews,
      propertyPerformance: summarizeListings(sorted),
      channelBreakdown,
      categoryHealth,
      issueLeaderboard: toLeaderboard(issueCounts),
      tagHighlights: toLeaderboard(tagCounts),
      totals,
    };
  }, [reviews, filters]);

  return {
    ...data,
    filters,
    generatedAt,
  };
};
