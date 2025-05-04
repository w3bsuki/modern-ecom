"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // Only show the theme toggle on the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
        >
          {mounted ? (
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.span
                  key="light"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                </motion.span>
              ) : theme === "dark" ? (
                <motion.span
                  key="dark"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                </motion.span>
              ) : (
                <motion.span
                  key="system"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Laptop className="h-[1.2rem] w-[1.2rem]" />
                </motion.span>
              )}
            </AnimatePresence>
          ) : (
            // This ensures the same size is reserved during server rendering
            <span className="h-[1.2rem] w-[1.2rem]"></span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px] font-medium">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {mounted && theme === "light" && (
            <span className="absolute right-2 flex h-2 w-2 rounded-full bg-black dark:bg-white"></span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {mounted && theme === "dark" && (
            <span className="absolute right-2 flex h-2 w-2 rounded-full bg-black dark:bg-white"></span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
          {mounted && theme === "system" && (
            <span className="absolute right-2 flex h-2 w-2 rounded-full bg-black dark:bg-white"></span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 