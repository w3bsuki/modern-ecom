# Backend Architecture & Guidelines

## Technology Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API Layer**: Next.js API Routes / Server Actions
- **Payment Processing**: Stripe
- **Email Service**: Resend
- **Caching**: Redis (optional for larger scale)

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: string[];
  categories: string[];
  tags?: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  id: string;
  sku: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  inventory?: number;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  addresses?: Address[];
  orders?: Order[];
  wishlist?: string[]; // Product IDs
  createdAt: string;
  lastLogin?: string;
}

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
  image?: string;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
```

### Cart
```typescript
interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  couponCode?: string;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
  image?: string;
}
```

## API Structure

### Products API
- `GET /api/products` - List products with filtering, sorting, and pagination
- `GET /api/products/:slug` - Get product details by slug
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new arrivals
- `GET /api/products/related/:productId` - Get related products

### Categories API
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category details by slug
- `GET /api/categories/:slug/products` - Get products by category

### Cart API
- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `POST /api/cart/clear` - Clear cart
- `POST /api/cart/apply-coupon` - Apply coupon code

### Checkout API
- `POST /api/checkout/create-session` - Create Stripe checkout session
- `POST /api/checkout/validate` - Validate checkout details
- `POST /api/checkout/complete` - Complete checkout

### User API
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address
- `GET /api/user/orders` - Get user orders
- `GET /api/user/orders/:id` - Get order details

### Authentication
- Handled by Supabase Auth with the following methods:
  - Email/Password
  - Social logins (Google, GitHub)
  - Magic Link (passwordless)

## Database Schema

### Tables
- products
- product_variants
- product_options
- product_images
- categories
- users
- addresses
- orders
- order_items
- carts
- cart_items
- reviews
- coupons
- wishlists

## Security Guidelines
- **API Authentication**: Using JWT tokens via Supabase
- **Rate Limiting**: Implemented on sensitive endpoints
- **Input Validation**: Server-side validation with Zod
- **CORS**: Proper configuration for allowed origins
- **Data Sanitization**: Prevention of SQL injection and XSS
- **Secure Payment Handling**: Using Stripe's secure elements

## Error Handling
- Consistent error response format
- Appropriate HTTP status codes
- Detailed error messages in development, generic in production
- Error logging for monitoring

## Performance Considerations
- Database indexing for frequently queried fields
- API response caching where appropriate
- Pagination for large datasets
- Optimized database queries

## Deployment Strategy
- CI/CD pipeline for backend changes
- Environment-specific configurations
- Database migration handling
- Backup and recovery procedures 