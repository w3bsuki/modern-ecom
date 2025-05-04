import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { EnhancedTrendingCarousel } from '@/components/home/EnhancedTrendingCarousel';
import { CategoryCollection } from '@/components/home/CategoryCollection';
import { ModernNewsletter } from '@/components/home/ModernNewsletter';
import { getFeaturedCollections, getTrendingProducts } from '@/lib/api';
import { ProductSalesBanner } from '@/components/home/ProductSalesBanner';
import { BrandsShowcase } from '@/components/home/BrandsShowcase';
import { NewArrivals } from '@/components/home/NewArrivals';
import { CustomerTestimonials } from '@/components/home/CustomerTestimonials';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { ShippingBanner } from '@/components/home/ShippingBanner';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const collections = await getFeaturedCollections();
  const trendingProducts = await getTrendingProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <Hero />
      
      {/* Featured Collections Grid - Moved to be directly after Hero */}
      <FeaturedCollections collections={collections} />
      
      {/* Featured Brands - Moved to be after Collections */}
      <BrandsShowcase />
      
      {/* New Arrivals Section */}
      <NewArrivals />
      
      {/* Featured Sale banner for promotions */}
      <ProductSalesBanner 
        title="Summer Sale"
        subtitle="Up to 40% off on selected items"
        ctaText="Shop Sale"
        ctaLink="/collections?sale=true"
        backgroundImage="/images/hats/summer-sale-bg.jpg"
        discount="40%"
        endDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 days from now
      />
      
      {/* Trending Products Carousel */}
      <EnhancedTrendingCarousel products={trendingProducts} />
      
      {/* Category Shop Section */}
      <CategoryCollection />
      
      {/* Customer Testimonials */}
      <CustomerTestimonials />
      
      {/* Instagram Feed Section */}
      <InstagramFeed />
      
      {/* Shipping & Benefits Banner - Moved down the page */}
      <ShippingBanner />
      
      {/* Newsletter Signup */}
      <ModernNewsletter />
    </div>
  );
}
