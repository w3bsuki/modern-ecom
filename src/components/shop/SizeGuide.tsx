"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Ruler, 
  Info, 
  RefreshCw,
  Check,
  Tape
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SizeChartData {
  sizes: string[];
  headers: string[];
  rows: {
    label: string;
    values: string[];
    unit: string;
  }[];
}

// Size charts for different product categories
const sizeCharts: Record<string, SizeChartData> = {
  tops: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    headers: ["SIZE", "CHEST", "WAIST", "HIPS", "LENGTH"],
    rows: [
      {
        label: "Chest",
        values: ["32-34", "34-36", "38-40", "42-44", "46-48", "50-52"],
        unit: "in"
      },
      {
        label: "Waist",
        values: ["26-28", "28-30", "32-34", "36-38", "40-42", "44-46"],
        unit: "in"
      },
      {
        label: "Hips",
        values: ["34-36", "36-38", "40-42", "44-46", "48-50", "52-54"],
        unit: "in"
      },
      {
        label: "Length",
        values: ["24-25", "25-26", "26-27", "27-28", "28-29", "29-30"],
        unit: "in"
      }
    ]
  },
  bottoms: {
    sizes: ["XS (0-2)", "S (4-6)", "M (8-10)", "L (12-14)", "XL (16-18)", "XXL (20-22)"],
    headers: ["SIZE", "WAIST", "HIPS", "INSEAM"],
    rows: [
      {
        label: "Waist",
        values: ["24-26", "27-29", "30-32", "33-35", "36-38", "40-42"],
        unit: "in"
      },
      {
        label: "Hips",
        values: ["34-36", "37-39", "40-42", "43-45", "46-48", "49-51"],
        unit: "in"
      },
      {
        label: "Inseam",
        values: ["29-30", "30-31", "31-32", "32-33", "33-34", "34-35"],
        unit: "in"
      }
    ]
  },
  dresses: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    headers: ["SIZE", "BUST", "WAIST", "HIPS", "LENGTH"],
    rows: [
      {
        label: "Bust",
        values: ["32-34", "34-36", "38-40", "42-44", "46-48", "50-52"],
        unit: "in"
      },
      {
        label: "Waist",
        values: ["25-27", "28-30", "31-33", "34-36", "37-39", "40-42"],
        unit: "in"
      },
      {
        label: "Hips",
        values: ["35-37", "38-40", "41-43", "44-46", "47-49", "50-52"],
        unit: "in"
      },
      {
        label: "Length",
        values: ["35-36", "36-37", "37-38", "38-39", "39-40", "40-41"],
        unit: "in"
      }
    ]
  }
};

// Measurement guide instructions
const measurementGuides = {
  chest: {
    title: "How to Measure Your Chest",
    description: "Stand with your arms relaxed at your sides. Measure around the fullest part of your chest, keeping the tape parallel to the floor.",
    image: "/images/size-guide/chest-measurement.jpg"
  },
  waist: {
    title: "How to Measure Your Waist",
    description: "Measure around your natural waistline, keeping the tape comfortably loose. This is typically the narrowest part of your waist.",
    image: "/images/size-guide/waist-measurement.jpg"
  },
  hips: {
    title: "How to Measure Your Hips",
    description: "Stand with your feet together. Measure around the fullest part of your hips, keeping the tape parallel to the floor.",
    image: "/images/size-guide/hip-measurement.jpg"
  },
  inseam: {
    title: "How to Measure Your Inseam",
    description: "Measure from the crotch to the bottom of your ankle. For best results, measure on a pair of pants that fit you well.",
    image: "/images/size-guide/inseam-measurement.jpg"
  }
};

