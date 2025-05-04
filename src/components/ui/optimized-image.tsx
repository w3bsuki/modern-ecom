import React, { useMemo } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';

export interface OptimizedImageProps extends Omit<NextImageProps, 'placeholder' | 'blurDataURL'> {
  /** Whether this image is above the fold and should be prioritized */
  isPriority?: boolean;
  /** Optional CSS class for the container */
  containerClassName?: string;
  /** Whether to use a blur placeholder (will auto-generate if true or use the provided string) */
  usePlaceholder?: boolean | string;
  /** Optional size to specify (useful for responsive images) */
  sizeHint?: string;
}

export function OptimizedImage({
  isPriority = false,
  containerClassName,
  usePlaceholder = true,
  sizeHint,
  alt,
  className,
  ...rest
}: OptimizedImageProps) {
  // Automatically generate default sizes attribute if not provided
  const defaultSizes = useMemo(() => {
    return sizeHint || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }, [sizeHint]);

  // Generate a very basic blue placeholder
  const placeholderData = useMemo(() => {
    if (typeof usePlaceholder === 'string') return usePlaceholder;
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHgyPSIwJSIgeTE9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIyMiIgc3RvcC1vcGFjaXR5PSIwLjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzMzMiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNnMSkiLz48L3N2Zz4=';
  }, [usePlaceholder]);

  return (
    <div className={twMerge('relative overflow-hidden', containerClassName)}>
      <NextImage
        alt={alt || 'Image'}
        className={twMerge('object-cover transition-opacity duration-300', className)}
        sizes={rest.sizes || defaultSizes}
        quality={rest.quality || 85}
        priority={isPriority}
        placeholder={usePlaceholder ? 'blur' : 'empty'}
        blurDataURL={usePlaceholder ? placeholderData : undefined}
        loading={isPriority ? 'eager' : 'lazy'}
        {...rest}
      />
    </div>
  );
} 