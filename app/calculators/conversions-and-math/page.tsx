import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowRight, Ruler, Scale, Thermometer, Percent } from "lucide-react"

export default function ConversionsAndMathPage() {
  const calculators = [
    {
      title: "Length Converter",
      description: "Convert between feet, inches, meters, centimeters, and other length measurements.",
      href: "/calculators/conversions-and-math/length-converter",
      icon: Ruler,
      features: ["Imperial & metric", "Multiple units", "Precision conversion", "Construction units"],
      implemented: false,
    },
    {
      title: "Area Converter",
      description: "Convert between square feet, square meters, acres, and other area measurements.",
      href: "/calculators/conversions-and-math/area-converter",
      icon: Calculator,
      features: ["Square measurements", "Land area units", "Construction areas", "Precision results"],
      implemented: false,
    },
    {
      title: "Volume Converter",
      description: "Convert between gallons, liters, cubic feet, and other volume measurements.",
      href: "/calculators/conversions-and-math/volume-converter",
      icon: Calculator,
      features: ["Liquid volumes", "Cubic measurements", "Tank capacities", "Multiple systems"],
      implemented: false,
    },
    {
      title: "Weight Converter",
      description: "Convert between pounds, kilograms, tons, and other weight measurements.",
      href: "/calculators/conversions-and-math/weight-converter",
      icon: Scale,
      features: ["Imperial & metric", "Heavy materials", "Precision weights", "Construction loads"],
      implemented: false,
    },
    {
      title: "Temperature Converter",
      description: "Convert between Fahrenheit, Celsius, and Kelvin temperature scales.",
      href: "/calculators/conversions-and-math/temperature-converter",
      icon: Thermometer,
      features: ["F to C conversion", "Weather temps", "Industrial scales", "Precise calculations"],
      implemented: false,
    },
    {
      title: "Percentage Calculator",
      description: "Calculate percentages, percentage increases, decreases, and percentage of totals.",
      href: "/calculators/conversions-and-math/percentage-calculator",
      icon: Percent,
      features: ["Percentage of total", "Increase/decrease", "Markup calculations", "Discount math"],
      implemented: false,
    },
    {
      title: "Ratio Calculator",
      description: "Calculate ratios, proportions, and scaling factors for construction and design.",
      href: "/calculators/conversions-and-math/ratio-calculator",
      icon: Calculator,
      features: ["Mix ratios", "Scale factors", "Proportional sizing", "Recipe scaling"],
      implemented: false,
    },
    {
      title: "Right Triangle Calculator",
      description: "Calculate sides, angles, and area of right triangles using Pythagorean theorem.",
      href: "/calculators/conversions-and-math/right-triangle-calculator",
      icon: Calculator,
      features: ["Pythagorean theorem", "Angle calculations", "Construction layouts", "Roof calculations"],
      implemented: false,
    },
  ]

  const implementedCalculators = calculators.filter((calc) => calc.implemented)
  const upcomingCalculators = calculators.filter((calc) => !calc.implemented)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary-navy" />
            <h1 className="text-4xl font-bold text-primary-navy">Conversions & Math Calculators</h1>
          </div>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Essential conversion tools and mathematical calculators for construction, engineering, and everyday
            calculations.
          </p>
        </div>

        {/* Available Calculators */}
        {implementedCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Available Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {implementedCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-navy/20"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-navy/10 rounded-lg group-hover:bg-primary-navy/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary-navy" />
                        </div>
                        <CardTitle className="text-xl">{calc.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{calc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {calc.features.map((feature) => (
                            <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <Link href={calc.href}>
                          <Button className="w-full group-hover:bg-primary-navy/90 transition-colors">
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
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary-navy mb-6">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingCalculators.map((calc) => {
              const IconComponent = calc.icon
              return (
                <Card key={calc.href} className="opacity-75 border-dashed border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-gray-500" />
                      </div>
                      <CardTitle className="text-xl text-gray-700">{calc.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{calc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {calc.features.map((feature) => (
                          <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
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

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Why Use Conversion Tools?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
                <li>• Avoid costly measurement errors in construction</li>
                <li>• Work seamlessly between imperial and metric systems</li>
                <li>• Ensure accurate material ordering and planning</li>
                <li>• Convert between different unit systems quickly</li>
                <li>• Maintain precision in technical calculations</li>
                <li>• Save time with instant, accurate conversions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mathematical Precision</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
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
