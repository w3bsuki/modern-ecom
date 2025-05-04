"use client";

import { useEffect } from "react";
import { registerHooks } from "@/lib/register-hooks";

export function ClientInitScript() {
  useEffect(() => {
    // Register app hooks
    registerHooks();
    
    // Register service worker for PWA support
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);
  
  return null;
} 