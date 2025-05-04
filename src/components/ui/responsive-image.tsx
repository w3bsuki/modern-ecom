import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// Common aspect ratio classes
export const aspectRatios = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  '16:9': 'aspect-[16/9]',
  '9:16': 'aspect-[9/16]',
  '21:9': 'aspect-[21/9]',
};

export type AspectRatio = keyof typeof aspectRatios;

// Predefined sizes for common use cases
export const imageSizes = {
  small: '(max-width: 640px) 100vw, 320px',
  medium: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  large: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px',
  full: '100vw',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw',
};

export type ImageSize = keyof typeof imageSizes;

interface ResponsiveImageProps extends Omit<ImageProps, 'sizes'> {
  aspectRatio?: AspectRatio;
  size?: ImageSize;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = '1:1',
  size = 'medium',
  className,
  containerClassName,
  loading,
  fill = true,
  sizes: customSizes,
  ...props
}: ResponsiveImageProps) {
  const sizesValue = customSizes || imageSizes[size];
  const ratioClass = aspectRatios[aspectRatio];
  
  return (
    <div className={cn(
      "relative overflow-hidden",
      ratioClass,
      containerClassName,
    )}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizesValue}
        loading={loading}
        className={cn(
          "object-cover transition-all duration-300",
          className,
        )}
        {...props}
      />
    </div>
  );
} 