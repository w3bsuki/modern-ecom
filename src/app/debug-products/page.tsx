import Link from "next/link";
import { getAllProducts } from "@/lib/api";

export default async function DebugProductsPage() {
  const products = await getAllProducts();
  
  // Log products for debugging
  console.log("All products:", products.map(p => ({ id: p.id, name: p.name, slug: p.slug })));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Products Debug</h1>
      <p className="mb-4">Total products: {products.length}</p>
      
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-md">
            <h2 className="font-bold">{product.name}</h2>
            <p className="font-mono text-sm">ID: {product.id}</p>
            <p className="font-mono text-sm">Slug: {product.slug}</p>
            <p>Price: {product.price} {product.salePrice && `(Sale: ${product.salePrice})`}</p>
            <p>Images: {product.images.length} available</p>
            <p>First image: {product.images[0]?.substring(0, 30)}...</p>
            <div className="mt-2 flex gap-2">
              <Link 
                href={`/product/${encodeURIComponent(product.slug)}`}
                className="text-blue-500 hover:underline"
              >
                View Product Page
              </Link>
              <span className="text-gray-400">|</span>
              <a 
                href={`/product/${encodeURIComponent(product.slug)}`}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 