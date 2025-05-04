"use client";

import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches the current window size
 * @param query - The media query to check
 * @returns A boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server to avoid hydration mismatch
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Browser check - window will not be available during SSR
    if (typeof window === 'undefined') return;
    
    // Create the media query list
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);
  
  return matches;
}

export default useMediaQuery; 