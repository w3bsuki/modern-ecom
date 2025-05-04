import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data/products";
import ProductDetail from "@/components/product/ProductDetail";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Hat Store`,
    description: product.description || `Shop our ${product.name} hat`,
    openGraph: {
      title: `${product.name} | Premium Hats & Caps`,
      description: product.description || `Shop our ${product.name} hat`,
      images: [product.images[0]],
      type: 'article',
      url: `https://hatstore.example.com/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product} />;
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
} 