import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Filter, Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import ProductGridClientWrapper from "./ProductGridClientWrapper";

export const metadata = {
  title: "Shop All Products | Hat Store",
  description: "Browse our premium selection of hats and caps for every style and occasion.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);
  
  // Get unique categories
  const categories = Object.keys(productsByCategory).sort();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop Our Collection</h1>
        <p className="text-muted-foreground">
          Browse our premium selection of hats for every style and occasion
        </p>
      </div>
      
      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-background" 
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Grid3X3 size={16} />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <List size={16} />
          </Button>
          <Button variant="outline" className="h-10 gap-2">
            <Filter size={16} />
            <span>Filters</span>
          </Button>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="border rounded-lg p-1 bg-muted/20">
          <TabsList className="w-full h-auto grid grid-cols-2 md:flex md:flex-wrap">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-background rounded px-4 py-2.5 text-sm font-medium"
            >
              All Products
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-background rounded px-4 py-2.5 text-sm font-medium"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="mt-6">
          <TabsContent value="all" className="m-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-md px-2 py-1 bg-transparent" aria-label="Sort products">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGridClientWrapper 
                products={products}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initialBatchSize={12}
                batchSize={8}
              />
            </Suspense>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="m-0">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {productsByCategory[category].length} products in {category}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border rounded-md px-2 py-1 bg-transparent" aria-label="Sort products">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
              
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGridClientWrapper 
                  products={productsByCategory[category]}
                  gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  initialBatchSize={12}
                  batchSize={8}
                />
              </Suspense>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      
      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button size="sm" variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-md border-gray-200 dark:border-gray-800">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden relative bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-blue-600 hover:bg-blue-700 px-2 py-1 h-auto">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-red-600 hover:bg-red-700 px-2 py-1 h-auto">Sale</Badge>
            )}
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`} className="block space-y-1 mb-2">
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                  <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex items-center text-amber-500">
              <span>★</span>
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating?.toFixed(1) || "4.0"}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
} 