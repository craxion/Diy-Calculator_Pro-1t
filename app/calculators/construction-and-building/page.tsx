import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hammer, Calculator, ArrowRight, DivideSquare } from "lucide-react"
import { calculatorCategories, createUrlSlug, getImplementedCalculators } from "@/lib/utils/url-slug"

export default function ConstructionCalculatorsPage() {
  const categoryName = "Construction and Building"
  const categoryCalculators = calculatorCategories[categoryName]

  const iconMap: Record<string, React.ElementType> = {
    "Concrete Slab Calculator": Calculator,
    "Excavation Volume and Cost Calculator": Calculator,
    "Wall Framing Calculator": Calculator,
    "Fraction Calculator": DivideSquare,
    // ... other specific icons
  }

  const implementedCalculators = getImplementedCalculators(categoryName).map((calc) => ({
    ...calc,
    href: `/calculators/${createUrlSlug(categoryName)}/${createUrlSlug(calc.name)}`,
    description: `Calculate materials and costs for ${calc.name.toLowerCase().replace(" calculator", "")} projects.`,
    icon: iconMap[calc.name] || Hammer, // Default to Hammer if no specific icon
    features: ["Accurate Estimates", "Cost Calculation", "Material Planning"], // Generic features
  }))

  const upcomingCalculators = categoryCalculators
    .filter((calc) => !calc.implemented)
    .map((calc) => ({
      ...calc,
      href: `/calculators/${createUrlSlug(categoryName)}/${createUrlSlug(calc.name)}`,
      description: `Upcoming: ${calc.name.toLowerCase().replace(" calculator", "")} projects.`,
      icon: iconMap[calc.name] || Hammer,
      features: ["Coming Soon"],
    }))

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hammer className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Construction & Building Calculators</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional construction calculators for accurate material estimation, cost calculation, and project
            planning. Perfect for contractors, builders, and DIY enthusiasts.
          </p>
        </div>

        {implementedCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {implementedCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 dark:bg-card dark:border-border dark:hover:border-primary/50"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl text-card-foreground">{calc.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base text-muted-foreground">{calc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {calc.features && calc.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {calc.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link href={calc.href}>
                          <Button className="w-full">
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

        {upcomingCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="opacity-75 border-dashed border-2 bg-muted/50 dark:bg-card/50 dark:border-border"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-muted dark:bg-muted/50 rounded-lg">
                          <IconComponent className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-xl text-muted-foreground">{calc.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base text-muted-foreground/80">
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
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
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

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Precision in Every Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our construction calculators are designed to provide accurate estimations for materials, costs, and
                dimensions. Whether you're a professional contractor or a DIY enthusiast, these tools help you plan
                effectively, reduce waste, and ensure your project stays on budget. From concrete slabs to wall framing,
                get the numbers you need.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tips for Accurate Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Always double-check your measurements on site.</li>
                <li>Account for waste (typically 10-15% for many materials).</li>
                <li>Consult local building codes for specific requirements.</li>
                <li>Factor in the cost of tools, permits, and labor if applicable.</li>
                <li>When in doubt, overestimate slightly rather than underestimate.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
