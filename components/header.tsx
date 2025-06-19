"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calculator, Menu, Search } from "lucide-react"
import { calculatorCategories, createUrlSlug, generateCalculatorUrl } from "@/lib/utils/url-slug"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

// Define sub-category structure for mega menus
// This would ideally be part of your `calculatorCategories` data structure or a separate config
interface SubCategory {
  title: string
  calculators: string[] // Array of calculator names
}

interface MegaMenuCategory {
  [mainCategory: string]: SubCategory[]
}

const megaMenuConfig: MegaMenuCategory = {
  "Construction & Building": [
    {
      title: "Concrete & Masonry",
      calculators: ["Concrete Slab Calculator", "Concrete Footing Calculator" /* Add CMU Block Wall if exists */],
    },
    {
      title: "Framing & Walls",
      calculators: ["Wall Framing Calculator" /* Add Drywall Calculator if exists */],
    },
    { title: "Excavation", calculators: ["Excavation Volume and Cost Calculator"] },
    { title: "General Math", calculators: ["Fraction Calculator"] },
  ],
  "Carpentry & Woodworking": [
    { title: "Lumber & Cuts", calculators: ["Lumber Cut Optimizer"] },
    // Add more sub-categories and calculators for Carpentry
  ],
  "Landscaping & Outdoor": [
    { title: "Materials", calculators: ["Soil and Mulch Calculator"] },
    { title: "Water Management", calculators: ["Water Flow GPM Calculator"] },
    // Add more sub-categories and calculators for Landscaping
  ],
  "Painting & Finishing": [
    { title: "Painting Projects", calculators: ["Paint Project Calculator"] },
    { title: "Deck Care", calculators: ["Deck Stain and Sealer Calculator"] },
  ],
  "Electrical & Plumbing": [
    { title: "Electrical Basics", calculators: ["Ohms Law Calculator"] },
    // Add more for plumbing
  ],
  "Conversions & Math": [
    {
      title: "Basic Conversions",
      calculators: ["Length Converter", "Area Converter", "Volume Converter" /* Add Weight, Temp */],
    },
    { title: "Geometry", calculators: ["Advanced Triangle Calculator"] },
    // Add Percentage Calculator
  ],
  "Household Solutions & Mixing": [{ title: "Dilutions", calculators: ["Chemical and Liquid Dilution Calculator"] }],
  "Home & Craft Projects": [{ title: "Resin & Epoxy", calculators: ["Resin and Epoxy Calculator"] }],
  // Define other main categories and their sub-categories here
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const implementedCategories = Object.entries(calculatorCategories)
    .filter(([_, calcs]) => calcs.some((calc) => calc.implemented))
    .map(([categoryName, calcs]) => ({
      name: categoryName,
      slug: createUrlSlug(categoryName),
      calculators: calcs.filter((c) => c.implemented),
      subCategories: megaMenuConfig[categoryName] || [],
    }))

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

        {/* Desktop Navigation with Mega Menus */}
        <NavigationMenu className="hidden md:flex flex-1 justify-start ml-8">
          <NavigationMenuList>
            {implementedCategories.map((category) => (
              <NavigationMenuItem key={category.name}>
                <NavigationMenuTrigger
                  className={cn(
                    "text-xs font-medium", // Changed from text-sm to text-xs for better fit
                    pathname.startsWith(`/calculators/${category.slug}`)
                      ? "text-primary-navy"
                      : "text-dark-grey hover:text-primary-navy",
                  )}
                >
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid p-6 gap-6 md:w-[600px] lg:w-[760px] lg:grid-cols-3 md:grid-cols-2 bg-white shadow-lg">
                    {category.subCategories.length > 0 ? (
                      category.subCategories.map((subCategory) => (
                        <div key={subCategory.title} className="flex flex-col space-y-2">
                          <h3 className="font-semibold text-md text-dark-grey mb-1">{subCategory.title}</h3>
                          {subCategory.calculators.map((calcName) => {
                            const calcInfo = category.calculators.find((c) => c.name === calcName)
                            if (!calcInfo) return null
                            return (
                              <Link
                                key={calcName}
                                href={generateCalculatorUrl(category.name, calcName)}
                                legacyBehavior
                                passHref
                              >
                                <NavigationMenuLink className="block text-sm text-medium-grey hover:text-primary-navy hover:underline py-1">
                                  {calcName}
                                </NavigationMenuLink>
                              </Link>
                            )
                          })}
                        </div>
                      ))
                    ) : (
                      // Fallback if no subcategories defined, list all calculators for the category
                      <div className="flex flex-col space-y-2 col-span-full">
                        <h3 className="font-semibold text-md text-dark-grey mb-1">{category.name} Calculators</h3>
                        {category.calculators.map((calcInfo) => (
                          <Link
                            key={calcInfo.name}
                            href={generateCalculatorUrl(category.name, calcInfo.name)}
                            legacyBehavior
                            passHref
                          >
                            <NavigationMenuLink className="block text-sm text-medium-grey hover:text-primary-navy hover:underline py-1">
                              {calcInfo.name}
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 border border-light-grey rounded-md px-3 py-1.5 bg-white focus-within:ring-1 focus-within:ring-primary-navy transition-all">
          <Search className="h-4 w-4 text-medium-grey" />
          <Input
            type="search"
            placeholder="Search calculators..."
            className="w-48 h-7 text-sm bg-transparent border-none focus:ring-0 text-dark-grey placeholder:text-medium-grey"
          />
        </div>

        {/* Mobile Navigation (Sheet) */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-dark-grey hover:bg-light-grey">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-xs bg-dark-grey text-brand-white border-l-medium-grey/50 p-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2 mt-8">
              {implementedCategories.map((category) => (
                <div key={`mobile-cat-${category.slug}`}>
                  <h3 className="text-brand-white font-semibold text-md mb-2 mt-3 px-3">{category.name}</h3>
                  {category.calculators.map((calculator) => (
                    <Button
                      key={`mobile-calc-${calculator.name}`}
                      variant="ghost"
                      asChild
                      className={`w-full justify-start text-base py-2 pl-6 hover:bg-medium-grey/50 hover:text-secondary-navy
                        ${pathname === generateCalculatorUrl(category.name, calculator.name) ? "text-secondary-navy bg-medium-grey/30 font-semibold" : "text-brand-white"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={generateCalculatorUrl(category.name, calculator.name)}>{calculator.name}</Link>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
