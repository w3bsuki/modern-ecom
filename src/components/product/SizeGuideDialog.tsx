"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SizeInfo {
  size: string;
  measurements: {
    [key: string]: string | number;
  };
}

interface SizeGuideDialogProps {
  productType?: "hat" | "cap" | "beanie" | "snapback" | "custom";
  sizeData?: SizeInfo[];
  productImage?: string;
  className?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export function SizeGuideDialog({
  productType = "hat",
  sizeData,
  productImage,
  className,
  children,
  trigger
}: SizeGuideDialogProps) {
  // Default size data for hats if none is provided
  const defaultSizeData: Record<string, SizeInfo[]> = {
    hat: [
      {
        size: "S",
        measurements: {
          "Head Circumference": "21-22 inches (53-56 cm)",
          "US Size": "6⅝-7",
          "UK Size": "6½-6⅞",
          "EU Size": "53-56"
        }
      },
      {
        size: "M",
        measurements: {
          "Head Circumference": "22-23 inches (56-58 cm)",
          "US Size": "7-7⅜",
          "UK Size": "6⅞-7¼",
          "EU Size": "56-58"
        }
      },
      {
        size: "L",
        measurements: {
          "Head Circumference": "23-24 inches (58-61 cm)",
          "US Size": "7⅜-7⅝",
          "UK Size": "7¼-7½",
          "EU Size": "58-61"
        }
      },
      {
        size: "XL",
        measurements: {
          "Head Circumference": "24-25 inches (61-63 cm)",
          "US Size": "7⅝-7⅞",
          "UK Size": "7½-7¾",
          "EU Size": "61-63"
        }
      }
    ],
    cap: [
      {
        size: "S/M",
        measurements: {
          "Head Circumference": "21-22.5 inches (53-57 cm)",
          "Cap Size": "6⅝-7⅛",
          "Fitted Size": "Small to Medium"
        }
      },
      {
        size: "L/XL",
        measurements: {
          "Head Circumference": "22.5-24 inches (57-61 cm)",
          "Cap Size": "7⅛-7⅝",
          "Fitted Size": "Large to X-Large"
        }
      },
      {
        size: "One Size",
        measurements: {
          "Head Circumference": "21-23.5 inches (53-60 cm)",
          "Cap Size": "6⅝-7½",
          "Fitted Size": "Adjustable"
        }
      }
    ],
    snapback: [
      {
        size: "One Size",
        measurements: {
          "Head Circumference": "21-24 inches (53-61 cm)",
          "Adjustment Type": "Snap closure",
          "Fit": "Adjustable"
        }
      }
    ],
    beanie: [
      {
        size: "S/M",
        measurements: {
          "Head Circumference": "21-22.5 inches (53-57 cm)",
          "Material": "Stretchable",
          "Fit": "Snug"
        }
      },
      {
        size: "L/XL",
        measurements: {
          "Head Circumference": "22.5-24 inches (57-61 cm)",
          "Material": "Stretchable",
          "Fit": "Relaxed"
        }
      },
      {
        size: "One Size",
        measurements: {
          "Head Circumference": "21-24 inches (53-61 cm)",
          "Material": "Highly Stretchable",
          "Fit": "Universal"
        }
      }
    ]
  };

  const sizes = sizeData || defaultSizeData[productType] || defaultSizeData.hat;
  
  // Get all measurement keys for the table headers
  const measurementKeys = sizes.length > 0 
    ? Object.keys(sizes[0].measurements) 
    : [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "flex gap-1.5 text-xs font-medium",
              className
            )}
          >
            <Ruler className="h-3.5 w-3.5" />
            Size Guide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl">Size Guide</DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Find your perfect fit
            </DialogDescription>
          </div>
          <DialogClose className="rounded-full p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        <Tabs defaultValue="sizes" className="w-full">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="sizes">Size Chart</TabsTrigger>
              <TabsTrigger value="how-to-measure">How to Measure</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="sizes" className="p-6 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 bg-muted/50 border-b font-medium text-sm">Size</th>
                    {measurementKeys.map((key) => (
                      <th 
                        key={key} 
                        className="text-left py-2 px-3 bg-muted/50 border-b font-medium text-sm"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, index) => (
                    <tr 
                      key={size.size}
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    >
                      <td className="py-3 px-3 border-b border-border/50 font-medium">
                        {size.size}
                      </td>
                      {measurementKeys.map((key) => (
                        <td 
                          key={key} 
                          className="py-3 px-3 border-b border-border/50"
                        >
                          {size.measurements[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>Sizes may vary slightly between styles and brands</span>
            </div>
          </TabsContent>
          
          <TabsContent value="how-to-measure" className="p-6 pt-4">
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted/50">
                {productImage ? (
                  <Image
                    src={productImage}
                    alt="How to measure for the right hat size"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/measuring-hat-size.jpg"
                      alt="How to measure for the right hat size"
                      width={400}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
              
              <h3 className="font-medium text-lg">How to Measure Your Head Size</h3>
              
              <ol className="space-y-3 list-decimal pl-5">
                <li className="text-sm">
                  <span className="font-medium">Use a soft measuring tape:</span> A soft, flexible measuring tape works best for an accurate measurement.
                </li>
                <li className="text-sm">
                  <span className="font-medium">Position the tape correctly:</span> Place the measuring tape around your head, just above your ears and across your mid-forehead, where a hat would naturally sit.
                </li>
                <li className="text-sm">
                  <span className="font-medium">Measure in inches or centimeters:</span> Take the measurement and refer to our size chart to find your perfect fit.
                </li>
                <li className="text-sm">
                  <span className="font-medium">No measuring tape?</span> Use a string or ribbon, mark where it meets, and measure against a ruler.
                </li>
              </ol>
              
              <div className="bg-muted/30 p-4 rounded-lg text-sm mt-4">
                <h4 className="font-medium mb-2">Tips for the Perfect Fit</h4>
                <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                  <li>Your hat should feel snug but not tight</li>
                  <li>A properly fitted hat sits about one finger-width above your eyebrows</li>
                  <li>If between sizes, choose the larger size</li>
                  <li>Different hat styles may fit differently</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SizeGuideDialog; 