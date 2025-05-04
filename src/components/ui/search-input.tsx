"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  clearable?: boolean;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  clearable = true,
  loading = false,
  className,
  inputClassName,
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
    // Blur input to hide mobile keyboard
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleClear = () => {
    onChange("");
    // Focus input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "relative flex w-full items-center rounded-md",
        isFocused && "ring-1 ring-ring",
        className
      )}
    >
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {loading ? (
          <div className="animate-spin h-4 w-4">
            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      
      <input
        id="search-input"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "block w-full py-2 pl-10 pr-10 text-sm bg-background border border-input rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-input",
          "disabled:cursor-not-allowed disabled:opacity-50",
          inputClassName
        )}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {clearable && value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 flex items-center pr-3 h-full hover:bg-transparent"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
    </form>
  );
} 