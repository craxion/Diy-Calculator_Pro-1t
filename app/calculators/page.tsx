import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calculator, Search } from "lucide-react"
import { calculatorCategories, createUrlSlug } from "@/lib/utils/url-slug"

export default function CalculatorsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">All Calculators</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our complete collection of professional project calculators organized by category.
        </p>

        <div className="flex items-center space-x-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search calculators..." className="pl-10" />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(calculatorCategories).map(([category, calculators]) => {
          const implementedCalculators = calculators.filter((calc) => calc.implemented)

          return (
            <section key={category} className="space-y-6">
              <Link href={`/calculators/${createUrlSlug(category)}`} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{category}</CardTitle>
                    <CardDescription>
                      {implementedCalculators.length > 0
                        ? `${implementedCalculators.length} calculators available`
                        : "More calculators coming soon in this category!"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {implementedCalculators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {implementedCalculators.map((calculator) => (
                    <Link
                      key={calculator.name}
                      href={`/calculators/${createUrlSlug(category)}/${createUrlSlug(calculator.name)}`}
                      className="block"
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Calculator className="h-4 w-4" />
                            <span>{calculator.name}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{/* No button needed here, the whole card is clickable */}</CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
                  <p className="text-muted-foreground">
                    We're working on adding more calculators to the {category} category. Check back soon!
                  </p>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
