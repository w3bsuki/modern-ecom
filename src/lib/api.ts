import { Collection } from './types';
import { Product } from '@/types/product';
import { products as newProducts } from '@/lib/data/products';
import { products as oldProducts } from '@/data/products';

// Define a consistent placeholder image path
const placeholderImage = "/images/hats/placeholder1.jpg";

/**
 * Normalize product data to ensure consistent format across the application
 */
export function normalizeProduct(product: any): Product {
  // Calculate sale price if discount is provided
  let salePrice = product.salePrice;
  if (!salePrice && product.discount && product.discount > 0) {
    salePrice = product.price * (1 - product.discount / 100);
  }

  return {
    id: product.id || `product-${Math.random().toString(36).substr(2, 9)}`,
    name: product.name || "Untitled Product",
    slug: product.slug || product.name?.toLowerCase().replace(/\s+/g, '-') || 'untitled-product',
    description: product.description || `A premium quality hat for all occasions.`,
    price: typeof product.price === 'number' ? product.price : 0,
    salePrice: salePrice || undefined,
    discount: typeof product.discount === 'number' ? product.discount : 0,
    images: Array.isArray(product.images) && product.images.length ? 
      product.images : [placeholderImage, placeholderImage],
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    collection: product.collection || product.category || "caps",
    categories: Array.isArray(product.categories) ? 
      product.categories : product.category ? [product.category] : ["caps"],
    thumbnail: product.thumbnail || (Array.isArray(product.images) && product.images[0]) || placeholderImage,
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
    isSale: Boolean(product.isSale) || (product.discount && product.discount > 0) || (product.salePrice && product.salePrice < product.price),
    inStock: product.inStock !== false, // Default to true unless explicitly false
    rating: typeof product.rating === 'number' ? product.rating : 4.0,
    reviews: product.reviews || product.reviewCount || 0,
    reviewCount: product.reviewCount || product.reviews || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetch featured collections from API
 */
export async function getFeaturedCollections(): Promise<Collection[]> {
  // Mock data for featured collections
  const featuredCollections: Collection[] = [
    {
      id: '1',
      title: 'Summer Collection',
      slug: 'summer-collection',
      description: 'Stay cool and stylish with our summer hat collection.',
      image: '/images/collections/summer-collection.jpg',
      products: []
    },
    {
      id: '2',
      title: 'Winter Essentials',
      slug: 'winter-essentials',
      description: 'Keep warm with our premium winter hats.',
      image: '/images/collections/winter-collection.jpg',
      products: []
    },
    {
      id: '3',
      title: 'Sport Caps',
      slug: 'sport-caps',
      description: 'Performance hats designed for athletes and sport enthusiasts.',
      image: '/images/collections/sport-collection.jpg',
      products: []
    },
    {
      id: '4',
      title: 'Luxury Hats',
      slug: 'luxury-hats',
      description: 'Exclusive designs using premium materials for discerning customers.',
      image: '/images/collections/luxury-collection.jpg',
      products: []
    }
  ];
  
  return featuredCollections;
}

// Mock data for trending products
const trendingProductsData: Product[] = [
  {
    id: '1',
    name: 'Classic Fedora',
    slug: 'classic-fedora',
    description: 'A timeless classic that adds sophistication to any outfit',
    price: 59.99,
    images: ['/images/hats/placeholder1.jpg', '/images/hats/placeholder1.jpg'],
    categories: ['fedora', 'formal'],
    colors: ['black', 'brown', 'navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isSale: false,
    isFeatured: true,
    collection: 'formal',
    thumbnail: '/images/hats/placeholder1.jpg',
    inStock: true,
    rating: 4.5,
    reviewCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Summer Straw Hat',
    slug: 'summer-straw-hat',
    description: 'Light and comfortable straw hat for hot summer days',
    price: 45.99,
    salePrice: 35.99,
    images: ['/images/hats/placeholder1.jpg', '/images/hats/placeholder1.jpg'],
    categories: ['straw', 'summer'],
    colors: ['natural', 'white'],
    sizes: ['M', 'L'],
    isNew: false,
    isSale: true,
    isFeatured: true,
    collection: 'summer',
    thumbnail: '/images/hats/placeholder1.jpg',
    inStock: true,
    rating: 4.2,
    reviewCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Vintage Newsboy Cap',
    slug: 'vintage-newsboy-cap',
    description: 'Classic newsboy style with a modern twist',
    price: 39.99,
    images: ['/images/hats/placeholder1.jpg', '/images/hats/placeholder1.jpg'],
    categories: ['cap', 'casual', 'vintage'],
    colors: ['gray', 'black', 'brown', 'navy'],
    sizes: ['S', 'M', 'L'],
    isNew: false,
    isSale: false,
    isFeatured: true,
    collection: 'casual',
    thumbnail: '/images/hats/placeholder1.jpg',
    inStock: true,
    rating: 4.0,
    reviewCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Winter Beanie',
    slug: 'winter-beanie',
    description: 'Warm knitted beanie for cold weather',
    price: 29.99,
    salePrice: 24.99,
    images: ['/images/hats/placeholder1.jpg', '/images/hats/placeholder1.jpg'],
    categories: ['beanie', 'winter'],
    colors: ['gray', 'black', 'navy', 'red'],
    sizes: ['one-size'],
    isNew: true,
    isSale: true,
    isFeatured: true,
    collection: 'winter',
    thumbnail: '/images/hats/placeholder1.jpg',
    inStock: true,
    rating: 4.8,
    reviewCount: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get trending products
 * @returns Array of trending products
 */
export async function getTrendingProducts(): Promise<Product[]> {
  // In a real application, this would make an API call
  // For now, we'll return mock data
  return trendingProductsData;
}

/**
 * Fetch all products from API - combining both product sets
 */
export async function getAllProducts(): Promise<Product[]> {
  // First process the new products with unsplash images
  const processedNewProducts = newProducts.map(normalizeProduct);
  
  // Then process the old products
  const processedOldProducts = oldProducts.map(normalizeProduct);
  
  // Combine both product sets
  return [...processedNewProducts, ...processedOldProducts];
}

/**
 * Fetch a product by slug from API
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.log("Looking for product with slug:", slug);
  const allProducts = await getAllProducts();
  const product = allProducts.find(product => product.slug === slug);
  
  if (!product) {
    console.warn(`Product with slug "${slug}" not found!`);
    console.log("Available products:", allProducts.map(p => p.slug));
  } else {
    console.log("Found product:", product.name);
  }
  
  return product || null;
} 