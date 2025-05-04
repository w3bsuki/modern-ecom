# Development Memory: Important Patterns & References

This document serves as a collection of critical implementation details, patterns, and snippets we should remember throughout development.

## UI Component Patterns

### Button Variants
```tsx
// Usage example for our custom button variants
<Button variant="primary">Primary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
```

### AnimatePresence for Transitions
```tsx
// Framer Motion pattern for component transitions (used in modals, drawers)
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Component content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Consistent Layout Spacing
```tsx
// Standard container with responsive padding
<div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
  {/* Content */}
</div>
```

## State Management

### Cart Context Setup (Legacy)
```tsx
// Cart context pattern
import { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // State and methods implementation
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

### Zustand Store Pattern (Preferred)
```tsx
// Zustand store pattern with persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store interface
interface StoreState {
  // State properties
  items: Item[];
  
  // Actions/methods
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

// Create the store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      
      // Actions
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      clearItems: () => set({ items: [] }),
      
      // Computed values (getters)
      get computedValue() {
        return get().items.reduce((total, item) => total + item.value, 0);
      }
    }),
    {
      // Persistence configuration
      name: "store-name",
      version: 1,
    }
  )
);

// Usage:
// const { items, addItem, removeItem } = useStore();
```

## Data Fetching

### Product Data Fetching
```tsx
// Server component pattern for fetching products
export async function getProducts(params: {
  category?: string;
  sort?: string;
  search?: string;
  page?: number;
  perPage?: number;
}) {
  // Implementation
  return products;
}

// Usage in page
import { getProducts } from '@/lib/data/products';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { slug?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts({
    category: params.slug,
    sort: searchParams.sort as string,
    search: searchParams.q as string,
    page: Number(searchParams.page) || 1,
    perPage: Number(searchParams.perPage) || 12,
  });
  
  return (
    // Render with products
  );
}
```

## Form Handling

### Form Validation with React Hook Form + Zod
```tsx
// Standard form handling pattern
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  function onSubmit(values: FormValues) {
    // Handle form submission
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Responsive Design

### Standard Breakpoints
```
// Tailwind breakpoints we're consistently using:
- sm: 640px  (small mobile devices)
- md: 768px  (tablets and larger phones)
- lg: 1024px (laptops and small desktops)
- xl: 1280px (desktops)
- 2xl: 1536px (large screens)
```

### Image Loading Optimization
```tsx
// Next.js Image component pattern with proper sizing
import Image from 'next/image';

<div className="relative aspect-square">
  <Image
    src={product.image}
    alt={product.name}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover"
    priority={isPriority}
  />
</div>
```

## Performance Optimizations

### Component Code Splitting
```tsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingPlaceholder />,
  ssr: false, // Set to false for client-only components
});
```

## Important Functions & Utilities

### Price Formatting
```tsx
// Consistent price formatting function
export function formatPrice(
  price: number,
  options: { 
    currency?: string;
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'USD', notation = 'standard' } = options;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
  }).format(price);
}
```

### Date Formatting
```tsx
// Standard date formatting
export function formatDate(
  date: string | Date,
  options: { 
    format?: 'short' | 'medium' | 'long';
  } = {}
) {
  const { format = 'medium' } = options;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatOptions: Intl.DateTimeFormatOptions = 
    format === 'short' ? { month: 'short', day: 'numeric' } :
    format === 'medium' ? { month: 'short', day: 'numeric', year: 'numeric' } :
    { month: 'long', day: 'numeric', year: 'numeric' };
    
  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
}
```

## Environment Setup

### Required Environment Variables
```
# Required env variables for the application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Testing Patterns

### Component Testing with React Testing Library
```tsx
// Standard component test pattern
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    // ...other properties
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onQuickView when quick view button is clicked', async () => {
    const mockOnQuickView = jest.fn();
    render(<ProductCard product={mockProduct} onQuickView={mockOnQuickView} />);
    
    await userEvent.click(screen.getByText(/quick view/i));
    
    expect(mockOnQuickView).toHaveBeenCalledWith(mockProduct.id, expect.anything());
  });
});
```

## Notes & Reminders

- Always use the `cn()` utility function for conditionally joining Tailwind classes
- Remember to handle loading, error, and empty states for all data-dependent components
- Use skeleton loaders for better perceived performance
- Always implement keyboard navigation for modals, drawers, and other interactive components
- Test responsive layouts at standard breakpoints
- Use React Server Components where possible for better performance 