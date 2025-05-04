import { Product } from "@/types/product";

// Use local placeholder image
const placeholderImage = "/images/hats/placeholder1.jpg";

// Update the products to use the placeholder image
export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Baseball Cap",
    slug: "classic-white-baseball-cap",
    description: "A timeless white baseball cap with a clean design. Perfect for casual outings.",
    images: [placeholderImage, placeholderImage],
    price: 29.99,
    discount: 0,
    rating: 4.5,
    isNew: true,
    category: "caps",
    tags: ["baseball", "white", "casual"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "black", "gray"]
  },
  {
    id: "2",
    name: "Premium Red Fitted Cap",
    slug: "premium-red-fitted-cap",
    description: "A bold red fitted cap that makes a statement. High-quality materials and excellent craftsmanship.",
    images: [placeholderImage, placeholderImage],
    price: 34.99,
    discount: 10,
    rating: 4.8,
    isNew: false,
    category: "caps",
    tags: ["fitted", "red", "premium"],
    sizes: ["S", "M", "L"],
    colors: ["red", "black", "navy"]
  },
  {
    id: "3",
    name: "RVCA Gray Snapback",
    slug: "rvca-gray-snapback",
    description: "A trendy gray snapback with adjustable sizing. Urban style with a comfortable fit.",
    images: [placeholderImage, placeholderImage],
    price: 39.99,
    discount: 15,
    rating: 4.2,
    isNew: true,
    category: "snapbacks",
    tags: ["snapback", "gray", "urban"],
    sizes: ["One Size"],
    colors: ["gray", "black", "white"]
  },
  {
    id: "4",
    name: "Modern Blue Cap",
    slug: "modern-blue-cap",
    description: "A sleek blue cap with a modern design. Perfect for both athletic and casual wear.",
    images: [placeholderImage, placeholderImage],
    price: 32.99,
    discount: 0,
    rating: 4.6,
    isNew: false,
    category: "caps",
    tags: ["blue", "modern", "athletic"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black", "white"]
  },
  {
    id: "5",
    name: "Vintage Black & White Cap",
    slug: "vintage-black-white-cap",
    description: "A vintage-style black and white cap with a distressed finish. Adds a retro vibe to any outfit.",
    images: [placeholderImage, placeholderImage],
    price: 36.99,
    discount: 20,
    rating: 4.9,
    isNew: true,
    category: "vintage",
    tags: ["vintage", "black", "white", "distressed"],
    sizes: ["One Size"],
    colors: ["black/white", "blue/white", "red/white"]
  }
]; 