# Developer Guide

## Introduction
This guide outlines our development practices, coding conventions, and workflows for the e-commerce platform. It serves as a reference for both new and existing team members.

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v8+)
- Git

### Setup
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
├── docs/               # Documentation
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions & libraries
│   ├── types/          # TypeScript definitions
│   └── data/           # Demo data & constants
├── .next/              # Next.js build output (gitignored)
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Development Workflow

### Feature Development Process
1. **Understand Requirements**: Review task documentation in `docs/`
2. **Component Planning**: Identify affected components and plan changes
3. **Implementation**: Develop the feature with appropriate tests
4. **Testing**: Verify functionality across devices and browsers
5. **Documentation**: Update relevant documentation
6. **Review**: Submit for code review

### Branch Strategy
- `main` - Production-ready code
- `feature/*` - Feature development branches
- `fix/*` - Bug fix branches

## Coding Standards

### TypeScript & React

- Use functional components with hooks
- Leverage TypeScript for type safety
- Break down complex components into smaller ones
- Use named exports for components
- Always include proper prop types

```tsx
// Good example
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Component implementation
}
```

### File Organization

- One component per file (except for small related components)
- Group related components in directories
- Use index files for cleaner imports
- Keep files under 300 lines

### State Management

- Use local state when possible
- Leverage Zustand for global state
- Follow the pattern in our hooks directory:

```tsx
// Example Zustand store
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
}));
```

### Styling

- Use Tailwind CSS for styling
- Use CSS variables for theme values
- Leverage shadcn/ui components
- Use `cn()` utility for conditional classes

```tsx
<div className={cn(
  "base-styles-here",
  isActive && "active-styles-here"
)}>
```

## Performance Considerations

- Use Next.js Image for optimized images
- Lazy load non-critical components
- Use React.memo() for expensive components
- Avoid unnecessary re-renders

```tsx
// Example of dynamic import
const CartDrawer = dynamic(() => import("./CartDrawer"), { 
  ssr: false,
  loading: () => <DrawerSkeleton />
});
```

## Testing

### Unit Testing
- Test hooks and utilities with Jest
- Use React Testing Library for component tests
- Focus on user behaviors over implementation details

### E2E Testing
- Use Cypress for critical user flows
- Test across different viewport sizes

## Deployment

- We use Vercel for hosting
- Deployments are triggered by pushes to main
- Preview deployments are created for PRs
- Run `pnpm build` locally before pushing to ensure no build errors

## Common Patterns

### Data Fetching
For server components:
```tsx
async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  return <ProductDetails product={product} />;
}
```

For client components:
```tsx
"use client";

function ProductFilters() {
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useSWR('/api/categories', fetcher);
  
  // Component implementation
}
```

### Loading States

Using Suspense:
```tsx
<Suspense fallback={<ProductSkeleton />}>
  <ProductList category="featured" />
</Suspense>
```

### Error Handling

```tsx
try {
  // Operation that might fail
} catch (error) {
  console.error("Operation failed:", error);
  toast({
    title: "Something went wrong",
    description: "Please try again later",
    variant: "destructive",
  });
}
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors
   - Verify import paths
   - Look for missing dependencies

2. **Performance Issues**
   - Run Lighthouse to identify bottlenecks
   - Check for unnecessary re-renders
   - Review network requests

3. **State Management Issues**
   - Verify store initialization
   - Check for proper store subscription
   - Look for state update side effects

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand) 