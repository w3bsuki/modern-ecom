import type { Metadata, Viewport } from "next";
import { Inter, Lusitana, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClientInitScript } from "@/components/ClientInitScript";
import { Suspense } from "react";
import { Analytics } from "@/components/analytics";
import { SkipLink } from "@/components/ui/skip-link";

// Load Inter font as primary sans-serif font
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sans',
});

// Load Lusitana as our heading font
const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-heading',
});

// Load Lora as our body font for better readability
const lora = Lora({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-body',
});

// Define viewport export separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "Hat Store | Premium Headwear Collection",
  description: "Shop our accessible, premium hat collection for all styles and occasions. Keyboard navigable with screen reader support.",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  authors: [{ name: 'Hat Store Team' }],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Hat Store | Premium Headwear Collection",
    description: "Shop our accessible, premium hat collection for all styles and occasions. Keyboard navigable with screen reader support.",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hat Store | Premium Headwear Collection',
    description: 'Shop our accessible, premium hat collection for all styles and occasions.',
  },
  applicationName: 'Hat Store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lusitana.variable} ${lora.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/hats/placeholder.jpg"
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href="/products/hat-placeholder.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        {/* Preload hero images for faster LCP */}
        <link
          rel="preload"
          href="/images/testimonials/user1.jpg"
          as="image"
          type="image/jpeg"
        />
        
        {/* Font preloading for better CLS */}
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />

        {/* Preconnect to any third-party APIs */}
        <link
          rel="preconnect"
          href="https://cdn.example.com"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://cdn.example.com" />
        
        {/* Preload critical JS */}
        <link 
          rel="modulepreload" 
          href="/_next/static/chunks/main.js" 
        />
      </head>
      <body className={`min-h-screen flex flex-col antialiased font-body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip link for keyboard accessibility */}
          <SkipLink targetId="main-content" />
          
          <ClientInitScript />
          {/* Use Suspense boundaries for better loading experience */}
          <Suspense fallback={<div className="fixed top-0 w-full h-2 bg-primary/30 animate-pulse"></div>}>
            <Header />
          </Suspense>
          
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {/* Content wrapped in Suspense for better loading */}
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
              {children}
            </Suspense>
          </main>
          
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          
          <Toaster />
          
          {/* Performance monitoring */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
