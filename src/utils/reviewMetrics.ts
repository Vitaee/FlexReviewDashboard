import type {
  AvailableFilters,
  BackendReview,
  ListingPerformance,
  NormalizedReview,
  ReviewCategoryKey,
  ReviewCategoryScore,
  ReviewChannel,
  ReviewTotals,
} from '../types/review';

export const REVIEW_CATEGORY_LABELS: Record<ReviewCategoryKey, string> = {
  cleanliness: 'Cleanliness',
  communication: 'Communication',
  check_in: 'Check-in',
  accuracy: 'Accuracy',
  value: 'Value',
  location: 'Location',
  respect_house_rules: 'House Rules',
  overall: 'Overall',
};

export const REVIEW_CATEGORY_KEYS = Object.keys(REVIEW_CATEGORY_LABELS) as ReviewCategoryKey[];

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

const roundTo = (value: number | null | undefined, decimals = 1) => {
  if (value === null || value === undefined) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));

const detectInsights = (text?: string | null) => {
  if (!text) return { tags: [] as string[], issues: [] as string[] };
  const lower = text.toLowerCase();
  const tags: string[] = [];
  const issues: string[] = [];

  const tagMap: Record<string, string> = {
    view: 'Great view',
    rooftop: 'Rooftop highlight',
    terrace: 'Terrace mention',
    kitchen: 'Kitchen mention',
    location: 'Location praise',
    host: 'Host shoutout',
    bikes: 'Mobility perk',
    espresso: 'Amenity highlight',
    plunge: 'Plunge pool',
  };

  const issueMap: Record<string, string> = {
    noise: 'Noise complaint',
    noisy: 'Noise complaint',
    construction: 'Construction nearby',
    glitchy: 'Tech issue',
    stairs: 'Access concern',
    steep: 'Access concern',
    loose: 'Maintenance follow-up',
    dark: 'Lighting concern',
    towel: 'Linen issue',
  };

  Object.entries(tagMap).forEach(([keyword, label]) => {
    if (lower.includes(keyword)) tags.push(label);
  });

  Object.entries(issueMap).forEach(([keyword, label]) => {
    if (lower.includes(keyword)) issues.push(label);
  });

  return { tags, issues };
};

const mapCategoryRatings = (
  categories: BackendReview['categoryRatings'],
): ReviewCategoryScore[] =>
  REVIEW_CATEGORY_KEYS.map((key) => {
    const score10 = categories[key] ?? null;
    const score5 = score10 === null ? null : roundTo(score10 / 2, 1);
    return {
      key,
      label: REVIEW_CATEGORY_LABELS[key],
      score10,
      score5,
    };
  }).filter((category) => category.score10 !== null);

export const normalizeBackendReview = (review: BackendReview): NormalizedReview => {
  const rating10 = review.overallRating ?? review.rating ?? null;
  const rating5 = rating10 === null ? null : roundTo(rating10 / 2, 1);
  const categories = mapCategoryRatings(review.categoryRatings ?? {});
  if (!categories.some((category) => category.key === 'overall') && rating10 !== null) {
    categories.push({
      key: 'overall',
      label: REVIEW_CATEGORY_LABELS.overall,
      score10: rating10,
      score5: rating5,
    });
  }
  const categoryAverage5 = roundTo(
    average(
      categories
        .map((category) => category.score5)
        .filter((value): value is number => value !== null && value !== undefined),
    ),
    1,
  );
  const { tags, issues } = detectInsights(review.publicReview);

  return {
    id: String(review.id),
    listingId: review.listingId,
    propertyName: review.listingName,
    location: review.listingLocation,
    channel: review.channel,
    reviewType: review.type,
    rating5,
    rating10,
    submittedAt: review.submittedAt,
    submittedDateLabel: formatDate(review.submittedAt),
    guestName: review.guestName ?? 'Guest',
    publicReview: review.publicReview,
    privateNote: review.privateNote,
    stayLength: review.stayLength,
    categories,
    categoryAverage5,
    tags,
    issues,
    isApproved: Boolean(review.isApproved),
  };
};

export const summarizeListings = (reviews: NormalizedReview[]): ListingPerformance[] => {
  const grouped = new Map<string, NormalizedReview[]>();
  reviews.forEach((review) => {
    if (!grouped.has(review.listingId)) grouped.set(review.listingId, []);
    grouped.get(review.listingId)!.push(review);
  });

  const emptyCategories = (): Record<ReviewCategoryKey, number | null> => ({
    cleanliness: null,
    communication: null,
    check_in: null,
    accuracy: null,
    value: null,
    location: null,
    respect_house_rules: null,
    overall: null,
  });

  const emptyChannelMix = (): Record<ReviewChannel, number> => ({
    airbnb: 0,
    booking: 0,
    direct: 0,
    vrbo: 0,
    google: 0,
  });

  return Array.from(grouped.entries()).map(([listingId, listingReviews]) => {
    const reviewCount = listingReviews.length;
    const ratingValues = listingReviews
      .map((review) => review.rating5)
      .filter((value): value is number => value !== null);
    const avgRating5 = roundTo(average(ratingValues), 1);
    const lastReviewDate = listingReviews
      .map((review) => review.submittedAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    const categoryAverages = emptyCategories();
    REVIEW_CATEGORY_KEYS.forEach((key) => {
      const scores = listingReviews
        .map((review) => review.categories.find((category) => category.key === key)?.score5)
        .filter((value): value is number => value !== undefined && value !== null);
      categoryAverages[key] = roundTo(average(scores), 1);
    });

    const channelMix = emptyChannelMix();
    listingReviews.forEach((review) => {
      channelMix[review.channel] += 1;
    });

    return {
      listingId,
      propertyName: listingReviews[0].propertyName,
      location: listingReviews[0].location,
      reviewCount,
      avgRating5,
      lastReviewDate,
      categoryAverages,
      channelMix,
    };
  });
};

export const deriveTotals = (reviews: NormalizedReview[]): ReviewTotals => {
  const avgRating5 = roundTo(
    average(
      reviews
        .map((review) => review.rating5)
        .filter((value): value is number => value !== null && value !== undefined),
    ),
    2,
  );
  const properties = new Set(reviews.map((review) => review.listingId)).size;
  const channels = new Set(reviews.map((review) => review.channel)).size;

  return {
    reviews: reviews.length,
    properties,
    avgRating5,
    channels,
  };
};

export const deriveAvailableFilters = (reviews: NormalizedReview[]): AvailableFilters => {
  const channels = Array.from(new Set(reviews.map((review) => review.channel)));
  return {
    channels,
    categories: REVIEW_CATEGORY_KEYS,
    reviewTypes: ['host-to-guest', 'guest-to-host'],
  };
};
