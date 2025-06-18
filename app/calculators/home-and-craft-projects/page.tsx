import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Palette, CheckCircle } from "lucide-react"
import { createUrlSlug, getImplementedCalculators } from "@/lib/utils/url-slug"
import { AnimatedOnScroll } from "@/components/animated-on-scroll"

export const metadata: Metadata = {
  title: "Home and Craft Projects Calculators | DIYCalculatorPro",
  description:
    "Professional calculators for home crafting and DIY projects. Calculate resin amounts, epoxy volumes, and more for your creative projects with precision.",
  keywords: [
    "resin calculator",
    "epoxy calculator",
    "craft project calculator",
    "DIY crafts",
    "home projects",
    "resin casting",
    "epoxy resin",
    "craft supplies",
  ],
}

const categoryName = "Home and Craft Projects"
const implementedCalculators = getImplementedCalculators(categoryName)

export default function HomeAndCraftProjectsPage() {
  return (
    <div className="container py-8 md:py-12 space-y-8 md:space-y-12">
      {/* Header Section */}
      <AnimatedOnScroll animationType="fade-in">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary-orange/10 rounded-lg">
              <Palette className="h-8 w-8 text-primary-orange" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-grey">Home and Craft Projects</h1>
          </div>
          <p className="text-lg md:text-xl text-medium-grey max-w-3xl mx-auto leading-relaxed">
            Professional-grade calculators designed for crafters, makers, and DIY enthusiasts. Get precise measurements
            for resin casting, epoxy projects, and creative home improvements.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-primary-orange/10 text-primary-orange border-primary-orange/20">
              {implementedCalculators.length} Calculator{implementedCalculators.length !== 1 ? "s" : ""} Available
            </Badge>
          </div>
        </div>
      </AnimatedOnScroll>

      {/* Calculators Grid */}
      <section className="space-y-6">
        <AnimatedOnScroll animationType="slide-up-fade">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-grey text-center mb-8">Available Calculators</h2>
        </AnimatedOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {implementedCalculators.map((calculator, index) => (
            <AnimatedOnScroll
              key={calculator.name}
              animationType="slide-up-fade"
              className="h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="bg-brand-white hover:shadow-xl transition-all duration-300 ease-in-out border-light-grey/80 group h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-dark-grey group-hover:text-primary-orange transition-colors mb-2">
                        {calculator.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-medium-grey">
                        {calculator.name === "Resin and Epoxy Calculator" &&
                          "Calculate precise resin and hardener amounts for casting, coating, and craft projects"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="space-y-3 mb-4">
                    {calculator.name === "Resin and Epoxy Calculator" && (
                      <ul className="space-y-2 text-sm text-medium-grey">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary-orange/70 mr-2 flex-shrink-0" />
                          Multiple pour shapes (rectangle, circle)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary-orange/70 mr-2 flex-shrink-0" />
                          Mix ratio calculations (1:1, 2:1)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary-orange/70 mr-2 flex-shrink-0" />
                          Waste factor and cost estimation
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary-orange/70 mr-2 flex-shrink-0" />
                          Visual diagram and real-time results
                        </li>
                      </ul>
                    )}
                  </div>
                </CardContent>

                <div className="p-6 pt-0 mt-auto">
                  <Button asChild className="w-full group/button">
                    <Link href={`/calculators/${createUrlSlug(categoryName)}/${createUrlSlug(calculator.name)}`}>
                      Use Calculator
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </AnimatedOnScroll>
          ))}
        </div>
      </section>

      {/* Category Benefits */}
      <AnimatedOnScroll animationType="slide-up-fade">
        <section className="py-12 md:py-16 bg-light-grey/50 rounded-2xl">
          <div className="container">
            <div className="text-center space-y-3 mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-grey">Why Use Our Craft Calculators?</h2>
              <p className="text-md md:text-lg text-medium-grey">
                Precision and confidence for every creative project.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  icon: CheckCircle,
                  title: "Eliminate Waste",
                  description:
                    "Calculate exact amounts needed to avoid costly overbuying or project delays from shortages.",
                },
                {
                  icon: Palette,
                  title: "Perfect Results",
                  description: "Get the right mix ratios and volumes for professional-quality finishes every time.",
                },
                {
                  icon: ArrowRight,
                  title: "Save Time",
                  description:
                    "Skip the guesswork and math errors with instant, accurate calculations for your projects.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-brand-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-light-grey/80"
                >
                  <div className="p-4 bg-primary-orange/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 ring-4 ring-primary-orange/20">
                    <feature.icon className="h-8 w-8 text-primary-orange" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-grey mb-2">{feature.title}</h3>
                  <p className="text-medium-grey text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedOnScroll>
    </div>
  )
}
