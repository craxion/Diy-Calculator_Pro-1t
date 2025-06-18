import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  ArrowRight,
  Ruler,
  Scale,
  Thermometer,
  Percent,
  Triangle,
  Maximize,
  Sigma,
  DivideSquare,
} from "lucide-react"
import { calculatorCategories, createUrlSlug, getImplementedCalculators } from "@/lib/utils/url-slug"

export default function ConversionsAndMathPage() {
  const categoryName = "Conversions and Math"
  const categoryCalculators = calculatorCategories[categoryName]

  const iconMap: Record<string, React.ElementType> = {
    "Advanced Triangle Calculator": Triangle,
    "Fraction Calculator": DivideSquare,
    "Length Converter": Ruler,
    "Area Converter": Maximize,
    "Volume Converter": Sigma,
    "Weight Converter": Scale,
    "Temperature Converter": Thermometer,
    "Percentage Calculator": Percent,
    "Ratio Calculator": Calculator,
  }

  const implementedCalculators = getImplementedCalculators(categoryName).map((calc) => ({
    ...calc,
    href: `/calculators/${createUrlSlug(categoryName)}/${createUrlSlug(calc.name)}`,
    description: `Perform ${calc.name.toLowerCase()}.`, // Adjusted description
    icon: iconMap[calc.name] || Calculator, // Use mapped icon or default
    features: ["Precise calculations", "Unit conversions", "User-friendly"], // Generic features
  }))

  const upcomingCalculators = categoryCalculators
    .filter((calc) => !calc.implemented)
    .map((calc) => ({
      ...calc,
      href: `/calculators/${createUrlSlug(categoryName)}/${createUrlSlug(calc.name)}`,
      description: `Upcoming: ${calc.name.toLowerCase()}.`,
      icon: iconMap[calc.name] || Calculator,
      features: ["Coming soon"],
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary-navy dark:text-sky-400" />
            <h1 className="text-4xl font-bold text-primary-navy dark:text-white">Conversions & Math Calculators</h1>
          </div>
          <p className="text-lg text-medium-grey dark:text-gray-300 max-w-2xl mx-auto">
            Essential conversion tools and mathematical calculators for construction, engineering, and everyday
            calculations.
          </p>
        </div>

        {/* Available Calculators */}
        {implementedCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary-navy dark:text-white mb-6">Available Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {implementedCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-navy/20 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-sky-500/50"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-navy/10 dark:bg-sky-500/10 rounded-lg group-hover:bg-primary-navy/20 dark:group-hover:bg-sky-500/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary-navy dark:text-sky-400" />
                        </div>
                        <CardTitle className="text-xl text-gray-800 dark:text-white">{calc.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {calc.features && calc.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {calc.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-blue-100 dark:bg-sky-700/50 text-blue-800 dark:text-sky-300 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link href={calc.href}>
                          <Button className="w-full group-hover:bg-primary-navy/90 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors">
                            <Calculator className="h-4 w-4 mr-2" />
                            Use Calculator
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        {upcomingCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary-navy dark:text-white mb-6">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="opacity-75 border-dashed border-2 dark:bg-slate-800/50 dark:border-slate-700"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <CardTitle className="text-xl text-gray-700 dark:text-gray-200">{calc.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {calc.features && calc.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {calc.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                        <Button disabled className="w-full" variant="outline">
                          <Calculator className="h-4 w-4 mr-2" />
                          Coming Soon
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">Why Use Conversion Tools?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey dark:text-gray-300">
                <li>• Avoid costly measurement errors in construction</li>
                <li>• Work seamlessly between imperial and metric systems</li>
                <li>• Ensure accurate material ordering and planning</li>
                <li>• Convert between different unit systems quickly</li>
                <li>• Maintain precision in technical calculations</li>
                <li>• Save time with instant, accurate conversions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">Mathematical Precision</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey dark:text-gray-300">
                <li>• Use proper significant figures for measurements</li>
                <li>• Round appropriately for practical applications</li>
                <li>• Understand tolerance and precision requirements</li>
                <li>• Apply mathematical principles to real-world problems</li>
                <li>• Verify calculations with multiple methods</li>
                <li>• Consider measurement uncertainty in planning</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
