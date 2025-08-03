# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Shtëpia e Lodrave** (House of Toys) is a modern e-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS. The application connects to a Django REST API backend hosted at `http://63.178.242.103/api`.

## Tech Stack

- **Framework**: Next.js 15.4.3 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom theme configuration
- **State Management**: 
  - Jotai for global state atoms
  - React Query (TanStack Query) for server state
  - Custom CartContext for shopping cart
- **API Client**: Axios with interceptors for authentication
- **UI Components**: Headless UI, custom components
- **Animation**: Framer Motion
- **Icons**: Custom SVG icon components
- **Forms**: Tailwind Forms plugin
- **Development**: Next.js Turbopack

## Key Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
yarn dev            # Alternative: Start development server

# Production
npm run build       # Build for production
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Architecture Overview

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related pages with separate layout
│   ├── (main)/            # Main application pages
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
├── config/               # Configuration files (routes)
├── contexts/             # React contexts (settings)
├── framework/            # Framework-specific code
├── layouts/              # Layout components (header, footer)
├── lib/                  # Utility libraries and helpers
├── providers/            # React providers (QueryClient)
├── services/             # API service layer
├── store/                # State management (Jotai atoms)
├── styles/               # Global styles and SCSS modules
└── utils/                # Utility functions
```

### Routing System
- Uses Next.js App Router with file-based routing
- Route definitions centralized in `src/config/routes.ts`
- Dynamic routes for products, categories, shops, orders, etc.
- Separate layout groups for auth and main sections

### API Integration
- Base URL: `http://63.178.242.103/api` (configured via environment variable)
- JWT authentication with Bearer tokens stored in localStorage
- Axios interceptors handle auth headers and 401 responses
- Service layer in `src/services/api.ts` provides typed API methods

### State Management Architecture
1. **Server State**: React Query for caching and synchronization
2. **Global UI State**: Jotai atoms for auth, drawer, search visibility
3. **Cart State**: Custom React Context with localStorage persistence
4. **Settings**: Context API for application settings

### Component Architecture
- Atomic design pattern with UI components
- Feature-based organization for complex components
- Custom icon system with SVG components
- Responsive design with Tailwind breakpoints

### Styling System
- Tailwind CSS with extensive custom configuration
- CSS custom properties for theme colors
- SCSS modules for component-specific styles  
- Custom fonts: Albert Sans and Grandstander
- Responsive breakpoints including custom `xs` and `3xl`

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://63.178.242.103/api  # Backend API endpoint

# Optional
NEXT_PUBLIC_SITE_NAME="Shtëpia e Lodrave"      # Site name
NEXT_PUBLIC_DEFAULT_LANGUAGE=en                # Default language
```

## Development Guidelines

### Adding New Features
1. Create pages in appropriate route group under `src/app/`
2. Add route definitions to `src/config/routes.ts`
3. Implement API methods in `src/services/api.ts`
4. Use React Query hooks for data fetching
5. Store UI state in Jotai atoms or contexts as appropriate

### Component Development
1. Place reusable components in `src/components/`
2. Use TypeScript interfaces for props
3. Follow existing patterns for icons and UI components
4. Implement responsive design using Tailwind classes
5. Use CSS modules (`.module.scss`) for complex component styles

### API Integration Pattern
```typescript
// In src/services/api.ts
export const api = {
  resource: {
    getAll: async (params?: any) => {
      const { data } = await apiClient.get('/endpoint/', { params });
      return data;
    },
  },
};

// In components, use with React Query
const { data, isLoading } = useQuery({
  queryKey: ['resource'],
  queryFn: () => api.resource.getAll(),
});
```

### State Management Guidelines
- **React Query**: All server state (API data)
- **Jotai**: Global UI state that needs cross-component access
- **Context**: Feature-specific state (cart, settings)
- **Component State**: Local UI state

## Common Patterns

### Protected Routes
Auth protection is handled at the layout level in `src/app/(auth)/layout.tsx`

### Cart Operations
```typescript
import { useCart } from '@/store/quick-cart/cart.context';

const { addItem, removeItem, updateItem, clearCart } = useCart();
```

### API Error Handling
Axios interceptors automatically handle 401 errors by clearing auth tokens and potentially redirecting to login.

### Responsive Images
Use Next.js Image component with responsive sizing and optimization.

## Performance Considerations
- Turbopack enabled for faster development builds
- React Query for efficient data caching
- Component code splitting via dynamic imports
- Image optimization through Next.js Image component

## TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to `src/*`
- Module resolution set to bundler
- JSX preserve mode for Next.js compatibility