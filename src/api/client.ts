import type { BackendReview } from '../types/review';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const sanitizeBaseUrl = (value?: string) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const API_BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private resolve(endpoint: string) {
    if (!this.baseUrl) return endpoint;
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolve(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail = typeof errorData === 'object' && errorData?.detail ? errorData.detail : null;
        throw new Error(detail ?? `HTTP ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getHostawayReviews() {
    return this.request<BackendReview[]>('/api/reviews/hostaway');
  }

  setReviewApproval(reviewId: number, isApproved: boolean) {
    return this.request<{ success: boolean; review_id: number; is_approved: boolean }>(
      '/api/reviews/approve',
      {
        method: 'PATCH',
        body: JSON.stringify({
          review_id: reviewId,
          is_approved: isApproved,
        }),
      },
    );
  }

  bulkSetReviewApproval(reviewIds: number[], isApproved: boolean) {
    return this.request<{ success: boolean; updated_count: number }>(
      '/api/reviews/approve/bulk',
      {
        method: 'PATCH',
        body: JSON.stringify({
          review_ids: reviewIds,
          is_approved: isApproved,
        }),
      },
    );
  }

  getApprovedReviews(listingId?: string) {
    const query = listingId ? `?listing_id=${encodeURIComponent(listingId)}` : '';
    return this.request<BackendReview[]>(`/api/reviews/approved${query}`);
  }

  healthCheck() {
    return this.request<{ status: string; service: string; version: string }>('/health');
  }
}

export const apiClient = new ApiClient();
