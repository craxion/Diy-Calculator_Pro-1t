"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Calculator, Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white text-dark-grey shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Calculator className="h-7 w-7 text-primary-navy group-hover:opacity-80 transition-opacity" />
          <span className="font-bold text-xl text-dark-grey group-hover:text-primary-navy transition-colors">
            DIYCalculatorPro
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 border border-light-grey rounded-md px-3 py-1.5 bg-white focus-within:ring-1 focus-within:ring-primary-navy transition-all">
          <Search className="h-4 w-4 text-medium-grey" />
          <Input
            type="search"
            placeholder="Search calculators..."
            className="w-48 h-7 text-sm bg-transparent border-none focus:ring-0 text-dark-grey placeholder:text-medium-grey"
          />
        </div>
      </div>
    </header>
  )
}
