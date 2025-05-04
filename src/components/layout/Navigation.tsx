import Link from "next/link";

// Adding debug link to the navigation for easy testing of product pages
export function Navigation() {
  return (
    <nav className="flex space-x-4">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/collections" className="text-sm font-medium transition-colors hover:text-primary">
        Collections
      </Link>
      <Link href="/product" className="text-sm font-medium transition-colors hover:text-primary">
        Products
      </Link>
      <Link href="/cart" className="text-sm font-medium transition-colors hover:text-primary">
        Cart
      </Link>
      <Link href="/debug-products" className="text-sm font-medium transition-colors hover:text-red-500">
        Debug Products
      </Link>
    </nav>
  );
} 