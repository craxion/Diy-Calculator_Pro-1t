"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calculator, Menu, Search } from "lucide-react" // Added Settings, Info

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-medium-grey/50 bg-dark-grey text-brand-white shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Calculator className="h-7 w-7 text-primary-green group-hover:animate-pulse" />
          <span className="font-bold text-xl text-brand-white group-hover:text-secondary-green transition-colors">
            DIYCalculatorPro
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 border border-medium-grey rounded-md px-2 py-1 bg-medium-grey/20 focus-within:ring-2 focus-within:ring-primary-green transition-all">
            <Search className="h-4 w-4 text-light-grey" />
            <Input
              type="search"
              placeholder="Search calculators..."
              className="w-48 h-8 text-sm bg-transparent border-none focus:ring-0 text-brand-white placeholder:text-light-grey/70"
            />
          </div>

          {/* Example: Settings/Theme Toggle Icon Button - can be implemented later */}
          {/* <Button variant="ghost" size="icon" className="text-brand-white hover:bg-medium-grey/50 hover:text-primary-green">
            <Settings className="h-5 w-5" />
          </Button> */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-white hover:bg-medium-grey/50 hover:text-primary-green"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs bg-dark-grey text-brand-white border-l-medium-grey/50 p-6"
            >
              <div className="flex flex-col space-y-3 mt-8">
                <div className="lg:hidden flex items-center space-x-2 border border-medium-grey rounded-md px-2 py-2 mt-4 bg-medium-grey/20 focus-within:ring-2 focus-within:ring-primary-green transition-all">
                  <Search className="h-5 w-5 text-light-grey" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full h-8 text-md bg-transparent border-none focus:ring-0 text-brand-white placeholder:text-light-grey/70"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
