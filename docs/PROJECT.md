# Modern E-Commerce Project

## Project Overview
This is a high-performance e-commerce platform focusing on a clean, minimalist black/white aesthetic with conversion-optimized UX. The application prioritizes speed, accessibility, and a premium shopping experience.

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion (used minimally for performance)
- **State Management**: React Context for cart/user state
- **Package Manager**: pnpm

### Backend
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **API Integration**: Next.js API routes / Server Actions
- **File Storage**: Supabase Storage
- **Analytics**: Simple Analytics (privacy-focused)

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Environment**: Docker (optional)

## Development Guidelines

### Code Quality
- **DRY Principle**: Don't repeat yourself. Extract reusable components and utilities.
- **Naming**: Use clear, descriptive names for files, components, and functions.
- **Component Size**: Keep components under 300 lines; refactor larger components.
- **Types**: Use strict TypeScript typing; avoid `any` types.
- **Comments**: Document complex logic; components should be self-explanatory.
- **Optimization**: Use React.memo, useMemo, and useCallback where appropriate.
- **Error Handling**: Implement proper error boundaries and handling.

### UI/UX Principles
- **Consistency**: Maintain consistent spacing, typography, and components.
- **Performance**: Optimize images, implement lazy loading, and keep bundle size small.
- **Accessibility**: Ensure WCAG 2.1 AA compliance (semantic HTML, keyboard navigation, etc.).
- **Responsiveness**: Design mobile-first, test on multiple viewport sizes.
- **Loading States**: Implement skeleton loaders for better perceived performance.
- **Animations**: Use subtle, purposeful animations that don't impact performance.

### Testing
- **Unit Tests**: Critical components and utilities
- **Integration Tests**: Key user flows
- **Accessibility Testing**: Regular audits
- **Performance Testing**: Lighthouse scoring, Core Web Vitals

### Performance Optimization
- Image optimization (WebP format with fallbacks)
- Code splitting and lazy loading
- Server-side rendering for SEO and initial load performance
- Optimize CSS and JS for minimal bundle size
- Implement caching strategies

## Feature Roadmap
See `PHASES.md` for detailed breakdown of development phases

## Current Status
See `PROGRESS.md` for up-to-date progress tracking 