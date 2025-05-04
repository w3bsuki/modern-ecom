# Modern E-Commerce Frontend

A high-performance e-commerce frontend built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Shopping Experience
- **Product Browsing**: Browse products by category or collection
- **Product Detail**: View detailed product information with image gallery
- **Cart Functionality**: Add products to cart, update quantities, and view cart summary
- **Wishlist**: Save products for later purchase
- **Recently Viewed**: Track and display recently viewed products
- **Quick View**: Preview products without leaving the current page
- **Responsive Design**: Optimized for all device sizes

### UI Components
- Modern black/white design with accent colors
- Shadcn UI component library for accessible, reusable components
- Dark/light mode support

### Performance Optimizations
- **State Management**: Efficient Zustand stores with selectors to prevent unnecessary re-renders
- **Minimal Storage**: Only storing necessary product data in state
- **Memoization**: Strategic use of useMemo for derived values
- **Local Storage**: Persistence for cart, wishlist, and recently viewed products

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Zustand
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Architecture

The project follows a feature-based architecture with clear separation of concerns:

- **`/app`**: Next.js App Router pages and layouts
- **`/components`**: Reusable React components organized by feature
- **`/hooks`**: Custom React hooks and Zustand stores
- **`/lib`**: Utility functions and data handling
- **`/types`**: TypeScript type definitions

## State Management

### Cart Store
- Efficient Zustand implementation with selector hooks
- Optimized to only store necessary product data
- Local storage persistence with zustand/middleware
- Toast notifications for user feedback

```typescript
// Usage examples
const cartItems = useCartItems();
const totalItems = useCartTotalItems();
const { addItem, removeItem } = useCartActions();
```

### Wishlist Store
- Similar Zustand pattern as cart implementation
- Toggle functionality for adding/removing items
- Local storage persistence
- Selector hooks for performance

```typescript
// Usage examples
const wishlistItems = useWishlistItems();
const isInWishlist = useIsInWishlist(productId);
const { toggleItem } = useWishlistActions();
```

### Recently Viewed Store
- Tracks recently viewed products
- Limits to a configurable number of items
- Shows products on product detail pages
- Local storage persistence

## Performance Optimizations

- **Selective State Access**: Using selector hooks to prevent unnecessary re-renders
- **Memoization**: Using useMemo for derived values
- **Code Splitting**: Dynamic imports for component-level code splitting
- **Minimal Data Storage**: Only storing necessary product data in state
- **Optimized Rendering**: Early returns and conditional rendering to reduce work

## Development

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Building for Production
```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
hat-store/
├── src/
│   ├── app/                    # App Router pages and layouts
│   │   ├── layout/             # Layout components (Navbar, Footer, etc.)
│   │   ├── home/               # Home page components
│   │   ├── product/            # Product components
│   │   ├── cart/               # Cart components
│   │   ├── wishlist/           # Wishlist components
│   │   └── ui/                 # Reusable UI components
│   ├── components/             # Shared components
│   │   ├── shop/               # Shop-specific components
│   │   └── ui/                 # UI components from shadcn/ui
│   ├── data/                   # Mock data for development
│   ├── hooks/                  # Custom React hooks and state management
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
│   ├── OPTIMIZATION.md         # Performance optimization details
│   └── CART-REFACTORING.md     # Cart implementation details
└── public/                     # Static assets
```

## Pages

- **Home**: Features hero banner, featured collections, and product grids
- **Collections**: Browse all available collections
- **Collection Detail**: View products in a specific collection
- **Product Detail**: View product information and options
- **Cart**: Manage items in the shopping cart
- **Wishlist**: View and manage saved products

## Future Enhancements

- User authentication
- Advanced filtering and search
- Payment processing integration
- Admin dashboard for product management
- Further performance optimizations (see [OPTIMIZATION.md](docs/OPTIMIZATION.md))

## License

MIT

## Credits

- Images from [Unsplash](https://unsplash.com/)
