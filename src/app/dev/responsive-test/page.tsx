"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveTester } from "@/components/ui/responsive-tester";

export default function ResponsiveTestPage() {
  const [url, setUrl] = useState("/");
  const [showTester, setShowTester] = useState(false);
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTester(true);
  };
  
  const handleClose = () => {
    setShowTester(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-medium">Responsive Testing Tool</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Test Responsive Layouts</h2>
          
          <p className="mb-6 text-gray-600">
            This tool helps you test how your site looks on different device sizes.
            Enter a URL to test (relative paths like "/products" are also supported).
          </p>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to test (e.g., /collections)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Test
              </button>
            </div>
          </form>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Homepage", path: "/" },
                { name: "Collections", path: "/collections" },
                { name: "Product Detail", path: "/product/baseball-cap" },
                { name: "Cart", path: "/cart" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    setUrl(link.path);
                    setShowTester(true);
                  }}
                  className="text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <span className="font-medium">{link.name}</span>
                  <span className="block text-sm text-gray-500">{link.path}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
        <p>Responsive testing utility for internal development use only.</p>
      </footer>
      
      {showTester && <ResponsiveTester targetUrl={url} onClose={handleClose} />}
    </div>
  );
} 