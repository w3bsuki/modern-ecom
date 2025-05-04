import { Product } from "@/types/product";

// Define products
export const products: Product[] = [
  {
    id: "1",
    name: "Classic Baseball Cap",
    slug: "classic-baseball-cap",
    description: "A timeless baseball cap with a clean design. Perfect for casual outings.",
    images: ["/images/hats/placeholder1.jpg", "/images/hats/placeholder1.jpg"],
    price: 29.99,
    salePrice: null,
    collection: "caps",
    category: "caps",
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "black", "gray"],
    isNew: true,
    isSale: false,
    isFeatured: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 124
  },
  {
    id: "2",
    name: "Vintage Dad Hat",
    slug: "vintage-dad-hat",
    description: "A comfortable dad hat with a distressed finish for that vintage look.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 24.99,
    salePrice: 19.99,
    collection: "dad-hats",
    category: "dad-hats",
    sizes: ["One Size"],
    colors: ["tan", "blue", "black"],
    isNew: false,
    isSale: true,
    isFeatured: true,
    inStock: true,
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: "3",
    name: "Premium Fitted Cap",
    slug: "premium-fitted-cap",
    description: "A high-quality fitted cap with a structured crown and flat brim.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 34.99,
    salePrice: null,
    collection: "fitted-caps",
    category: "fitted-caps",
    sizes: ["S", "M", "L", "XL"],
    colors: ["navy", "red", "black"],
    isNew: true,
    isSale: false,
    isFeatured: false,
    inStock: true,
    rating: 4.8,
    reviewCount: 56
  },
  {
    id: "4",
    name: "Summer Straw Hat",
    slug: "summer-straw-hat",
    description: "A lightweight straw hat perfect for keeping cool in the summer.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 39.99,
    salePrice: null,
    collection: "straw-hats",
    category: "straw-hats",
    sizes: ["S", "M", "L"],
    colors: ["natural", "black"],
    isNew: false,
    isSale: false,
    isFeatured: true,
    inStock: true,
    rating: 4.3,
    reviewCount: 48
  },
  {
    id: "5",
    name: "Winter Beanie",
    slug: "winter-beanie",
    description: "A warm knitted beanie for the cold winter months.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 19.99,
    salePrice: 15.99,
    collection: "beanies",
    category: "beanies",
    sizes: ["One Size"],
    colors: ["gray", "black", "maroon"],
    isNew: false,
    isSale: true,
    isFeatured: false,
    inStock: true,
    rating: 4.6,
    reviewCount: 78
  },
  {
    id: "6",
    name: "Limited Edition Snapback",
    slug: "limited-edition-snapback",
    description: "A limited edition snapback hat with unique design elements.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 44.99,
    salePrice: null,
    collection: "limited-edition",
    category: "snapbacks",
    sizes: ["One Size"],
    colors: ["black/gold"],
    isNew: true,
    isSale: false,
    isFeatured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 32
  },
  {
    id: "7",
    name: "59FIFTY Fitted",
    slug: "59fifty-fitted",
    description: "The iconic 59FIFTY fitted cap with a structured crown and flat visor.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 39.99,
    salePrice: null,
    collection: "fitted-caps",
    category: "fitted-caps",
    sizes: ["7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8", "7 3/4"],
    colors: ["black", "navy", "red"],
    isNew: false,
    isSale: false,
    isFeatured: false,
    inStock: true,
    rating: 4.7,
    reviewCount: 105
  },
  {
    id: "8",
    name: "9FORTY Adjustable",
    slug: "9forty-adjustable",
    description: "The 9FORTY adjustable cap with a curved visor and relaxed fit.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 29.99,
    salePrice: 24.99,
    collection: "dad-hats",
    category: "dad-hats",
    sizes: ["One Size"],
    colors: ["black", "navy", "white"],
    isNew: false,
    isSale: true,
    isFeatured: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 87
  },
  {
    id: "9",
    name: "9FIFTY Snapback",
    slug: "9fifty-snapback",
    description: "The 9FIFTY snapback with a flat visor and structured front.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 34.99,
    salePrice: null,
    collection: "snapbacks",
    category: "snapbacks",
    sizes: ["One Size"],
    colors: ["black", "navy", "gray"],
    isNew: true,
    isSale: false,
    isFeatured: false,
    inStock: true,
    rating: 4.6,
    reviewCount: 64
  },
  {
    id: "10",
    name: "9TWENTY Dad Hat",
    slug: "9twenty-dad-hat",
    description: "The 9TWENTY dad hat with an unstructured crown and curved visor.",
    images: [
      "/images/hats/placeholder1.jpg",
      "/images/hats/placeholder1.jpg"
    ],
    price: 27.99,
    salePrice: null,
    collection: "dad-hats",
    category: "dad-hats",
    sizes: ["One Size"],
    colors: ["khaki", "black", "navy"],
    isNew: false,
    isSale: false,
    isFeatured: true,
    inStock: true,
    rating: 4.4,
    reviewCount: 72
  }
]; 