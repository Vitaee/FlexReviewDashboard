import { create } from 'zustand';
import { apiClient } from '../api/client';
import { deriveAvailableFilters, normalizeBackendReview, REVIEW_CATEGORY_KEYS } from '../utils/reviewMetrics';
import type {
  AvailableFilters,
  NormalizedReview,
  ReviewCategoryKey,
  ReviewChannel,
  ReviewType,
} from '../types/review';

export type TimeRangeFilter = '30d' | '60d' | '90d' | 'all';
export type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest';

export interface ReviewFilters {
  channel: ReviewChannel | 'all';
  reviewType: ReviewType | 'all';
  category: ReviewCategoryKey | 'all';
  minRating: number;
  timeRange: TimeRangeFilter;
  searchTerm: string;
  sortBy: SortOption;
  showApprovedOnly: boolean;
}

interface ReviewStoreState {
  reviews: NormalizedReview[];
  publicReviews: NormalizedReview[];
  loading: boolean;
  publicLoading: boolean;
  error?: string;
  publicError?: string;
  filters: ReviewFilters;
  availableFilters: AvailableFilters;
  lastGeneratedAt?: string;
  fetchReviews: () => Promise<void>;
  fetchApprovedReviews: (listingId?: string) => Promise<void>;
  setFilter: <K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) => void;
  resetFilters: () => void;
  toggleApproval: (reviewId: string) => Promise<void>;
  bulkToggleApproval: (reviewIds: string[], isApproved: boolean) => Promise<void>;
}

const initialFilters: ReviewFilters = {
  channel: 'all',
  reviewType: 'all',
  category: 'all',
  minRating: 0,
  timeRange: 'all',
  searchTerm: '',
  sortBy: 'recent',
  showApprovedOnly: false,
};

const EMPTY_REVIEWS: NormalizedReview[] = [];

const DEFAULT_AVAILABLE_FILTERS: AvailableFilters = {
  channels: [],
  categories: REVIEW_CATEGORY_KEYS,
  reviewTypes: ['host-to-guest', 'guest-to-host'],
};

export const useReviewStore = create<ReviewStoreState>((set, get) => ({
  reviews: [],
  publicReviews: [],
  loading: false,
  publicLoading: false,
  filters: initialFilters,
  availableFilters: DEFAULT_AVAILABLE_FILTERS,
  lastGeneratedAt: undefined,
  async fetchReviews() {
    if (get().loading) return;
    set({ loading: true, error: undefined });

    try {
      const response = await apiClient.getHostawayReviews();
      if (response.error || !response.data) {
        throw new Error(response.error ?? 'Unable to load reviews');
      }

      const normalized = response.data.map(normalizeBackendReview);
      set({
        reviews: normalized,
        availableFilters: deriveAvailableFilters(normalized),
        lastGeneratedAt: new Date().toISOString(),
        loading: false,
      });

      void get()
        .fetchApprovedReviews()
        .catch(() => {
          /* handled in fetchApprovedReviews */
        });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load reviews',
      });
    }
  },
  async fetchApprovedReviews(listingId) {
    if (get().publicLoading) return;
    set({ publicLoading: true, publicError: undefined });

    try {
      const response = await apiClient.getApprovedReviews(listingId);
      if (response.error || !response.data) {
        throw new Error(response.error ?? 'Unable to load approved reviews');
      }

      const normalized = response.data.map(normalizeBackendReview);
      set({
        publicReviews: normalized,
        publicLoading: false,
      });
    } catch (error) {
      set({
        publicLoading: false,
        publicError: error instanceof Error ? error.message : 'Unable to load approved reviews',
      });
    }
  },
  setFilter(key, value) {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },
  resetFilters() {
    set({ filters: initialFilters });
  },
  async toggleApproval(reviewId) {
    const target = get().reviews.find((review) => review.id === reviewId);
    if (!target) return;
    const nextState = !target.isApproved;

    try {
      const response = await apiClient.setReviewApproval(Number(reviewId), nextState);
      if (response.error) {
        throw new Error(response.error);
      }

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === reviewId ? { ...review, isApproved: nextState } : review,
        ),
      }));

      await get().fetchApprovedReviews();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to update approval status',
      });
    }
  },
  async bulkToggleApproval(reviewIds, isApproved) {
    if (!reviewIds.length) return;

    try {
      const response = await apiClient.bulkSetReviewApproval(
        reviewIds.map((id) => Number(id)),
        isApproved,
      );
      if (response.error) {
        throw new Error(response.error);
      }

      set((state) => ({
        reviews: state.reviews.map((review) =>
          reviewIds.includes(review.id) ? { ...review, isApproved } : review,
        ),
      }));

      await get().fetchApprovedReviews();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to update approvals',
      });
    }
  },
}));

export const selectReviews = (state: ReviewStoreState): NormalizedReview[] =>
  state.reviews ?? EMPTY_REVIEWS;

export const selectFilters = (state: ReviewStoreState) => state.filters;

export const selectLastGeneratedAt = (state: ReviewStoreState) => state.lastGeneratedAt;

export const selectAvailableFilters = (state: ReviewStoreState) => state.availableFilters;

export const selectPublicReviews = (state: ReviewStoreState) => state.publicReviews;

export const selectPublicLoading = (state: ReviewStoreState) => state.publicLoading;

export const selectPublicError = (state: ReviewStoreState) => state.publicError;
