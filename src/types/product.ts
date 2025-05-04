/**
 * Standardized Product Interface
 * This is the single source of truth for product data structure throughout the application.
 */
export interface Product {
  // Basic Information
  id: string;
  name: string;
  slug: string;
  description: string;
  
  // Pricing
  price: number;
  salePrice?: number | null; // Use salePrice for discounted prices (null if no sale)
  
  // Images 
  images: string[]; // Always use images array (first image is primary)
  thumbnail?: string; // Optional thumbnail for optimized listings
  
  // Categories & Collections
  category?: string; // Primary category
  categories?: string[]; // Multiple categories if applicable
  collection?: string; // Primary collection  
  collections?: string[]; // Multiple collections if applicable
  
  // Attributes
  colors?: string[];
  sizes?: string[];
  
  // Status flags
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean; // Indicates if product is on sale (should match with salePrice existence)
  inStock?: boolean;
  
  // Ratings & Reviews
  rating: number;
  reviewCount?: number;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Helper function to calculate discount percentage
 * Use this instead of storing discount directly
 */
export function calculateDiscount(price: number, salePrice: number | null | undefined): number {
  if (!salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Helper function to format price consistently
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Standardized product data for display in product cards
 * This should be derived from the main Product interface
 */
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  salePrice?: number | null;
  originalPrice?: string | null; // Formatted original price for display
  hasDiscount: boolean;
  discount: number; // Percentage discount
  image: string; // Primary image for the card
  images: string[]; // All product images
  slug: string;
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  rating: number;
}

/**
 * Helper function to transform Product into ProductCardData
 * Use this when preparing product data for display in cards
 */
export function createProductCardData(product: Product): ProductCardData {
  const discount = calculateDiscount(product.price, product.salePrice);
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    formattedPrice: product.salePrice ? 
      formatPrice(product.salePrice) : 
      formatPrice(product.price),
    salePrice: product.salePrice,
    originalPrice: product.salePrice ? formatPrice(product.price) : null,
    hasDiscount: !!product.salePrice,
    discount,
    image: product.images[0], // Primary image
    images: product.images,
    slug: product.slug,
    isNew: product.isNew,
    isSale: product.isSale,
    inStock: product.inStock ?? true, // Default to true if not specified
    rating: product.rating,
  };
} 