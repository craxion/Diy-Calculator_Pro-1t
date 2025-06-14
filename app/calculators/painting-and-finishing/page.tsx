import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaintBucket, Calculator, ArrowRight, Paintbrush } from "lucide-react"

export default function PaintingAndFinishingPage() {
  const calculators = [
    {
      title: "Paint Project Calculator",
      description:
        "Calculate paint requirements for walls, ceiling, and trim with detailed cost estimates and supply recommendations.",
      href: "/calculators/painting-and-finishing/paint-project-calculator",
      icon: PaintBucket,
      features: ["Room dimensions", "Door & window exclusions", "Multiple coats", "Cost estimation"],
    },
    {
      title: "Deck Stain & Sealer Calculator",
      description:
        "Calculate the exact amount of stain or sealer needed for your deck, including railings, spindles, and stairs.",
      href: "/calculators/painting-and-finishing/deck-stain-and-sealer-calculator",
      icon: Paintbrush,
      features: ["Deck shapes", "Railings & spindles", "Stairs included", "Wood condition factors"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PaintBucket className="h-8 w-8 text-primary-navy" />
            <h1 className="text-4xl font-bold text-primary-navy">Painting & Finishing Calculators</h1>
          </div>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Professional tools for calculating paint requirements, surface preparation, and finishing materials for your
            projects.
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {calculators.map((calc) => {
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

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Why Use Paint Calculators?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
                <li>• Avoid buying too much or too little paint</li>
                <li>• Get accurate cost estimates before starting</li>
                <li>• Plan for primer and multiple coats</li>
                <li>• Calculate supplies needed for the job</li>
                <li>• Account for doors, windows, and other openings</li>
                <li>• Professional-grade accuracy for any room size</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Painting Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
                <li>• Always use primer on new or dramatically different colors</li>
                <li>• Buy quality brushes and rollers for better coverage</li>
                <li>• Test paint colors in different lighting conditions</li>
                <li>• Keep detailed records of paint colors and quantities</li>
                <li>• Allow proper drying time between coats</li>
                <li>• Store leftover paint properly for future touch-ups</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
