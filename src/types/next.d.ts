// Custom type declarations for Next.js 15
import { Metadata } from 'next';

// This allows us to override the PageProps type in Next.js 15
declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
} 