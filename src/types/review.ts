/**
 * Represents a review in the database
 */
export interface Review {
  id: string;
  productId: string;
  userId: string | null;
  userName: string;
  rating: number;
  title: string;
  reviewText: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  images?: string[];
}

/**
 * Data required to submit a new review
 */
export interface ReviewSubmission {
  productId: string;
  rating: number;
  title?: string;
  reviewText?: string;
  userName?: string;
  images?: string[];
}

/**
 * Response format when retrieving reviews
 */
export interface ReviewResponse {
  reviews: Review[];
}

/**
 * Data structure for review statistics
 */
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchases: number;
  hasImages: number;
}

/**
 * Allowed values for sorting reviews
 */
export type ReviewSortOption = 
  | 'newest'
  | 'highest'
  | 'lowest'
  | 'helpful'
  | 'relevant';

/**
 * Filter options for reviews
 */
export interface ReviewFilterOptions {
  minRating?: number;
  maxRating?: number;
  verifiedOnly?: boolean;
  withImages?: boolean;
  withText?: boolean;
}

/**
 * Parameters for fetching reviews
 */
export interface ReviewFetchParams {
  productId: string;
  page?: number;
  limit?: number;
  sort?: ReviewSortOption;
  filters?: ReviewFilterOptions;
}

/**
 * Response when marking a review as helpful/unhelpful
 */
export interface ReviewHelpfulResponse {
  success: boolean;
  helpfulCount: number;
}

/**
 * Structure for review summary displayed on product cards
 */
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

/**
 * Report about an inappropriate review
 */
export interface ReviewReport {
  reviewId: string;
  userId?: string;
  reason: 'inappropriate' | 'fake' | 'spam' | 'other';
  description?: string;
  createdAt: string;
} 