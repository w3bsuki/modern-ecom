"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  badgeCount?: number;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export function ShopDrawer({
  isOpen,
  onClose,
  title,
  icon,
  children,
  badgeCount,
  className,
  contentClassName,
  headerClassName,
}: ShopDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className={cn(
        "max-w-md bg-black text-white border-l border-white/20 h-[100dvh] overflow-hidden mx-0 rounded-none",
        className
      )}>
        <DrawerHeader className={cn(
          "sticky top-0 z-10 border-b border-white/20 bg-black p-4",
          headerClassName
        )}>
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-lg font-semibold flex items-center text-white">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
              {typeof badgeCount === 'number' && badgeCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-6 w-auto px-2 rounded-full bg-white text-black text-xs font-bold">
                  {badgeCount} {badgeCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </DrawerTitle>
            <DrawerClose className="p-1.5 -mr-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white">
              <X size={22} />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className={cn(
          "flex-1 overflow-y-auto h-[calc(100vh-4rem)]",
          contentClassName
        )}>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 