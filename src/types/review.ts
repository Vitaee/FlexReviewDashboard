export type ReviewChannel = 'airbnb' | 'booking' | 'direct' | 'vrbo' | 'google';

export type ReviewType = 'host-to-guest' | 'guest-to-host';

export type ReviewCategoryKey =
  | 'cleanliness'
  | 'communication'
  | 'check_in'
  | 'accuracy'
  | 'value'
  | 'location'
  | 'respect_house_rules'
  | 'overall';

export interface BackendReview {
  id: number;
  listingId: string;
  listingName: string;
  listingLocation: string;
  channel: ReviewChannel;
  type: ReviewType;
  status: 'published' | 'hidden';
  rating: number | null;
  overallRating: number | null;
  categoryRatings: Partial<Record<ReviewCategoryKey, number>>;
  publicReview: string | null;
  privateNote: string | null;
  guestName: string | null;
  submittedAt: string;
  date: string;
  stayDate: string;
  stayLength: number;
  isApproved?: boolean;
}

export interface ReviewCategoryScore {
  key: ReviewCategoryKey;
  label: string;
  score10: number | null;
  score5: number | null;
}

export interface NormalizedReview {
  id: string;
  listingId: string;
  propertyName: string;
  location: string;
  channel: ReviewChannel;
  reviewType: ReviewType;
  rating5: number | null;
  rating10: number | null;
  submittedAt: string;
  submittedDateLabel: string;
  guestName: string;
  publicReview: string | null;
  privateNote?: string | null;
  stayLength: number;
  categories: ReviewCategoryScore[];
  categoryAverage5: number | null;
  tags: string[];
  issues: string[];
  isApproved: boolean;
}

export interface ListingPerformance {
  listingId: string;
  propertyName: string;
  location: string;
  reviewCount: number;
  avgRating5: number | null;
  lastReviewDate: string;
  categoryAverages: Record<ReviewCategoryKey, number | null>;
  channelMix: Record<ReviewChannel, number>;
}

export interface ReviewTotals {
  reviews: number;
  properties: number;
  avgRating5: number | null;
  channels: number;
}

export interface AvailableFilters {
  channels: ReviewChannel[];
  categories: ReviewCategoryKey[];
  reviewTypes: ReviewType[];
}
