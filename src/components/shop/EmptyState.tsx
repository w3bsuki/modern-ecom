"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText = "Continue Shopping",
  actionLink = "/collections",
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center flex-1 h-full py-20 px-4 text-center",
      className
    )}>
      <div className="w-16 h-16 mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <p className="text-zinc-400 mb-6 max-w-xs">
        {description}
      </p>
      
      {actionLink && !onAction ? (
        <Link href={actionLink} onClick={onAction}>
          <Button variant="outline" className="border-white/20">
            {actionText}
          </Button>
        </Link>
      ) : (
        <Button 
          variant="outline" 
          className="border-white/20"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
} 