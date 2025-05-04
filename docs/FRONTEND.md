# Frontend Architecture & Guidelines

## Architecture Overview

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Root layout
│   ├── cart/         # Cart page
│   ├── product/      # Product detail pages
│   ├── collections/  # Collection pages
│   └── ...
├── components/       # Reusable components
│   ├── ui/           # Shadcn UI components
│   ├── layout/       # Layout components
│   ├── home/         # Homepage components
│   ├── product/      # Product-related components
│   ├── shop/         # Shop-related components
│   └── theme/        # Theme components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
│   └── data/         # Data fetching utilities
├── types/            # TypeScript type definitions
└── ...
```

## Component Structure
- **Atomic Design Methodology**: We follow the atomic design pattern (atoms, molecules, organisms, templates, pages)
- **Component Organization**: Components are organized by feature and function
- **Component Naming**: Descriptive, PascalCase for components, camelCase for utilities

## Styling Guidelines
- **Tailwind CSS**: Used for all styling with custom theme
- **Custom Classes**: Located in global.css for reusable patterns
- **Theming**: Dark/light mode with persistent user preference
- **Responsive Design**: Mobile-first approach with standard breakpoints
- **Design System**: Consistent spacing, typography, and color scales

## Performance Optimization
- **Code Splitting**: Dynamic imports for large components/pages
- **Image Optimization**: Next.js Image component with proper sizing
- **Lazy Loading**: For off-screen content using Intersection Observer
- **Font Loading**: Optimized with next/font
- **Bundle Analysis**: Regular checks with @next/bundle-analyzer

## Component Guidelines

### Layout Components
- **Header**: Site navigation, search, cart, user menu
- **Footer**: Navigation, legal, newsletter signup
- **PageContainer**: Consistent page margins and max-width

### Product Components
- **ProductCard**: Display product with consistent card style
- **ProductGrid**: Responsive grid for product listings
- **ProductDetail**: Complete product information page
- **QuickView**: Modal for quick product preview
- **ProductCarousel**: Swipeable product display

### Shop Components
- **FilterSidebar**: Product filtering options
- **CategoryNavigation**: Browse by category
- **SortDropdown**: Product sorting options
- **SearchResults**: Display search results
- **MobileFilterDrawer**: Mobile-optimized filters

### Cart Components
- **CartDrawer**: Slide-in cart view
- **CartItem**: Individual item in cart
- **CartSummary**: Price breakdown and checkout button
- **QuantitySelector**: Adjust item quantity
- **EmptyCart**: Empty state for cart

## State Management
- **Cart State**: React Context for cross-app cart access
- **User State**: Authentication and preferences state
- **UI State**: Local component state for UI interactions
- **Server State**: React Query for data fetching and caching

## Forms and Validation
- **React Hook Form**: For all form handling
- **Zod**: Schema validation
- **Feedback**: Clear error messages and success states
- **Accessibility**: ARIA attributes and keyboard navigation

## Testing Strategy
- **Component Testing**: With React Testing Library
- **UI Testing**: Storybook for visual regression
- **End-to-End**: Cypress for critical user flows
- **Accessibility**: Automated a11y testing with axe-core

## Available UI Components
See the Shadcn UI documentation for available components and usage guidelines. For custom components, refer to the component documentation in the code.

## Design Resources
- **Color Scheme**: Primary black/white with accent colors
- **Typography**: Modern sans-serif with hierarchical sizing
- **Icons**: Lucide Icons library
- **Spacing**: 4px/0.25rem grid system 