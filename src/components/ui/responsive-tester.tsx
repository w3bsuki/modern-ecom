"use client";

import React, { useState } from "react";
import { X, Monitor, Smartphone, Tablet, ArrowLeft, ArrowRight } from "lucide-react";

const devices = [
  { name: "Mobile S", width: 320, icon: Smartphone },
  { name: "Mobile M", width: 375, icon: Smartphone },
  { name: "Mobile L", width: 425, icon: Smartphone },
  { name: "Tablet", width: 768, icon: Tablet },
  { name: "Laptop", width: 1024, icon: Monitor },
  { name: "Laptop L", width: 1440, icon: Monitor },
  { name: "4K", width: 2560, icon: Monitor },
];

interface ResponsiveTesterProps {
  targetUrl?: string;
  onClose: () => void;
}

export function ResponsiveTester({ targetUrl = "/", onClose }: ResponsiveTesterProps) {
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(3); // Default to Tablet
  const activeDevice = devices[activeDeviceIndex];
  
  const handlePrevDevice = () => {
    setActiveDeviceIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleNextDevice = () => {
    setActiveDeviceIndex((prev) => (prev < devices.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium">Responsive Testing Mode</h2>
          <div className="px-2 py-1 bg-white/10 rounded text-xs">
            {activeDevice.width}px
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDevice}
              disabled={activeDeviceIndex === 0}
              className="p-2 hover:bg-white/10 rounded disabled:opacity-30"
              aria-label="Previous device"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            
            <div className="flex gap-2">
              {devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <button
                    key={device.name}
                    onClick={() => setActiveDeviceIndex(index)}
                    className={`p-2 rounded ${
                      index === activeDeviceIndex
                        ? "bg-white text-black"
                        : "hover:bg-white/10"
                    }`}
                    aria-label={device.name}
                    title={`${device.name} (${device.width}px)`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextDevice}
              disabled={activeDeviceIndex === devices.length - 1}
              className="p-2 hover:bg-white/10 rounded disabled:opacity-30"
              aria-label="Next device"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded"
            aria-label="Close responsive tester"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Frame container with adjusted height */}
      <div 
        className="bg-white rounded-md shadow-lg flex-1 overflow-hidden flex items-start justify-center"
        style={{ 
          maxHeight: "calc(100vh - 100px)",
          width: "100%", 
          maxWidth: "calc(100vw - 32px)"
        }}
      >
        <div
          className="h-full transform-gpu transition-all duration-300 ease-in-out"
          style={{ 
            width: `${activeDevice.width}px`,
            maxWidth: "100%"
          }}
        >
          <iframe
            src={targetUrl}
            title="Responsive Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>
      
      {/* Device info */}
      <div className="w-full max-w-6xl mt-4 text-white text-sm flex items-center justify-between">
        <div>
          <span className="font-medium">{activeDevice.name}</span>
          <span className="text-white/60 ml-2">{activeDevice.width} x auto</span>
        </div>
        
        <div className="text-white/60">
          Use the controls above to switch between device sizes
        </div>
      </div>
    </div>
  );
}

export default ResponsiveTester; 