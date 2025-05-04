# Immediate Action Items

This document outlines specific, high-priority tasks that can be implemented immediately to start addressing the most critical issues in our e-commerce application.

## Critical Fixes (Start Immediately)

### 1. Fix Metadata Configuration Warnings

**Issue:** Console shows warnings about `viewport` and `themeColor` metadata configuration.
```
⚠ Unsupported metadata viewport is configured in metadata export in /. Please move it to viewport export instead.
⚠ Unsupported metadata themeColor is configured in metadata export in /. Please move it to viewport export instead.
```

**Action:**
- [x] Update root layout.tsx to use the proper metadata pattern for Next.js 13+
- [x] Move viewport and themeColor configuration to a dedicated viewport export

### 2. Fix Font Loading Issues

**Issue:** 404 errors for font files
```
GET /fonts/inter-var.woff2 404 in 266ms
```

**Action:**
- [x] Check font configuration in next.config.js and globals.css
- [x] Ensure fonts are either properly loaded using Next.js font optimization or available in the public directory
- [x] Consider using the next/font module for optimized font loading

### 3. Standardize Product Data Model

**Issue:** Inconsistent product data structure across components

**Action:**
- [x] Create a comprehensive product interface in src/types/product.ts
- [x] Ensure all product properties are consistently named
- [x] Standardize on either `salePrice` or `discount` for pricing
- [x] Fix the inconsistency between `image` and `images`
- [ ] Update all components to use the standardized product interface

### 4. Fix Server/Client Component Issues

**Issue:** Improper use of "use client" directives in page components

**Action:**
- [x] Audit all page.tsx files and fix server/client component separation (started with product page)
- [ ] Remove "use client" directive from page components that use server functions
- [ ] Create proper client components for interactive functionality
- [ ] Fix hydration errors by ensuring consistent component rendering

### 5. Fix Cart and Wishlist Functionality

**Issue:** Cart badges not updating properly, wishlist functionality inconsistent

**Action:**
- [ ] Review cart and wishlist hooks for proper state updates
- [ ] Ensure consistent hydration with isMounted pattern
- [ ] Fix badge update logic to respond immediately to changes
- [ ] Test cart and wishlist functionality across all paths

## Implementation Process

1. **Make small, focused changes:** Address one issue at a time
2. **Test after each change:** Ensure no regressions after each fix
3. **Document changes:** Update comments and documentation as you fix issues
4. **Track progress:** Check off items in this list as they're completed

## Testing Checklist

For each fix, verify:
- [ ] No console errors/warnings related to the issue
- [ ] Functionality works correctly across different pages
- [ ] No visual regressions
- [ ] Changes follow the TypeScript type definitions

## Next Steps

After completing these immediate actions, refer to the comprehensive REFACTORING-PLAN.md for the next set of priorities. 