// Size Calculator Component
const SizeCalculator = () => {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hips: ""
  });
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  const handleUnitChange = (value: string) => {
    setUnit(value as "in" | "cm");
    // Reset measurements when changing units
    setMeasurements({
      bust: "",
      waist: "",
      hips: ""
    });
    setRecommendedSize(null);
  };

  const handleMeasurementChange = (field: keyof typeof measurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
    setRecommendedSize(null);
  };

  const calculateSize = () => {
    // Basic size calculation logic
    // In a real application, this would be more sophisticated
    const bust = parseFloat(measurements.bust) || 0;
    const waist = parseFloat(measurements.waist) || 0;
    const hips = parseFloat(measurements.hips) || 0;
    
    // Convert to inches if measurements are in cm
    const bustInches = unit === "cm" ? bust / 2.54 : bust;
    const waistInches = unit === "cm" ? waist / 2.54 : waist;
    const hipsInches = unit === "cm" ? hips / 2.54 : hips;
    
    // Simple logic to determine size based on bust measurement
    // This would be more complex in a real application
    let size = "";
    if (bustInches < 34) size = "XS";
    else if (bustInches < 36) size = "S";
    else if (bustInches < 40) size = "M";
    else if (bustInches < 44) size = "L";
    else if (bustInches < 48) size = "XL";
    else size = "XXL";
    
    setRecommendedSize(size);
  };

  const isFormValid = () => {
    return measurements.bust && measurements.waist && measurements.hips;
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Size Calculator</h3>
      <p className="text-gray-600 mb-6">
        Enter your measurements to find your perfect size
      </p>
      
      <div className="mb-4">
        <Label className="mb-2 block">Unit of Measurement</Label>
        <div className="flex gap-4">
          <button
            className={cn(
              "px-4 py-2 rounded-md border border-gray-300",
              unit === "in" ? "bg-black text-white" : "bg-white text-gray-800"
            )}
            onClick={() => handleUnitChange("in")}
          >
            Inches
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md border border-gray-300",
              unit === "cm" ? "bg-black text-white" : "bg-white text-gray-800"
            )}
            onClick={() => handleUnitChange("cm")}
          >
            Centimeters
          </button>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="bust">Bust/Chest ({unit})</Label>
          <div className="flex items-center">
            <Input 
              id="bust"
              type="number" 
              placeholder={`Enter bust/chest measurement in ${unit}`}
              value={measurements.bust}
              onChange={(e) => handleMeasurementChange("bust", e.target.value)}
              className="mt-1"
            />
            <InfoTooltip content={measurementGuides.chest.description} />
          </div>
        </div>
        
        <div>
          <Label htmlFor="waist">Waist ({unit})</Label>
          <div className="flex items-center">
            <Input 
              id="waist"
              type="number" 
              placeholder={`Enter waist measurement in ${unit}`}
              value={measurements.waist}
              onChange={(e) => handleMeasurementChange("waist", e.target.value)}
              className="mt-1"
            />
            <InfoTooltip content={measurementGuides.waist.description} />
          </div>
        </div>
        
        <div>
          <Label htmlFor="hips">Hips ({unit})</Label>
          <div className="flex items-center">
            <Input 
              id="hips"
              type="number" 
              placeholder={`Enter hips measurement in ${unit}`}
              value={measurements.hips}
              onChange={(e) => handleMeasurementChange("hips", e.target.value)}
              className="mt-1"
            />
            <InfoTooltip content={measurementGuides.hips.description} />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={calculateSize} 
        disabled={!isFormValid()}
        className="w-full"
      >
        Find My Size
      </Button>
      
      {recommendedSize && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Check className="text-green-500" size={18} />
            <h4 className="font-medium">Your Recommended Size</h4>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-black">{recommendedSize}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setMeasurements({
                  bust: "",
                  waist: "",
                  hips: ""
                });
                setRecommendedSize(null);
              }}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Reset
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is a recommended size based on your measurements. For the best fit, please refer to the detailed size chart.
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Info tooltip component
const InfoTooltip = ({ content }: { content: string }) => {
  return (
    <div className="relative flex items-center group ml-2">
      <Info size={16} className="text-gray-400" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-black w-0 h-0"></div>
      </div>
    </div>
  );
};

// Main SizeGuide Component
export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("tops");
  const [unit, setUnit] = useState<"in" | "cm">("in");
  
  const handleUnitChange = (value: string) => {
    setUnit(value as "in" | "cm");
  };
  
  const renderSizeChart = (categoryKey: string) => {
    const chart = sizeCharts[categoryKey];
    if (!chart) return null;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {chart.headers.map((header, index) => (
                <th key={index} className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.sizes.map((size, sizeIndex) => (
              <tr key={sizeIndex} className={sizeIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-3 px-4 text-sm font-medium">{size}</td>
                {chart.rows.map((row, rowIndex) => (
                  rowIndex < chart.headers.length - 1 && (
                    <td key={rowIndex} className="py-3 px-4 text-sm text-gray-600">
                      {row.values[sizeIndex]} {row.unit}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-sm flex items-center gap-1.5 h-8 px-3"
          aria-label="Size Guide"
        >
          <Ruler size={14} />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Size Guide</DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive size guide and measurement tools.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="chart" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Size Charts</TabsTrigger>
            <TabsTrigger value="measure">How to Measure</TabsTrigger>
            <TabsTrigger value="calculator">Size Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-x-1">
                  <Button 
                    variant={activeTab === "tops" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveTab("tops")}
                  >
                    Tops
                  </Button>
                  <Button 
                    variant={activeTab === "bottoms" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveTab("bottoms")}
                  >
                    Bottoms
                  </Button>
                  <Button 
                    variant={activeTab === "dresses" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveTab("dresses")}
                  >
                    Dresses
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Units:</span>
                  <Select 
                    defaultValue={unit} 
                    onValueChange={handleUnitChange}
                  >
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Inches</SelectItem>
                      <SelectItem value="cm">Centimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {renderSizeChart(activeTab)}
              
              <div className="text-sm text-gray-600 mt-4">
                <p className="italic">Note: All measurements are body measurements, not garment measurements. For a more relaxed fit, we recommend sizing up.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="measure" className="mt-6">
            <div className="space-y-6">
              <p className="text-gray-600">
                To ensure the best fit, take your measurements accurately using a cloth measuring tape. Stand in a relaxed position and have someone help you if possible.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(measurementGuides).map(([key, guide]) => (
                  <div key={key} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{guide.title}</h3>
                      <p className="text-sm text-gray-600">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Tape className="h-10 w-10 text-gray-800" />
                <div>
                  <h3 className="font-medium">Measuring Tips</h3>
                  <p className="text-sm text-gray-600">For the most accurate measurements, wear only lightweight clothes or measure directly against your skin.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <SizeCalculator />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
} 